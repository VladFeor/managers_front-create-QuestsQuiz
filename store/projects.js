import { defineStore } from 'pinia';
import { useAuthStore } from '~/store/auth';
import { useManagersStore } from '~/store/managers';
import { useTalentsStore } from '~/store/talents';
import AxiosService from '~/service/axiosService';

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    pendingReviews: [],
    projects: [],
    projectsList: [],
    tags: [],
    reportTypes: [],
    social_links: [],
    mediumPosts: [],
    project: [],
    newProjectId: null,
    refCode: null,
    newProjectErrors: [],
    updateProjectErrors: [],
    loading: false,
    createProjectLoading: false,
    pendingReviewsLoading: false,
    isPendingReviewsLoaded: false,
    projectLoading: false,
    projectsLoading: false,
    isProjectLoaded: false,
    isProjectsLoaded: false,
    projectOverview: [],
    projectOverviewLoading: false,
    isProjectOverviewLoaded: false,
    chartData: [],
    chartSocialNetworkData: [],
    chartSocialNetworkLoading: false,
    chartTasksData: [],
    chartTasksLoading: false,
    isChartTasksLoaded: false,
    chartAllTasksData: [],
    chartAllTasksLoading: false,
    isChartAllTasksLoaded: false,
    chartProjectsData: [],
    chartProjectsLoading: false,
    isChartProjectsLoaded: false,
    chartSocialNetworkDataLoading: false,
    isChartSocialNetworkDataLoaded: false,
    chartDataLoading: false,
    isChartDataLoaded: false,
    taskLabels: [],
    allTaskLabels: [],
    projectLabels: [],
    socialProviders: [],
  }),
  actions: {
    async getProjectsAction() {
      try {
        this.loading = true;
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + `projects`);
        this.projects = data;
        this.loading = false;
      } catch (error) {
        console.log('getProjectsAction error', error);
      }
    },
    async getProjectCode(id) {
      try {
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `invitations/generate/${id}`,
        );
        this.refCode = data.token;
      } catch (error) {
        console.log('getProjectCode error', error);
      }
    },
    async getProjectsListAction(params) {
      try {
        this.projectsLoading = true;
        params.per_page = 10;
        params.projectList = true;
        const { data } = await AxiosService.post(
          useRuntimeConfig().public.apiBase + `projects/list`,
          params,
        );
        this.projectsList = data;
        this.projectsLoading = false;
        this.isProjectsLoaded = true;
      } catch (error) {
        this.projectsLoading = false;
        this.isProjectsLoaded = true;
        console.log('getProjectsAction error', error);
      }
    },
    async getTagsAction() {
      try {
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + `tags`);
        this.tags = data;
      } catch (error) {
        console.log('getTagsAction error', error);
      }
    },
    async getSocialLinksAction(params) {
      try {
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `social-links`,
          params,
        );
        this.social_links = data;
      } catch (error) {
        console.log('getTagsAction error', error);
      }
    },
    async getProjectsSocialProvidersAction(id) {
      try {
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `projects/${id}/social-providers`,
        );

        console.log('getProjectsSocialProvidersAction', data);

        this.socialProviders = data;
      } catch (error) {
        console.log('getProjectsAction error', error);
      }
    },
    async getProjectAction(id) {
      try {
        console.log('getProjectAction', id);
        this.projectLoading = true;
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `projects/${id}`,
        );

        console.log('getProjectAction data', data);

        this.project = data;
        this.projectLoading = false;
        this.isProjectLoaded = true;
        // this.getSocialNetworkChartAction(data.id, 'discord', 'm');
        // this.getProjectsMembersChartAction('m');
        // this.getProjectChartLabelsAction('m');
        // this.getTasksChartAction(data.id, 'created', 'm');
        // this.getTasksChartLabelsAction(data.id, 'created', 'm');
        // this.getAllTasksChartLabelsAction('created', 'm');
        // useManagersStore().getManagersEffectivenessLabelsAction('m', null, data.id);
        // useManagersStore().getManagersEffectivenessAction('m', 'reviewed', null, data.id);
        // useTalentsStore().getTalentActivityLabelsAction('m', data.id);
      } catch (error) {
        this.projectLoading = false;
        this.isProjectLoaded = true;
        console.log('getProjectAction error', error);
        throw error;
      }
    },
    async getPendingReviewsAction(id) {
      try {
        this.pendingReviewsLoading = true;
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `projects/${id}/pending-reviews`,
        );

        this.pendingReviews = data;
        this.pendingReviewsLoading = false;
        this.isPendingReviewsLoaded = true;
      } catch (error) {
        this.pendingReviewsLoading = false;
        this.isPendingReviewsLoaded = true;
        console.log('getPendingReviewsAction error', error);
      }
    },
    async getProjectOverviewAction(id) {
      try {
        this.projectOverviewLoading = true;
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `projects/${id}/dashboard`,
        );

        this.projectOverview = data;
        this.projectOverviewLoading = false;
        this.isProjectOverviewLoaded = true;
      } catch (error) {
        this.projectOverviewLoading = false;
        this.isProjectOverviewLoaded = true;
        console.log('getPendingReviewsAction error', error);
      }
    },
    async getProjectsChartAction(period, tag) {
      try {
        this.chartDataLoading = true;
        const tagParam = tag
          .filter((i) => i !== 0)
          .map((id) => `&tag_id[]=${id}`)
          .join('');

        let url =
          tagParam.length > 0
            ? `charts/projects/?period=${period}${tagParam}`
            : `charts/projects/?period=${period}`;
        const index = tag.findIndex((element) => element === 0);
        if (index !== -1) {
          url = url + '&include_all=true';
        }
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + url);
        this.chartData = data;
        this.chartDataLoading = false;
        this.isChartDataLoaded = true;
      } catch (error) {
        this.chartDataLoading = false;
        this.isChartDataLoaded = true;
        console.log('getProjectsChartAction error', error);
      }
    },
    async getProjectsMembersChartAction(period, id) {
      try {
        this.chartProjectsLoading = true;
        const url = id
          ? `charts/project-members/?period=${period}&project_id=${id}`
          : `charts/project-members/?period=${period}`;
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + url);
        this.chartProjectsData = data;
        this.chartProjectsLoading = false;
        this.isChartProjectsLoaded = true;
      } catch (error) {
        this.chartProjectsLoading = false;
        this.isChartProjectsLoaded = true;
        console.log('getProjectsMembersChartAction error', error);
      }
    },
    async getReportTypesAction() {
      try {
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `projects/reportTypes`,
        );
        this.reportTypes = data;
      } catch (error) {
        console.log('getTagsAction error', error);
      }
    },

    async getSocialNetworkChartAction(id, type, period) {
      try {
        this.chartSocialNetworkDataLoading = true;
        const url = `charts/social-followers/?project_id=${id}&period=${period}&type=${type}`;
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + url);
        this.chartSocialNetworkData = data;
        this.chartSocialNetworkDataLoading = false;
        this.isChartSocialNetworkDataLoaded = true;
      } catch (error) {
        this.chartSocialNetworkDataLoading = false;
        this.isChartSocialNetworkDataLoaded = true;
        console.log('getSocialNetworkChartAction error', error);
      }
    },
    async getTasksChartAction(id, type, period, activity) {
      try {
        this.chartTasksLoading = true;
        const authStore = useAuthStore();
        const activityParam = activity
          .filter((i) => i !== 0)
          .map((id) => `&activity_id[]=${id}`)
          .join('');
        let url =
          activity.length > 0
            ? `charts/tasks/?period=${period}&type=${type}${activityParam}&project_id=${id}`
            : `charts/tasks/?period=${period}&type=${type}&project_id=${id}`;
        const index = activity.findIndex((element) => element === 0);
        if (index !== -1) {
          url = url + '&include_all=true';
        }
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + url);
        this.chartTasksData = data;
        this.chartTasksLoading = false;
        this.isChartTasksLoaded = true;
      } catch (error) {
        this.chartTasksLoading = false;
        this.isChartTasksLoaded = true;
        console.log('getTasksChartAction error', error);
      }
    },
    async getTasksChartLabelsAction(id, type, period) {
      try {
        const url = id
          ? `chart-labels/tasks/?type=${type}&period=${period}&project_id=${id}`
          : `chart-labels/tasks/?period=${period}&type=${type}`;
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + url);
        this.taskLabels = data;
      } catch (error) {
        console.log('getTasksChartLabelsAction error', error);
      }
    },
    async getProjectChartLabelsAction(period) {
      try {
        const url = `chart-labels/projects/?period=${period}`;
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + url);
        this.projectLabels = data;
      } catch (error) {
        console.log('getProjectChartLabelsAction error', error);
      }
    },
    async getAllTasksChartAction(type, period, activity) {
      try {
        this.chartAllTasksLoading = true;
        const authStore = useAuthStore();
        const activityParam = activity
          .filter((i) => i !== 0)
          .map((id) => `&activity_id[]=${id}`)
          .join('');
        let url =
          activity.length > 0
            ? `charts/tasks/?period=${period}&type=${type}${activityParam}`
            : `charts/tasks/?&period=${period}&type=${type}`;
        const index = activity.findIndex((element) => element === 0);
        if (index !== -1) {
          url = url + '&include_all=true';
        }
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + url);
        this.chartAllTasksData = data;
        this.chartAllTasksLoading = false;
        this.isChartAllTasksLoaded = true;
      } catch (error) {
        this.chartAllTasksLoading = false;
        this.isChartAllTasksLoaded = true;
        console.log('getAllTasksChartAction error', error);
      }
    },
    async getAllTasksChartLabelsAction(type, period) {
      try {
        const url = `chart-labels/tasks/?period=${period}&type=${type}`;
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + url);
        this.allTaskLabels = data;
      } catch (error) {
        console.log('getTasksChartLabelsAction error', error);
      }
    },
    async getProjectMediumPostsAction(id) {
      try {
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `projects/${id}/medium`,
        );

        console.log('getProjectMediumPostsAction data', data.items);
        this.mediumPosts = data.items;
      } catch (error) {
        console.log('getProjectMediumPostsAction error', error);
      }
    },

    async createProjectAction(params) {
      this.newProjectId = null;
      try {
        this.createProjectLoading = true;
        const { data } = await AxiosService.post(
          useRuntimeConfig().public.apiBase + `projects`,
          params,
          true,
        );
        this.newProjectId = data.id ?? null;
        this.createProjectLoading = false;
      } catch (error) {
        this.createProjectLoading = false;
        this.newProjectErrors = [].concat(...Object.values(error.response.data.errors));
      }
    },

    async updateProjectAction(params) {
      try {
        return await AxiosService.put(
          useRuntimeConfig().public.apiBase + `projects/${params.id}`,
          params.data,
          true,
        );
      } catch (error) {
        if (error.response) {
          return error;
        }
      }
    },
    async removeProjectAction(params) {
      try {
        const { data } = await AxiosService.delete(
          useRuntimeConfig().public.apiBase + `projects/${params.id}`,
        );
      } catch (error) {
        if (error.response) {
          console.log(error);
        }
      }
    },

    setProjects(data) {
      this.projects = data;
    },
  },
  getters: {
    getPendingReviews: (state) => state.pendingReviews,
    getProjects: (state) => state.projects,
    getReportTypes: (state) => state.reportTypes,
    getProjectsList: (state) => state.projectsList,
    getProjectMediumPosts: (state) => state.mediumPosts,
    getTags: (state) => state.tags,
    getNewProjectErrors: (state) => state.newProjectErrors,
    getSocialLinks: (state) => state.social_links,
    getProject: (state) => state.project,
    getNewProjectId: (state) => state.newProjectId,
    getLoading: (state) => state.loading,
    getProjectLoading: (state) => state.projectLoading,
    getIsProjectLoaded: (state) => state.isProjectLoaded,
    getProjectsLoading: (state) => state.projectsLoading,
    getIsProjectsLoaded: (state) => state.isProjectsLoaded,
    getPendingReviewsLoading: (state) => state.pendingReviewsLoading,
    getIsPendingReviewsLoaded: (state) => state.isPendingReviewsLoaded,
    getProjectOverview: (state) => state.projectOverview,
    getProjectOverviewLoading: (state) => state.projectOverviewLoading,
    getIsProjectOverviewLoaded: (state) => state.isProjectOverviewLoaded,
    getProjectsChart: (state) => state.chartData,
    getChartDataLoading: (state) => state.chartDataLoading,
    getIsChartDataLoaded: (state) => state.isChartDataLoaded,
    getSocialNetworkChartLoading: (state) => state.chartSocialNetworkDataLoading,
    getIsChartSocialNetworkDataLoaded: (state) => state.isChartSocialNetworkDataLoaded,
    getSocialNetworkChart: (state) => state.chartSocialNetworkData,
    getTasksChart: (state) => state.chartTasksData,
    getAllTasksChart: (state) => state.chartAllTasksData,
    getTasksChartLoading: (state) => state.chartTasksLoading,
    getIsChartTasksLoaded: (state) => state.isChartTasksLoaded,
    getAllTasksChartLoading: (state) => state.chartAllTasksLoading,
    getIsChartAllTasksLoaded: (state) => state.isChartAllTasksLoaded,
    getProjectsMembersChart: (state) => state.chartProjectsData,
    getProjectsMembersChartLoading: (state) => state.chartProjectsLoading,
    getIsChartProjectsLoaded: (state) => state.isChartProjectsLoaded,
    getTaskChartLabels: (state) => state.taskLabels,
    getAllTaskChartLabels: (state) => state.allTaskLabels,
    getProjectChartLabels: (state) => state.projectLabels,
    getSocialProviders: (state) => state.socialProviders,
    getCreateProjectLoading: (state) => state.createProjectLoading,
    getCode: (state) => state.refCode,
  },
});
