import { defineStore } from 'pinia';
import AxiosService from '~/service/axiosService';

export const useBlockchainsStore = defineStore('blockchains', {
  state: () => ({
    blockchains: [],
    blockchainsLoading: false,
    blockchainsLoaded: false,
  }),
  actions: {
    async getBlockchainsAction() {
      try {
        this.blockchainsLoading = true;
        const { data } = await AxiosService.get(`${useRuntimeConfig().public.apiBase}blockchains`);

        this.blockchains = data;
        this.blockchainsLoading = false;
        this.blockchainsLoaded = true;
      } catch (error) {
        this.blockchainsLoading = false;
        this.blockchainsLoaded = true;
        console.log('getRequestsAction error', error);
      }
    },
    // async editBlockchainsAction(editData, id) {
    //   try {
    //     const { data } = await AxiosService.put(
    //       `${useRuntimeConfig().public.apiBase}v2/tasks/${id}/blockchain`,
    //       editData,
    //     );
    //     console.log('editBlockchainsAction', data);
    //   } catch (error) {
    //     this.blockchainsLoading = false;
    //     this.blockchainsLoaded = true;
    //     console.log('getRequestsAction error', error);
    //   }
    // },
  },
  getters: {
    getBlockchains: (state) => state.blockchains,
    getBlockchainsLoading: (state) => state.blockchainsLoading,
    getBlockchainsLoaded: (state) => state.blockchainsLoaded,
  },
});
