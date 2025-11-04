import { type ValidatedRequest } from 'express-zod-safe';
import { Address, etherUnits } from 'viem';
import { z } from 'zod';

import { ethereumAddress } from '@/common/utils/commonValidation';

export const NonceResponseSchema = z.object({
  nonce: z.string(),
});

export type NonceResponse = z.infer<typeof NonceResponseSchema>;

export const VerifyRequestSchema = {
  body: z.object({
    message: z.string(),
    signature: z.string(),
  }),
};

export type VerifyRequest = ValidatedRequest<typeof VerifyRequestSchema>;

export const VerifyResponseSchema = z.object({
  token: z.string(),
});

export type VerifyResponse = z.infer<typeof VerifyResponseSchema>;

export const MeResponseSchema = z.object({
  me: ethereumAddress,
});

export type MeResponse = z.infer<typeof MeResponseSchema>;

export interface JwtPayload {
  address: Address;
}
