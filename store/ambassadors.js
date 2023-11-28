import { defineStore } from 'pinia';
import AxiosService from '~/service/axiosService';

export const useAmbassadorsStore = defineStore('ambassadors', {
  state: () => ({
    ambassadors: [],
  }),
  actions: {
    async getAmbassadorsAction({ levels = null, activity_id = null }) {
      try {
        const params = {};
        if (levels) {
          params.levels = levels;
        }
        if (activity_id) {
          params.activity_id = activity_id;
        }
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + 'v2/ambassadors/autocomplete',
          // useRuntimeConfig().public.apiBase + 'ambassadors/autocomplete',
          params,
        );
        console.log('getAmbassadorsAction', data);
        this.ambassadors = data;
      } catch (error) {
        console.log('getAmbassadorsAction error', error);
      }
    },
  },
  getters: {
    getAmbassadors: (state) => state.ambassadors,
  },
});
