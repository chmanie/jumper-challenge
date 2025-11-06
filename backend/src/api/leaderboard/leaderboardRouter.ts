import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Router } from 'express';
import validate, { type WeakRequestHandler } from 'express-zod-safe';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { checkAuth } from '@/api/auth/authMiddleware';
import { createApiResponses } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

import {
  EnterLeaderboardRequestSchema,
  GetLeaderboardRequestSchema,
  GetLeaderboardResponseSchema,
} from './leaderboardModel';
import { enterLeaderboard, getLeaderboard } from './leaderboardService';

export const leaderboardRegistry = new OpenAPIRegistry();

export const leaderboardRouter: Router = (() => {
  const router = express.Router();

  leaderboardRegistry.registerPath({
    method: 'post',
    path: '/api/leaderboard/{chainId}',
    tags: ['Leaderboard'],
    summary: 'Enter the leaderboard with the signed in address',
    request: {
      params: EnterLeaderboardRequestSchema.params,
    },
    responses: createApiResponses([
      { schema: z.null(), description: 'Leaderboard entry created', statusCode: StatusCodes.OK },
      { schema: z.null(), description: 'Unexpected error', statusCode: StatusCodes.INTERNAL_SERVER_ERROR },
      {
        schema: z.null(),
        description: 'Not authorized',
        statusCode: StatusCodes.UNAUTHORIZED,
      },
    ]),
  });

  router.post(
    '/:chainId',
    // See https://github.com/AngaBlue/express-zod-safe?tab=readme-ov-file#%EF%B8%8F-usage-with-additional-middleware
    checkAuth as WeakRequestHandler,
    validate(EnterLeaderboardRequestSchema),
    async (req, res) => {
      const serviceResponse = await enterLeaderboard(req.params.chainId, req.user!.address);
      handleServiceResponse(serviceResponse, res);
    }
  );

  leaderboardRegistry.registerPath({
    method: 'get',
    path: '/api/leaderboard/{chainId}',
    tags: ['Leaderboard'],
    summary: 'Get the leaderboard',
    request: {
      params: GetLeaderboardRequestSchema.params,
      query: GetLeaderboardRequestSchema.query,
    },
    responses: createApiResponses([
      {
        schema: GetLeaderboardResponseSchema,
        description: 'Leaderboard fetched successfully',
        statusCode: StatusCodes.OK,
      },
      { schema: z.null(), description: 'Unexpected error', statusCode: StatusCodes.INTERNAL_SERVER_ERROR },
      {
        schema: z.null(),
        description: 'Not authorized',
        statusCode: StatusCodes.UNAUTHORIZED,
      },
    ]),
  });

  router.get(
    '/:chainId',
    // See https://github.com/AngaBlue/express-zod-safe?tab=readme-ov-file#%EF%B8%8F-usage-with-additional-middleware
    checkAuth as WeakRequestHandler,
    validate(GetLeaderboardRequestSchema),
    async (req, res) => {
      const serviceResponse = await getLeaderboard(req.params.chainId, req.query.pageKey, req.query.limit);
      handleServiceResponse(serviceResponse, res);
    }
  );

  return router;
})();
