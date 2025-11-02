import { z } from 'zod';

export const NonceResponseSchema = z.object({
  nonce: z.string(),
});

export type NonceResponse = z.infer<typeof NonceResponseSchema>;

export const VerifyRequestSchema = z.object({
  body: z.object({
    message: z.string(),
    signature: z.string(),
  }),
});

export type VerifyRequest = z.infer<typeof VerifyRequestSchema>;

export const VerifyResponseSchema = z.object({
  token: z.string(),
});

export type VerifyResponse = z.infer<typeof VerifyResponseSchema>;

export interface JwtPayload {
  address: string;
}
