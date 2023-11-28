import { defineStore } from 'pinia';
import AxiosService from '~/service/axiosService';

export const useTopStore = defineStore('top', {
  state: () => ({
    topTalents: [],
    topTalentsLoading: false,
    isTopTalentsLoaded: false,
    topReviewers: [],
    topReviewersLoading: false,
    isTopReviewersLoaded: false,
  }),
  actions: {
    async getTopTalentsAction(id) {
      try {
        this.topTalentsLoading = true;
        const params = {};
        if (id) {
          params.project_id = id;
        }
        console.log('getTopTalentsAction params', params);
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + 'top/talents',
          params,
        );

        this.topTalents = data;
        this.topTalentsLoading = false;
        this.isTopTalentsLoaded = true;
      } catch (error) {
        this.topTalentsLoading = false;
        this.isTopTalentsLoaded = true;
        console.log('getEventsAction error', error);
      }
    },
    async getTopReviewersAction() {
      try {
        this.topReviewersLoading = true;
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + 'top/reviewers',
        );

        this.topReviewers = data;
        this.topReviewersLoading = false;
        this.isTopReviewersLoaded = true;
      } catch (error) {
        this.topReviewersLoading = false;
        this.isTopReviewersLoaded = true;
        console.log('getEventsAction error', error);
      }
    },
  },
  getters: {
    getTopTalents: (state) => state.topTalents,
    getTopTalentsLoading: (state) => state.topTalentsLoading,
    getIsTopTalentsLoaded: (state) => state.isTopTalentsLoaded,
    getTopReviewers: (state) => state.topReviewers,
    getTopReviewersLoading: (state) => state.topReviewersLoading,
    getIsTopReviewersLoaded: (state) => state.isTopReviewersLoaded,
  },
});
