import { defineStore } from 'pinia';
import AxiosService from '~/service/axiosService';

export const useCoinsStore = defineStore('coins', {
  state: () => ({
    coins: [],
  }),
  actions: {
    async getCoinsAction(blockchain_id = null) {
      console.log('getCoinsAction blockchain_id', blockchain_id);
      const params = {};
      if (blockchain_id) {
        params.blockchain_id = blockchain_id;
      }
      try {
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + 'coin-types',
          params,
        );
        console.log('getCoinsAction', data);
        this.coins = data;
      } catch (error) {
        console.log('getCoinsAction error', error);
      }
    },
  },
  getters: {
    getCoins: (state) => state.coins,
  },
});
