import { WalletAbstract } from '@/wallets/wallet-abstract';
import { ethers } from 'ethers';
import { ConnectionType, TYPE_OF_CHAIN } from '~/web3/connection';
import { useWalletStore } from '~/store/wallet';
import { getAprosPetraProvider } from '~/util/web3';
import { WalletFactory } from './wallet-factory';

export class WalletAptosPetra extends WalletAbstract {
  constructor() {
    super();
    this.type = ConnectionType.APTOS_PETRA;
  }

  checkConnection = async () => {
    await this.connectWallet();
    return this;
  };

  connect = async () => {
    await this.connectWallet();
    return this;
  };

  connectWallet = async () => {
    if (typeof window !== 'undefined' && window.aptos) {
      try {
        const walletStore = useWalletStore();

        const petraWallet = getAprosPetraProvider();

        const account = await petraWallet.connect();

        let aptosNetwork = '';

        const testNetwork = await window.aptos.network();

        switch (testNetwork) {
          case 'Mainnet':
            aptosNetwork = 'APTOS_MAINNET';
            break;
          case 'Devnet':
            aptosNetwork = 'APTOS_DEVNET';
            break;
          case 'Testnet':
            aptosNetwork = 'APTOS_TESTNET';
            break;

          default:
            aptosNetwork = '';
            break;
        }

        window.aptos.onNetworkChange((newNetwork) => {
          let aptosNetwork = '';

          switch (newNetwork) {
            case 'Mainnet':
              aptosNetwork = 'APTOS_MAINNET';
              break;
            case 'Devnet':
              aptosNetwork = 'APTOS_DEVNET';
              break;
            case 'Testnet':
              aptosNetwork = 'APTOS_TESTNET';
              break;

            default:
              aptosNetwork = '';
              break;
          }

          walletStore.updateWalletState({
            chainId: aptosNetwork,
            walletType: ConnectionType.APTOS_PETRA,
            typeOfChain: TYPE_OF_CHAIN.APTOS,
          });
        });
        window.aptos.onAccountChange((newAccount) => {
          if (newAccount) {
            walletStore.updateWalletState({
              walletAddress: newAccount.address,
              walletType: ConnectionType.APTOS_PETRA,
              typeOfChain: TYPE_OF_CHAIN.APTOS,
            });
          }
        });

        if (!account || (account && !account.address)) {
          return;
        }
        this.address = account.address;
        this.connector = window.aptos;

        walletStore.updateWalletState({
          walletAddress: this.address,
          walletType: this.type,
          typeOfChain: TYPE_OF_CHAIN.APTOS,
          chainId: aptosNetwork,
          connector: this.connector,
          provider: this.provider,
        });
      } catch (err) {
        this.error = err.message;
        console.log('APTOS err', err);

        this.resetWallet();
      }
    } else {
      this.error = 'Please install Petra';
      window.open(
        'https://chrome.google.com/webstore/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci',
        '_blank',
      );
    }
  };

  getChainId = async () => {
    const provider = this.getProvider();
    const response = await provider.network();
    console.log('response getNetwork APTOS', response);

    return 'APTOS_MAINNET';
  };

  getProvider = () => {
    return getAprosPetraProvider();
  };

  getBalance = async () => {
    return 0;
  };

  switchNetwork = async (chainId) => {
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

    const hexChainId = ethers.utils.hexValue(+chainId);

    const newMetamaskWallet = WalletFactory.getWallet(ConnectionType.METAMASK);

    await newMetamaskWallet.connect();
    if (typeof window !== 'undefined' && getMetamaskProvider()) {
      this.resetWallet();
      WalletFactory.getWallet(ConnectionType.METAMASK);
      try {
        await getMetamaskProvider().request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: hexChainId }],
        });
        const newMetamaskWallet = WalletFactory.getWallet(ConnectionType.METAMASK);

        await newMetamaskWallet.connect();
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
