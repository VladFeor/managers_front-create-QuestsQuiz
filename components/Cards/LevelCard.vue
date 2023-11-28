<template>
  <div class="level-card">
    <div class="title-block">
      <div class="level">Level {{ info.level }}</div>
      <div class="point">
        {{ info.points }} / {{ info.need_points }} QP
        <TooltipIcon tooltipText="QP(Quality Points) earn by completing tasks" isLeft />
      </div>
    </div>
    <div class="box">
      <div
        class="progress"
        :style="`width: ${
          info.points > info.need_points ? 100 : (info.points * 100) / info.need_points
        }%`"
      ></div>
    </div>
    <div class="lvl-up" @click="lvlup" v-if="canSetLevel">Level Up</div>
  </div>
</template>

<script setup>
import AxiosService from '~/service/axiosService';
import { computed, inject } from 'vue';
import { useTalentsStore } from '~/store';
const props = defineProps({
  info: { type: Object, default: () => {} },
  reading: {
    type: Boolean,
    default: false,
  },
});
const talentsStore = useTalentsStore();
const nuxtApp = useNuxtApp();
const roles = inject('roles');

const { isSuperAdmin, isCatapultManager } = roles;
const canSetLevel = computed(
  () => props.info.next_level && (isSuperAdmin.value || isCatapultManager.value) && !props.reading,
);
const lvlup = () => {
  AxiosService.post(useRuntimeConfig().public.apiBase + 'ambassadors/level-up/' + props.info.id, {})
    .then(async () => {
      await talentsStore.getTalentByIdAction(props.info.id);
      await nuxtApp.$alert.show('Success', {
        type: 'success',
        timeout: 5000,
      });
    })
    .catch((e) => {
      nuxtApp.$alert.show(e.response.data.message, {
        type: 'error',
        timeout: 5000,
      });
    });
};
</script>

<style scoped lang="scss">
.level-card {
  padding: 14px;
  max-width: 376px;
  border: 1px solid $default-border;
  background: $white;
  border-radius: 16px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  flex-direction: column;
  .title-block {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    .level {
      font-weight: 500;
      font-size: 18px;
      line-height: 24px;
      color: $default;
    }
    .point {
      display: flex;
      align-items: flex-end;
      font-weight: 500;
      font-size: 18px;
      line-height: 24px;
      text-align: right;
      color: $default;
      font-feature-settings: 'zero' on;
    }
  }
  .box {
    margin-bottom: 20px;
    background: $default-bg;
    border: 1px solid $default-badge-border;
    border-radius: 16px;
    padding: 2px;
    .progress {
      height: 12px;
      background: linear-gradient(90deg, #fc660c 0%, #ff9844 100%);
      border-radius: 16px;
    }
  }
  .lvl-up {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 7px 40px;
    gap: 8px;
    margin-top: 26px;
    width: fit-content;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $default;
    background: $default-border;
    border-radius: 8px;
    &:hover {
      background: $default;
      cursor: pointer;
      color: $white;
    }
  }
}
</style>
