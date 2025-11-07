import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import validate from 'express-zod-safe';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { createApiResponse, createApiResponses } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

import { NonceResponseSchema, VerifyRequestSchema, VerifyResponseSchema } from './authModel';
import { AuthService } from './authService';

export const authRegistry = new OpenAPIRegistry();

export const authRouter: Router = (() => {
  const router = express.Router();
  const authService = new AuthService();

  authRegistry.registerPath({
    method: 'get',
    path: '/api/auth/nonce',
    tags: ['Auth'],
    summary: 'Generate a SIWE nonce',
    responses: createApiResponse(NonceResponseSchema, 'Nonce created successfully'),
  });

  router.get('/nonce', (_req: Request, res: Response) => {
    const serviceResponse = authService.generateNonce();
    handleServiceResponse(serviceResponse, res);
  });

  authRegistry.registerPath({
    method: 'post',
    path: '/api/auth/verify',
    tags: ['Auth'],
    summary: 'Verify a SIWE signed message',
    request: {
      body: {
        content: {
          'application/json': {
            schema: VerifyRequestSchema.body,
          },
        },
        description: 'SIWE message and corresponding singature',
      },
    },
    responses: createApiResponses([
      { schema: VerifyResponseSchema, description: 'Authentication successful', statusCode: StatusCodes.OK },
      { schema: z.null(), description: 'Request body verification failed', statusCode: StatusCodes.BAD_REQUEST },
      {
        schema: z.null(),
        description: 'Signature verification or nonce error',
        statusCode: StatusCodes.UNAUTHORIZED,
      },
      { schema: z.null(), description: 'Invalid SIWE message format or unsupported chain', statusCode: StatusCodes.UNPROCESSABLE_ENTITY },
    ]),
  });

  router.post('/verify', validate(VerifyRequestSchema), async (req, res) => {
    const serviceResponse = await authService.verifySignature(req.body);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
