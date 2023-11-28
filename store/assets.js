import { defineStore } from 'pinia';
import AxiosService from '~/service/axiosService';
export const useAssetsStore = defineStore('assets', {
  state: () => ({
    languages: [],
    roles: [],
    countries: [],
    skills: [],
    keywords: [],
  }),
  actions: {
    getLanguagesAction() {
      AxiosService.get(useRuntimeConfig().public.apiBase + 'languages')
        .then((response) => {
          this.languages = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getKeyWordsAction() {
      AxiosService.get(useRuntimeConfig().public.apiBaseV2 + 'ambassadors/twitter/keywords')
        .then((response) => {
          this.keywords = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getCountriesAction() {
      AxiosService.get(useRuntimeConfig().public.apiBase + 'countries')
        .then((response) => {
          this.countries = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getSkillsAction() {
      AxiosService.get(useRuntimeConfig().public.apiBase + 'skills')
        .then((response) => {
          this.skills = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getRolesAction() {
      AxiosService.get(useRuntimeConfig().public.apiBase + 'roles')
        .then((response) => {
          this.roles = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  getters: {
    getLanguages: (state) => state.languages,
    getCountries: (state) => state.countries,
    getSkills: (state) => state.skills,
    getRoles: (state) => state.roles,
    getKeywords: (state) => state.keywords,
  },
});
