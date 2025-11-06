'use client';

import { useAppKitNetwork } from '@reown/appkit/react';

export const NetworkName = () => {
  const { caipNetwork } = useAppKitNetwork();
  return caipNetwork?.name;
};
