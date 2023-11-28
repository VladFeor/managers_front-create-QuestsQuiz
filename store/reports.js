import { defineStore } from 'pinia';
import AxiosService from '~/service/axiosService';
export const useReportsStore = defineStore('reports', {
  state: () => ({
    reports: [],
    loaded: false,
    loading: false,
  }),
  actions: {
    async getReportsAction(params) {
      this.loaded = false;
      this.loading = true
      let url = useRuntimeConfig().public.apiBase + `reports`
      try {
        const { data } = await AxiosService.get(url, params);
        this.reports = data;
        this.loaded = true;
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log('getReportsAction error', e);
      }
    },
    async updateReportAction(params) {
      let url = useRuntimeConfig().public.apiBase + `reports/${params.id}`
      try {
        return await AxiosService.put(url, params);
      } catch (e) {
        return e
      }
    },
    async deleteReportAction(id) {
      let url = useRuntimeConfig().public.apiBase + `reports/${id}`
      try {
        return await AxiosService.delete(url, {});
      } catch (e) {
        return e
      }
    },
    setReports(data) {
      this.reports.data = data
    }
  },
  getters: {
    getReports: (state) => state.reports,
    getLoaded: (state) => state.loaded,
    getLoading: (state) => state.loading,
  },
});
