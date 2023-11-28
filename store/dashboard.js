import { defineStore } from 'pinia';
import AxiosService from '~/service/axiosService';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    dashboard: [],
    dashboardOverview: [],
    dashboardOverviewLoading: false,
    tags: [],
    isSidebarOpen: true,
  }),
  actions: {
    async getDashboardAction() {
      try {
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + 'dashboard');
        this.dashboard = data;
      } catch (error) {
        console.log('getEventsAction error', error);
      }
    },
    async getDashboardOverviewAction() {
      try {
        this.dashboardOverviewLoading = true;
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + 'dashboard/overview',
        );

        this.dashboardOverview = data;
        this.dashboardOverviewLoading = false;
      } catch (error) {
        this.dashboardOverviewLoading = false;

        console.log('getEventsAction error', error);
      }
    },
    async getTagsAction() {
      try {
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + 'tags');
        this.tags = data;
      } catch (error) {
        console.log('getEventsAction error', error);
      }
    },
    setIsSidebarOpen(value) {
      this.isSidebarOpen = value;
    },
  },
  getters: {
    getDashboard: (state) => state.dashboard,
    getDashboardOverview: (state) => state.dashboardOverview,
    getIsSidebarOpen: (state) => state.isSidebarOpen,
    getDashboardOverviewLoading: (state) => state.dashboardOverviewLoading,
    getTags: (state) => state.tags,
  },
});
