import { defineStore } from 'pinia';
import AxiosService from '~/service/axiosService';

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notificationsSettings: [],
    notificationsSettingsLoading: false,
    notifications: [],
    allNotifications: [],
    allUnreadNotifications: [],
  }),
  actions: {
    async getNotificationsAction() {
      try {
        const response = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `notifications?skip=${0}&take=${10}`,
        );
        if (response) {
          this.notifications = response.data;
        }
      } catch (err) {
        console.error(err);
      }
    },
    async getAllNotificationsAction(take) {
      try {
        const response = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `notifications?skip=${take - 10}&take=${take}&type=read`,
        );
        if (response) {
          this.allNotifications = response.data;
        }
      } catch (err) {
        console.error(err);
      }
    },
    async getAllUnreadNotificationsAction(take) {
      try {
        const response = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `notifications?skip=${take - 10}&take=${take}&type=unread`,
        );
        if (response) {
          this.allUnreadNotifications = response.data;
        }
      } catch (err) {
        console.error(err);
      }
    },
    async getNotificationsSettingsAction() {
      this.notificationsSettingsLoading = true;
      try {
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + 'notification-settings',
        );
        this.notificationsSettings = data;
        this.notificationsSettingsLoading = false;
      } catch (error) {
        this.notificationsSettingsLoading = false;
        console.log('getNotificationsSettingsAction error', error);
      }
    },
    async setNotificationsSettingsAction(body) {
      console.log('body', body);
      try {
        const { data } = await AxiosService.post(
          useRuntimeConfig().public.apiBase + 'notification-settings',
          body,
        );
        console.log('setNotificationsSettingsAction', data);
        this.notificationsSettings = data.status;
      } catch (error) {
        console.log('getNotificationsSettingsAction error', error);

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
  },
  getters: {
    getNotificationsSettings: (state) => state.notificationsSettings,
    getNotifications: (state) => state.notifications,
    getAllNotifications: (state) => state.allNotifications,
    getAllUnreadNotifications: (state) => state.allUnreadNotifications,
    getNotificationsSettingsLoading: (state) => state.notificationsSettingsLoading,
  },
});
