<template>
  <div class="tasks-container">
    <div class="tasks-header">
      <PageToggle :buttons="[{ title: 'Automations', id: 0 }]" :id="0" />
    </div>
    <div class="tasks-body">
      <AutomationCard type="Discord" />
      <AutomationCard type="Telegram" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, computed } from 'vue';
import { useReferralsStore, useProjectsStore, useUserStore } from '~/store';
import { formatDateCurrent } from '~/util/helpers';
import Badge from '@/components/Badge.vue';
import Status from '@/components/TasksComponents/Status.vue';
import Talent from '~/components/Talent.vue';
import Preview from '~/components/Referrals/Preview.vue';
import defaultBg from '@/assets/images/default-avatar.png';
import { useRouter } from 'vue-router';

const router = useRouter();

const roles = inject('roles');

const {
  isProjectOwner,
  isSuperAdmin,
  isProjectAdministrator,
  isAdminSupport,
  isProjectManager,
  isCatapultManager,
} = roles;

onMounted(() => {
  if (isSuperAdmin.value) {
    router.push('/');
  }
});
</script>

<style lang="scss" scoped>
.tasks-container {
  display: flex;
  justify-content: center;
  //   align-items: center;
  flex-direction: column;
  //   width: 100%;
  max-width: 1160px;
  margin: 0 auto;

  &.fullWidth {
    max-width: 100%;
  }
}
.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
}
.tasks-body {
  display: flex;
  align-items: flex-start;
  gap: 40px;
  align-self: stretch;
}
.tasks-modify {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
}

.toggles_wrapper {
  width: 100%;
  display: flex;
  gap: 8px;
}
.filters {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 28px;
  gap: 8px;
}

.clear-filtrers {
  width: 71px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background: #eaeafb;
  }
  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    font-feature-settings: 'zero' on;
    color: #6a6d8f;
  }
}
.line {
  align-self: stretch;
  height: 32px;
  border: 0.25px solid #dad9f7;
}
</style>
