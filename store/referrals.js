import { defineStore } from 'pinia';
import AxiosService from '~/service/axiosService';
export const useReferralsStore = defineStore('referrals', {
  state: () => ({
    referrals: [],
    loaded: false,
  }),
  actions: {
    async getReferralsAction(params, page) {
      this.loaded = false;
      let url = params
        ? useRuntimeConfig().public.apiBase + `referral-program` + params
        : useRuntimeConfig().public.apiBase + `referral-program`;
      if (page) {
        url = params ? url + `&page=${page}` : url + `?page=${page}`;
      }
      try {
        const { data } = await AxiosService.get(url);
        this.referrals = data;
        this.loaded = true;
      } catch (e) {
        console.log('getAllManagersInTalentumTeamAction error', e);
      }
    },
  },
  getters: {
    getReferrals: (state) => state.referrals,
    getLoaded: (state) => state.loaded,
  },
});
