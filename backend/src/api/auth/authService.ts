import { StatusCodes } from 'http-status-codes';
import { createPublicClient, Hex, http } from 'viem';
import { parseSiweMessage } from 'viem/siwe';

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { prismaClient } from '@/common/prisma';
import { logger } from '@/server';

import { SUPPORTED_NETWORKS } from '../../common/consts';
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
    let siweMessage: ReturnType<typeof parseSiweMessage>;

    try {
      // Try to parse SIWE message
      siweMessage = parseSiweMessage(message);
    } catch {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Invalid SIWE message format',
        null,
        StatusCodes.UNPROCESSABLE_ENTITY
      );
    }

    if (!siweMessage.chainId || !Object.hasOwn(SUPPORTED_NETWORKS, siweMessage.chainId)) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'No chainId given or chain not supported',
        null,
        StatusCodes.UNPROCESSABLE_ENTITY
      );
    }

    try {
      const publicClient = createPublicClient({
        chain: SUPPORTED_NETWORKS[siweMessage.chainId].VIEM_CHAIN,
        transport: http(),
      });
      const valid = await publicClient.verifySiweMessage({ message, signature: signature as Hex });

      if (!valid) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Signature could not be verified',
          null,
          StatusCodes.UNAUTHORIZED
        );
      }

      if (!siweMessage.nonce || !this.nonceStore.validateNonce(siweMessage.nonce)) {
        return new ServiceResponse(ResponseStatus.Failed, 'Invalid or expired nonce', null, StatusCodes.UNAUTHORIZED);
      }

      if (!siweMessage.address) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'No address found in SIWE message',
          null,
          StatusCodes.UNAUTHORIZED
        );
      }

      await prismaClient.user.upsert({
        create: {
          id: siweMessage.address,
        },
        update: {},
        where: {
          id: siweMessage.address,
        },
      });

      const token = await generateJWT({ address: siweMessage.address });
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
