'use client';

import { HeroUIProvider } from '@heroui/react';
import { createAppKit } from '@reown/appkit/react';
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
  fantom,
} from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

const queryClient = new QueryClient();
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, arbitrum];
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

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </WagmiProvider>
    </HeroUIProvider>
  );
}
