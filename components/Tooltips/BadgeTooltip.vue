<template>
  <div class="tooltip-component" :class="{ active, isManager }">
    <div class="tooltip-item">
      <span class="tooltip-content">{{
        isManager
          ? "The task is overdue because the manager didn't check it in time"
          : "The task is overdue because a talent didn't finish it in time"
      }}</span>
    </div>
  </div>
</template>

<script setup>
import { useDashboardStore } from '~/store/dashboard';
import { computed } from 'vue';
import { checkIsPropertyExist } from '@/util/helpers';
import { useUserStore } from '~/store/user';

const userStore = useUserStore();

const role = computed(() => {
  const userRoles = userStore.userRoles;
  if (userRoles && userRoles.length && userRoles[0].name) {
    return userRoles[0].name;
  }
  return null;
});

const dashboardStore = useDashboardStore();

const dashboard = computed(() => dashboardStore.getDashboardOverview);

const props = defineProps({
  data: { type: Array, default: [] },
  text: { type: String, default: '' },
  active: { type: Boolean, default: false },
  isManager: { type: Boolean, default: false },
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
  width: auto;
  height: auto;
  font-size: 14px;
}
.tooltip-component {
  display: none;
  position: absolute;
  z-index: 999;
  background: $default;
  box-shadow: 0px 2px 8px rgba(26, 29, 41, 0.24);
  border-radius: 8px;
  font-size: 12px;
  width: 136px;
  height: 64px;
  left: 50%;
  top: 68px;
  transform: translate(-50%, -50%);
  padding: 8px;
  &.isManager {
    height: 80px;
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
    transform: rotate(45deg) translate(-50%, -1%);
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
    font-size: 11px;
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
        font-size: 12px;
        line-height: 24px;
        font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
        color: #eb6854;
      }
    }
  }
}
</style>
