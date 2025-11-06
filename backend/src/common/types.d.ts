import { type JwtPayload } from '@/api/auth/authModel.ts';

declare global {
  /* eslint-disable @typescript-eslint/no-namespace */
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

type AlchemyAPIResponse<T> = {
  jsonrpc: string;
  id: number;
  result: T;
};

export type AlchemyTokenBalanceResponse = AlchemyAPIResponse<{
  address: Address;
  tokenBalances: {
    contractAddress: Address;
    tokenBalance: string;
  }[];
  pageKey?: string;
}>;

export type AlchemyTokenMetadataResponse = AlchemyAPIResponse<{
  name: string;
  symbol: string;
  decimals: number;
  logo: string;
}>;
