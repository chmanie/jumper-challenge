import { setTimeout } from 'node:timers/promises';

import { StatusCodes } from 'http-status-codes';
import ky, { HTTPError } from 'ky';
import { Address, type Hex, hexToBigInt } from 'viem';

import { SUPPORTED_NETWORKS } from '@/common/consts';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { prismaClient } from '@/common/prisma';
import { AlchemyTokenBalanceResponse } from '@/common/types';
import { env } from '@/common/utils/envConfig';
import { logger } from '@/server';

import { GetLeaderboardRequest, GetLeaderboardResponse } from './leaderboardModel';

export const getLeaderboard = async (
  chainId: GetLeaderboardRequest['params']['chainId'],
  pageKey: GetLeaderboardRequest['query']['pageKey'],
  limit: GetLeaderboardRequest['query']['limit'] = 100
): Promise<ServiceResponse<GetLeaderboardResponse | null>> => {
  try {
    const [entries, totalCount] = await prismaClient.$transaction([
      prismaClient.leaderboardEntry.findMany({
        where: {
          chainId,
        },
        orderBy: [
          {
            tokenCount: 'desc',
          },
          {
            id: 'asc',
          },
        ],
        take: limit + 1,
        cursor: pageKey ? { id: pageKey } : undefined,
      }),
      prismaClient.leaderboardEntry.count({
        where: {
          chainId,
        },
      }),
    ]);

    const response: GetLeaderboardResponse = { entries, totalCount };

    if (limit && limit > 1 && entries.length > limit) {
      entries.pop();
      response.pageKey = entries.at(-1)!.id;
    }

    return new ServiceResponse(ResponseStatus.Success, 'Leaderboard fetched successfully', response, StatusCodes.OK);
  } catch (error) {
    logger.error({ err: error, context: 'leaderboard' }, 'An unexpected error occurred while getting the leaderboard');
    return new ServiceResponse(
      ResponseStatus.Failed,
      'An unexpected error occurred while getting the leaderboard',
      null,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const enterLeaderboard = async (chainId: number, userAddress: Address): Promise<ServiceResponse<null>> => {
  // chainId is already validated
  const alchemyEndpoint = SUPPORTED_NETWORKS[chainId as keyof typeof SUPPORTED_NETWORKS].ALCHEMY_ENDPOINT;

  try {
    let pageKey;
    let tokenCount = 0;
    do {
      const params: [Address, string, { pageKey?: string }] = [userAddress, 'erc20', {}];

      if (pageKey) {
        params[2].pageKey = pageKey;
      }

      const { result } = await ky
        .post(`https://${alchemyEndpoint}.g.alchemy.com/v2/${env.ALCHEMY_API_KEY}`, {
          json: {
            jsonrpc: '2.0',
            method: 'alchemy_getTokenBalances',
            params,
            id: 1,
          },
        })
        .json<AlchemyTokenBalanceResponse>();

      const tokenBalances = result.tokenBalances
        // Alchemy also shows historic token holdings with a zero balance
        .filter(({ tokenBalance }) => hexToBigInt(tokenBalance as Hex) > 0n);

      tokenCount += tokenBalances.length;
      pageKey = result.pageKey;

      if (pageKey) {
        // Wait a bit to not get rate limited (not really practical in production, probably)
        await setTimeout(250);
      }
    } while (pageKey);

    await prismaClient.leaderboardEntry.upsert({
      where: {
        userId_chainId: { userId: userAddress, chainId },
      },
      create: {
        chainId,
        userId: userAddress,
        tokenCount,
      },
      update: {
        tokenCount,
      },
    });

    return new ServiceResponse(ResponseStatus.Success, 'Leaderboard entry added successfully', null, StatusCodes.OK);
  } catch (error) {
    if (error instanceof HTTPError) {
      logger.error(
        { err: error, context: 'leaderboard' },
        'An unexpected error occurred while adding the leaderboard entry'
      );
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Failed to add leaderboard entry',
        null,
        StatusCodes.BAD_GATEWAY
      );
    }
  }

  return new ServiceResponse(
    ResponseStatus.Failed,
    'An unexpected error occurred while adding the leaderboard entry',
    null,
    StatusCodes.INTERNAL_SERVER_ERROR
  );
};
