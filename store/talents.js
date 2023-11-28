import { defineStore } from 'pinia';
import AxiosService from '~/service/axiosService';

export const useTalentsStore = defineStore('talents', {
  state: () => ({
    talentActivity: [],
    talentActivityLabels: [],
    talentActivityLoading: false,
    isTalentActivityLoaded: false,
    isTalentsLoaded: false,
    talent: null,
    rewards: [],
    projects: [],
    tasks: [],
    labels: [],
    loading: true,
    talents: [],
    leaderboard: [],
    isLeaderBoardLoaded: false,
    loadingTalent: true,
    leaderboardProject: [],
  }),
  actions: {
    async getTalentActivityAction(period, activity, type, project) {
      try {
        this.talentActivityLoading = true;
        let url = activity
          ? `charts/talent-activity/?period=${period}&type=${type}&activity_id=${activity}`
          : `charts/talent-activity/?period=${period}&type=${type}`;
        if (project) {
          url = url + `&project_id=${project}`;
        }
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + url);

        this.talentActivity = data;
        this.talentActivityLoading = false;
        this.isTalentActivityLoaded = true;
      } catch (error) {
        this.talentActivityLoading = false;
        this.isTalentActivityLoaded = true;
        console.log('getTalentActivityAction error', error);
      }
    },
    async getTalentActivityLabelsAction(period, project) {
      try {
        let url = project
          ? `chart-labels/talent-activity/?period=${period}&project_id=${project}`
          : `chart-labels/talent-activity/?period=${period}`;

        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + url);
        this.talentActivityLabels = data;
      } catch (error) {
        console.log('getTalentActivityLabelsAction error', error);
      }
    },
    async getTalentByIdAction(id) {
      this.loadingTalent = true;
      try {
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBaseV2 + 'ambassadors/' + id,
        );
        const rewards = await AxiosService.get(
          useRuntimeConfig().public.apiBaseV2 + `ambassadors/${id}/discord-rewards/`,
        );
        this.rewards = rewards.data;
        this.talent = data;
        this.loadingTalent = false;
      } catch (error) {
        this.loadingTalent = false;
        console.log('getTalentByIdAction error', error);
      }
    },
    async getTalentTasksAction(id, status, page, sort) {
      this.loading = true;
      try {
        const labels = await AxiosService.get(
          useRuntimeConfig().public.apiBaseV2 + `ambassadors/${id}/tasks/labels`,
        );
        const tasks = await AxiosService.get(
          useRuntimeConfig().public.apiBaseV2 + `ambassadors/${id}/tasks`,
          {
            status: status,
            page: page,
            ...sort,
          },
        );
        this.loading = false;
        this.tasks = tasks.data;
        this.labels = labels.data;
      } catch (error) {
        console.log('getTalentTaskLabelsAction error', error);
      }
    },
    async getTalentProjectsAction(id, search) {
      try {
        const url = search
          ? `ambassadors/${id}/projects?search=${search}`
          : `ambassadors/${id}/projects`;

        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBaseV2 + url);
        this.projects = data;
      } catch (error) {
        console.log('getTalentProjectsAction error', error);
      }
    },
    async getTalentsAction(page, filters, type) {
      this.isTalentsLoaded = false;
      try {
        const url = type ? `ambassadors/${type}` : `ambassadors`;
        const { data } = await AxiosService.post(useRuntimeConfig().public.apiBaseV2 + url, {
          page: page,
          ...filters,
        });
        this.talents = data;
        this.isTalentsLoaded = true;
      } catch (error) {
        this.talents = [];
        this.isTalentsLoaded = true;
        console.log('getTalentProjectsAction error', error);
      }
    },
    async getLeaderBoardAction(page, filters, status) {
      this.isLeaderBoardLoaded = false;
      const url = !status ? 'leaderboard' : 'leaderboard/project';
      try {
        const { data } = await AxiosService.post(useRuntimeConfig().public.apiBase + url, {
          page: page,
          ...filters,
        });
        this.leaderboard = data;
        this.isLeaderBoardLoaded = true;
      } catch (error) {
        console.log('getLeaderBoardAction error', error);
      }
    },
    async getLeaderBoardProjectAction(page, filters, id) {
      this.isLeaderBoardLoaded = false;
      const url = `leaderboard/project?project_id=${id}`;
      try {
        const { data } = await AxiosService.post(useRuntimeConfig().public.apiBase + url, {
          page: page,
          ...filters,
        });
        this.leaderboardProject = data;
        this.isLeaderBoardLoaded = true;
      } catch (error) {
        console.log('getLeaderBoardAction error', error);
      }
    },
  },
  getters: {
    getTalentActivity: (state) => state.talentActivity,
    getTasksLoading: (state) => state.loading,
    getTasks: (state) => state.tasks,
    getProjects: (state) => state.projects,
    getTaskLabels: (state) => state.labels,
    getTalentById: (state) => state.talent,
    getTalents: (state) => state.talents,
    getLeaderBoard: (state) => state.leaderboard,
    getLeaderBoardLoaded: (state) => state.isLeaderBoardLoaded,
    getTalentsLoaded: (state) => state.isTalentsLoaded,
    getTalentRewardsById: (state) => state.rewards,
    getTalentActivityLabels: (state) => state.talentActivityLabels,
    getTalentActivityLoading: (state) => state.talentActivityLoading,
    getIsTalentActivityLoaded: (state) => state.isTalentActivityLoaded,
    talentIsLoading: (state) => state.loadingTalent,
    getLeaderboardProject: (state) => state.leaderboardProject,
  },
});
