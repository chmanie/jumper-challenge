import { StatusCodes } from 'http-status-codes';
import ky, { HTTPError } from 'ky';
import { Address, Hex, hexToBigInt, isAddressEqual } from 'viem';

import { ALCHEMY_NETWORKS } from '@/common/consts';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { env } from '@/common/utils/envConfig';

import { prismaClient } from '../../common/prisma';
import { BalanceRequest, BalanceResponse } from './tokenBalanceModel';

type AlchemyAPIResponse<T> = {
  jsonrpc: string;
  id: number;
  result: T;
};

type AlchemyTokenBalanceResponse = AlchemyAPIResponse<{
  address: Address;
  tokenBalances: {
    contractAddress: Address;
    tokenBalance: string;
  }[];
}>;

type AlchemyTokenMetadataResponse = AlchemyAPIResponse<{
  name: string;
  symbol: string;
  decimals: number;
  logo: string;
}>;

export const getTokenBalances = async ({
  address,
  chainId,
}: BalanceRequest['params']): Promise<ServiceResponse<BalanceResponse | null>> => {
  const networkString = ALCHEMY_NETWORKS[chainId as keyof typeof ALCHEMY_NETWORKS];

  try {
    const { result: balanceResult } = await ky
      .post(`https://${networkString}.g.alchemy.com/v2/${env.ALCHEMY_API_KEY}`, {
        json: {
          jsonrpc: '2.0',
          method: 'alchemy_getTokenBalances',
          params: [address, 'erc20'],
          id: 1,
        },
      })
      .json<AlchemyTokenBalanceResponse>();

    const tokenBalances = balanceResult.tokenBalances
      // Alchemy also shows historic token holdings with a zero balance
      .filter(({ tokenBalance }) => hexToBigInt(tokenBalance as Hex) > 0n);

    const tokenList = tokenBalances.map(({ contractAddress }) => contractAddress);

    const cachedTokens = await prismaClient.token.findMany({
      where: {
        id: {
          in: tokenList,
        },
      },
    });

    const tokensToFetch = tokenList.filter(
      (contractAddress) => !cachedTokens.find(({ id }) => isAddressEqual(id as Address, contractAddress))
    );

    let newTokens: (typeof cachedTokens)[number][] = [];

    if (tokensToFetch.length > 0) {
      // Create JSON-RPC batch requst
      const metadataRequests = tokensToFetch.map((contractAddress, index) => ({
        jsonrpc: '2.0',
        method: 'alchemy_getTokenMetadata',
        params: [contractAddress],
        id: index,
      }));

      const fetchedTokenResults = await ky
        .post(`https://${networkString}.g.alchemy.com/v2/${env.ALCHEMY_API_KEY}`, {
          json: metadataRequests,
        })
        .json<AlchemyTokenMetadataResponse[]>();

      newTokens = fetchedTokenResults
        .map((response, index) => {
          if (response && response.result) {
            return {
              id: tokensToFetch[index],
              ...response.result,
            };
          }
          return null;
        })
        .filter((token): token is NonNullable<typeof token> => !!token);
    }

    if (newTokens.length > 0) {
      await prismaClient.token.createMany({
        data: newTokens,
        // In production (e.g. PostgreSQL) we would use skipDuplicates: true
        // as this operation is not atomic
      });
    }

    const allTokens = new Map([...cachedTokens, ...newTokens].map(({ id, ...data }) => [id as Address, data]));

    // Enrich our tokenBalances with metadata
    const data = {
      address,
      tokenBalances: tokenBalances.map(({ contractAddress, tokenBalance }) => ({
        contractAddress,
        tokenMetadata: allTokens.get(contractAddress),
        tokenBalance,
      })),
    };

    return new ServiceResponse(ResponseStatus.Success, 'Balances fetched successfully', data, StatusCodes.OK);
  } catch (error) {
    if (error instanceof HTTPError) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Failed to fetch token balances',
        null,
        StatusCodes.BAD_GATEWAY
      );
    }
  }

  return new ServiceResponse(
    ResponseStatus.Failed,
    'An unexpected error occurred while fetching token balances',
    null,
    StatusCodes.INTERNAL_SERVER_ERROR
  );

  // FIXME: Paging!!
};
