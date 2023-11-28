import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import {
  GATE_CONDITIONS,
  CONDITION_PART_VALUES,
  GATE_CONDITION_PARTS_MAP,
  GATE_CONDITION_DATA,
} from '~/components/Gate/utils';
import axiosService from '~/service/axiosService';

export const useGateStore = defineStore('gates', {
  state: () => ({
    createGateLoading: false,
    conditions: [],
    gateLoading: false,
    isGateLoaded: false,
  }),
  actions: {
    async getGateAction(projectId) {
      try {
        this.gateLoading = true;
        const { data } = await axiosService.get(
          useRuntimeConfig().public.apiBaseV2 + 'projects/' + projectId + '/conditions',
        );
        const map = {};

        for (let condition of data) {
          const key = condition.name;
          const valueKey = condition.field_name;
          const value = condition.value;

          map[key] = {
            ...(key in map ? map[key] : {}),
            [valueKey]: value,
          };
        }

        const conditions = Object.keys(map).map((type) => ({
          type,
          values: map[type],
        }));

        this.conditions = conditions;
        this.gateLoading = false;
        this.isGateLoaded = true;
      } catch (error) {
        this.gateLoading = false;
        this.isGateLoaded = true;
        console.log('getGateAction error', error);
      }
    },
    async createGateAction(projectId, conditionType, payload) {
      const params = payload
        .map((condition) => {
          const valueKeys = GATE_CONDITION_PARTS_MAP[condition.id]
            .map((key) => CONDITION_PART_VALUES[key])
            .flat();

          return valueKeys.map((key) => ({
            name: condition.id,
            field_name: key,
            value: condition.values[key].toString(),
          }));
        })
        .flat();

      return await axiosService
        .post(useRuntimeConfig().public.apiBaseV2 + 'projects/' + projectId + '/conditions', {
          conditions: params,
          any: Number(conditionType === 'any'),
        })
        .then((res) => {
          this.getGateAction(projectId);
          return res.data;
        });
    },
    async removeConditionAction(projectId, type) {
      try {
        return await axiosService
          .delete(
            useRuntimeConfig().public.apiBaseV2 +
              'projects/' +
              projectId +
              '/conditions' +
              `?name=${type}`,
          )
          .then((res) => {
            this.getGateAction(projectId);
            return res.data;
          });
      } catch (error) {
        console.log('removeGateAction error', error);
      }
    },
    async editCondition(projectId, type, values) {
      const params = Object.keys(values).map((valueKey) => ({
        name: type,
        field_name: valueKey,
        value: values[valueKey],
      }));

      return await axiosService
        .patch(useRuntimeConfig().public.apiBaseV2 + 'projects/' + projectId + '/conditions', {
          conditions: params,
        })
        .then((res) => {
          this.getGateAction(projectId);
          return res.data;
        });
    },
    async addCondition(projectId, type, values) {
      const params = Object.keys(values).map((valueKey) => ({
        name: type,
        field_name: valueKey,
        value: values[valueKey].toString(),
      }));
      return axiosService
        .post(useRuntimeConfig().public.apiBaseV2 + 'projects/' + projectId + '/conditions', {
          conditions: params,
        })
        .then((res) => {
          this.getGateAction(projectId);
          return res.data;
        });
    },
    async changeGateType(projectId, type) {
      return await axiosService
        .post(useRuntimeConfig().public.apiBaseV2 + 'projects/' + projectId + '/conditions/any', {
          _method: 'patch',
          any: type,
        })
        .then((res) => {
          this.getGateAction(projectId);
          return res.data;
        });
    },
  },
  getters: {
    getCreateGateLoading: (state) => state.createGateLoading,
  },
});
