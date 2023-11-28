import { WalletAbstract } from './wallet-abstract';
import { COMPASS_WALLET } from '@sei-js/core';
import { useWalletStore } from '~/store/wallet';
import { ConnectionType, TYPE_OF_CHAIN } from '~/web3/connection';
import { getSigningCosmWasmClient } from '@sei-js/core';
import { getQueryClient } from '@sei-js/core';
import { getMetamaskProvider } from '~/util/web3';
import { WalletFactory } from './wallet-factory';

const RPC_URL = 'https://sei-rpc.polkachu.com/';
// const RPC_URL = 'https://rpc.wallet.pacific-1.sei.io';

// Create a CosmWasmClient

export class WalletCompass extends WalletAbstract {
  constructor() {
    super();
    this.type = ConnectionType.COMPASS; // You can set a custom type for Compass Wallet
  }

  checkConnection = async () => {
    await this.connect();
    return this;
  };

  connect = async () => {
    await this.connectWallet();
    return this;
  };

  connectWallet = async () => {
    try {
      if (!window.compass) {
        window.open(
          'https://chrome.google.com/webstore/detail/compass-wallet-for-sei/anokgmphncpekkhclmingpimjmcooifb',
          '_blank',
        );
        return;
      }
      const walletStore = useWalletStore();

      await COMPASS_WALLET.connect('pacific-1');

      const accounts = await COMPASS_WALLET.getAccounts('pacific-1');
      this.address = accounts[0].address;

      const offlineSigner = await COMPASS_WALLET.getOfflineSigner('pacific-1');

      let balance = 0;

      const signingCosmWasmClient = await getSigningCosmWasmClient(RPC_URL, offlineSigner);

      const balances = await signingCosmWasmClient.queryClient.bank.allBalances(this.address);

      this.connector = signingCosmWasmClient;

      if (balances.length && balances.some((item) => item.denom === 'usei')) {
        balance = balances.find((item) => item.denom === 'usei').amount;
      }

      console.log('connect SEI balance', balance);

      walletStore.updateWalletState({
        walletAddress: this.address,
        walletType: this.type,
        typeOfChain: TYPE_OF_CHAIN.SEI,
        provider: window.compass,
        connector: this.connector,
        chainId: 'SEI_MAINNET',
        balance,
      });

      return this;
    } catch (error) {
      console.log('connect COMPASS_WALLET error', error);
      this.error = error.message;
      // this.resetWallet();
    }
  };

  getBalance = async () => {
    console.log('this.connector', this.connector);
    let balance = '0';
    const balances = await this.connector.queryClient.bank.allBalances(this.address);

    if (balances.length && balances.some((item) => item.denom === 'usei')) {
      balance = balances.find((item) => item.denom === 'usei').amount;
    }

    console.log('SEI balance', balance);

    return balance;
  };

  getChainId = async () => {
    return 'SEI_MAINNET';
  };

  async getAccounts() {
    try {
      const accounts = await COMPASS_WALLET.getAccounts('pacific-1');
      return accounts;
    } catch (error) {
      console.error('Failed to retrieve accounts:', error);
    }
  }

  async disconnect() {
    try {
      await COMPASS_WALLET.disconnect('pacific-1');
    } catch (error) {
      console.error('Failed to disconnect from Compass Wallet:', error);
    }
  }

  switchNetwork = async (chainId) => {
    const nuxtApp = useNuxtApp();

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
    if (chainId !== 'SEI_MAINNET') {
      if (getMetamaskProvider()) {
        this.resetWallet();
        const wallet = WalletFactory.getWallet(ConnectionType.METAMASK);
        if (wallet && typeof chainId === 'number') {
          wallet.switchNetwork(chainId);
        }
      } else {
        window.open('https://metamask.io/', '_blank');
      }
      return;
    }
    nuxtApp.$alert.show(`Network switching is not supported for Tron`, {
      type: 'error',
      timeout: 5000,
    });
    throw new Error('Network switching is not supported for Tron');
  };
}
