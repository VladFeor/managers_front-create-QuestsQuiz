import { defineStore } from 'pinia';
import * as web3 from '~/web3/web3';
import { SUPPORTED_CHAIN_ID } from '~/web3/constants';
import { getMetamaskProvider } from '@/util/web3';

export const useWeb3Store = defineStore('web3store', {
  state: () => ({
    address: '',
    balance: 0,
    networkId: 1,
    isMetamaskExist: false,
  }),
  actions: {
    clearAccount() {
      this.address = '';
      this.balance = 0;
    },
  },
  getters: {
    getAccountInfo: (state) => state,
    getAddress: (state) => state.address,
    getBalance: (state) => state.balance,
    getNetworkId: (state) => state.networkId,
  },
});
