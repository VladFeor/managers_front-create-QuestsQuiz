import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from '~/store/auth';

export const useDiscordStore = defineStore('discord', {
  state: () => ({
    discordRoles: [],
  }),
  actions: {
    clearDiscordRoles() {
      this.discordRoles = [];
    },
    async getDiscordRoleAction(id) {
      try {
        const authStore = useAuthStore();
        const { data } = await axios.get(
          useRuntimeConfig().public.apiBase + `projects/${id}/discord/guild/roles`,
          {
            headers: {
              Authorization: `Bearer ${authStore.getToken()}`,
            },
          },
        );
        console.log('discord data', data);
        return data;
      } catch (error) {
        console.log('getEventsAction error', error);
      }
    },
    async getDiscordRolesAction(id) {
      try {
        const authStore = useAuthStore();
        const { data } = await axios.get(
          useRuntimeConfig().public.apiBase + `projects/${id}/discord/guild/roles`,
          {
            headers: {
              Authorization: `Bearer ${authStore.getToken()}`,
            },
          },
        );

        this.discordRoles = data;
      } catch (error) {
        console.log('getActivitiesAction error', error);
      }
    },
  },
  getters: {
    getDiscordRoles: (state) => state.discordRoles,
  },
});
