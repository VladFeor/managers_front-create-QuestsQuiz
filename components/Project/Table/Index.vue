<template>
  <div>
    <ProjectTableMenu :menus="menus" :activeMenu="activeMenu" @setActiveMenu="setActiveMenu" />
    <!-- <div
        class="my-7"
        v-if="activeMenu.key === 'leaderboard'"
    >
      <ProjectTableMenuAction :activeMenu="activeMenu" />
    </div> -->
    <ProjectTableBody :activeMenu="activeMenu" />
  </div>
</template>

<script setup>
import { ProjectTableMenu, ProjectTableMenuAction, ProjectTableBody } from '~/components/';
const activeMenu = ref({
  key: 'tasks',
  title: 'Tasks',
});
const menus = [
  { key: 'tasks', title: 'Tasks' },
  { key: 'managers', title: 'Managers' },
  { key: 'talents', title: 'Talents' },
  { key: 'leaderboard', title: 'Leaderboard' },
  { key: 'analytics', title: 'Analytics' },
];
const setActiveMenu = (menu) => {
  activeMenu.value = menu;
};
</script>

<style scoped lang="scss"></style>
