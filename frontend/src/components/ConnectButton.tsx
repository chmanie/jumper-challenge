'use client';

import { Button } from '@heroui/button';
import { button as buttonStyles } from '@heroui/theme';
import { useAppKit } from '@reown/appkit/react';

export const ConnectButton = () => {
  const { open } = useAppKit();
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
