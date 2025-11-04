import { ValidatedRequest } from 'express-zod-safe';
import { z } from 'zod';

import { ethereumAddress, supportedChain } from '@/common/utils/commonValidation';

export const BalanceRequestSchema = {
  params: z.object({
    address: ethereumAddress,
    chainId: supportedChain,
  }),
};

export type BalanceRequest = ValidatedRequest<typeof BalanceRequestSchema>;

export const BalanceResponseSchema = z.object({
  address: ethereumAddress,
  tokenBalances: z.array(
    z.object({
      contractAddress: ethereumAddress,
      tokenMetadata: z
        .object({
          symbol: z.string().nullish(),
          name: z.string().nullish(),
          decimals: z.number().nullish(),
          logo: z.string().nullish(),
        })
        .optional(),
      tokenBalance: z.string(),
    })
  ),
});

export type BalanceResponse = z.infer<typeof BalanceResponseSchema>;
