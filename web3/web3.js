import detectEthereumProvider from '@metamask/detect-provider';
// import WalletConnectProvider from '@walletconnect/web3-provider/dist/umd/index.min.js';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { CHAIN_IDS_TO_NAMES, CHAIN_INFO, SUPPORTED_CHAIN_ID } from './constants';
// import { parseUnits } from 'ethers/lib/utils';
import { getMetamaskProvider } from '@/util/web3';

// function isMobile() {
//   if (typeof window !== 'undefined' && window && window.isSecureContext && navigator.userAgent) {
//     return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
//       navigator.userAgent,
//     );
//   } else return false;
// }

// const getWalletConnetProvider = () => {
//   return new WalletConnectProvider({
//     rpc: {
//       97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
//       56: 'https://bsc-dataseed.binance.org/',
//       137: 'https://rpc-mainnet.matic.network',
//     },
//     bridge: 'https://pancakeswap.bridge.walletconnect.org/',
//     qrcode: true,
//     pollingInterval: 12000,
//   });
// };

// export const walletProvider = new WalletConnectProvider({
//   rpc: {
//     97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
//     56: 'https://bsc-dataseed.binance.org/',
//     137: 'https://rpc-mainnet.matic.network',
//   },
//   bridge: 'https://pancakeswap.bridge.walletconnect.org/',
//   qrcode: true,
//   pollingInterval: 12000,
// });

// export const connect = async () => {
//   try {
//     if (typeof window !== 'undefined' && window) {
//       // const { ethereum } = window;
//       if (!getMetamaskProvider()) {
//         console.log('getMetamaskProvider()', getMetamaskProvider());
//         // if (!ethereum) {
//         alert('Get MetaMask!');
//         return;
//       }
//       console.log('getMetamaskProvider()', getMetamaskProvider());
//       await getMetamaskProvider().request({
//         method: 'eth_requestAccounts',
//       });
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const getAccount = async () => {
//   const address = await getAddress();
//   if (address) {
//     try {
//       const provider = checkAndInstantiateWeb3();
//       const networkId = await getNetworkId();
//       const balance = (await provider.getBalance(address)).toString();
//       localStorage.setItem('account', address);
//       return { address, balance, networkId };
//     } catch (error) {
//       console.error(error);
//     }
//   } else {
//     throw new Error('Unable to connect to Metamask');
//   }
// };

// export async function getAddress() {
//   return 'test';
//   // if (localStorage.provider && typeof window !== 'undefined' && window) {
//   //   try {
//   //     const provider = await detectEthereumProvider();
//   //     return (await provider.request({ method: 'eth_accounts' }))[0];
//   //   } catch (e) {
//   //     console.error(e);
//   //     return null;
//   //   }
//   // } else if (localStorage.walletconnect) {
//   //   try {
//   //     const walletProvider = getWalletConnetProvider();
//   //     return walletProvider.wc.accounts[0];
//   //   } catch (e) {
//   //     console.error(e);
//   //     return null;
//   //   }
//   // } else {
//   //   return null;
//   // }
// }

// export async function getNetworkId() {
//   let networkID;
//   if (!isMobile() && typeof window !== 'undefined' && window) {
//     const chainIdHex = await getMetamaskProvider().request({ method: 'eth_chainId' });
//     networkID = parseInt(chainIdHex, 16);
//     console.log('networkID', networkID);
//     if (await localStorage.walletconnect) {
//       const walletProvider = getWalletConnetProvider();
//       networkID = walletProvider.wc.chainId;
//     }
//   } else {
//     if (localStorage.provider && typeof window !== 'undefined' && window) {
//       const provider = await detectEthereumProvider();
//       networkID = await provider.request({ method: 'net_version' });
//     }
//     if (await localStorage.walletconnect) {
//       const walletProvider = getWalletConnetProvider();
//       networkID = walletProvider.wc.chainId;
//     }
//   }

//   return networkID;
// }

// export const enableWallet = async () => {
//   try {
//     const walletProvider = getWalletConnetProvider();
//     await walletProvider.enable();
//   } catch (error) {
//     if (typeof window !== 'undefined' && window) {
//       // localStorage.removeItem('walletconnect');
//       localStorage.setItem('walletconnect', 'null');
//       // window.location.reload();
//     }
//     console.error(error);
//   }
// };

// export function checkAndInstantiateWeb3() {
//   try {
//     if (localStorage.provider && typeof window !== 'undefined' && getMetamaskProvider()) {
//       return new ethers.providers.Web3Provider(getMetamaskProvider());
//     } else if (localStorage.walletconnect) {
//       const walletProvider = getWalletConnetProvider();
//       return new ethers.providers.Web3Provider(walletProvider);
//     } else {
//       if (typeof window !== 'undefined' && getMetamaskProvider()) {
//         return new ethers.providers.Web3Provider(getMetamaskProvider());
//       }
//     }
//   } catch (e) {
//     console.error(e);
//     return null;
//   }
// }

// add 0.1%
export const calculateCommissionFee = (value, percent = 10) =>
  value
    .mul(ethers.BigNumber.from(10000).add(ethers.BigNumber.from(percent)))
    .div(ethers.BigNumber.from(10000));

export function getExponentValue(decimals) {
  return new BigNumber(10).pow(decimals);
}

export function getHumanValue(value, decimals = 18) {
  return new BigNumber(value).div(getExponentValue(decimals));
}

export function getNonHumanValue(value, decimals) {
  if (typeof value !== 'string') {
    value = value.toString();
  }
  return ethers.utils.parseUnits(value.toString(), decimals);
}

export function getNonHumanValueSumm(amounts) {
  return amounts.reduce((acc, amount) => {
    return ethers.BigNumber.from(acc).add(ethers.BigNumber.from(amount));
  }, ethers.BigNumber.from(0));
}

export function isSupportedChain(chainId) {
  console.log('isSupportedChain chainId', chainId);
  console.log('CHAIN_INFO', CHAIN_INFO);
  const supportedChainsIds = Object.keys(CHAIN_INFO);
  console.log('supportedChainsIds', supportedChainsIds);
  return !!chainId && supportedChainsIds.includes(String(chainId));
  // return !!chainId && SUPPORTED_CHAIN_ID.includes(+chainId);
}

export const calculateDecimalsPlaces = (value, decimals) => {
  let decimalPart = value.split('.')[1];
  let decimalPlaces = decimalPart ? decimalPart.length : 0;
  return decimalPlaces > decimals;
};

export function getChainInfo(chainId) {
  if (chainId) {
    return (
      CHAIN_INFO[chainId] ?? {
        explorer: '',
        label: 'Undefined',
        nativeCurrency: { name: '', symbol: '', decimals: 0 },
      }
    );
  }
  return {
    explorer: '',
    label: 'Undefined',
    nativeCurrency: { name: '', symbol: '', decimals: 0 },
  };
}

export async function switchNetwork(chainId) {
  const hexChainId = ethers.utils.hexValue(chainId);

  if (typeof window !== 'undefined' && getMetamaskProvider()) {
    try {
      await getMetamaskProvider().request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902 || switchError.code === -32603) {
        try {
          await getMetamaskProvider().request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: hexChainId,
                chainName: CHAIN_IDS_TO_NAMES[chainId],
                nativeCurrency: getChainInfo(chainId).nativeCurrency,
                rpcUrls: RPC_URLS[chainId],
                blockExplorerUrls: [getChainInfo(chainId).explorer],
              },
            ],
          });
        } catch (addError) {
          console.log('addError', addError);
        }
      }
    }
  }
}

const INFURA_KEY = 'cb79f6871ebe4e1c827ab1019e048094';

export const FALLBACK_URLS = {
  1: [
    // "Safe" URLs
    'https://api.mycryptoapi.com/eth',
    'https://cloudflare-eth.com',
    // "Fallback" URLs
    'https://rpc.ankr.com/eth',
    'https://eth-mainnet.public.blastapi.io',
  ],
  137: [
    // "Safe" URLs
    'https://polygon-rpc.com/',
    'https://rpc-mainnet.matic.network',
    'https://matic-mainnet.chainstacklabs.com',
    'https://rpc-mainnet.maticvigil.com',
    'https://rpc-mainnet.matic.quiknode.pro',
    'https://matic-mainnet-full-rpc.bwarelabs.com',
  ],
  42161: [
    // "Safe" URLs
    'https://arb1.arbitrum.io/rpc',
    // "Fallback" URLs
    'https://arbitrum.public-rpc.com',
  ],
  10: [
    // "Safe" URLs
    'https://mainnet.optimism.io/',
    // "Fallback" URLs
    'https://rpc.ankr.com/optimism',
  ],
  42220: [
    // "Safe" URLs
    `https://forno.celo.org`,
  ],
  56: [
    // "Safe" URLs
    `https://bsc-dataseed1.defibit.io`,
    `https://bsc-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3`,
    `https://rpc-bsc.bnb48.club`,
    `https://bsc-dataseed4.binance.org`,
    `https://bsc-dataseed1.binance.org/`,
  ],
  97: [
    // "Safe" URLs
    `https://bsc-testnet.public.blastapi.io`,
    `https://endpoints.omniatech.io/v1/bsc/testnet/public`,
    `https://data-seed-prebsc-1-s3.binance.org:8545/`,
    `https://data-seed-prebsc-2-s3.binance.org:8545`,
    `https://data-seed-prebsc-2-s1.binance.org:8545`,
  ],
  43114: [
    // "Safe" URLs
    `https://avalanche-evm.publicnode.com`,
    `https://ava-mainnet.public.blastapi.io/ext/bc/C/rpc`,
    `https://avalanche.blockpi.network/v1/rpc/public`,
    `https://endpoints.omniatech.io/v1/avax/mainnet/public`,
    `https://api.avax.network/ext/bc/C/rpc`,
  ],
  71402: [
    // "Safe" URLs
    `https://v1.mainnet.godwoken.io/rpc`,
  ],
  250: [
    // "Safe" URLs
    `https://endpoints.omniatech.io/v1/fantom/mainnet/public`,
    `https://rpc.fantom.network`,
    `https://rpc2.fantom.network`,
    `https://fantom-mainnet.public.blastapi.io`,
    `https://1rpc.io/ftm`,
  ],
  100: [
    // "Safe" URLs
    `https://gnosis-mainnet.public.blastapi.io`,
    `https://rpc.gnosischain.com`,
    `https://xdai-rpc.gateway.pokt.network`,
    `https://gnosis.blockpi.network/v1/rpc/public`,
    `https://rpc.ankr.com/gnosis`,
  ],
  1284: [
    // "Safe" URLs
    `https://rpc.api.moonbeam.network`,
    `https://moonbeam.public.blastapi.io`,
    `https://rpc.ankr.com/moonbeam`,
  ],
  42262: [
    // "Safe" URLs
    `https://emerald.oasis.dev`,
  ],
  23294: [
    // "Safe" URLs
    `https://sapphire.oasis.io`,
  ],
  1313161554: [
    // "Safe" URLs
    `https://mainnet.aurora.dev`,
    `https://endpoints.omniatech.io/v1/aurora/mainnet/public`,
  ],
  122: [
    // "Safe" URLs
    `https://fuse-mainnet.chainstacklabs.com`,
    `https://rpc.fuse.io`,
    `https://fuse-rpc.gateway.pokt.network`,
  ],
  324: [
    // "Safe" URLs
    `https://mainnet.era.zksync.io`,
  ],
  1666600000: [
    // "Safe" URLs
    `https://api.s0.t.hmny.io`,
    `https://api.harmony.one`,
    `https://harmony-mainnet.chainstacklabs.com`,
    `https://rpc.ankr.com/harmony`,
    `https://a.api.s0.t.hmny.io`,
  ],
  1285: [
    // "Safe" URLs
    `https://rpc.api.moonriver.moonbeam.network`,
    `https://moonriver.public.blastapi.io`,
    `https://moonriver.unitedbloc.com:2000`,
  ],
  128: [
    // "Safe" URLs
    `https://http-mainnet.hecochain.com`,
    `https://hecoapi.terminet.io/rpc`,
    `https://http-mainnet-node.huobichain.com	`,
  ],
  66: [
    // "Safe" URLs
    `https://exchainrpc.okex.org`,
    `https://okc-mainnet.gateway.pokt.network/v1/lb/6275309bea1b320039c893ff`,
  ],
  40: [
    // "Safe" URLs
    `https://rpc1.eu.telos.net/evm`,
    `https://mainnet.telos.net/evm`,
    `https://api.kainosbp.com/evm`,
  ],
  7001: [
    // "Safe" URLs
    `https://api.athens2.zetachain.com/evm`,
  ],
  534353: [
    // "Safe" URLs
    `https://alpha-rpc.scroll.io/l2`,
    `https://scroll-alphanet.public.blastapi.io`,
    `https://scroll-alpha-public.unifra.io`,
  ],
  25: [
    // "Safe" URLs
    `https://evm.cronos.org`,
  ],
  338: [
    // "Safe" URLs
    `https://evm-t3.cronos.org`,
  ],
  2046399126: [
    // "Safe" URLs
    `https://mainnet.skalenodes.com/v1/elated-tan-skat`,
  ],
  476158412: [
    // "Safe" URLs
    `https://staging-v3.skalenodes.com/v1/staging-legal-crazy-castor`,
  ],
  4689: [
    // "Safe" URLs
    `https://rpc.ankr.com/iotex`,
  ],
  4690: [
    // "Safe" URLs
    `https://babel-api.testnet.iotex.io`,
  ],
};

/**
 * Known JSON-RPC endpoints.
 * These are the URLs used by the interface when there is not another available source of chain data.
 */
export const RPC_URLS = {
  1: [`https://mainnet.infura.io/v3/${INFURA_KEY}`, ...FALLBACK_URLS[1]],
  10: [`https://optimism-mainnet.infura.io/v3/${INFURA_KEY}`, ...FALLBACK_URLS[10]],
  42161: [`https://arbitrum-mainnet.infura.io/v3/${INFURA_KEY}`, ...FALLBACK_URLS[42161]],
  137: [`https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`, ...FALLBACK_URLS[137]],
  42220: [`https://celo-mainnet.infura.io/v3/${INFURA_KEY}`, ...FALLBACK_URLS[42220]],
  56: [
    `https://palpable-fragrant-sun.bsc.discover.quiknode.pro/b4d621ed1a1c73e2dc8d28721cc3b15e5a44b02d/`,
    ...FALLBACK_URLS[56],
  ],
  97: FALLBACK_URLS[97],
  43114: [`https://avalanche-mainnet.infura.io/v3/${INFURA_KEY}`, ...FALLBACK_URLS[43114]],
  71402: [...FALLBACK_URLS[71402]],
  250: [...FALLBACK_URLS[250]],
  100: [...FALLBACK_URLS[100]],
  1284: [...FALLBACK_URLS[1284]],
  42262: [...FALLBACK_URLS[42262]],
  23294: [...FALLBACK_URLS[23294]],
  1313161554: [...FALLBACK_URLS[1313161554]],
  122: FALLBACK_URLS[122],
  324: FALLBACK_URLS[324],
  1666600000: FALLBACK_URLS[1666600000],
  1285: FALLBACK_URLS[1285],
  128: FALLBACK_URLS[128],
  66: FALLBACK_URLS[66],
  40: FALLBACK_URLS[40],
  7001: FALLBACK_URLS[7001],
  534353: FALLBACK_URLS[534353],
  25: [...FALLBACK_URLS[25]],
  338: FALLBACK_URLS[338],
  2046399126: FALLBACK_URLS[2046399126],
  476158412: FALLBACK_URLS[476158412],
  4689: FALLBACK_URLS[4689],
  4690: FALLBACK_URLS[4690],
};

export class Uint128 {
  constructor(value) {}

  static fromString(value) {
    return new Uint128(value);
  }
}
