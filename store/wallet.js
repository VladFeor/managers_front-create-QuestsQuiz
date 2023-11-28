import { defineStore } from 'pinia';

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    walletAddress: '',
    walletType: '',
    provider: null,
    connector: null,
    chainId: null,
    wallet: null,
    balance: 0,
    typeOfChain: null,
  }),
  actions: {
    updateWalletState({
      walletAddress,
      walletType,
      provider,
      connector,
      chainId,
      wallet,
      balance,
      typeOfChain,
    }) {
      if ((walletAddress && this.walletAddress !== walletAddress) || walletAddress === '') {
        console.log('updateWalletState walletAddress', walletAddress);
        this.walletAddress = walletAddress;
      }
      if (walletType) {
        this.walletType = walletType;
      }
      if (balance !== undefined) {
        this.balance = balance;
      }
      if (provider) {
        this.provider = provider;
      }
      if (connector) {
        this.connector = connector;
      }
      if (chainId) {
        this.chainId = chainId;
      }
      if (wallet) {
        this.wallet = wallet;
      }
      if (typeOfChain) {
        this.typeOfChain = typeOfChain;
      }
    },
  },
  getters: {
    getWalletInfo: (state) => state,
    getWalletType: (state) => state.walletType,
    getConnector: (state) => state.connector,
    getAddress: (state) => state.walletAddress,
    getChainId: (state) => state.chainId,
    getProvider: (state) => state.provider,
    getTypeOfChain: (state) => state.typeOfChain,
  },
});
