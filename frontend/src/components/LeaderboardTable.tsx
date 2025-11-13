'use client';

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table';
import { Spinner } from '@heroui/spinner';
import { useState, useEffect, useCallback } from 'react';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';

import { getLeaderboard } from '@/app/leaderboard/actions';
import { LeaderboardResponse } from '../lib/types';
import { parseChainId } from '../lib/utils';
import { LeaderboardEnterButton } from './LeaderboardEnterButton';
import { Address, isAddressEqual } from 'viem';

export const LeaderboardTable = () => {
  const [isLoading, setLoading] = useState(true);
  const [entries, setEntries] = useState<LeaderboardResponse['entries'] | undefined>();
  const { chainId } = useAppKitNetwork();
  const { address } = useAppKitAccount();

  const fetchLeaderboard = useCallback(async () => {
    try {
      const cId = parseChainId(chainId);
      setLoading(true);
      const response = await getLeaderboard(cId);
      setEntries(response.entries);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [chainId]);

  useEffect(() => {
    fetchLeaderboard();
  }, [chainId, fetchLeaderboard]);

  if (!address) {
    return null;
  }

  // FIXME: Could use tanstack/react-query here

  const isEntered = entries && entries.find(({ userId }) => isAddressEqual(userId as Address, address as Address));

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        {!isLoading ? <LeaderboardEnterButton update={!!isEntered} onSubmit={() => fetchLeaderboard()} /> : null}
      </div>
      <Table isStriped aria-label="Leaderboard table">
        <TableHeader>
          <TableColumn>Address</TableColumn>
          <TableColumn className="w-36 text-right">Token diversity</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={'No rows to display.'}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
          items={entries || []}
        >
          {({ id, userId, tokenCount }) => (
            <TableRow key={id}>
              <TableCell>{userId}</TableCell>
              <TableCell className="text-right">{tokenCount}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
