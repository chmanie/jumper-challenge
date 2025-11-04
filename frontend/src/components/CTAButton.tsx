'use client';

import { Button } from '@heroui/button';
import NextLink from 'next/link';
import { button as buttonStyles } from '@heroui/theme';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';

export const CTAButton = () => {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();

  if (isConnected) {
    return (
      <NextLink
        className={buttonStyles({
          color: 'primary',
          radius: 'full',
          variant: 'shadow',
          size: 'lg',
        })}
        href="/balances"
      >
        Go to Balances
      </NextLink>
    );
  }
  return (
    <Button
      className={buttonStyles({
        color: 'primary',
        radius: 'full',
        variant: 'shadow',
        size: 'lg',
      })}
      onPress={() => open()}
    >
      Connect wallet
    </Button>
  );
};
