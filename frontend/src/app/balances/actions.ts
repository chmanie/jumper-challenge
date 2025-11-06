'use server';

import { cookies } from 'next/headers';
import { Address } from 'viem';

import type { APIResponse, BalanceResponse } from '@/lib/types';

export const getBalances = async (chainId: number, address: Address, opts?: { page?: string; limit?: number }) => {
  const token = (await cookies()).get('auth_token');

  if (!token) {
    throw new Error('Not authenticated');
  }

  const res = await fetch(
    `${process.env.API_URL}/balances/${chainId}/${address}?pageKey=${opts?.page || ''}&limit=${opts?.limit || ''}`,
    {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }
  );

  const result: APIResponse<BalanceResponse> = await res.json();

  if (!res.ok) {
    throw new Error(result.message);
  }

  return result.responseObject;
};
