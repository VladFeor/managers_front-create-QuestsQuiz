import { defineStore } from 'pinia';
import axiosService from '~/service/axiosService';

export const useTaskGateStore = defineStore('taskGate', {
  state: () => ({
    conditions: [],
    gateLoading: false,
    isGateLoaded: false,
  }),
  actions: {
    async updateConditionAction(taskId, conditionId, { type, values }) {
      try {
        const { data } = await axiosService.patch(
          useRuntimeConfig().public.apiBaseV2 + 'tasks/' + taskId + '/conditions/' + conditionId,
          {
            fields: Object.keys(values)
              .map((key) => ({
                name: key,
                value: values[key].toString(),
              }))
              .filter((v) => v.value),
          },
        );
        return data;
      } catch (e) {
        console.log('updateGateCondition Error', e);
      }
    },
    async addConditionAction(taskId, { type, values }) {
      try {
        return await axiosService.post(
          useRuntimeConfig().public.apiBaseV2 + 'tasks/' + taskId + '/conditions',
          {
            condition: {
              type: 'gate',
              name: type,
              fields: Object.keys(values)
                .map((key) => ({
                  name: key,
                  value: values[key].toString(),
                }))
                .filter((v) => v.value),
            },
          },
        );
      } catch (e) {
        console.log('addGateCondition Error', e);
      }
    },
    async removeConditionAction(taskId, { id }) {
      try {
        return await axiosService.delete(
          useRuntimeConfig().public.apiBaseV2 + 'tasks/' + taskId + '/conditions/' + id,
        );
      } catch (e) {
        console.log('removeGateCondition Error', e);
      }
    },
  },
  getters: {},
});
