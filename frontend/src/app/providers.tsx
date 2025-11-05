'use client';

import { HeroUIProvider } from '@heroui/react';
import { createAppKit } from '@reown/appkit/react';
import { type PropsWithChildren } from 'react';
import { WagmiProvider } from 'wagmi';
import {
  AppKitNetwork,
  arbitrum,
  mainnet,
  bsc,
  polygon,
  optimism,
  base,
  avalanche,
  zksync,
} from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

import { AuthProvider } from '../providers/AuthProvider';

const queryClient = new QueryClient();
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
  mainnet,
  arbitrum,
  bsc,
  polygon,
  optimism,
  base,
  avalanche,
  zksync,
];
const projectId = process.env.NEXT_PUBLIC_APPKIT_PROJECT_ID;

if (!projectId) {
  throw new Error('AppKit Project ID not set');
}

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
});

interface Props {
  isAuthenticated: boolean;
}

export const Providers = ({ children, isAuthenticated }: PropsWithChildren<Props>) => {
  return (
    <HeroUIProvider>
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider initialIsAuthenticated={isAuthenticated}>{children}</AuthProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </HeroUIProvider>
  );
};
