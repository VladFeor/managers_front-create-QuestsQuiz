import { WalletAbstract } from './wallet-abstract';
import { EthereumProvider } from '@walletconnect/ethereum-provider';
import { WalletFactory } from './wallet-factory';
import { ethers } from 'ethers';
import { getChainInfo, RPC_URLS } from '~/web3/web3';
import { CHAIN_IDS_TO_NAMES, SupportedChainId } from '~/web3/constants';
import { ConnectionType, TYPE_OF_CHAIN } from '~/web3/connection';
import { useWalletStore } from '~/store/wallet';

const connectHandler = (event) => {
  console.log('connectHandler', event);
};

const sessionEventHandler = (event) => {
  console.log('sessionEventHandler', event);
};

const chainChangedListener = (event) => {
  const walletStore = useWalletStore();
  console.log('chainChangedListener', event);
  let networkId;
  if (typeof event === 'string' && event.includes('x')) {
    networkId = parseInt(event, 16);
  } else {
    networkId = event;
  }
  console.log('networkId', networkId);

  walletStore.updateWalletState({
    chainId: networkId,
    walletType: ConnectionType.WALLET_CONNECT,
    typeOfChain: TYPE_OF_CHAIN.EVM,
  });
};

const accountsChangedListener = (event) => {
  const walletStore = useWalletStore();
  console.log('accountsChangedListener event, ', event);
  walletStore.updateWalletState({
    walletAddress: event[0],
    walletType: ConnectionType.WALLET_CONNECT,
    typeOfChain: TYPE_OF_CHAIN.EVM,
  });
};

const WALLET_METHODS = [
  'personal_sign',
  'eth_sendTransaction',
  'eth_accounts',
  'eth_requestAccounts',
  'eth_call',
  'eth_getBalance',
  'eth_sendRawTransaction',
  'eth_sign',
  'eth_signTransaction',
  'eth_signTypedData',
  'eth_signTypedData_v3',
  'eth_signTypedData_v4',
  'wallet_switchEthereumChain',
  'wallet_addEthereumChain',
  'wallet_getPermissions',
  'wallet_requestPermissions',
  'wallet_registerOnboarding',
  'wallet_watchAsset',
  'wallet_scanQRCode',
];

const allChainIds = [
  1, 42161, 10, 137, 42220, 56, 97, 43114, 71402, 250, 100, 1284, 42262, 23294, 1313161554, 122,
  324, 1666600000, 1285, 128, 66, 40, 7001, 534353, 25, 338, 2046399126, 476158412, 4689, 4690,
];

const RPC_URLS_WITHOUT_FALLBACKS = Object.entries(RPC_URLS).reduce(
  (map, [chainId, urls]) => ({
    ...map,
    [chainId]: urls[0],
  }),
  {},
);

export class WalletConnectorV2 extends WalletAbstract {
  constructor() {
    super();
    this.type = ConnectionType.WALLET_CONNECT;

    this.initializeWalletConnect();
  }

  async initializeWalletConnect() {
    const chainIds = [1];

    this.connector = await EthereumProvider.init({
      projectId: '276d8971dd5b4b5490f107c75a0e280d',
      chains: [chainIds],
      showQrModal: true,
      optionalChains: allChainIds,
      rpcMap: RPC_URLS_WITHOUT_FALLBACKS,
      methods: WALLET_METHODS,
      optionalMethods: WALLET_METHODS,
    });
  }

  checkConnection = async () => {
    const walletConnectStorage = localStorage.getItem('wc@2:client:0.3//session');
    if (!walletConnectStorage || (walletConnectStorage && walletConnectStorage === 'null'))
      return this;
    await this.connect();
    return this;
  };

  connect = async () => {
    try {
      const walletStore = useWalletStore();

      await this.initializeWalletConnect();

      const accounts = await this.connector.enable();

      const provider = new ethers.providers.Web3Provider(this.connector);
      // const provider = this.getProvider();

      console.log('accounts[0]', accounts[0]);

      const result = await this.connector.request({ method: 'eth_chainId' });
      console.log('this.connector result', result);

      this.connector.on('chainChanged', chainChangedListener);
      this.connector.on('accountsChanged', accountsChangedListener);
      this.connector.on('connect', connectHandler);
      this.connector.on('session_event', sessionEventHandler);

      if (provider) {
        if (accounts && accounts.length === 1) {
          this.address = accounts[0];

          walletStore.updateWalletState({
            walletAddress: this.address,
            walletType: this.type,
            typeOfChain: TYPE_OF_CHAIN.EVM,
            provider,
            connector: this.connector,
            chainId: this.connector.chainId,
            wallet: this,
          });
        } else {
          walletStore.updateWalletState({
            walletType: this.type,
            typeOfChain: TYPE_OF_CHAIN.EVM,
            provider,
            connector: this.connector,
            chainId: this.connector.chainId,
            wallet: this,
          });
        }
      }
    } catch (error) {
      console.log('WALLET CONNECT V2 CONNECT ERROR', error);
    }

    return this;
  };

  getProvider = () => {
    console.log('this.connector', this.connector);
    return new ethers.providers.Web3Provider(this.connector);
  };

  getChainId = async () => {
    try {
      console.log('this.connector getChainId', this.connector);
      console.log('this.connector.chainId', this.connector.chainId);

      return this.connector.chainId;
    } catch (error) {
      console.log('getChainId error', error);
      return 1;
    }
  };

  getBalance = async () => {
    try {
      const provider = this.getProvider();
      if (provider) {
        const address = this.address;
        const balance = await provider.getBalance(address);

        return balance.toString();
      } else {
        return 0;
      }
    } catch (err) {
      console.error('Failed to retrieve balance:', err);
    }
  };

  switchNetwork = async (chainId) => {
    const nuxtApp = useNuxtApp();
    if (chainId === 'SEI_MAINNET') {
      if (window.compass) {
        this.resetWallet();
        WalletFactory.getWallet(ConnectionType.COMPASS);
      } else {
        window.open(
          'https://chrome.google.com/webstore/detail/compass-wallet-for-sei/anokgmphncpekkhclmingpimjmcooifb',
          '_blank',
        );
      }
      return;
    }
    if (chainId === 'TRON_GRID_MAINNET') {
      if (window.tronWeb && window.tronLink.ready) {
        this.resetWallet();
        WalletFactory.getWallet(ConnectionType.TRONLINK);
      } else if (window.tronWeb && !window.tronLink.ready) {
        nuxtApp.$alert.show(`Connect Tronlink wallet`, {
          type: 'error',
          timeout: 5000,
        });
      } else {
        window.open(
          'https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec',
          '_blank',
        );
      }
      return;
    }
    if (chainId === 'APTOS_MAINNET') {
      if (window.aptos) {
        this.resetWallet();
        WalletFactory.getWallet(ConnectionType.APTOS_PETRA);
      } else {
        window.open(
          'https://chrome.google.com/webstore/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci',
          '_blank',
        );
      }
      return;
    }
    const walletStore = useWalletStore();

    const hexChainId = ethers.utils.hexValue(chainId);
    console.log('walletconnectswitchNetwork chainId', chainId);

    this.connector = await EthereumProvider.init({
      projectId: '276d8971dd5b4b5490f107c75a0e280d',
      chains: [chainId],
      showQrModal: true,
      optionalChains: allChainIds,
      rpcMap: RPC_URLS_WITHOUT_FALLBACKS,
      methods: WALLET_METHODS,
    });

    // this.connector = await EthereumProvider.init({
    //   projectId: '276d8971dd5b4b5490f107c75a0e280d',
    //   chains: [chainId],
    //   showQrModal: true,
    //   optionalChains: allChainIds,
    //   rpcMap: RPC_URLS_WITHOUT_FALLBACKS,
    //   methods: WALLET_METHODS,
    // });

    // const provider = new ethers.providers.Web3Provider(this.connector);
    // // const currentProvider = await EthereumProvider.init({
    // //   projectId: '276d8971dd5b4b5490f107c75a0e280d',
    // //   chains: [1],
    // //   showQrModal: true,
    // //   optionalChains: allChainIds,
    // //   rpcMap: RPC_URLS_WITHOUT_FALLBACKS,
    // //   methods: WALLET_METHODS,
    // // });

    // try {
    //   await this.connector.enable();
    //   console.log('walletconnectswitchNetwork currentProvider AFTER ENABLE', this.connector);
    // } catch (error) {
    //   console.log('walletconnectswitchNetwork currentProvider AFTER  ERROR', error);
    // }

    // // this.connector = newConnection;

    // walletStore.updateWalletState({
    //   walletType: this.type,
    //   typeOfChain: true,
    //   provider,
    //   connector: this.connector,
    //   chainId: this.connector.chainId,
    //   wallet: this,
    // });

    // return;

    try {
      await this.connector.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      });

      const provider = new ethers.providers.Web3Provider(this.connector);

      try {
        // await this.connector.connect();
        await this.connector.enable();
        console.log('walletconnectswitchNetwork currentProvider AFTER ENABLE', this.connector);
      } catch (error) {
        console.log('walletconnectswitchNetwork currentProvider AFTER  ERROR', error);
      }

      walletStore.updateWalletState({
        walletType: this.type,
        typeOfChain: TYPE_OF_CHAIN.EVM,
        provider,
        connector: this.connector,
        chainId: this.connector.chainId,
        wallet: this,
      });
    } catch (switchError) {
      console.log('switchError', switchError);

      if (switchError.code === 4902 || switchError.code === -32603 || switchError.code === 5000) {
        try {
          await this.connector.request({
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
  };
}
