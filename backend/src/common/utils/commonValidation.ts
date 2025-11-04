import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { isAddress } from 'viem';
import { z } from 'zod';

// Needs to be called for request param generation to work
extendZodWithOpenApi(z);

import { ALCHEMY_NETWORKS } from '../consts';

export const ethereumAddress = z
  .string()
  .refine(isAddress, 'Invalid Ethereum address')
  .describe('Valid Ethereum address');
export const supportedChain = z.coerce
  .number()
  .refine((val) => Object.hasOwn(ALCHEMY_NETWORKS, val), 'Unsupported chain ID')
  .describe(`Needs to be a supported chain id (one of ${Object.keys(ALCHEMY_NETWORKS).join(',')})`);
