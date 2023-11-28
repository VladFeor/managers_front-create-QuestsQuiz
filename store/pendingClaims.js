import { defineStore } from 'pinia';
import AxiosService from '~/service/axiosService';

export const usePendingClaimsStore = defineStore('pendingClaims', {
  state: () => ({
    pendingClaims: [],
    pendingClaimsLoading: false,
    isPendingClaimsLoaded: false,
  }),
  actions: {
    async getPendingClaimsAction(id) {
      try {
        const url = id ? `pending-claims?project_id=${id}` : 'pending-claims';
        this.pendingClaimsLoading = true;
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + url);
        this.pendingClaims = data;
        this.pendingClaimsLoading = false;
        this.isPendingClaimsLoaded = true;
      } catch (error) {
        this.pendingClaimsLoading = false;
        this.isPendingClaimsLoaded = true;
        console.log('getProjectsAction error', error);
      }
    },
  },
  getters: {
    getPendingClaims: (state) => state.pendingClaims,
    getPendingClaimsLoading: (state) => state.pendingClaimsLoading,
    getIsPendingClaimsLoaded: (state) => state.isPendingClaimsLoaded,
  },
});
