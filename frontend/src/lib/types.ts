import { Address } from 'viem';

export type APIResponse<T> = {
  message: string;
  responseObject: T;
  statusCode: number;
  success: boolean;
};

export interface TokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
  logo: string;
}

export interface BalanceResponse {
  address: Address;
  tokenBalances: {
    contractAddress: string;
    tokenMetadata: TokenMetadata;
    tokenBalance: string;
  }[];
  pageKey?: string;
}
