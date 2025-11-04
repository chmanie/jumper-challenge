import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Router } from 'express';
import validate, { type WeakRequestHandler } from 'express-zod-safe';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { createApiResponses } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

import { checkAuth } from '../auth/authMiddleware';
import { BalanceRequestSchema, BalanceResponseSchema } from './tokenBalanceModel';
import { getTokenBalances } from './tokenBalanceService';

export const tokenBalanceRegistry = new OpenAPIRegistry();

export const tokenBalanceRouter: Router = (() => {
  const router = express.Router();

  tokenBalanceRegistry.registerPath({
    method: 'get',
    path: '/api/balances/{chainId}/{address}',
    tags: ['Balances'],
    summary: 'Get balances for user on a supported chain',
    request: {
      params: BalanceRequestSchema.params,
    },
    responses: createApiResponses([
      { schema: BalanceResponseSchema, description: 'Token balances fetched successfully', statusCode: StatusCodes.OK },
      { schema: z.null(), description: 'Failed to fetch token balances', statusCode: StatusCodes.BAD_GATEWAY },
      { schema: z.null(), description: 'Unexpected error', statusCode: StatusCodes.INTERNAL_SERVER_ERROR },
      {
        schema: z.null(),
        description: 'Not authorized',
        statusCode: StatusCodes.UNAUTHORIZED,
      },
    ]),
  });

  router.get(
    '/:chainId/:address',
    // See https://github.com/AngaBlue/express-zod-safe?tab=readme-ov-file#%EF%B8%8F-usage-with-additional-middleware
    checkAuth as WeakRequestHandler,
    validate(BalanceRequestSchema),
    async (req, res) => {
      const serviceResponse = await getTokenBalances(req.params);
      handleServiceResponse(serviceResponse, res);
    }
  );

  return router;
})();
