<template>
  <div
    v-if="
      profile ||
      (checkIsPropertyExist(dashboard, 'overdueManagerTasks') && role !== 'Talentum Manager')
    "
    class="tooltip-component"
    :class="{ active }"
    :style="{ width: width, height: height }"
  >
    <div class="tooltip-item" v-if="manager && profile">
      <div class="tooltip-content active">
        <span>{{ manager.overdue_by_manager_tasks }}</span>
        by managers
      </div>
      <div class="tooltip-content active">
        <span>{{ manager.overdue_by_talent_tasks }}</span> by talents
      </div>
    </div>
    <div class="tooltip-item" v-else-if="user && profile">
      <div class="tooltip-content active">
        <span>{{ user.overdue_by_manager_tasks }}</span>
        by managers
      </div>
      <div class="tooltip-content active">
        <span>{{ user.overdue_by_talent_tasks }}</span> by talents
      </div>
    </div>
    <div class="tooltip-item" v-else>
      <div class="tooltip-content active">
        <span>{{ dashboard.overdueManagerTasks }}</span>
        by managers
      </div>
      <div class="tooltip-content active">
        <span>{{ dashboard.overdueTasks }}</span> by talents
      </div>
    </div>
  </div>
  <div v-else class="tooltip-component" :class="{ active, top: role === 'Talentum Manager' }">
    <div class="tooltip-item">
      <span class="tooltip-content">Just tasks that you personally overdue.</span>
    </div>
  </div>
</template>

<script setup>
import { useDashboardStore } from '~/store/dashboard';
import { computed } from 'vue';
import { checkIsPropertyExist } from '@/util/helpers';
import { useUserStore } from '~/store/user';
import { useManagersStore } from '~/store/managers';

const userStore = useUserStore();
const managerStore = useManagersStore();
const user = computed(() => userStore.getProfile);

const role = computed(() => {
  const userRoles = userStore.userRoles;
  if (userRoles && userRoles.length && userRoles[0].name) {
    return userRoles[0].name;
  }
  return null;
});

const dashboardStore = useDashboardStore();

const dashboard = computed(() => dashboardStore.getDashboardOverview);
const manager = computed(() => managerStore.getManager);
console.log(manager.value);

const props = defineProps({
  data: { type: Array, default: [] },
  text: { type: String, default: '' },
  active: { type: Boolean, default: false },
  profile: { type: Boolean, default: false },
  width: { type: String, default: 'fit-content' },
  height: { type: String, default: 'auto' },
});
</script>

<style scoped lang="scss">
.tooltip-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  height: fit-content;
}
.tooltip-component {
  display: none;
  position: absolute;
  z-index: 999;
  background: $default;
  box-shadow: 0px 2px 8px rgba(26, 29, 41, 0.24);
  border-radius: 8px;
  font-size: 14px;
  width: fit-content;
  height: fit-content;
  left: 49%;
  top: 60px;
  transform: translate(-50%, -50%);
  &.top {
    top: 46px;
  }
  &.active {
    display: block;
  }
  &::after {
    content: '';
    position: absolute;
    width: 28px;
    height: 18px;
    background: $default;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 10;
    top: 10px;
    left: 50%;
    right: 50%;
    transform: rotate(45deg) translate(-50%, -5%);
  }
  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    text-align: right;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $default-border;
  }
  .tooltip-content {
    width: 112px;
    position: relative;
    z-index: 20;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $white;
    text-align: left;
    &.active {
      display: flex;
      align-items: center;
      padding-left: 0;
      gap: 8px;
      span {
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
        color: #eb6854;
      }
    }
  }
}
</style>
