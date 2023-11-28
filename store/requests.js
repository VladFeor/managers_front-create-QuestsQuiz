import { defineStore } from 'pinia';
import AxiosService from '~/service/axiosService';

export const useRequestsStore = defineStore('requests', {
  state: () => ({
    requests: [],
    requestsLoading: false,
    allAnswersLoading: false,
    requestsLoaded: false,
    allAnswers: [],
  }),
  actions: {
    async getRequestsAction({ page, level, urgent, levelupDirectionToggle, dashboard }) {
      try {
        this.requestsLoading = true;
        const params = {};

        if (page) {
          params.page = page;
          params.per_page = 10;
        }
        if (level !== null) {
          params.level = level;
        }
        if (urgent) {
          params.urgent = urgent;
        }

        if (dashboard) {
          params.dashboard = dashboard;
        }
        console.log(levelupDirectionToggle);
        const { data } = await AxiosService.get(
          `${useRuntimeConfig().public.apiBase}${levelupDirectionToggle}-requests`,
          params,
        );

        this.requests = data;
        this.requestsLoading = false;
        this.requestsLoaded = true;
      } catch (error) {
        this.requestsLoading = false;
        this.requestsLoaded = true;
        console.log('getRequestsAction error', error);
      }
    },
    async levelupRequestAction({ id, levelupDirectionToggle }) {
      try {
        const url =
          levelupDirectionToggle.value === 'level-up'
            ? `ambassadors/level-up/${id}`
            : `activities/approve/${id}`;

        return await AxiosService.post(useRuntimeConfig().public.apiBase + url, {});
      } catch (error) {
        return error;
      }
    },
    async dismissRequestAction({ id, levelupDirectionToggle }) {
      try {
        const url =
          levelupDirectionToggle.value === 'level-up'
            ? `ambassadors/dismiss/${id}`
            : `activities/decline/${id}`;
        const { data } = await AxiosService.post(useRuntimeConfig().public.apiBase + url, {});
        return data;
      } catch (error) {
        return error;
      }
    },
    async levelupMultiRequestAction({ ids }) {
      try {
        const { data } = await AxiosService.post(
          useRuntimeConfig().public.apiBase + `ambassadors/level-up-multi/`,
          { ids },
        );
        return data;
      } catch (error) {
        return error;
      }
    },
    async dismissMultiRequestAction({ ids }) {
      try {
        const { data } = await AxiosService.post(
          useRuntimeConfig().public.apiBase + `ambassadors/dismiss-multi/`,
          { ids },
        );
        console.log(data);
      } catch (error) {
        console.log('dismissRequestAction error', error);
      }
    },
    setRequests(data) {
      this.requests = data;
    },

    async getAllAnswersAction(params, page) {
      this.allAnswersLoading = true;
      let url = params
        ? useRuntimeConfig().public.apiBase + `survey/answers` + params
        : useRuntimeConfig().public.apiBase + `survey/answers`;

      if (page) {
        url = params ? url + `&page=${page}` : url + `?page=${page}`;
      }
      try {
        const { data } = await AxiosService.get(url);
        this.allAnswers = data;
        this.allAnswersLoading = false;
      } catch (e) {
        this.allAnswersLoading = false;
        console.log('getAllManagers error', e);
      }
    },
  },
  getters: {
    getRequests: (state) => state.requests,
    getAnswers: (state) => state.allAnswers,
    getRequestsLoading: (state) => state.requestsLoading,
    getStatus: (state) => state.allAnswersLoading,
    getRequestsLoaded: (state) => state.requestsLoaded,
  },
});
