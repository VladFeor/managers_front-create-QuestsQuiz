<template>
  <div class="filters">
    <div class="toggles_wrapper">
      <FilterToggle
        v-if="!defaultProject"
        :buttons="[
          {
            title: `Available ${dashboard && dashboard.available ? dashboard.available : 0}`,
            id: 0,
            name: 'Available',
          },
          {
            title: `Upcoming ${dashboard && dashboard.upcoming ? dashboard.upcoming : 0}`,
            id: 1,
            name: 'Upcoming',
          },
          {
            title: `Completed ${dashboard && dashboard.finished ? dashboard.finished : 0}`,
            id: 2,
            name: 'Completed',
          },
        ]"
        :id="id"
        @select="setIsShowEvents($event)"
      />
      <TasksSelect
        :isClear="isClear"
        :setIsClear="setIsClear"
        :options="rewards"
        @input="filtersHandler($event, 'reward')"
        :reduceLength="14"
      />
      <TasksSelect
        v-if="!isProjectOwner && !isProjectAdministrator && !isProjectManager && !defaultProject"
        :isClear="isClear"
        :setIsClear="setIsClear"
        filter
        :options="projects"
        @input="filtersHandler($event, 'project')"
        type="project"
        :setIsFilterActive="setIsProjectsFilterActive"
        :reduceLength="14"
      />
      <TasksSelect
        :isClear="isClear"
        :setIsClear="setIsClear"
        :options="directions"
        @input="filtersHandler($event, 'direction')"
        :reduceLength="14"
        isShort
      />
      <TasksSelect
        :isClear="isClear"
        :setIsClear="setIsClear"
        :options="priorities"
        @input="filtersHandler($event, 'priority')"
        :reduceLength="14"
      />

      <TasksSelect
        :isClear="isClear"
        :setIsClear="setIsClear"
        :options="typesOptions"
        @input="filtersHandler($event, 'types')"
        :reduceLength="14"
      />
      <div v-if="isFilterBtnActive" class="clear-filtrers" @click="clearFilters">
        <span>Clear All</span>
      </div>
    </div>
    <ExportSelect
      title="Export"
      :options="exportOptions"
      :handleOpenSubMenu="handleOpenSubMenu"
      :exportFunction="exportTasksAction"
    />
  </div>
  <TableSkeleton v-if="tasksLoading || !isTasksLoaded" />
  <BaseTable
    v-else
    :columns="tasksColumns"
    :rows="tasksRows"
    pointer
    title="You have no tasks yet"
    icon="icons8-futurama-bender"
    :sortFunction="sortTasks"
    :sortDirection="sortDirection"
    :setSortDirection="setSortDirection"
    :sortColumn="sortColumn"
    :setSortColumn="setSortColumn"
    isSorting
  />
  <Pagination
    @pageChanged="nextPage($event)"
    :currentPage="currentPage"
    v-if="!tasksLoading && isTasksLoaded && tasksRows && tasksRows.length"
    :totalPages="totalPages"
  />
</template>

<script setup>
import Badge from '@/components/Badge.vue';
import Tokens from '@/components/Tokens.vue';
import Priority from '@/components/Priority/Priority.vue';
import Talent from '@/components/Talent.vue';
import Amount from '@/components/Amount.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseLineChart from '@/components/BaseLineChart';
import defaultBg from '@/assets/images/default-avatar.png';
import { useActivitiesStore } from '~/store/activities';

import {
  formatFutureDate,
  formatPastDate,
  formatDate,
  getBadgeTypeByName,
  formatNumber,
  formatNumberMore10K,
  formatNumberAddComma,
  timestampToString,
} from '@/util/helpers';
import { useTasksStore } from '~/store/tasks';
import { useProjectsStore } from '~/store/projects';
import { useDashboardStore } from '~/store/dashboard';
import { ref, toRef, computed, onMounted, inject } from 'vue';
import axiosService from '~~/service/axiosService';
import { useRouter, useRoute } from 'vue-router';

const roles = inject('roles');
const route = useRoute();
const router = useRouter();

const { isProjectOwner, isProjectAdministrator, isProjectManager } = roles;

const emit = defineEmits(['pagData']);

const props = defineProps({
  search: { type: String, default: '' },
  defaultProject: { type: Object, default: null },
});
const defaultProject = toRef(props, 'defaultProject');
const dashboardStore = useDashboardStore();
const projectsStore = useProjectsStore();
const activityStore = useActivitiesStore();
onMounted(() => {
  if (route.query && route.query.page) {
    currentPage.value = route.query.page;
  }
  if (route.query && route.query.tasksStatus) {
    id.value = getIdByTasksStatus(route.query.tasksStatus);
    status.value = route.query.tasksStatus;
  }
  activityStore.getActivitiesAction();
  projectsStore.getProjectsAction();

  emit('pagData', { status: status.value, page: currentPage.value, search: props.search });
  isMounted = true;

  if (props.defaultProject) {
    tasksStore.getTasksAction({
      page: currentPage.value,
      status: status.value,
      search: props.search,
      project_id: props.defaultProject.id,
    });
  } else {
    tasksStore.getTasksAction({
      page: currentPage.value,
      status: status.value,
      search: props.search,
    });
  }
});

const exportOptions = reactive([
  {
    name: 'Export as XLSX',
    list: [
      { title: 'Export All', table: '', type: 'csv', redirect_url: 'tasks' },
      { title: 'Available', table: 'available', type: 'csv', redirect_url: 'tasks' },
      { title: 'Upcoming', table: 'upcoming', type: 'csv', redirect_url: 'tasks' },
      { title: 'Completed', table: 'completed', type: 'csv', redirect_url: 'tasks' },
    ],
    isSubMenuVisible: false,
  },
  {
    name: 'Export as PDF',
    list: [
      { title: 'Export All', table: '', type: 'pdf', redirect_url: 'tasks' },
      { title: 'Available', table: 'available', type: 'pdf', redirect_url: 'tasks' },
      { title: 'Upcoming', table: 'upcoming', type: 'pdf', redirect_url: 'tasks' },
      { title: 'Completed', table: 'completed', type: 'pdf', redirect_url: 'tasks' },
    ],
    isSubMenuVisible: false,
  },
  {
    name: 'Export to Google Sheet',
    list: [
      { title: 'All', table: '', type: 'google_sheet', redirect_url: 'tasks' },
      { title: 'Available', table: 'available', type: 'google_sheet', redirect_url: 'tasks' },
      { title: 'Upcoming', table: 'upcoming', type: 'google_sheet', redirect_url: 'tasks' },
      { title: 'Completed', table: 'completed', type: 'google_sheet', redirect_url: 'tasks' },
    ],
    isSubMenuVisible: false,
  },
]);

const handleOpenSubMenu = (option) => {
  exportOptions.map((item) => {
    if (item.name === option.name) {
      item.isSubMenuVisible = !item.isSubMenuVisible;
    } else {
      item.isSubMenuVisible = false;
    }
    return item;
  });
};

const exportTasksAction = async (type, table) => {
  if (type !== 'google_sheet') {
    return await tasksStore.getTaskExportDataAction(type, table);
  }

  await tasksStore.getTaskGoogleExportDataAction(type, table);
};

const getIdByTasksStatus = (status) => {
  console.log('getIdByTasksStatus', status);
  let id;
  switch (status) {
    case 'finished':
      id = 2;
      break;
    case 'upcoming':
      id = 1;
      break;
    default:
      id = 0;
  }
  return id;
};

const rewards = [
  {
    name: 'All Rewards',
    id: '',
  },
  {
    name: 'Coins',
    id: 'coins',
  },
  {
    name: 'Discord Role',
    id: 'discord_role',
  },
  {
    name: 'Credits',
    id: 'credits',
  },
  // {
  //   name: 'NFT',
  //   id: 'nft',
  // },
];

const priorities = [
  {
    name: 'All Priorities',
    id: '',
  },
  {
    name: 'Low',
    id: 'low',
  },
  {
    name: 'Middle',
    id: 'medium',
  },
  {
    name: 'High',
    id: 'high',
  },
];

const typesOptions = [
  {
    name: 'Any Types',
    id: '',
  },
  {
    name: 'On-Chain',
    id: 'on',
  },
  {
    name: 'Off-Chain',
    id: 'of',
  },
];

const directions = computed(() => {
  const activitiesArray = activityStore.getActivities;
  if (!activitiesArray || (activitiesArray && !activitiesArray.length)) {
    return [
      {
        name: 'All Directions',
        id: '',
      },
    ];
  }

  const activitiesIds = activitiesArray.map((item) => ({
    id: item.id,
    name: item.name,
  }));

  const activitiesOptions = [
    {
      name: 'All Directions',
      id: '',
    },
  ].concat(activitiesIds);
  return activitiesOptions;
});

const projects = computed(() => {
  const projectsArray = projectsStore.getProjects;
  if (!projectsArray || (projectsArray && !projectsArray.length)) {
    return [
      {
        name: 'All Projects',
        id: '',
      },
    ];
  }

  const projectsIds = projectsArray.map((item) => ({
    id: item.id,
    name: item.name,
  }));

  const projectsOptions = [
    {
      name: 'All Projects',
      id: '',
    },
  ].concat(projectsIds);
  return projectsOptions;
});

const reward = ref('');
const types = ref('');
const priority = ref('');
const direction = ref('');
const project = ref(null);
const sortDirection = ref('');
const sortColumn = ref('');
let isMounted = false;

const isFilterBtnActive = computed(() => {
  if (reward.value || priority.value || project.value || direction.value) return true;
  else return false;
});

const currentPage = ref(route.query ? route.query.page : 1);

const id = ref(0);
const status = ref('available');

const isProjectsFilterActive = ref(false);

const setIsProjectsFilterActive = (value) => {
  isProjectsFilterActive.value = value;
};

const isClear = ref(false);

const setIsClear = (value) => {
  isClear.value = value;
};

const setSortDirection = (value) => {
  sortDirection.value = value;
};
const setSortColumn = (value) => {
  sortColumn.value = value;
};

const sortHandle = (name, type) => {
  const params = {
    status: status.value,
    search: props.search,
    page: currentPage.value,
  };
  if (reward.value) {
    params.reward_type = reward.value;
  }
  if (priority.value) {
    params.priority = priority.value;
  }
  if (direction.value) {
    params.activity_id = direction.value;
  }
  if (project.value) {
    params.project_id = project.value;
  }
  if (defaultProject && defaultProject.value) {
    params.project_id = defaultProject.value.id;
  }
  if (type) {
    params.sortKey = name;
    params.sortType = type;
  }

  console.log('sortHandle params', params);

  tasksStore.getTasksAction(params);
  emit('pagData', params);
};

const filtersHandler = (data, type) => {
  if (!isMounted || isProjectsFilterActive.value) return;
  if (type === 'reward') {
    reward.value = data.id;
  }
  if (type === 'priority') {
    priority.value = data.id;
  }
  if (type === 'direction') {
    direction.value = data.id;
  }
  if (type === 'project') {
    project.value = data.id;
  }
  if (type === 'types') {
    types.value = data.id
  }
  const params = {
    status: status.value,
    search: props.search,
    page: 1,
  };

  if ((type === 'reward' && data.id) || reward.value) {
    params.reward_type = type === 'reward' ? data.id : reward.value;
  }
  if ((type === 'priority' && data.id) || priority.value) {
    params.priority = type === 'priority' ? data.id : priority.value;
  }
  if ((type === 'direction' && data.id) || direction.value) {
    params.activity_id = type === 'direction' ? data.id : direction.value;
  }
  if ((type === 'project' && data.id) || project.value) {
    params.project_id = type === 'project' ? data.id : project.value;
  }

  if (defaultProject && defaultProject.value) {
    params.project_id = defaultProject.value.id;
  }
  if (type === 'types' && data.id) {
    params.type = data.id === 'on' ? 'on-chain' : 'regular';
  }
  tasksStore.getTasksAction(params);
  emit('pagData', params);
};

const searchInterval = ref(null);

const clearFilters = () => {
  clearTimeout(searchInterval.value);

  searchInterval.value = setTimeout(() => {
    setIsClear(true);
  }, 500);
};

function nextPage(page) {
  currentPage.value = page;
  const params = {
    status: status.value,
    page,
    search: props.search,
  };
  if (reward.value) {
    params.reward_type = reward.value;
  }
  if (priority.value) {
    params.priority = priority.value;
  }
  if (direction.value) {
    params.activity_id = direction.value;
  }
  if (types.value) {
    console.log(types.value);
    params.types = types.value === 'on' ? 'on-chain' : 'regular';
  }

  if (project.value) {
    params.project_id = project.value;
  }
  if (sortDirection.value) {
    let sortName = '';
    if (sortColumn.value === 'task') {
      sortName = 'name';
    }
    if (sortColumn.value === 'project') {
      sortName = 'project';
    }
    if (sortColumn.value === 'direction') {
      sortName = 'direction';
    }
    if (sortColumn.value === 'start') {
      sortName = 'started_at';
    }
    if (sortColumn.value === 'deadline') {
      sortName = 'ended_at';
    }
    if (sortColumn.value === 'priority') {
      sortName = 'priority';
    }
    if (sortColumn.value === 'rewards') {
      sortName = 'rewards';
    }
    params.sortKey = sortName;
    params.sortType = sortDirection.value;
  }
  tasksStore.getTasksAction(params);
  emit('pagData', params);
}

function setIsShowEvents(event) {
  id.value = event.id;
  status.value = event.status === 'Completed' ? 'finished' : event.status.toLowerCase();
  router.push({ query: { tasksStatus: status.value } });
  currentPage.value = 1;
  const params = {
    status: status.value,
    search: props.search,
    page: 1,
  };
  if (reward.value) {
    params.reward_type = reward.value;
  }
  if (priority.value) {
    params.priority = priority.value;
  }
  if (direction.value) {
    params.activity_id = direction.value;
  }
  if (project.value) {
    params.project_id = project.value;
  }
  if (types.value) {
    params.type = types.value === 'on' ? 'on-chain' : 'regular';
  }
  tasksStore.getTasksAction(params);

  emit('pagData', params);
}

const tasksStore = useTasksStore();
const tasks = computed(() => tasksStore.getTasks);
const tasksLoading = computed(() => tasksStore.getTasksLoading);
const isTasksLoaded = computed(() => tasksStore.getTasksLoaded);
const dashboard = computed(() => {
  return dashboardStore.getDashboard;
});

const tasksColumns = computed(() => {
  if (isProjectOwner.value || isProjectAdministrator.value || isProjectManager.value) {
    return [
      { prop: 'task', label: 'Task', width: '140%' },
      { prop: 'rewards', label: 'Rewards', width: '60%' },
      { prop: 'direction', label: 'Direction', width: '60%' },
      { prop: 'start', label: 'Start', width: '60%' },
      {
        prop: 'deadline',
        label: 'Deadline',
        width: '60%',
      },
      { prop: 'priority', label: 'Priority', width: '30%' },
    ];
  } else {
    return [
      { prop: 'task', label: 'Task', width: '140%' },
      { prop: 'rewards', label: 'Rewards', width: '60%' },
      { prop: 'project', label: 'Project', width: '70%' },
      { prop: 'direction', label: 'Direction', width: '60%' },
      { prop: 'start', label: 'Start', width: '60%' },
      {
        prop: 'deadline',
        label: 'Deadline',
        width: '60%',
      },
      { prop: 'priority', label: 'Priority', width: '30%' },
    ];
  }
});

const getRewardsIcons = (reward) => {
  const icons = [];

  if (reward.rewards.some((item) => item.type === 'coins')) {
    icons.push(reward.coin_type.symbol);
  }

  if (reward.rewards.some((item) => item.type === 'discord_role')) {
    icons.push('discord');
  }

  if (reward.rewards.some((item) => item.type === 'credits')) {
    icons.push('credits');
  }

  return icons;
};

const totalPages = computed(() => tasksStore.getTasks.pagination.total_pages);

const allTasksData = computed(() => tasksStore.getTasks);
const allTasks = computed(() => tasksStore.getTasks.data);

let baseTasks = null;

const getProperty = (obj, prop) => {
  const props = prop.split('.');
  const regex = /\[(\d+)\]/;

  return props.reduce((prev, curr) => {
    const matches = regex.exec(curr);
    if (matches) {
      const index = parseInt(matches[1]);
      const arrProp = curr.slice(0, matches.index);
      return prev[arrProp][index];
    } else {
      return prev && prev[curr];
    }
  }, obj);
};

watch(allTasksData, (value) => {
  console.log('WATCH TASK', value);
  if (value) {
    baseTasks = JSON.parse(JSON.stringify(value));
  }
});

const sortTasks = (prop, direction) => {
  if (!isMounted) return;

  if (prop === 'task') {
    sortHandle('name', direction);
  }
  if (prop === 'project') {
    sortHandle('project', direction);
  }
  if (prop === 'direction') {
    sortHandle('direction', direction);
  }
  if (prop === 'start') {
    sortHandle('started_at', direction);
  }
  if (prop === 'deadline') {
    sortHandle('ended_at', direction);
  }
  if (prop === 'priority') {
    sortHandle('priority', direction);
  }
  if (prop === 'rewards') {
    sortHandle('rewards', direction);
  }
};

const tasksRows = computed(
  () => {
    const tasksArray = allTasks.value;
    if (!tasksArray || (tasksArray && !tasksArray.length)) {
      return [];
    }
    return tasksArray.map((item) => {
      return {
        to: `/tasks/task/${item.id}`,
        task: {
          content: item.name,
        },
        rewards: {
          component: Tokens,
          props: {
            currencies: getRewardsIcons(item),
            isCoefficient: item.level_coefficient,
          },
        },
        project: {
          component: Talent,
          props: {
            text: item.project ? item.project.name : '',
            img: item.project && item.project.logo ? item.project.logo : defaultBg,
            square: true,
            reduceLength: 15,
          },
        },
        direction: {
          component: Badge,
          props: {
            text: item.activity ? item.activity.name : 'All',
            value: '',
            type: getBadgeTypeByName(item.activity ? item.activity.name : 'All'),
            big: false,
          },
        },
        start: {
          component: Badge,
          props: {
            text: formatDate(timestampToString(item.started_at)),
            value: '',
            type: 'transparent',
            big: false,
          },
        },
        deadline: {
          component: Badge,
          props: {
            text: formatDate(timestampToString(item.ended_at)),
            value: '',
            type: 'transparent',
            big: false,
            futureDate: timestampToString(item.ended_at),
          },
        },
        priority: {
          component: Priority,
          props: {
            dots: item.priority,
          },
        },
      };
    });
  },
  { dependsOn: [allTasks] },
);
</script>

<style lang="scss" scoped>
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
.toggles_wrapper {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.filters {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 28px;
  gap: 8px;
}
.custom-project-select {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 25px;
  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $section-title;
  }
}
.filter-select {
  width: 160px;
  height: 32px;
}
</style>
