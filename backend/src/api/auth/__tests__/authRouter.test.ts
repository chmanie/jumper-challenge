import { StatusCodes } from 'http-status-codes';
import { SiweMessage } from 'siwe';
import request from 'supertest';
import { privateKeyToAccount } from 'viem/accounts';

import { ServiceResponse } from '@/common/models/serviceResponse';
import { clearTestDatabase } from '@/common/utils/testHelpers';
import { app } from '@/server';

import { verifyJWT } from '../authHelpers';
import { NonceResponse, VerifyResponse } from '../authModel';

const account = privateKeyToAccount('0x2b4a9397657e07f92ffb4f995ead4857b1d3cbb34720e48cfa247a790a9e85c3');

const getSiweMessage = (nonce: string) =>
  new SiweMessage({
    domain: 'localhost:3000',
    address: account.address,
    statement: 'Sign in with Ethereum to the app.',
    uri: 'https://localhost:3000',
    version: '1',
    chainId: 1,
    nonce,
    issuedAt: new Date().toISOString(),
  });

describe('Auth endpoints', () => {
  beforeEach(async () => {
    await clearTestDatabase();
  });

  it('Gets the nonce', async () => {
    const response = await request(app).get('/api/auth/nonce');
    const result: ServiceResponse<NonceResponse> = response.body;

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(result.success).toBeTruthy();
    expect(result.responseObject.nonce).toBeTypeOf('string');
    expect(result.message).toEqual('Nonce generated successfully');
  });

  it('Can verify a message', async () => {
    const nonceResponse = await request(app).get('/api/auth/nonce');
    const nonceResult: ServiceResponse<NonceResponse> = nonceResponse.body;
    const { nonce } = nonceResult.responseObject;
    const message = getSiweMessage(nonce).prepareMessage();
    const signature = await account.signMessage({ message });

    const verifyResponse = await request(app).post('/api/auth/verify').send({ message, signature });
    const verifyResult: ServiceResponse<VerifyResponse> = verifyResponse.body;

    expect(verifyResponse.statusCode).toEqual(StatusCodes.OK);
    expect(verifyResult.success).toBeTruthy();
    expect(verifyResult.responseObject.token).toBeTypeOf('string');
    expect(verifyResult.message).toEqual('Message verified successfully');

    const { payload } = await verifyJWT(verifyResult.responseObject.token);
    expect(payload.address).toEqual(account.address);
  });
});
