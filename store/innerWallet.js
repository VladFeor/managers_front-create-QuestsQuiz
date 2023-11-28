import axios from 'axios';
import { defineStore } from 'pinia';
import AxiosService from '~/service/axiosService';
import { useAuthStore } from '~/store/auth';

export const useInnerWalletStore = defineStore('innerWallet', {
  state: () => ({
    innerWalletCurrentAmount: [],
    innerWalletWithdrawalHistory: [],
    innerWalletWithdrawalRequests: [],
    innerWalletOverview: [],
    innerWalletOverviewLoading: false,
    isInnerWalletOverviewLoaded: false,
    chartUSDTDataLoading: false,
    USDTChartData: [],
    USDTChartLabelsData: [],
    exportData: null,
  }),
  actions: {
    async getInnerWalletOverviewAction(id) {
      try {
        this.levelUpRequestsLoading = true;
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `v2/projects/${id}/inner-wallet/overview`,
        );
        this.innerWalletOverview = data;
        this.innerWalletOverviewLoading = false;
        this.isInnerWalletOverviewLoaded = true;
      } catch (error) {
        this.innerWalletOverviewLoading = false;
        this.isInnerWalletOverviewLoaded = true;
        console.log('getPopularTasksAction error', error);
      }
    },
    async getInnerWalletCurrentAmountAction({ id, page }) {
      try {
        const params = {};

        if (page) {
          params.page = page;
          params.per_page = 10;
        }
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `v2/projects/${id}/inner-wallet/current-amount`,
          params,
        );
        this.innerWalletCurrentAmount = data;
      } catch (error) {
        console.log('getInnerWalletCurrentAmountAction error', error);
      }
    },
    async getInnerWalletWithdrawalHistoryAction({ id, page }) {
      try {
        const params = {};

        if (page) {
          params.page = page;
          params.per_page = 10;
        }
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `v2/projects/${id}/inner-wallet/withdrawal-history`,
          params,
        );
        this.innerWalletWithdrawalHistory = data;
      } catch (error) {
        console.log('getInnerWalletWithdrawalHistoryAction error', error);
      }
    },
    async setInnerWalletWithdrawalHistoryAction(id, historyData) {
      try {
        const { data } = await AxiosService.patch(
          useRuntimeConfig().public.apiBase + `v2/projects/${id}/inner-wallet/withdrawal-requests`,
          historyData,
        );
        console.log('setInnerWalletWithdrawalHistoryAction', data);
      } catch (error) {
        console.log('getInnerWalletWithdrawalHistoryAction error', error);
      }
    },
    async getInnerWalletWithdrawalRequestsAction({ id, cointype_id, blockchain_id, page }) {
      try {
        const params = {};
        if (cointype_id) {
          params.coin_type_id = cointype_id;
        }
        if (blockchain_id) {
          params.blockchain_id = blockchain_id;
        }
        if (page) {
          params.page = page;
          params.per_page = 10;
        }
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `v2/projects/${id}/inner-wallet/withdrawal-requests`,
          params,
        );
        this.innerWalletWithdrawalRequests = data;
      } catch (error) {
        console.log('getInnerWalletWithdrawalRequestsAction error', error);
      }
    },
    async deleteWithdrawRequestAction(id, ids) {
      try {
        const { data } = await AxiosService.delete(
          useRuntimeConfig().public.apiBase + `v2/projects/${id}/inner-wallet/withdrawal-requests`,
          ids,
        );
        console.log('deleteWithdrawRequestAction', data);
      } catch (error) {
        console.log('deleteWithdrawRequestAction error', error);
        if (error.response.data.errors) {
          const parseErrors = Object.values(error.response.data.errors);
          parseErrors.forEach((errorItem) => {
            throw new Error(errorItem.join('\n'));
          });
        } else {
          throw new Error(error.response.data.message);
        }
      }
    },
    async getUSDTChartAction(period, project) {
      try {
        this.chartUSDTDataLoading = true;

        let url = !project
          ? `charts/usdt-paid/?period=${period}`
          : `charts/usdt-paid/?period=${period}&project_id=${project}`;

        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + url);
        this.USDTChartData = data;
        this.chartUSDTDataLoading = false;
      } catch (error) {
        this.chartUSDTDataLoading = false;
        console.log('getUSDTChartAction error', error);
      }
    },
    async getUSDTLabelsChartAction(period, project) {
      try {
        let url = !project
          ? `chart-labels/usdt-paid/?period=${period}`
          : `chart-labels/usdt-paid/?period=${period}&project_id=${project}`;
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + url);
        this.USDTChartLabelsData = data;
      } catch (error) {
        console.log('getUSDTLabelsChartAction error', error);
      }
    },
    async getWalletExportDataAction(id, type, table) {
      const authStore = useAuthStore();
      const params = {};

      if (type) {
        params.type = type;
      }

      if (table) {
        params.table = table;
      }

      try {
        const { data } = await axios.get(
          useRuntimeConfig().public.apiBase + `v2/projects/${id}/inner-wallet/export`,
          {
            params,
            responseType: 'blob',
            headers: {
              Authorization: `Bearer ${authStore.getToken()}`,
            },
          },
        );

        return data;
      } catch (error) {
        console.log('getWalletExportDataAction error', error);
      }
    },
    async getWalletGoogleExportDataAction(id, table) {
      try {
        await axios.get(
            useRuntimeConfig().public.apiBase + `v2/projects/${id}/inner-wallet/google-export`,
            {
              params: {
                table,
              },
              headers: {
                Authorization: `Bearer ${useAuthStore().getToken()}`,
              },
            },
        );
      } catch (error) {
        console.log('getWalletGoogleExportDataAction error', error);
      }
    },
  },
  getters: {
    getInnerWalletCurrentAmount: (state) => state.innerWalletCurrentAmount,
    getInnerWalletWithdrawalHistory: (state) => state.innerWalletWithdrawalHistory,
    getInnerWalletWithdrawalRequests: (state) => state.innerWalletWithdrawalRequests,
    getInnerWalletOverview: (state) => state.innerWalletOverview,
    getInnerWalletOverviewLoading: (state) => state.innerWalletOverviewLoading,
    getIsInnerWalletOverviewLoaded: (state) => state.isInnerWalletOverviewLoaded,
    getUSDTChart: (state) => state.USDTChartData,
    getUSDTLabels: (state) => state.USDTChartLabelsData,
    isChartUSDTDataLoaded: (state) => state.chartUSDTDataLoading,
    isExportData: (state) => state.exportData,
  },
});
