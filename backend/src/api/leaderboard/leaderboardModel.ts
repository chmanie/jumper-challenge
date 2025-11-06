import { ValidatedRequest } from 'express-zod-safe';
import { z } from 'zod';

import { supportedChain } from '@/common/utils/commonValidation';

export const EnterLeaderboardRequestSchema = {
  params: z.object({
    chainId: supportedChain,
  }),
};

export type EnterLeaderboardRequest = ValidatedRequest<typeof EnterLeaderboardRequestSchema>;

export const GetLeaderboardRequestSchema = {
  params: z.object({
    chainId: supportedChain,
  }),
  query: z.object({
    pageKey: z.string().optional(),
    limit: z.coerce.number().optional(),
  }),
};

export type GetLeaderboardRequest = ValidatedRequest<typeof GetLeaderboardRequestSchema>;

export const GetLeaderboardResponseSchema = z.object({
  entries: z.array(
    z.object({
      chainId: z.number(),
      id: z.string(),
      userId: z.string(),
      tokenCount: z.number(),
    })
  ),
  pageKey: z.string().optional(),
  totalCount: z.number(),
});

export type GetLeaderboardResponse = z.infer<typeof GetLeaderboardResponseSchema>;
