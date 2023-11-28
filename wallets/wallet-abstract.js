import { useWalletStore } from '~/store/wallet';

export class WalletAbstract {
  type;
  address;
  error;
  connector;
  provider;

  constructor() {
    this.type = '';
    this.address = '';
    this.error = '';
    this.connector = '';
    this.provider = '';
  }

  checkConnection = async () => {
    return this;
  };

  connect = async () => {
    return this;
  };

  resetWallet = () => {
    const walletStore = useWalletStore();

    walletStore.updateWalletState({
      walletAddress: '',
      walletType: '',
      provider: null,
      connector: null,
      chainId: null,
      wallet: null,
      typeOfChain: null,
    });

    this.type = '';
    this.address = '';
    localStorage.setItem('walletType', 'null');
    localStorage.setItem('walletconnect', 'null');
    localStorage.removeItem('wc@2:client:0.3//session');
    localStorage.removeItem('wc@2:universal_provider:/optionalNamespaces');
    localStorage.removeItem('wc@2:core:0.3//pairing');
    localStorage.removeItem('wc@2:core:0.3//expirer');
    localStorage.removeItem('wc@2:core:0.3//history');
    localStorage.removeItem('wc@2:universal_provider:/sessionProperties');
    localStorage.removeItem('wc@2:core:0.3//subscription');
    localStorage.removeItem('wc@2:universal_provider:/namespaces');
    localStorage.removeItem('wc@2:client:0.3//proposal');
    localStorage.removeItem('wc@2:ethereum_provider:/chainId');
    localStorage.removeItem('wc@2:core:0.3//messages');
    localStorage.removeItem('wc@2:core:0.3//keychain');

    return this;
  };

  getNetwork = (chainId) => {
    // Add implementation
  };

  getChainId = async () => {
    // Add implementation
  };

  getBalance = async () => {
    // Add implementation
  };

  getProvider = () => {
    // Add implementation
  };

  switchNetwork = async (chainId) => {
    // Add implementation
  };
}
