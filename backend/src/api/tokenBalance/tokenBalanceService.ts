import { inspect } from 'node:util';

import { Network } from 'alchemy-sdk';
import ky from 'ky';

import { env } from '@/common/utils/envConfig';

const getTokenBalances = async (address: string, chainId: number) => {
  const result = await ky
    .post(`https://${Network.ETH_MAINNET}.g.alchemy.com/v2/${env.ALCHEMY_API_KEY}`, {
      json: {
        jsonrpc: '2.0',
        method: 'alchemy_getTokenBalances',
        params: ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', 'erc20'],
        id: 1,
      },
    })
    .json();

  // FIXME: Paging!!
  console.log(inspect(result, { depth: null }));
};
