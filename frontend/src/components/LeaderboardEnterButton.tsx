'use client';

import { useState } from 'react';
import { Button } from '@heroui/button';
import { useAppKitNetwork } from '@reown/appkit/react';
import { enterLeaderboard } from '@/app/leaderboard/actions';
import { parseChainId } from '../lib/utils';
import { Spinner } from '@heroui/spinner';

interface Props {
  onSubmit: () => void;
  update?: boolean;
}

export const LeaderboardEnterButton = ({ onSubmit, update }: Props) => {
  const { chainId } = useAppKitNetwork();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);

    try {
      const cId = parseChainId(chainId);
      await enterLeaderboard(cId);
      onSubmit();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button color="primary" onPress={handleToggle} isLoading={isLoading} disabled={isLoading}>
      {isLoading ? (
        <>
          <Spinner />
          <span>Crunching the numbers...</span>
        </>
      ) : update ? (
        'Update your numbers'
      ) : (
        'Enter the leaderboard'
      )}
    </Button>
  );
};
