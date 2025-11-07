import request from 'supertest';
import { privateKeyToAccount } from 'viem/accounts';
import { createSiweMessage } from 'viem/siwe';

import { NonceResponse, VerifyResponse } from '@/api/auth/authModel';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { prismaClient } from '@/common/prisma';
import { app } from '@/server';

export async function clearTestDatabase() {
  await prismaClient.leaderboardEntry.deleteMany();
  await prismaClient.token.deleteMany();
  await prismaClient.user.deleteMany();
}

export const testAccount = privateKeyToAccount('0x2b4a9397657e07f92ffb4f995ead4857b1d3cbb34720e48cfa247a790a9e85c3');

const getSiweMessage = (nonce: string) =>
  createSiweMessage({
    domain: 'localhost:3000',
    address: testAccount.address,
    statement: 'Sign in with Ethereum to Balancr.',
    uri: 'https://localhost:3000',
    version: '1',
    chainId: 1,
    nonce,
  });

export const getAuthToken = async (): Promise<string> => {
  const nonceResponse = await request(app).get('/api/auth/nonce');
  const { nonce } = (nonceResponse.body as ServiceResponse<NonceResponse>).responseObject;
  const message = getSiweMessage(nonce);
  const signature = await testAccount.signMessage({ message });
  const verifyResponse = await request(app).post('/api/auth/verify').send({ message, signature });
  const { token } = (verifyResponse.body as ServiceResponse<VerifyResponse>).responseObject;
  return token;
};
