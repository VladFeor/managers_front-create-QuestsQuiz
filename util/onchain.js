import { RPC_URLS } from '~/web3/web3';

export const blockchains = [
  {
    name: 'Arbitrum',
    id: 0,
    icon: 'Arbitrum One',
    value: 'arbitrum',
    chainId: 42161,
    rpcUrl: RPC_URLS[42161], //'https://arbitrum.drpc.org',
  },
  {
    name: 'Avalanche',
    id: 1,
    icon: 'Avalanche',
    value: 'avalanche',
    chainId: 43114,
    rpcUrl: RPC_URLS[43114],//'https://avalanche.drpc.org/',
  },
  {
    name: 'BNB Chain',
    id: 2,
    icon: 'BSC',
    value: 'BNB Chain',
    chainId: 56,
    rpcUrl: RPC_URLS[56], //rpcUrl: 'https://bsc.drpc.org/',
  },
  {
    name: 'Celo',
    id: 9,
    icon: 'Celo',
    value: 'celo',
    chainId: 42220,
    rpcUrl: RPC_URLS[42220],//rpcUrl: 'https://celo.drpc.org',
  },
  {
    name: 'Cronos',
    icon: 'Cronos',
    id: 6,
    value: 'cronos',
    chainId: 25,
    rpcUrl: RPC_URLS[25],//rpcUrl: 'https://evm-cronos.crypto.org',
  },
  {
    name: 'Ethereum',
    icon: 'Ethereum',
    id: 3,
    value: 'ethereum',
    chainId: 1,
    rpcUrl: RPC_URLS[1],//rpcUrl: 'https://eth.drpc.org',
  },
  {
    name: 'Fantom',
    icon: 'Fantom',
    id: 8,
    value: 'fantom',
    chainId: 250,
    rpcUrl: RPC_URLS[250],//rpcUrl: 'https://fantom.drpc.org/',
  },
  {
    name: 'Harmony',
    icon: 'Harmony',
    id: 10,
    value: 'harmony',
    chainId: 1666600000,
    rpcUrl: RPC_URLS[1666600000],//rpcUrl: 'https://api.harmony.one',
  },
  {
    name: 'Moonbeam',
    icon: 'Moonbeam',
    id: 7,
    value: 'moonbeam',
    chainId: 1284,
    rpcUrl: RPC_URLS[1284],//rpcUrl: 'https://moonbeam.drpc.org',
  },
  {
    name: 'Optimism',
    icon: 'Optimism',
    id: 5,
    value: 'optimism',
    chainId: 10,
    rpcUrl: RPC_URLS[10],// rpcUrl: 'https://optimism.drpc.org',
  },
  {
    name: 'Polygon',
    icon: 'Polygon',
    id: 4,
    value: 'polygon',
    chainId: 137,
    rpcUrl: RPC_URLS[137],//rpcUrl: 'https://polygon.drpc.org',
  },

  // { name: 'Solana', icon: '/_nuxt/assets/images/solana.svg', id: 11, value: 'solana' },
];

export const ethereumBlockchain = { name: 'Ethereum', icon: 'Ethereum', id: 3, value: 'ethereum' };
export const IPFS_PROVIDER_URL = 'https://ipfs.io/ipfs/';

export const handleIPFSUrl = (url) => {
  console.log(
    'url',
    url,
    url?.startsWith('ipfs://') ? url.replace('ipfs://', IPFS_PROVIDER_URL) : url,
  );
  return url?.startsWith('ipfs://') ? url.replace('ipfs://', IPFS_PROVIDER_URL) : url;
};
