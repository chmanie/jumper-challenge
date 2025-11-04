import { StatusCodes } from 'http-status-codes';
import { SiweMessage } from 'siwe';

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { prismaClient } from '@/common/prisma';
import { logger } from '@/server';

import { generateJWT } from './authHelpers';
import { NonceResponse, VerifyRequest, VerifyResponse } from './authModel';
import { NonceStore } from './NonceStore';

export class AuthService {
  private nonceStore: NonceStore = new NonceStore();

  public generateNonce(): ServiceResponse<NonceResponse> {
    const nonce = this.nonceStore.createNonce();
    return new ServiceResponse(ResponseStatus.Success, 'Nonce generated successfully', { nonce }, StatusCodes.OK);
  }

  public async verifySignature({
    message,
    signature,
  }: VerifyRequest['body']): Promise<ServiceResponse<VerifyResponse | null>> {
    let siweMessage: SiweMessage;

    try {
      // Try to parse SIWE message
      siweMessage = new SiweMessage(message);
    } catch {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Invalid SIWE message format',
        null,
        StatusCodes.UNPROCESSABLE_ENTITY
      );
    }

    try {
      const { data } = await siweMessage.verify({ signature });

      if (!this.nonceStore.validateNonce(data.nonce)) {
        return new ServiceResponse(ResponseStatus.Failed, 'Invalid or expired nonce', null, StatusCodes.UNAUTHORIZED);
      }

      await prismaClient.user.upsert({
        create: {
          id: data.address,
        },
        update: {},
        where: {
          id: data.address,
        },
      });

      const token = await generateJWT({ address: data.address });
      return new ServiceResponse(ResponseStatus.Success, 'Message verified successfully', { token }, StatusCodes.OK);
    } catch (error) {
      logger.error({ error, context: 'siwe-verification' }, 'SIWE signature verification failed');
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Signature could not be verified',
        null,
        StatusCodes.UNAUTHORIZED
      );
    }
  }
}
