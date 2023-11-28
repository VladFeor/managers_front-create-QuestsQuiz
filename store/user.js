import { defineStore } from 'pinia';
import ALLOWED_ROUTES from '@/constants/roles';
import AxiosService from '@/service/axiosService';
import { useRouter } from 'vue-router';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    isAuthenticated: !!localStorage.getItem('user'),
    roles: JSON.parse(localStorage.getItem('roles') || '[]'),
    profile: JSON.parse(localStorage.getItem('profile') || 'null'),
    QR: null,
  }),

  actions: {
    async userInfo(token) {
      const router = useRouter();
      try {
        const response = await AxiosService.get(useRuntimeConfig().public.apiBase + 'auth/me');
        if (response) {
          if (!response.data.roles.length) {
            window.location.href = `${window.location.origin}/login`;
            return;
          }
          this.setUser(response.data);
          this.userProfile();
        }
      } catch (err) {
        console.error(err);
      }
    },
    async userProfile() {
      try {
        const response = await AxiosService.get(useRuntimeConfig().public.apiBaseV2 + 'profile');
        this.profile = response.data;
        localStorage.setItem('profile', JSON.stringify(response.data));
      } catch (err) {
        console.error(err);
      }
    },
    async getQRAction() {
      try {
        const QR = await AxiosService.get(useRuntimeConfig().public.apiBaseV2 + 'profile/2fa');
        this.QR = QR.data;
      } catch (err) {
        console.error(err);
      }
    },

    setUser(user) {
      this.user = user;
      this.isAuthenticated = user !== null;
      this.roles = user ? user.roles : [];
      // this.roles = user ? user.roles.map((role) => role.name.toLowerCase().replace(/\s/g, '')) : [];
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('roles', JSON.stringify(user.roles));
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('roles');
      }
    },

    getAllowedRoutes() {
      return this.roles.map((role) => ALLOWED_ROUTES[role.name] || []).flat();
    },
  },
  getters: {
    hasRole: (state) => (role) =>
      state.roles.some((userRole) => userRole.name.toLowerCase().replace(/\s/g, '') === role),
    userRoles: (state) => state.roles,
    getUserProjectId: (state) =>
      state.user && state.user.projects && state.user.projects.length
        ? state.user.projects[0].id
        : null,
    getUser: (state) => state.user,
    getProfile: (state) => state.profile,
    getQR: (state) => state.QR,
  },
});
