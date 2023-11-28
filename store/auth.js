import { defineStore } from 'pinia';
import AxiosService from '@/service/axiosService';
import { useUserStore } from '~/store/user';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.token || null,
    isRefreshed: false,
  }),
  actions: {
    async login({ email, password }) {
      try {
        const {
          data: { access_token },
        } = await AxiosService.post(useRuntimeConfig().public.apiBase + 'auth/login', {
          email,
          password,
        });
        this.setToken(access_token);
        await useUserStore().userInfo(access_token);
      } catch (error) {
        this.setToken();
        throw error.response.data;
      }
    },
    async register(data) {
      try {
        await AxiosService.post(useRuntimeConfig().public.apiBase + 'auth/registration', data);
      } catch (error) {
        throw error.response.data;
      }
    },
    async resetPassword(data) {
      try {
        await AxiosService.post(useRuntimeConfig().public.apiBase + 'auth/refresh-password', {
          email: data.email,
        });
      } catch (error) {
        throw error.response.data;
      }
    },

    setToken(token) {
      this.token = token;
      localStorage.token = token;
    },
    async refreshToken() {
      return new Promise((resolve, reject) => {
        AxiosService.post(useRuntimeConfig().public.apiBase + 'auth/refresh', {})
          .then((response) => {
            this.setToken(response.data.access_token);
            useUserStore().userInfo(response.data.access_token);
            resolve(response);
          })
          .catch((err) => {
            useUserStore().setUser(null);
            if (err.response.status === 500) {
              this.setToken(null);
            }
            reject();
          });
      });
    },

    async logout() {
      try {
        await AxiosService.post(useRuntimeConfig().public.apiBase + 'auth/logout');
      } catch (error) {
        console.error('Ошибка выхода из системы', error);
      }
      await localStorage.clear();
      useUserStore().setUser(null);
      this.setToken(null);
      this.refreshToken();
    },
  },
  getters: {
    getToken: (state) => (token) => state.token,
  },
});
