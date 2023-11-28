import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from '~/store/auth';
import { useRouter } from 'vue-router';
import AxiosService from '~/service/axiosService';

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    popularTasks: [],
    popularTasksLoading: false,
    isPopularTasksLoaded: false,
    tasks: null,
    tasksLoading: false,
    tasksLoaded: false,
    task: null,
    taskLoading: false,
    taskLoaded: false,
    reviews: null,
    reviewsLoading: false,
    reviewsLoaded: false,
    userTask: null,
    userTaskLoading: false,
    userTaskLoaded: false,
    gateConditions: [],
    trophies: [],
  }),
  actions: {
    async getReviewsAction({ status, page, project_id, sortKey, sortType }) {
      try {
        this.reviewsLoading = true;
        const params = {};
        if (status) {
          params.status = status;
        }
        if (project_id) {
          params.project_id = project_id;
        }
        if (page) {
          params.page = page;
          params.per_page = 10;
        }
        if (sortKey) {
          params['sort[key]'] = sortKey;
        }
        if (sortType) {
          params['sort[type]'] = sortType;
        }
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `ambassadors/tasks`,
          params,
        );

        this.reviews = data;
        this.reviewsLoading = false;
        this.reviewsLoaded = true;
      } catch (error) {
        this.reviewsLoading = false;
        this.reviewsLoaded = true;
        console.log('getTasksAction error', error);
      }
    },
    setTasks(data) {
      console.log('setTasks', data);
      this.tasks = data;
    },
    setReviews(data) {
      console.log('setReviews', data);
      this.reviews = data;
    },
    async getTasksAction({
      search,
      status,
      page,
      reward_type,
      types,
      project_id,
      activity_id,
      priority,
      sortKey,
      sortType,
    }) {
      try {
        this.tasksLoading = true;
        const params = {};
        if (search) {
          params.search = search;
        }
        if (status) {
          params.status = status;
        }
        if (reward_type) {
          params.reward_type = reward_type;
        }
        if (project_id) {
          params.project_id = project_id;
        }
        if (priority) {
          params.priority = priority;
        }
        if (activity_id) {
          params.activity_id = activity_id;
        }
        if (types) {
          params.type = types;
        }
        if (page) {
          params.page = page;
          params.per_page = 10;
        }
        if (sortKey) {
          params['sort[key]'] = sortKey;
        }
        if (sortType) {
          params['sort[type]'] = sortType;
        }
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `v2/tasks`,
          params,
        );

        this.tasks = data;
        this.tasksLoading = false;
        this.tasksLoaded = true;
      } catch (error) {
        this.tasksLoading = false;
        this.tasksLoaded = true;
        console.log('getTasksAction error', error);
      }
    },
    async getTaskAction(id) {
      this.task = null;
      try {
        this.taskLoading = true;
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + `tasks/${id}`);
        this.task = data;
        this.gateConditions = data.chain_conditions
          .filter((c) => c.type === 'gate')
          .map((c) => ({
            id: c.id,
            type: c.name,
            values: c.chain_condition_fields.reduce(
              (res, cf) => ({ ...res, [cf.name]: cf.value }),
              {},
            ),
          }));
        this.taskLoading = false;
        this.taskLoaded = true;
      } catch (error) {
        this.taskLoading = false;
        this.taskLoaded = true;
        console.log('getTasksAction error', error);
        throw error;
      }
    },
    async getUserTaskAction(id) {
      try {
        this.userTaskLoading = true;

        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `v2/ambassadors/tasks/${id}`,
          // useRuntimeConfig().public.apiBase + `v2/ambassadors/tasks/${id}`,
        );

        this.userTask = data;
        this.userTaskLoading = false;
        this.userTaskLoaded = true;
      } catch (error) {
        this.userTaskLoading = false;
        this.userTaskLoaded = true;
        throw error;
        console.log('getTasksAction error', error);
      }
    },
    async createTaskAction(formData) {
      try {
        const { data } = await AxiosService.post(
          useRuntimeConfig().public.apiBase + `v2/tasks`,
          formData,
          true,
        );
        console.log('createTaskAction', data);
        if (data.id) {
          router.push(`tasks/task/${data.id}`);
        }
      } catch (error) {
        console.log('createTaskAction error', error);
        throw new Error("Task wasn't creted");
      }
    },
    async editBlockchainsAction(editData, id) {
      console.log('editBlockchainsAction editData', editData);
      try {
        const { data } = await AxiosService.put(
          `${useRuntimeConfig().public.apiBase}v2/tasks/${id}/blockchain`,
          editData,
        );
        console.log('editBlockchainsAction', data);
        // this.tasks = data;
        this.task = data;
        return data;
      } catch (error) {
        console.log('getRequestsAction error', error);
      }
    },
    async updateTaskAction(id, formData, isAxios, onChain) {
      try {
        if (!isAxios) {
          if (onChain) {
            const { data } = await AxiosService.post(
              useRuntimeConfig().public.apiBase + `v2/tasks/on-chain/${id}`,
              formData,
            );
            this.task = data;
            console.log('updateTaskAction', data);
            return;
          }
          const { data } = await AxiosService.patch(
            useRuntimeConfig().public.apiBase + `v2/tasks/${id}`,
            formData,
            true,
          );
          this.task = data;
          console.log('updateTaskAction', data);
        } else {
          const authStore = useAuthStore();
          const { data } = await axios.post(
            useRuntimeConfig().public.apiBase + `v2/tasks/${id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${authStore.getToken()}`,
              },
            },
          );
          console.log('updateTaskAction', data);
          this.task = data;
          console.log('updateTaskAction', data);
        }
      } catch (error) {
        console.log('updateTaskAction error', error);
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
    async addFilesTaskAction(id, formData, isAxios) {
      try {
        if (!isAxios) {
          const { data } = await AxiosService.post(
            useRuntimeConfig().public.apiBase + `v2/tasks/${id}/files`,
            formData,
            true,
          );
          this.task = data;
          console.log('updateTaskAction', data);
        } else {
          const authStore = useAuthStore();
          const { data } = await axios.post(
            useRuntimeConfig().public.apiBase + `v2/tasks/${id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${authStore.getToken()}`,
              },
            },
          );
          this.task = data;
          console.log('updateTaskAction', data);
        }
      } catch (error) {
        console.log('updateTaskAction error', error);
        throw new Error("Task wasn't creted");
      }
    },
    async deleteFilesTaskAction(id, formData, isAxios) {
      try {
        if (!isAxios) {
          const { data } = await AxiosService.delete(
            useRuntimeConfig().public.apiBase + `v2/tasks/${id}/files`,
            formData,
            true,
          );
          this.task = data;
          console.log('updateTaskAction', data);
        } else {
          const authStore = useAuthStore();
          const { data } = await axios.post(
            useRuntimeConfig().public.apiBase + `v2/tasks/${id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${authStore.getToken()}`,
              },
            },
          );
          this.task = data;
          console.log('updateTaskAction', data);
        }
      } catch (error) {
        console.log('updateTaskAction error', error);
        throw new Error("Task wasn't creted");
      }
    },
    async getPopularTasksAction(id) {
      try {
        this.popularTasksLoading = true;
        const params = {};
        if (id) {
          params.project_id = id;
        }
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `tasks/popular`,
          params,
        );

        this.popularTasks = data;
        this.popularTasksLoading = false;
        this.isPopularTasksLoaded = true;
      } catch (error) {
        this.popularTasksLoading = false;
        this.isPopularTasksLoaded = true;
        console.log('getPopularTasksAction error', error);
      }
    },
    async getTaskExportDataAction(type, table) {
      const authStore = useAuthStore();
      const params = {};

      if (type) {
        params.type = type;
      }

      if (table) {
        params.table = table;
      }

      try {
        const { data } = await axios.get(useRuntimeConfig().public.apiBase + `v2/tasks/export`, {
          params,
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${authStore.getToken()}`,
          },
        });

        return data;
      } catch (error) {
        console.log('getTaskExportDataAction error', error);
      }
    },
    async getTaskGoogleExportDataAction(type, table) {
      try {
        await axios.get(
            useRuntimeConfig().public.apiBase + `v2/tasks/google-export`,
            {
              params: {
                table,
              },
              headers: {
                Authorization: `Bearer ${useAuthStore().getToken()}`,
              },
            },
        );
      } catch (error) {
        console.log('getTaskGoogleExportDataAction error', error);
      }
    },
    async getUserTaskGoogleExportDataAction(type, table) {
      try {
        await axios.get(
            useRuntimeConfig().public.apiBase + `v2/ambassadors/tasks/google-export`,
            {
              params: {
                table,
              },
              headers: {
                Authorization: `Bearer ${useAuthStore().getToken()}`,
              },
            },
        );
      } catch (error) {
        console.log('getUserTaskGoogleExportDataAction error', error);
      }
    },
    async getUserTaskExportDataAction(type, table) {
      const authStore = useAuthStore();
      const params = {};
      if (type) {
        params.type = type;
      }
      if (table) {
        params.table = table;
      }
      try {
        const { data } = await axios.get(
          useRuntimeConfig().public.apiBase + `v2/ambassadors/tasks/export`,
          {
            params,
            responseType: 'blob',
            headers: {
              Authorization: `Bearer ${authStore.getToken()}`,
            },
          },
        );
        // this.exportData = data;
        return data;
      } catch (error) {
        console.log('getUserTaskExportDataAction error', error);
      }
    },
    async getTrophiesAction() {
      try {
        AxiosService.get(useRuntimeConfig().public.apiBase + 'reddit/trophies').then((response) => {
          this.trophies = response.data;
        });
      } catch (e) {
        console.log('getTrophies error', e);
      }
    },
  },
  getters: {
    getPopularTasks: (state) => state.popularTasks,
    getPopularTasksLoading: (state) => state.popularTasksLoading,
    getIsPopularTasksLoaded: (state) => state.isPopularTasksLoaded,
    getTasks: (state) => state.tasks,
    getTasksLoading: (state) => state.tasksLoading,
    getTasksLoaded: (state) => state.tasksLoaded,
    getTask: (state) => state.task,
    getTaskLoading: (state) => state.taskLoading,
    getTaskLoaded: (state) => state.taskLoaded,
    getUserTask: (state) => state.userTask,
    getUserTaskLoading: (state) => state.userTaskLoading,
    getUserTaskLoaded: (state) => state.userTaskLoaded,
    getReviews: (state) => state.reviews,
    getReviewsLoading: (state) => state.reviewsLoading,
    getReviewsLoaded: (state) => state.reviewsLoaded,
    getGate: (state) => state.gateConditions,
    getTrophies: (state) => state.trophies,
  },
});
