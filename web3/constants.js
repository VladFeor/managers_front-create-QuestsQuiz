export const MULTI_SEND_ADDRESSES = {
  1: '0x82679f36C862E60aAA2506aD26F8c6DE1dA9B5b0',
  10: '0x82679f36C862E60aAA2506aD26F8c6DE1dA9B5b0',
  42161: '0x82679f36C862E60aAA2506aD26F8c6DE1dA9B5b0',
  137: '0x82679f36C862E60aAA2506aD26F8c6DE1dA9B5b0',
  42220: '0x82679f36C862E60aAA2506aD26F8c6DE1dA9B5b0',
  56: '0x82679f36C862E60aAA2506aD26F8c6DE1dA9B5b0',
  97: '0x45Bb2366E0b43e1e45aDb7128C0150339FCc4729',
  43114: '0x82679f36C862E60aAA2506aD26F8c6DE1dA9B5b0',
  71402: '0x82679f36C862E60aAA2506aD26F8c6DE1dA9B5b0', // new version
  250: '0x82679f36C862E60aAA2506aD26F8c6DE1dA9B5b0',
  100: '0x82679f36C862E60aAA2506aD26F8c6DE1dA9B5b0',
  1284: '0x82679f36C862E60aAA2506aD26F8c6DE1dA9B5b0',
  42262: '0x82679f36C862E60aAA2506aD26F8c6DE1dA9B5b0',
  23294: '0xa673810C62c2BfaF261614F72bC01e79bC6F19fA',
  122: '0x82679f36C862E60aAA2506aD26F8c6DE1dA9B5b0',
  1313161554: '0x82679f36C862E60aAA2506aD26F8c6DE1dA9B5b0',
  324: '0xc094c359187C92A9F113e41D24c2fDAd8130497A',
  1666600000: '0x82679f36C862E60aAA2506aD26F8c6DE1dA9B5b0',
  1285: '0x82679f36C862E60aAA2506aD26F8c6DE1dA9B5b0',
  128: '0x82679f36C862E60aAA2506aD26F8c6DE1dA9B5b0',
  66: '0x82679f36C862E60aAA2506aD26F8c6DE1dA9B5b0',
  40: '0x82679f36C862E60aAA2506aD26F8c6DE1dA9B5b0',
  7001: '0x42B28E2Dc1843A636347C1D521d08711Ac18B2FB',
  534353: '0x42B28E2Dc1843A636347C1D521d08711Ac18B2FB',
  25: '0x42B28E2Dc1843A636347C1D521d08711Ac18B2FB',
  338: '0x42B28E2Dc1843A636347C1D521d08711Ac18B2FB',
  476158412: '0x5DA5a85B57822501a26B778Cf90c078c04cfDbf6', // new version
  2046399126: '0x8CACd4402E2F4248dc7CdF36f4049997F5B57aF7',
  4689: '0x42B28E2Dc1843A636347C1D521d08711Ac18B2FB',
  4690: '0x42B28E2Dc1843A636347C1D521d08711Ac18B2FB',
  1088: '0x6A4c90CA940013ff4a06e2429d660c04Cd4fE3f9',
  TRON_GRID_MAINNET: 'TE6hpzuBVxMLWcoiUk9EZGF8TxBNSKSrn8',
  APTOS_MAINNET:
    '0x9e2c76d559f4b68ab913f3fd2d25b92acbcb5f6bba6e8e5f0f9c996cfa921e0d::sender::multisend',
};

export const SUPPORTED_CHAIN_ID = [137, 1, 56, 97];

export const TOKENS = {
  56: [
    {
      address: 'native',
      symbol: 'BNB',
      name: 'bnb',
      decimals: 18,
    },
    {
      address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
      chainId: 56,
      name: 'Ethereum Token',
      symbol: 'ETH',
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/complusnetwork/default-token-list/master/src/bsc/0x2170Ed0880ac9A755fd29B2688956BD959F933F8/logo.png',
    },
    {
      address: '0x55d398326f99059fF775485246999027B3197955',
      chainId: 56,
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/complusnetwork/default-token-list/master/src/bsc/0x55d398326f99059fF775485246999027B3197955/logo.png',
    },
    {
      address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      chainId: 56,
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/complusnetwork/default-token-list/master/src/bsc/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d/logo.png',
    },
    {
      address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
      chainId: 56,
      name: 'Dai Token',
      symbol: 'DAI',
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/complusnetwork/default-token-list/master/src/bsc/0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3/logo.png',
    },
    {
      address: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
      chainId: 56,
      name: 'Uniswap',
      symbol: 'UNI',
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/complusnetwork/default-token-list/master/src/bsc/0xBf5140A22578168FD562DCcF235E5D43A02ce9B1/logo.png',
    },
    {
      address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
      chainId: 56,
      name: 'BUSD Token',
      symbol: 'BUSD',
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/complusnetwork/default-token-list/master/src/bsc/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/logo.png',
    },
    {
      address: '0xfb6115445Bff7b52FeB98650C87f44907E58f802',
      name: 'Binance-Peg Aave Token',
      symbol: 'AAVE',
      decimals: 18,
    },
    {
      address: '0xf307910A4c7bbc79691fD374889b36d8531B08e3',
      name: 'Ankr',
      symbol: 'ANKR',
      decimals: 18,
    },
    {
      address: '0x715D400F88C167884bbCc41C5FeA407ed4D2f8A0',
      name: 'Binance-Peg Axie Infinity Shard Token',
      symbol: 'AXS',
      decimals: 18,
    },
    {
      address: '0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95',
      name: 'ApeSwapFinance Banana',
      symbol: 'BANANA',
      decimals: 18,
    },
  ],
  1: [
    {
      address: 'native',
      symbol: 'ETH',
      name: 'eth',
      decimals: 18,
    },
    {
      address: '0x4355fC160f74328f9b383dF2EC589bB3dFd82Ba0',
      name: 'Optimus',
      symbol: 'OPT',
      decimals: 18,
    },
    {
      address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
      name: ' Aave Token',
      symbol: 'AAVE',
      decimals: 18,
    },
    {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
    },
    {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      name: 'Dai Stablecoin',
      symbol: 'DAI',
      decimals: 18,
    },
    {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
    },
    {
      address: '0x028171bCA77440897B824Ca71D1c56caC55b68A3',
      name: 'Aave interest bearing DAI',
      symbol: 'aDAI',
      decimals: 18,
    },
    {
      address: '0xBcca60bB61934080951369a648Fb03DF4F96263C',
      name: 'Aave interest bearing USDC',
      symbol: 'aUSDC',
      decimals: 6,
    },
    {
      address: '0x013062189dc3dcc99e9Cee714c513033b8d99e3c',
      symbol: 'INFRA',
      name: 'Bware',
      decimals: 18,
    },
  ],
  137: [
    {
      address: 'native',
      symbol: 'MATIC',
      name: 'Matic',
      decimals: 18,
    },
    {
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      symbol: 'USDT',
      name: '(PoS) Tether USD',
      decimals: 6,
    },
    {
      address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      symbol: 'DAI',
      name: '(PoS) Dai Stablecoin',
      decimals: 18,
    },
    {
      address: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
      symbol: 'AAVE',
      name: 'Aave (PoS)',
      decimals: 18,
    },
    {
      address: '0x329434Fe066AC71D5FB93489F955A6959658097b',
      symbol: 'aDAI',
      name: 'Aave interest bearing DAI (PoS)',
      decimals: 18,
    },
    {
      address: '0xe87Ba1bd11EE6e0D3c7dd6932E6A038e38627F65',
      symbol: 'aUSDC',
      name: 'aUSDC',
      decimals: 18,
    },
  ],
  10: [
    {
      address: 'native',
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
    {
      address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
    },
    {
      address: '0x4200000000000000000000000000000000000006',
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
    },
    {
      address: '0x76FB31fb4af56892A25e32cFC43De717950c9278',
      symbol: 'AAVE',
      name: 'Aave Token',
      decimals: 18,
    },
    {
      address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
    },
    {
      address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
    },
    {
      address: '0xEc6adef5E1006bb305bB1975333e8fc4071295bf',
      name: 'Cartesi Token',
      symbol: 'CTSI',
      decimals: 18,
    },
  ],
  42161: [
    {
      address: 'native',
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
    {
      address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
    },
    {
      address: '0x8F4581D173FFD2c439824465366a67c509A813ac',
      symbol: 'AETH',
      name: 'Atlantis EThereum',
      decimals: 18,
    },
    {
      address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      symbol: 'USDC',
      name: 'USD Coin (Arb1)',
      decimals: 6,
    },
    {
      address: '0x625E7708f30cA75bfd92586e17077590C60eb4cD',
      symbol: 'aArbUSDC',
      name: 'Aave Arbitrum USDC',
      decimals: 6,
    },
    {
      address: '0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE',
      symbol: 'aArbDAI',
      name: 'Aave Arbitrum DAI',
      decimals: 18,
    },
    {
      address: '0xa0b862F60edEf4452F25B4160F177db44DeB6Cf1',
      symbol: 'GNO',
      name: 'Gnosis Token',
      decimals: 18,
    },
    {
      address: '0x9623063377AD1B27544C965cCd7342f7EA7e88C7',
      symbol: 'GRT',
      name: 'Graph Token',
      decimals: 18,
    },
    {
      address: '0xe4DDDfe67E7164b0FE14E218d80dC4C08eDC01cB',
      symbol: 'KNC',
      name: 'Kyber Network Crystal v2',
      decimals: 18,
    },
    {
      address: '0x319f865b287fCC10b30d8cE6144e8b6D1b476999',
      name: 'Cartesi Token',
      symbol: 'CTSI',
      decimals: 18,
    },
  ],
  42220: [
    {
      address: 'native',
      symbol: 'CELO',
      name: 'CELO',
      decimals: 18,
    },
    {
      address: '0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787',
      symbol: 'cREAL',
      name: 'Celo Brazilian Real',
      decimals: 18,
    },
    {
      address: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
      symbol: 'cUSD',
      name: 'Celo Dollar',
      decimals: 18,
    },
    {
      address: '0x29dFce9c22003A4999930382Fd00f9Fd6133Acd1',
      symbol: 'SUSHI',
      name: 'SushiToken',
      decimals: 18,
    },
    {
      address: '0x122013fd7dF1C6F636a5bb8f03108E876548b455',
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
    },
    {
      address: '0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C',
      symbol: 'BIFI',
      name: 'beefy.finance',
      decimals: 18,
    },
  ],
  97: [
    {
      address: 'native',
      symbol: 'BNB',
      name: 'BNB',
      decimals: 18,
    },
    {
      address: '0x64544969ed7EBf5f083679233325356EbE738930',
      symbol: 'USDC',
      name: 'USDC Token',
      decimals: 18,
    },
    {
      address: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
      symbol: 'USDT',
      name: 'USDT Token',
      decimals: 18,
    },
    {
      address: '0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867',
      symbol: 'DAI',
      name: 'DAI Token',
      decimals: 18,
    },
  ],
  43114: [
    {
      address: 'native',
      symbol: 'AVAX',
      name: 'Avax',
      decimals: 18,
    },
    {
      address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
      symbol: 'USDT',
      name: 'TetherToken',
      decimals: 6,
    },
    {
      address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
    },
    {
      address: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
      symbol: 'DAIe',
      name: 'Dai Stablecoin',
      decimals: 18,
    },
    {
      address: '0x63a72806098Bd3D9520cC43356dD78afe5D386D9',
      symbol: 'AAVEe',
      name: 'Aave Token',
      decimals: 18,
    },
    {
      address: '0xEc6adef5E1006bb305bB1975333e8fc4071295bf',
      name: 'Cartesi Token',
      symbol: 'CTSI',
      decimals: 18,
    },
    {
      address: '0xa4FB4F0Ff2431262D236778495145EcBC975c38B',
      symbol: 'INFRA.e',
      name: 'Bware',
      decimals: 18,
    },
  ],
  71402: [
    {
      address: 'native',
      symbol: 'CKB',
      name: 'CKB',
      decimals: 18,
    },
  ],
  7001: [
    {
      address: 'native',
      symbol: 'aZETA',
      name: 'aZETA',
      decimals: 18,
    },
  ],
  534353: [
    {
      address: 'native',
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
  ],
  25: [
    {
      address: 'native',
      symbol: 'CRO',
      name: 'CRO',
      decimals: 18,
    },
  ],
  2046399126: [
    {
      address: 'native',
      symbol: 'sFUEL',
      name: 'sFUEL',
      decimals: 18,
    },
    {
      address: '0xE0595a049d02b7674572b0d59cd4880Db60EDC50',
      symbol: 'SKL',
      name: 'SKALE',
      decimals: 18,
    },
  ],
  1351057110: [
    {
      address: 'native',
      symbol: 'sFUEL',
      name: 'sFUEL',
      decimals: 18,
    },
  ],
  476158412: [
    {
      address: 'native',
      symbol: 'sFUEL',
      name: 'sFUEL',
      decimals: 18,
    },
    {
      address: '0xbA1E9BA7CDd4815Da6a51586bE56e8643d1bEAb6',
      symbol: 'SKL',
      name: 'SKALE',
      decimals: 18,
    },
    {
      address: '0xf06De9214B1Db39fFE9db2AebFA74E52f1e46e39',
      symbol: 'RUBY',
      name: 'RubyToken',
      decimals: 18,
    },
    {
      address: '0xf5E880E1066DDc90471B9BAE6f183D5344fd289F',
      symbol: 'wBTC',
      name: 'Wrapped BTC',
      decimals: 8,
    },
    {
      address: '0xD2Aaa00700000000000000000000000000000000',
      symbol: 'ETH',
      name: 'ERC20 Ether Clone',
      decimals: 18,
    },
    {
      address: '0xa388F9783d8E5B0502548061c3b06bf4300Fc0E1',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
    },
    {
      address: '0x5d42495D417fcd9ECf42F3EA8a55FcEf44eD9B33',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
    },
    {
      address: '0x3595E2f313780cb2f23e197B8e297066fd410d30',
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
    },
    {
      address: '0x3595E2f313780cb2f23e197B8e297066fd410d30',
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
    },
    {
      address: '0xe0E2cb3A5d6f94a5bc2D00FAa3e64460A9D241E1',
      symbol: 'USDP',
      name: 'Pax Dollar',
      decimals: 18,
    },
  ],
  4689: [
    {
      address: 'native',
      symbol: 'IOTX',
      name: 'IOTX',
      decimals: 18,
    },
  ],
  1313161554: [
    {
      address: 'native',
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
    {
      address: '0x8bec47865ade3b172a928df8f990bc7f2a3b9f79',
      symbol: 'AURORA',
      name: 'AURORA',
      decimals: 18,
    },
  ],
  250: [
    {
      address: 'native',
      symbol: 'FTM',
      name: 'FTM',
      decimals: 18,
    },
    {
      address: '0x6a07A792ab2965C72a5B8088d3a069A7aC3a993B',
      symbol: 'AAVE',
      name: 'Aave',
      decimals: 18,
    },
    {
      address: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3e',
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
    },
    {
      address: '0x657A1861c15A3deD9AF0B6799a195a249ebdCbc6',
      symbol: 'CREAM',
      name: 'Cream',
      decimals: 18,
    },
    {
      address: '0xe1146b9AC456fCbB60644c36Fd3F868A9072fc6E',
      symbol: 'FBTC',
      name: 'fBTC',
      decimals: 18,
    },
    {
      address: '0x658b0c7613e890EE50B8C4BC6A3f41ef411208aD',
      symbol: 'FETH',
      name: 'fETH',
      decimals: 18,
    },
    {
      address: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
    },
    {
      address: '0x5A33869045db8A6a16c9f351293501CFD92cf7ed',
      symbol: 'BSGG',
      name: 'Betswap.gg',
      decimals: 18,
    },
  ],
  100: [
    {
      address: 'native',
      symbol: 'xDai',
      name: 'xDai',
      decimals: 18,
    },
    {
      address: '0xdd96B45877d0E8361a4DDb732da741e97f3191Ff',
      symbol: 'BUSD',
      name: 'BUSD Token on xDai',
      decimals: 18,
    },
    {
      address: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
      symbol: 'USDC',
      name: ' USD//C on xDai',
      decimals: 6,
    },
    {
      address: '0x256eb8a51f382650B2A1e946b8811953640ee47D',
      symbol: 'DATA',
      name: 'Streamr',
      decimals: 18,
    },
    {
      address: '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb',
      symbol: 'GNO',
      name: 'Gnosis Token on xDai',
      decimals: 18,
    },
    {
      address: '0xFAdc59D012Ba3c110B08A15B7755A5cb7Cbe77D7',
      symbol: 'GRT',
      name: 'Graph Token on xDai',
      decimals: 18,
    },
    {
      address: '0x9fB1d52596c44603198fB0aee434fac3a679f702',
      symbol: 'jEUR',
      name: 'Jarvis Synthetic Euro',
      decimals: 18,
    },
    {
      address: '0xDF613aF6B44a31299E48131e9347F034347E2F00',
      symbol: 'AAVE',
      name: 'Aave Token on xDai',
      decimals: 18,
    },
  ],
  1284: [
    {
      address: 'native',
      symbol: 'GLMR',
      name: 'GLMR',
      decimals: 18,
    },
    {
      address: '0xc234A67a4F840E61adE794be47de455361b52413',
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
    },
    {
      address: '0x0E358838ce72d5e61E0018a2ffaC4bEC5F4c88d2',
      symbol: 'STELLA',
      name: 'StellaSwap',
      decimals: 18,
    },
    {
      address: '0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
    },
    {
      address: '0xeFAeeE334F0Fd1712f9a8cc375f427D9Cdd40d73',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
    },
    {
      address: '0x65b09ef8c5A096C5Fd3A80f1F7369E56eB932412',
      symbol: 'BEANS',
      name: 'MoonBeans',
      decimals: 18,
    },
  ],
  42262: [
    {
      address: 'native',
      symbol: 'ROSE',
      name: 'Oasis Network',
      decimals: 18,
    },
  ],
  23294: [
    {
      address: 'native',
      symbol: 'ROSE',
      name: 'Oasis Sapphire Network',
      decimals: 18,
    },
  ],
  122: [
    {
      address: 'native',
      symbol: 'FUSE',
      name: 'FUSE',
      decimals: 18,
    },
    {
      address: '0x6a5f6a8121592becd6747a38d67451b310f7f156',
      symbol: 'BUSD',
      name: 'Binance USD on Fuse',
      decimals: 18,
    },
    {
      address: '0x249be57637d8b013ad64785404b24aebae9b098b',
      symbol: 'fUSD',
      name: 'Fuse Dollar',
      decimals: 18,
    },
    {
      address: '0x38bc6110cd10bf396e67d54adb9aa8de8426c8bf',
      symbol: 'GDD',
      name: 'GoodDollar',
      decimals: 18,
    },
  ],
  324: [
    {
      address: 'native',
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
  ],
  1666600000: [
    {
      address: 'native',
      symbol: 'ONE',
      name: 'ONE',
      decimals: 18,
    },
  ],
  1285: [
    {
      address: 'native',
      symbol: 'MOVR',
      name: 'MOVR',
      decimals: 18,
    },
  ],
  128: [
    {
      address: 'native',
      symbol: 'HT',
      name: 'HT',
      decimals: 18,
    },
  ],
  66: [
    {
      address: 'native',
      symbol: 'OKT',
      name: 'OKT',
      decimals: 18,
    },
  ],
  40: [
    {
      address: 'native',
      symbol: 'TLOS',
      name: 'TLOS',
      decimals: 18,
    },
  ],
  1088: [
    {
      address: 'native',
      symbol: 'METIS',
      name: 'METIS',
      decimals: 18,
    },
  ],
  TRON_GRID_MAINNET: [
    {
      address: 'native',
      symbol: 'TRX',
      name: 'TRX',
      decimals: 6,
    },
  ],
  APTOS_MAINNET: [
    {
      address: 'native',
      symbol: 'APT',
      name: 'APT',
      decimals: 18,
    },
    {
      address: '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT',
      symbol: 'USDT',
      name: 'USDT',
      decimals: 18,
    },
  ],
};

export const CHAIN_IDS_TO_NAMES = {
  1: 'ethereum',
  137: 'polygon',
  42220: 'celo',
  42161: 'arbitrum',
  10: 'optimism',
  56: 'binance',
  97: 'testnet_binance',
  43114: 'avalanche',
  71402: 'godwoken',
  250: 'fantom',
  100: 'gnosis',
  1284: 'moonbeam',
  42262: 'oasis_emerald',
  23294: 'oasis_sapphire',
  1313161554: 'aurora',
  122: 'fuse',
  324: 'zkSync',
  1666600000: 'harmony',
  1285: 'moonriver',
  128: 'heco',
  66: 'okx_chain',
  40: 'telos',
  7001: 'testnet_zetachain_athens',
  534353: 'tesnet_scroll_alpha',
  25: 'cronos',
  338: 'tesnet_cronos',
  2046399126: 'skale_europa',
  476158412: 'skale_europa_testnet',
  1351057110: 'skale_chaos',
  4689: 'iotex',
  1088: 'metis',
  TRON_GRID_MAINNET: 'tron_grid',
  SEI_MAINNET: 'sei_mainnet',
  APTOS_MAINNET: 'aptos_mainnet',
};

export const CHAIN_INFO = {
  1: {
    explorer: 'https://etherscan.io/',
    label: 'Ethereum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  10: {
    explorer: 'https://optimistic.etherscan.io/',
    label: 'Optimism',
    nativeCurrency: { name: 'OP', symbol: 'OP', decimals: 18 },
  },
  42161: {
    explorer: 'https://arbiscan.io/',
    label: 'Arbitrum',
    nativeCurrency: { name: 'ARB', symbol: 'ARB', decimals: 18 },
  },
  137: {
    explorer: 'https://polygonscan.com/',
    label: 'Polygon',
    nativeCurrency: { name: 'Polygon Matic', symbol: 'MATIC', decimals: 18 },
  },
  42220: {
    explorer: 'https://celoscan.io/',
    label: 'Celo',
    nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18 },
  },
  56: {
    explorer: 'https://bscscan.com/',
    label: 'Binance',
    nativeCurrency: { name: 'Bnb', symbol: 'BNB', decimals: 18 },
  },
  97: {
    explorer: 'https://testnet.bscscan.com/',
    label: 'Binance',
    nativeCurrency: { name: 'Bnb', symbol: 'BNB', decimals: 18 },
  },
  43114: {
    explorer: 'https://snowtrace.io/',
    label: 'Avalanche',
    nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
  },
  71402: {
    explorer: 'https://gw-mainnet-explorer.nervosdao.community/',
    label: 'Godwoken',
    nativeCurrency: { name: 'CBK', symbol: 'CKB', decimals: 18 },
  },
  250: {
    explorer: 'https://ftmscan.com/',
    label: 'Fantom',
    nativeCurrency: { name: 'FTM', symbol: 'FTM', decimals: 18 },
  },
  122: {
    explorer: 'https://explorer.fuse.io/',
    label: 'Fuse',
    nativeCurrency: { name: 'Fuse', symbol: 'Fuse', decimals: 18 },
  },
  100: {
    explorer: 'https://gnosisscan.io/',
    label: 'Gnosis',
    nativeCurrency: { name: 'xDai', symbol: 'xDai', decimals: 18 },
  },
  42262: {
    explorer: 'https://explorer.emerald.oasis.dev/',
    label: 'Oasis emerals',
    nativeCurrency: { name: 'ROSE', symbol: 'ROSE', decimals: 18 },
  },
  23294: {
    explorer: 'https://explorer.sapphire.oasis.io',
    label: 'Oasis sapphire',
    nativeCurrency: { name: 'ROSE', symbol: 'ROSE', decimals: 18 },
  },
  1284: {
    explorer: 'https://moonscan.io/',
    label: 'Moonbeam',
    nativeCurrency: { name: 'GLMR', symbol: 'GLMR', decimals: 18 },
  },
  1313161554: {
    explorer: 'https://aurorascan.dev',
    label: 'Aurora',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  },
  324: {
    explorer: 'https://explorer.zksync.io/',
    label: 'ZkSync',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  },
  1666600000: {
    explorer: 'https://explorer.harmony.one',
    label: 'Harmony',
    nativeCurrency: { name: 'ONE', symbol: 'ONE', decimals: 18 },
  },
  1285: {
    explorer: 'https://moonriver.moonscan.io',
    label: 'Moonriver',
    nativeCurrency: { name: 'MOVR', symbol: 'MOVR', decimals: 18 },
  },
  128: {
    explorer: 'https://hecoinfo.com',
    label: 'HECO',
    nativeCurrency: { name: 'HT', symbol: 'HT', decimals: 18 },
  },
  66: {
    explorer: 'https://www.oklink.com/en/okc',
    label: 'OKXChain Mainnet',
    nativeCurrency: { name: 'OKT', symbol: 'OKT', decimals: 18 },
  },
  40: {
    explorer: 'https://www.oklink.com/en/okc',
    label: 'TELOS',
    nativeCurrency: { name: 'TLOS', symbol: 'TLOS', decimals: 18 },
  },
  7001: {
    explorer: 'https://explorer.athens.zetachain.com',
    label: 'ZETACHAIN ATHENS TESTNET',
    nativeCurrency: { name: 'aZETA', symbol: 'aZETA', decimals: 18 },
  },
  534353: {
    explorer: 'https://blockscout.scroll.io',
    label: 'SCROLL ALPHA TESTNET',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  },
  25: {
    explorer: 'https://cronoscan.com',
    label: 'Cronos',
    nativeCurrency: { name: 'CRO', symbol: 'CRO', decimals: 18 },
  },
  476158412: {
    explorer: 'https://staging-legal-crazy-castor.explorer.staging-v3.skalenodes.com',
    label: 'SKALE EUROPA HUB TESTNET',
    nativeCurrency: { name: 'sFuel', symbol: 'sFuel', decimals: 18 },
  },
  2046399126: {
    explorer: 'https://elated-tan-skat.explorer.mainnet.skalenodes.com',
    label: 'https://skale.space/',
    nativeCurrency: { name: 'sFuel', symbol: 'sFuel', decimals: 18 },
  },
  1351057110: {
    explorer: 'https://staging-fast-active-bellatrix.explorer.staging-v3.skalenodes.com',
    label: 'https://skale.space/',
    nativeCurrency: { name: 'sFuel', symbol: 'sFuel', decimals: 18 },
  },
  4689: {
    explorer: 'https://staging-fast-active-bellatrix.explorer.staging-v3.skalenodes.com',
    label: 'IOTEX',
    nativeCurrency: { name: 'IOTX', symbol: 'IOTX', decimals: 18 },
  },
  1088: {
    explorer: 'https://explorer.metis.io/',
    label: 'Metis Andromeda Mainnet',
    nativeCurrency: { name: 'METIS', symbol: 'METIS', decimals: 18 },
  },
  TRON_GRID_MAINNET: {
    explorer: 'https://tronscan.io/',
    label: 'Tron Grid Mainnet',
    nativeCurrency: { name: 'TRX', symbol: 'TRX', decimals: 6 },
  },
  SEI_MAINNET: {
    explorer: 'https://www.seiscan.app/pacific-1/',
    label: 'Sei Mainnet',
    nativeCurrency: { name: 'SEI', symbol: 'SEI', decimals: 6 },
  },
  APTOS_MAINNET: {
    explorer: 'https://explorer.aptoslabs.com/',
    label: 'Aptos Mainnet',
    nativeCurrency: { name: 'APT', symbol: 'APT', decimals: 18 },
  },
};

export const SupportedChainId = Object.keys(CHAIN_INFO);

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

export const APTOS_NATIVE_TOKEN = '0x1::aptos_coin::AptosCoin';
