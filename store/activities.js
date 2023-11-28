import { defineStore } from 'pinia';
import AxiosService from '~/service/axiosService';

export const useActivitiesStore = defineStore('activities', {
  state: () => ({
    activities: JSON.parse(localStorage.getItem('activities') || '[]'),
  }),
  actions: {
    async getActivitiesAction() {
      try {
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + 'activities');
        this.activities = data;
        localStorage.activities = JSON.stringify(data);
      } catch (error) {
        console.log('getActivitiesAction error', error);
      }
    },
  },
  getters: {
    getActivities: (state) => state.activities,
  },
});
