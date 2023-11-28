import { defineStore } from 'pinia';
import AxiosService from '~/service/axiosService';

export const useLevelsStore = defineStore('levels', {
  state: () => ({
    levelUpRequests: [],
    levelUpRequestsLoading: false,
    isLevelUpRequestsLoaded: false,
  }),
  actions: {
    async getLevelUpRequestsAction() {
      try {
        this.levelUpRequestsLoading = true;
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `level-up-requests-dashboard`,
        );
        this.levelUpRequests = data;
        this.levelUpRequestsLoading = false;
        this.isLevelUpRequestsLoaded = true;
      } catch (error) {
        this.levelUpRequestsLoading = false;
        this.isLevelUpRequestsLoaded = true;
        console.log('getPopularTasksAction error', error);
      }
    },
  },
  getters: {
    getLevelUpRequests: (state) => state.levelUpRequests,
    getLevelUpRequestsLoading: (state) => state.levelUpRequestsLoading,
    getIsLevelUpRequestsLoaded: (state) => state.isLevelUpRequestsLoaded,
  },
});
