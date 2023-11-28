import { defineStore } from 'pinia';
import AxiosService from '~/service/axiosService';

export const useManagersStore = defineStore('managers', {
  state: () => ({
    managersEffectiveness: [],
    managersEffectivenessLoading: false,
    isManagersEffectivenessLoaded: false,
    managers: [],
    managerEffectivenessLabels: [],
    projects: [],
    allManagers: [],
    allManagerInProject: [],
    allManagerInTalentumTeam: [],
    manager: null,
    autocomplete: [],
    loadedTable: false,
    managerLoading: true,
  }),
  actions: {
    async getManagersEffectivenessAction(period, type, manager, project) {
      try {
        this.managersEffectivenessLoading = true;
        let url = manager
          ? `charts/manager-effectiveness/?period=${period}&task_type=${type}&manager_id=${manager}`
          : `charts/manager-effectiveness/?period=${period}&task_type=${type}`;
        if (project) {
          url = url + `&project_id=${project}`;
        }
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + url);
        this.managersEffectiveness = data;
        this.managersEffectivenessLoading = false;
        this.isManagersEffectivenessLoaded = true;
      } catch (error) {
        this.managersEffectivenessLoading = false;
        this.isManagersEffectivenessLoaded = true;
        console.log('getManagersEffectivenessAction error', error);
      }
    },
    async getManagersEffectivenessLabelsAction(period, manager_id, project) {
      try {
        let url = manager_id
          ? `chart-labels/manager-effectiveness/?period=${period}&manager_id=${manager_id}`
          : `chart-labels/manager-effectiveness/?period=${period}`;
        if (project) {
          url = url + `&project_id=${project}`;
        }

        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + url);
        this.managerEffectivenessLabels = data;
      } catch (error) {
        console.log('getManagersEffectivenessLabelsAction error', error);
      }
    },

    async getManagersAction(search, project) {
      try {
        let url = project
          ? useRuntimeConfig().public.apiBaseV2 + `managers/autocomplete?project_id=${project}`
          : useRuntimeConfig().public.apiBaseV2 + `managers`;
        if (search) {
          url = url + `?search=${search}`;
        }

        const { data } = await AxiosService.get(url);
        this.managers = data;
        console.log(this.managers, 666);
      } catch (error) {
        console.log('getManagersEffectivenessAction error', error);
      }
    },
    async getAllManagersAction(params, page) {
      let url = params
        ? useRuntimeConfig().public.apiBaseV2 + `managers` + params
        : useRuntimeConfig().public.apiBaseV2 + `managers`;
      this.loadedTable = false;

      if (page) {
        url = params ? url + `&page=${page}` : url + `?page=${page}`;
      }
      try {
        const { data } = await AxiosService.get(url);
        this.allManagers = data;
        this.loadedTable = true;
      } catch (e) {
        this.loadedTable = true;
        console.log('getAllManagers error', e);
      }
    },
    async getAutocompleteAction(params) {
      const url = params ? `managers/autocomplete` + params : `managers/autocomplete`;
      try {
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBaseV2 + url);
        this.autocomplete = data;
      } catch (e) {
        console.log('getAutocompleteAction error', e);
      }
    },
    async getAllManagersInProjectAction(project, page = 1, role_id = null, isTM = null, param) {
      let url = `projects/${project}/managers`;
      if (param) {
        url = url + param;
      }
      if (page) {
        url = param ? url + `&page=${page}` : url + `?page=${page}`;
      }

      if (role_id) {
        url = url + `&role_id=${role_id}/`;
      }

      if (isTM) {
        url = url + `&is_talantum_manager=${isTM}`;
      }
      this.loadedTable = false;

      try {
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBaseV2 + url);
        this.allManagerInProject = data;
        this.loadedTable = true;
      } catch (e) {
        this.loadedTable = true;

        console.log('getAllManagersInProjectAction error', e);
      }
    },
    async getAllManagersInTalentumTeamAction(project, page, param) {
      let url = `projects/${project}/talentum-team`;

      if (param) {
        url = url + param;
      }

      if (page) {
        url = param ? url + `&page=${page}` : url + `?page=${page}`;
      }
      this.loadedTable = false;
      try {
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBaseV2 + url);
        this.allManagerInTalentumTeam = data;
        this.loadedTable = true;
      } catch (e) {
        this.loadedTable = true;
        console.log('getAllManagersInTalentumTeamAction error', e);
      }
    },
    async getManagerByIdAction(id) {
      this.managerLoading = true;

      try {
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBaseV2 + `managers/${id}`,
        );
        this.manager = data;
        this.managerLoading = false;
      } catch (error) {
        this.managerLoading = false;

        console.log('getManagerByIdAction error', error);
      }
    },
    async getManagerProjectsByIdAction(id, search) {
      this.loadedTable = false;

      try {
        const url = search ? `managers/${id}/projects?search=${search}` : `managers/${id}/projects`;
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBaseV2 + url);
        this.projects = data;
        this.loadedTable = true;
      } catch (error) {
        this.loadedTable = true;
        console.log('getManagerProjectsByIdAction error', error);
      }
    },
  },
  getters: {
    getManagersEffectiveness: (state) => state.managersEffectiveness,
    getManagersEffectivenessLoading: (state) => state.managersEffectivenessLoading,
    getIsManagersEffectivenessLoaded: (state) => state.isManagersEffectivenessLoaded,
    getManagers: (state) => state.managers,
    getManager: (state) => state.manager,
    getProjects: (state) => state.projects,
    getManagersEffectivenessLabels: (state) => state.managerEffectivenessLabels,
    getAllManagers: (state) => state.allManagers,
    getAllManagerInProject: (state) => state.allManagerInProject,
    getAllManagerInTalentumTeam: (state) => state.allManagerInTalentumTeam,
    getAutocomplete: (state) => state.autocomplete,
    getLoadingTable: (state) => state.loadedTable,
    isManagerLoading: (state) => state.managerLoading,
  },
});
