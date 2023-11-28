<template>
  <div class="tasks-container">
    <div class="tasks-header">
      <PageToggle
        v-if="!isProjectManager"
        :buttons="[
          { title: 'Talents', id: 0 },
          { title: 'Leaderboard', id: 1 },
        ]"
        :id="id"
        @select="setIsShowEvents($event)"
      />
      <PageToggle
        v-if="isProjectManager"
        :buttons="[{ title: 'Leaderboard', id: 1 }]"
        :id="0"
        @select="setIsShowEvents($event)"
      />
      <div class="tasks-modify" v-if="id === 0">
        <InputWithSearch :placeholder="'Find a Talent'" :iconSize="24" v-model="search" />
      </div>
    </div>

    <div class="tasks-body">
      <Talents v-if="id === 0" :search="search" />
      <Leaderboard v-if="id === 1" :search="search" />
    </div>
  </div>
</template>

<script setup>
import { useTasksStore } from '~/store/tasks';
import { useDashboardStore } from '~/store/dashboard';
import { ref, onMounted, inject, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const isMounted = ref(false);
onMounted(async () => {
  await dashboardStore.getDashboardAction();
  if (
    isProjectManager.value ||
    (route.query && route.query.status && route.query.status === 'leaderboard_my_projects')
  ) {
    id.value = 1;
  } else if (route.query.tab) {
    id.value = +route.query.tab;
  } else {
    await setIsShowEvents(0);
  }
  isMounted.value = true;
});

const roles = inject('roles');

const { isProjectManager } = roles;
const tasksStore = useTasksStore();
const dashboardStore = useDashboardStore();
const route = useRoute();
const router = useRouter();

watch(
  () => route.query.tab,
  (value) => {
    if (value) {
      id.value = +value;
    }
  },
);
watch(
  () => route.query.type,
  (value) => {
    if (value) {
      id.value = 1;
    }
  },
);
const id = ref(0);
const search = ref('');
async function setIsShowEvents(idProp) {
  await router.push(`leaderboard?tab=${idProp}&page=1`);
  await nextTick();
  id.value = idProp;
}
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
}
.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
}
.tasks-modify {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
}
</style>
