import { WalletAbstract } from './wallet-abstract';
import { ethers } from 'ethers';
import { WalletFactory } from './wallet-factory';
import { getChainInfo, RPC_URLS } from '~/web3/web3';
import { getMetamaskProvider } from '~/util/web3';
import { CHAIN_IDS_TO_NAMES, SupportedChainId } from '~/web3/constants';
import { ConnectionType, TYPE_OF_CHAIN } from '~/web3/connection';
import { useWalletStore } from '~/store/wallet';

export class WalletMetamask extends WalletAbstract {
  constructor() {
    super();
    this.type = ConnectionType.METAMASK;
  }

  checkConnection = async () => {
    await this.connectWallet('eth_accounts');
    return this;
  };

  connect = async () => {
    await this.connectWallet('eth_requestAccounts');
    return this;
  };

  connectWallet = async (method) => {
    if (typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask) {
      try {
        const addressArray = await getMetamaskProvider().request({ method });
        const provider = new ethers.providers.Web3Provider(getMetamaskProvider());
        const walletStore = useWalletStore();

        if (!addressArray.length) {
          return;
        }
        this.address = addressArray[0];

        const chainIdHex = await getMetamaskProvider().request({ method: 'eth_chainId' });
        const chainIdNumber = parseInt(chainIdHex, 16);

        getMetamaskProvider().on('accountsChanged', async (address) => {
          walletStore.updateWalletState({
            walletAddress: address[0],
            walletType: ConnectionType.METAMASK,
            typeOfChain: TYPE_OF_CHAIN.EVM,
          });
        });

        getMetamaskProvider().on('chainChanged', async (chainId) => {
          walletStore.updateWalletState({
            chainId: parseInt(chainId, 16),
            walletType: ConnectionType.METAMASK,
            typeOfChain: TYPE_OF_CHAIN.EVM,
          });
        });

        walletStore.updateWalletState({
          walletAddress: this.address,
          walletType: this.type,
          typeOfChain: TYPE_OF_CHAIN.EVM,
          provider,
          chainId: chainIdNumber,
        });
      } catch (err) {
        this.error = err.message;
        this.resetWallet();
      }
    } else {
      this.error = 'Please install Metamask';
      window.open(
        'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
        '_blank',
      );
    }
  };

  getChainId = async () => {
    const chainIdHex = await getMetamaskProvider().request({ method: 'eth_chainId' });
    const chainIdNumber = parseInt(chainIdHex, 16);
    return chainIdNumber;
  };

  getProvider = () => {
    return new ethers.providers.Web3Provider(getMetamaskProvider());
  };

  getBalance = async () => {
    if (typeof window !== 'undefined' && getMetamaskProvider()) {
      try {
        const provider = this.getProvider();
        const address = this.address;
        const balance = await provider.getBalance(address);

        return balance.toString();
      } catch (err) {
        console.error('Failed to retrieve balance:', err);
      }
    } else {
      console.warn('Metamask is not available');
    }
  };

  switchNetwork = async (chainId) => {
    const nuxtApp = useNuxtApp();
    if (chainId === 'TRON_GRID_MAINNET') {
      if (window.tronWeb && window.tronLink.ready) {
        this.resetWallet();
        const currentWallet = WalletFactory.getWallet(ConnectionType.TRONLINK);
        await currentWallet.connect();
        return;
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
    const hexChainId = ethers.utils.hexValue(+chainId);

    const newMetamaskWallet = WalletFactory.getWallet(ConnectionType.METAMASK);

    await newMetamaskWallet.connect();

    const walletStore = useWalletStore();

    if (typeof window !== 'undefined' && getMetamaskProvider()) {
      try {
        await getMetamaskProvider().request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: hexChainId }],
        });
        // const newMetamaskWallet = WalletFactory.getWallet(ConnectionType.METAMASK);

        // await newMetamaskWallet.connect();
        const provider = this.getProvider();

        walletStore.updateWalletState({
          walletType: this.type,
          typeOfChain: TYPE_OF_CHAIN.EVM,
          chainId: chainId,
          provider,
        });
      } catch (switchError) {
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
            const newMetamaskWallet = WalletFactory.getWallet(ConnectionType.METAMASK);

            await newMetamaskWallet.connect();
          } catch (addError) {
            console.log('addError', addError);
          }
        }
      }
    }
  };
}
