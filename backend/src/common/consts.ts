import { arbitrum, avalanche, base, bsc, Chain, mainnet, optimism, polygon, zksync } from 'viem/chains';

export const SUPPORTED_NETWORKS: Record<number, { ALCHEMY_ENDPOINT: string; VIEM_CHAIN: Chain }> = {
  1: { ALCHEMY_ENDPOINT: 'eth-mainnet', VIEM_CHAIN: mainnet },
  10: { ALCHEMY_ENDPOINT: 'opt-mainnet', VIEM_CHAIN: optimism },
  56: { ALCHEMY_ENDPOINT: 'bnb-mainnet', VIEM_CHAIN: bsc },
  137: { ALCHEMY_ENDPOINT: 'polygon-mainnet', VIEM_CHAIN: polygon },
  324: { ALCHEMY_ENDPOINT: 'zksync-mainnet', VIEM_CHAIN: zksync },
  8453: { ALCHEMY_ENDPOINT: 'base-mainnet', VIEM_CHAIN: base },
  42161: { ALCHEMY_ENDPOINT: 'arb-mainnet', VIEM_CHAIN: arbitrum },
  43114: { ALCHEMY_ENDPOINT: 'avax-mainnet', VIEM_CHAIN: avalanche },
};
