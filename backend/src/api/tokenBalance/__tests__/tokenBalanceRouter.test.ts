import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { clearTestDatabase, testAccount } from '@/common/utils/testHelpers';
import { app } from '@/server';

describe('Balance endpoint', () => {
  beforeEach(async () => {
    await clearTestDatabase();
  });

  describe('Get balances for an address on a chainId', () => {
    it('should return 401 Unauthorized if no token is provided', async () => {
      const response = await request(app).get(`/api/balances/1/${testAccount.address}`);
      expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    });
  });
});
