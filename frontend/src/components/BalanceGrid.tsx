'use client';

import { useAppKitNetwork } from '@reown/appkit/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';
import { type Address } from 'viem';

import { getBalances } from '@/app/balances/actions';
import type { BalanceResponse } from '@/lib/types';

import { BalanceCard, BalanceSkeletonCard } from './BalanceCard';
import { InfoCard } from './InfoCard';

interface Props {
  address: Address;
}

export const BalanceGrid = ({ address }: Props) => {
  const { chainId } = useAppKitNetwork();
  const [balances, setBalances] = useState<BalanceResponse['tokenBalances'] | undefined>();
  const [isInitialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const { isIntersecting, ref } = useIntersectionObserver({ threshold: 0.1 });
  const [pageKey, setPageKey] = useState<string | undefined>();
  const [isLoadingMore, setLoadingMore] = useState(false);
  const isFetchingRef = useRef(false);

  const fetchBalances = useCallback(
    async (page?: string) => {
      if (!chainId) {
        setInitialLoading(false);
        setError('Please connect to a network using the wallet.');
        return;
      }

      // Prevent duplicate fetches
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      try {
        const response = await getBalances(typeof chainId == 'number' ? chainId : parseInt(chainId, 10), address, {
          page,
          limit: 30,
        });
        if (response.tokenBalances) {
          if (page) {
            setBalances((prev) => [...(prev || []), ...response.tokenBalances]);
          } else {
            setBalances(response.tokenBalances);
          }
        }
        setPageKey(response.pageKey);
      } catch (error) {
        console.error('Failed to fetch balances: ', error);
        setBalances(undefined);
        setPageKey(undefined);
        setError(`Could not get token balances: ${(error as Error).message}`);
      } finally {
        setInitialLoading(false);
        setLoadingMore(false);
        isFetchingRef.current = false;
      }
    },
    [address, chainId]
  );

  useEffect(() => {
    fetchBalances();
    // Only for initial load, and when address or chainId change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, chainId]);

  useEffect(() => {
    if (isIntersecting && !isLoadingMore && !isFetchingRef.current && pageKey) {
      setLoadingMore(true);
      fetchBalances(pageKey);
    }
  }, [isIntersecting, isLoadingMore, pageKey, fetchBalances]);

  if (isInitialLoading) {
    return (
      <div className="grid grid-cols-3 gap-4 lg:grid-cols-3">
        {Array.from({ length: 11 }).map((_val, idx) => (
          <BalanceSkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  if (error) {
    return <InfoCard isError>{error}</InfoCard>;
  }

  if (!balances || balances.length === 0) {
    return <InfoCard>No token balances found.</InfoCard>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 lg:grid-cols-3">
        {balances.map(({ contractAddress, tokenBalance, tokenMetadata }) => (
          <BalanceCard
            key={contractAddress}
            address={contractAddress}
            balance={tokenBalance}
            decimals={tokenMetadata.decimals}
            icon={tokenMetadata.logo}
            symbol={tokenMetadata.symbol}
            name={tokenMetadata.name}
          />
        ))}

        {isLoadingMore && (
          <>
            {Array.from({ length: 6 }).map((_, idx) => (
              <BalanceSkeletonCard key={`loading-${idx}`} />
            ))}
          </>
        )}
      </div>

      {pageKey && <div ref={ref} className="h-20" />}
    </div>
  );
};
