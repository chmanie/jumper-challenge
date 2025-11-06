'use server';

import { cookies } from 'next/headers';

import type { APIResponse, LeaderboardResponse } from '@/lib/types';

export const enterLeaderboard = async (chainId: number) => {
  const token = (await cookies()).get('auth_token');

  if (!token) {
    throw new Error('Not authenticated');
  }

  const res = await fetch(`${process.env.API_URL}/leaderboard/${chainId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  const result: APIResponse<null> = await res.json();

  if (!res.ok) {
    throw new Error(result.message);
  }

  return result.responseObject;
};

export const getLeaderboard = async (chainId: number, opts?: { page?: string; limit?: number }) => {
  const token = (await cookies()).get('auth_token');

  if (!token) {
    throw new Error('Not authenticated');
  }

  const res = await fetch(
    `${process.env.API_URL}/leaderboard/${chainId}?pageKey=${opts?.page || ''}&limit=${opts?.limit || ''}`,
    {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }
  );

  const result: APIResponse<LeaderboardResponse> = await res.json();

  if (!res.ok) {
    throw new Error(result.message);
  }

  return result.responseObject;
};
