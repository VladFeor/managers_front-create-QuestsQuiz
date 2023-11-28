<template>
  <TasksTable :project="project" v-if="activeMenu.key === 'tasks'"/>
  <ManagersTable :project="project" v-if="activeMenu.key === 'managers'"/>
  <TalentsTable :project="project" v-if="activeMenu.key === 'talents'"/>
  <LeaderBoardTable :project="project" v-if="activeMenu.key === 'leaderboard'" />
  <Analytics :project="project" v-if="activeMenu.key === 'analytics'" />
</template>

<script setup>
import { TasksTable, ManagersTable, TalentsTable, LeaderBoardTable, Analytics } from "@/components/";
const roles = inject('roles');
const project = inject('project');
const props = defineProps({
  activeMenu: {
    type: Object,
    default: null
  }
})
const {
  isProjectAdministrator,
  isSuperAdmin,
  isProjectManager,
  isProjectOwner
} = roles;
</script>

<style scoped lang="scss">

</style>