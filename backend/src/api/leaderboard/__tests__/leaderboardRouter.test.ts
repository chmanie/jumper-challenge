import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { ServiceResponse } from '@/common/models/serviceResponse';
import { clearTestDatabase, getAuthToken } from '@/common/utils/testHelpers';
import { app } from '@/server';

import { type GetLeaderboardResponse } from '../leaderboardModel';

describe('Leaderboard endpoints', () => {
  beforeEach(async () => {
    await clearTestDatabase();
  });

  describe('Get the leaderboard for a chainId', () => {
    it('should return 401 Unauthorized if no token is provided', async () => {
      const response = await request(app).get('/api/leaderboard/1');
      expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    });

    it('should return the leaderboard if authenticated', async () => {
      const token = await getAuthToken();
      const response = await request(app).get(`/api/leaderboard/1`).set('Authorization', `Bearer ${token}`);
      expect(response.statusCode).toEqual(StatusCodes.OK);
      const body: ServiceResponse<GetLeaderboardResponse> = response.body;
      expect(body.success).toBe(true);
      expect(body.responseObject.entries).toBeInstanceOf(Array);
    });
  });

  describe('Enter the leaderboard with currently signed in address', () => {
    it('should return 401 Unauthorized if no token is provided', async () => {
      const response = await request(app).post('/api/leaderboard/1');
      expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    });

    it('should allow an authenticated user to enter the leaderboard', async () => {
      const token = await getAuthToken();
      const response = await request(app).post(`/api/leaderboard/1`).set('Authorization', `Bearer ${token}`);
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Leaderboard entry added successfully');
    });
  });
});
