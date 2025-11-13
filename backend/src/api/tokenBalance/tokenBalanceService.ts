import { StatusCodes } from 'http-status-codes';
import ky, { HTTPError } from 'ky';
import { Address, Hex, hexToBigInt, isAddressEqual } from 'viem';

import { SUPPORTED_NETWORKS } from '@/common/consts';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { prismaClient } from '@/common/prisma';
import { AlchemyTokenBalanceResponse, AlchemyTokenMetadataResponse } from '@/common/types';
import { env } from '@/common/utils/envConfig';
import { logger } from '@/server';

import { BalanceRequest, BalanceResponse } from './tokenBalanceModel';

export const getTokenBalances = async (
  chainId: BalanceRequest['params']['chainId'],
  address: BalanceRequest['params']['address'],
  pageKey: BalanceRequest['query']['pageKey'],
  limit: BalanceRequest['query']['limit'] = 100
): Promise<ServiceResponse<BalanceResponse | null>> => {
  // chainId is already validated
  const alchemyEndpoint = SUPPORTED_NETWORKS[chainId as keyof typeof SUPPORTED_NETWORKS].ALCHEMY_ENDPOINT;

  try {
    const balanceParams: [Address, string, { maxCount: number; pageKey?: string }] = [
      address,
      'erc20',
      { maxCount: limit },
    ];

    if (pageKey) {
      balanceParams[2].pageKey = pageKey;
    }

    const { result: balanceResult } = await ky
      .post(`https://${alchemyEndpoint}.g.alchemy.com/v2/${env.ALCHEMY_API_KEY}`, {
        json: {
          jsonrpc: '2.0',
          method: 'alchemy_getTokenBalances',
          params: balanceParams,
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
      // Create JSON-RPC batch requst (https://www.jsonrpc.org/specification#batch)
      const metadataRequests = tokensToFetch.map((contractAddress, index) => ({
        jsonrpc: '2.0',
        method: 'alchemy_getTokenMetadata',
        params: [contractAddress],
        id: index,
      }));

      const fetchedTokenResults = await ky
        .post(`https://${alchemyEndpoint}.g.alchemy.com/v2/${env.ALCHEMY_API_KEY}`, {
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
      pageKey: balanceResult.pageKey,
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
    } else {
      logger.error(
        { err: error, context: 'leaderboard' },
        'An unexpected error occurred while fetching token balances'
      );
    }
    console.log(error);
  }

  return new ServiceResponse(
    ResponseStatus.Failed,
    'An unexpected error occurred while fetching token balances',
    null,
    StatusCodes.INTERNAL_SERVER_ERROR
  );
};
