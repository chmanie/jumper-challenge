'use client';

import { useAppKitAccount, useAppKit } from '@reown/appkit/react';
import { blo } from 'blo';
import { type Address } from 'viem';

import { Avatar as HerouiAvatar } from '@heroui/avatar';
import clsx from 'clsx';

export const Avatar = () => {
  const { isConnected, address } = useAppKitAccount();
  const { open } = useAppKit();

  return (
    <HerouiAvatar
      className={clsx({ 'cursor-pointer': isConnected })}
      onClick={isConnected ? () => open() : undefined}
      src={address ? blo(address as Address) : undefined}
    />
  );
};
