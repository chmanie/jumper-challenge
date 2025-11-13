import { StatusCodes } from 'http-status-codes';
import ky from 'ky';
import request from 'supertest';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clearTestDatabase, getAuthToken, testAccount } from '@/common/utils/testHelpers';
import { app } from '@/server';

vi.mock('ky');

describe('Balance endpoint', () => {
  beforeEach(async () => {
    await clearTestDatabase();
  });

  describe('Get balances for an address on a chainId', () => {
    it('should return 401 Unauthorized if no token is provided', async () => {
      const response = await request(app).get(`/api/balances/1/${testAccount.address}`);
      expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    });

    it('Get token balances and metadata for an address', async () => {
      vi.mocked(ky.post)
        .mockReturnValueOnce({
          json: vi.fn().mockResolvedValueOnce({
            result: {
              address: testAccount.address,
              tokenBalances: [
                {
                  contractAddress: zeroAddress,
                  tokenBalance: '0x100000',
                },
              ],
            },
          }),
        } as any)
        .mockReturnValueOnce({
          json: vi.fn().mockResolvedValueOnce([
            {
              result: {
                name: 'Foo',
                symbol: 'BAR',
                decimals: 18,
                logo: 'http://nothing',
              },
            },
          ]),
        } as any);

      const token = await getAuthToken();

      const response = await request(app)
        .get(`/api/balances/1/${testAccount.address}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body.responseObject.tokenBalances[0].tokenBalance).toEqual('0x100000');
    }, 15000);
  });
});
