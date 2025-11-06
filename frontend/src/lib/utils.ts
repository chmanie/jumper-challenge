export const parseChainId = (chainId?: number | string): number => {
  if (!chainId) {
    throw new Error('Please connect to a network using the wallet.');
  }
  return typeof chainId == 'number' ? chainId : parseInt(chainId, 10);
};
