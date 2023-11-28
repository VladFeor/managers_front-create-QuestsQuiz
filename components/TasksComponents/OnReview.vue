<template>
  <div class="filters">
    <div class="toggles_wrapper">
      <FilterToggle
        :buttons="[
          {
            title: `Pending ${
              dashboard && dashboard.on_review?.to_approve ? dashboard.on_review.to_approve : 0
            }`,
            id: 0,
            name: 'Pending',
          },
          {
            title: `On Revision ${
              dashboard && dashboard.on_review?.on_revision ? dashboard.on_review.on_revision : 0
            }`,
            id: 1,
            name: 'On Revision',
          },
          {
            title: `Completed ${
              dashboard && dashboard.on_review?.approved ? dashboard.on_review.approved : 0
            }`,
            id: 2,
            name: 'Completed',
          },
          {
            title: `Overdue ${
              dashboard && dashboard.on_review?.overdue ? dashboard.on_review.overdue : 0
            }`,
            id: 3,
            name: 'Overdue',
          },
        ]"
        :id="id"
        @select="setIsShowEvents($event)"
        review
      />
      <TasksSelect
        v-if="
          (!isProjectOwner && !isProjectAdministrator && !isProjectManager) ||
          (isCatapultManager && isProjectAdministrator) ||
          (isCatapultManager && isProjectManager)
        "
        filter
        :options="projects"
        class="filter-select"
        @input="filtersHandler($event)"
        type="project"
        :setIsFilterActive="setIsProjectsFilterActive"
        :reduceLength="14"
      />
    </div>

    <ExportSelect
      title="Export"
      :options="exportOptions"
      :handleOpenSubMenu="handleOpenSubMenu"
      :exportFunction="exportTasksAction"
    />
    <!-- <div class="custom-project-select">
      <span>Project</span>
      <TasksSelect
        filter
        :options="projects"
        class="filter-select"
        @input="filtersHandler($event)"
        type="project"
        :setIsFilterActive="setIsProjectsFilterActive"
        :reduceLength="14"
      />
    </div> -->
  </div>
  <TableSkeleton v-if="reviewsLoading || !isReviewsLoaded" />
  <BaseTable
    v-else
    :columns="tasksColumns"
    :rows="tasksRows"
    pointer
    title="You have no reviews yet"
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
    v-if="!reviewsLoading && isReviewsLoaded && tasksRows && tasksRows.length"
    :totalPages="totalPages"
  />
</template>

<script setup>
import Badge from '@/components/Badge.vue';
import Priority from '@/components/Priority/Priority.vue';
import Talent from '@/components/Talent.vue';
import Amount from '@/components/Amount.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseLineChart from '@/components/BaseLineChart';
import defaultBg from '@/assets/images/default-avatar.png';
import { useProjectsStore } from '~/store/projects';
import { useRouter, useRoute } from 'vue-router';

import {
  formatFutureDate,
  formatPastDate,
  formatDate,
  getBadgeTypeByName,
  formatNumber,
  timestampToString,
  formatNumberMore10K,
  formatNumberAddComma,
} from '@/util/helpers';
import { useTasksStore } from '~/store/tasks';

import { ref, computed, onMounted, inject, onBeforeUpdate, watch } from 'vue';
import { useDashboardStore } from '~/store/dashboard';

const dashboardStore = useDashboardStore();
const projectsStore = useProjectsStore();
const roles = inject('roles');
const overviewStatus = inject('overviewStatus');
const router = useRouter();
const route = useRoute();

onMounted(() => {
  projectsStore.getProjectsAction();
  isMounted = true;
  if (route.query && route.query.page) {
    currentPage.value = route.query.page;
  }
  if (overviewStatus && overviewStatus.value) {
    id.value = getIdByOverviewStatus(overviewStatus.value);
    status.value = overviewStatus.value;
  } else {
    router.push({ query: { status: status.value } });
  }

  tasksStore.getReviewsAction({ status: status.value });
});

const {
  isProjectOwner,
  isSuperAdmin,
  isProjectAdministrator,
  isProjectManager,
  isCatapultManager,
} = roles;

let isMounted = false;

const dashboard = computed(() => dashboardStore.getDashboard);

const reviewStatus = (status) => {
  switch (status) {
    case 'Pending':
      return 'waiting_for_review';
    case 'On Revision':
      return 'on_revision';
    case 'Completed':
      return 'done';
    case 'Overdue':
      return 'overdue_by_manager';
    default:
      return 'waiting_for_review';
  }
};

const getIdByOverviewStatus = (status) => {
  let id;
  switch (status) {
    case 'done':
      id = 2;
      break;
    case 'on_revision':
      id = 1;
      break;
    case 'overdue_by_manager':
      id = 3;
      break;
    default:
      id = 0;
  }
  return id;
};

const id = ref(0);
const status = ref('waiting_for_review');
const currentPage = ref(route.query ? route.query.page : 1);
const project = ref(null);
const sortDirection = ref('');
const sortColumn = ref('');

function nextPage(page) {
  currentPage.value = page;
  const params = {
    status: status.value,
    page,
  };

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

    if (sortColumn.value === 'manager') {
      sortName = 'manager';
    }
    if (sortColumn.value === 'talent') {
      sortName = 'talent';
    }

    if (sortColumn.value === 'deadline') {
      sortName = 'deadline_in';
    }
    if (sortColumn.value === 'deadline_in') {
      sortName = 'deadline_in';
    }
    if (sortColumn.value === 'deadline2') {
      sortName = 'deadline_in';
    }
    if (sortColumn.value === 'completed') {
      sortName = 'completed';
    }

    params.sortKey = sortName;
    params.sortType = sortDirection.value;
  }
  tasksStore.getReviewsAction(params);
}

const isProjectsFilterActive = ref(false);

const setIsProjectsFilterActive = (value) => {
  isProjectsFilterActive.value = value;
};

const filtersHandler = (data) => {
  if (!isMounted || isProjectsFilterActive.value) return;

  project.value = data.id;

  const params = {
    status: status.value,
    page: currentPage.value,
  };

  if (data.id) {
    params.project_id = data.id;
  }

  tasksStore.getReviewsAction(params);
};

const exportOptions = reactive([
  {
    name: 'Export as XLSX',
    list: [
      { title: 'Export All', table: '', type: 'csv', redirect_url: 'tasks' },
      { title: 'Pending', table: 'pending', type: 'csv', redirect_url: 'tasks' },
      { title: 'On Revision', table: 'on_revision', type: 'csv', redirect_url: 'tasks' },
      { title: 'Completed', table: 'completed', type: 'csv', redirect_url: 'tasks' },
      { title: 'Overdue', table: 'overdue', type: 'csv', redirect_url: 'tasks' },
    ],
    isSubMenuVisible: false,
  },
  {
    name: 'Export as PDF',
    list: [
      { title: 'Export All', table: '', type: 'pdf', redirect_url: 'tasks' },
      { title: 'Pending', table: 'pending', type: 'pdf', redirect_url: 'tasks' },
      { title: 'On Revision', table: 'on_revision', type: 'pdf', redirect_url: 'tasks' },
      { title: 'Completed', table: 'completed', type: 'pdf', redirect_url: 'tasks' },
      { title: 'Overdue', table: 'overdue', type: 'pdf', redirect_url: 'tasks' },
    ],
    isSubMenuVisible: false,
  },
  {
    name: 'Export to Google Sheet',
    list: [
      { title: 'All', table: '', type: 'google_sheet', redirect_url: 'tasks' },
      { title: 'Pending', table: 'pending', type: 'google_sheet', redirect_url: 'tasks' },
      { title: 'On Revision', table: 'on_revision', type: 'google_sheet', redirect_url: 'tasks' },
      { title: 'Completed', table: 'completed', type: 'google_sheet', redirect_url: 'tasks' },
      { title: 'Overdue', table: 'overdue', type: 'google_sheet', redirect_url: 'tasks' },
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
    return await tasksStore.getUserTaskExportDataAction(type, table);
  }

  await tasksStore.getUserTaskGoogleExportDataAction(type, table);
};

function setIsShowEvents(event) {
  id.value = event.id;
  status.value = reviewStatus(event.status);
  router.push({ query: { status: status.value } });
  currentPage.value = 1;

  const params = {
    status: reviewStatus(event.status),
    page: 1,
  };

  if (project.value) {
    params.project_id = project.value;
  }
  tasksStore.getReviewsAction(params);
}

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

  const projectsIds = projectsArray.map((item) => {
    return {
      id: item.id,
      name: item.name,
    };
  });

  const projectsOptions = [
    {
      name: 'All Projects',
      id: '',
    },
  ].concat(projectsIds);
  return projectsOptions;
});
const tasksStore = useTasksStore();
const reviewsLoading = computed(() => tasksStore.getReviewsLoading);
const isReviewsLoaded = computed(() => tasksStore.getReviewsLoaded);
const tasksColumns = computed(() => {
  if (id.value === 0) {
    if (isProjectOwner.value) {
      return [
        { prop: 'task', label: 'Task', width: '150%' },
        { prop: 'talent', label: 'Talent', width: '70%' },
        { prop: 'direction', label: 'Direction', width: '50%' },
        {
          prop: 'deadline',
          label: 'Deadline in',
          width: '50%',
        },
        { prop: 'priority', label: 'Priority', width: '30%' },
      ];
    } else {
      return [
        { prop: 'task', label: 'Task', width: '150%' },
        { prop: 'project', label: 'Project', width: '110%' },
        { prop: 'talent', label: 'Talent', width: '70%' },
        { prop: 'direction', label: 'Direction', width: '50%' },
        {
          prop: 'deadline',
          label: 'Deadline in',
          width: '50%',
        },
        { prop: 'priority', label: 'Priority', width: '30%' },
      ];
    }
  } else if (id.value === 2) {
    if (isSuperAdmin.value) {
      return [
        { prop: 'task', label: 'Task', width: '150%' },
        { prop: 'project', label: 'Project', width: '110%' },
        { prop: 'manager', label: 'Manager', width: '70%' },
        { prop: 'talent', label: 'Talent', width: '70%' },
        { prop: 'direction', label: 'Direction', width: '50%' },
        {
          prop: 'completed',
          label: 'Completed',
          width: '50%',
        },
      ];
    } else if (isProjectOwner.value) {
      return [
        { prop: 'task', label: 'Task', width: '150%' },
        { prop: 'manager', label: 'Manager', width: '70%' },
        { prop: 'talent', label: 'Talent', width: '70%' },
        { prop: 'direction', label: 'Direction', width: '50%' },
        {
          prop: 'completed',
          label: 'Completed',
          width: '50%',
        },
      ];
    } else {
      return [
        { prop: 'task', label: 'Task', width: '150%' },
        { prop: 'project', label: 'Project', width: '110%' },
        { prop: 'talent', label: 'Talent', width: '70%' },
        { prop: 'direction', label: 'Direction', width: '50%' },
        {
          prop: 'completed',
          label: 'Completed',
          width: '50%',
        },
      ];
    }
  } else if (id.value === 3) {
    if (isSuperAdmin.value) {
      return [
        { prop: 'task', label: 'Task', width: '150%' },
        { prop: 'project', label: 'Project', width: '110%' },
        { prop: 'manager', label: 'Manager', width: '70%' },
        { prop: 'talent', label: 'Talent', width: '70%' },
        { prop: 'direction', label: 'Direction', width: '50%' },
        {
          prop: 'deadline2',
          label: 'Deadline',
          width: '50%',
        },
        { prop: 'badge', label: '', width: '10%' },
      ];
    } else if (isProjectOwner.value) {
      return [
        { prop: 'task', label: 'Task', width: '150%' },
        { prop: 'manager', label: 'Manager', width: '70%' },
        { prop: 'talent', label: 'Talent', width: '70%' },
        { prop: 'direction', label: 'Direction', width: '50%' },
        {
          prop: 'deadline2',
          label: 'Deadline',
          width: '50%',
        },
        { prop: 'badge', label: '', width: '10%' },
      ];
    } else {
      return [
        { prop: 'task', label: 'Task', width: '150%' },
        { prop: 'project', label: 'Project', width: '110%' },
        { prop: 'talent', label: 'Talent', width: '70%' },
        { prop: 'direction', label: 'Direction', width: '50%' },
        {
          prop: 'deadline2',
          label: 'Deadline',
          width: '50%',
        },
        { prop: 'badge', label: '', width: '10%' },
      ];
    }
  } else {
    if (isSuperAdmin.value) {
      return [
        { prop: 'task', label: 'Task', width: '90%' },
        { prop: 'project', label: 'Project', width: '80%' },
        { prop: 'manager', label: 'Manager', width: '80%' },
        { prop: 'talent', label: 'Talent', width: '70%' },
        { prop: 'direction', label: 'Direction', width: '80%' },
        {
          prop: 'deadline',
          label: 'Deadline in',
          width: '50%',
        },
        { prop: 'priority', label: 'Priority', width: '30%' },
      ];
    } else if (isProjectOwner.value) {
      return [
        { prop: 'task', label: 'Task', width: '150%' },
        { prop: 'manager', label: 'Manager', width: '70%' },
        { prop: 'talent', label: 'Talent', width: '70%' },
        { prop: 'direction', label: 'Direction', width: '50%' },
        {
          prop: 'deadline',
          label: 'Deadline in',
          width: '50%',
        },
        { prop: 'priority', label: 'Priority', width: '30%' },
      ];
    } else {
      return [
        { prop: 'task', label: 'Task', width: '130%' },
        { prop: 'project', label: 'Project', width: '110%' },
        { prop: 'talent', label: 'Talent', width: '70%' },
        { prop: 'direction', label: 'Direction', width: '50%' },
        {
          prop: 'deadline',
          label: 'Deadline in',
          width: '50%',
        },
        { prop: 'priority', label: 'Priority', width: '30%' },
      ];
    }
  }
});
const totalPages = computed(() => tasksStore.getReviews.pagination.total_pages);

const allTasksData = computed(() => tasksStore.getReviews);
const allTasks = computed(() => tasksStore.getReviews.data);

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

const sortFunc = (prop, direction) => {
  if (direction === 'none') {
    tasksStore.setReviews(baseTasks);
    return;
  }
  allTasks.value.sort((a, b) => {
    const valA = getProperty(a, prop);
    const valB = getProperty(b, prop);
    const nameA =
      typeof valA === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(valA)
        ? new Date(valA)
        : valA;
    const nameB =
      typeof valB === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(valB)
        ? new Date(valB)
        : valB;
    if (nameA == null && nameB == null) {
      return 0;
    }
    if (nameA == null) {
      return direction === 'asc' ? -1 : 1;
    }
    if (nameB == null) {
      return direction === 'asc' ? 1 : -1;
    }
    if (nameA < nameB) {
      return direction === 'asc' ? -1 : 1;
    }
    if (nameA > nameB) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

watch(allTasksData, (value) => {
  if (value) {
    baseTasks = JSON.parse(JSON.stringify(value));
  }
});

const setSortDirection = (value) => {
  sortDirection.value = value;
};
const setSortColumn = (value) => {
  sortColumn.value = value;
};

const sortHandle = (name, type) => {
  const params = {
    status: status.value,
    page: currentPage.value,
  };

  if (project.value) {
    params.project_id = project.value;
  }
  if (type) {
    params.sortKey = name;
    params.sortType = type;
  }

  tasksStore.getReviewsAction(params);
};

const sortTasks = (prop, direction) => {
  if (!isMounted) return;

  if (prop === 'task') {
    sortHandle('name', direction);
  }
  if (prop === 'project') {
    sortHandle('project', direction);
  }
  if (prop === 'manager') {
    sortHandle('manager', direction);
  }
  if (prop === 'talent') {
    sortHandle('talent', direction);
  }
  if (prop === 'direction') {
    sortHandle('direction', direction);
  }
  if (prop === 'deadline') {
    sortHandle('deadline_in', direction);
  }
  if (prop === 'deadline_in') {
    sortHandle('deadline_in', direction);
  }
  if (prop === 'deadline2') {
    sortHandle('deadline_in', direction);
  }
  if (prop === 'priority') {
    sortHandle('priority', direction);
  }
  if (prop === 'completed') {
    sortHandle('completed', direction);
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
        to: `tasks/review-task/${item.id}`,
        task: {
          content: item.task.name,
        },
        project: {
          component: Talent,
          props: {
            text: item.task.project ? item.task.project.name : '',
            img: item.task.project && item.task.project.logo ? item.task.project.logo : defaultBg,
            square: true,
            reduceLength: 15,
          },
        },
        manager: {
          content: item.manager && item.manager.name ? item.manager.name : '',
          reduceLength: 14,
        },
        talent: {
          component: Talent,
          props: {
            text: item.user ? item.user.name : '',
            img: item.user && item.user.avatar ? item.user.avatar : defaultBg,
          },
        },
        direction: {
          component: Badge,
          props: {
            text: item.task.activity ? item.task.activity.name : 'All',
            value: '',
            type: getBadgeTypeByName(item.task.activity ? item.task.activity.name : 'All'),
            big: false,
          },
        },
        deadline: {
          component: Badge,
          props: {
            text: formatFutureDate(timestampToString(item.task.ended_at)),
            value: '',
            type: 'transparent',
            big: false,
            futureDate: timestampToString(item.task.ended_at),
          },
          time: formatNumber(timestampToString(item.task.ended_at)),
          adjustReturnBtn: item.returned_at ? true : false,
        },
        deadline2: {
          component: Badge,
          props: {
            text: formatDate(timestampToString(item.task.ended_at)),
            value: '',
            type: 'transparent',
            big: false,
            futureDate: timestampToString(item.task.ended_at),
          },
          time: formatNumber(timestampToString(item.task.ended_at)),
          adjustReturnBtn: item.returned ? item.returned : false,
        },
        completed: {
          component: Badge,
          props: {
            text: formatDate(timestampToString(item.completed_at)),
            value: '',
            type: 'transparent',
            big: false,
          },
        },
        priority: {
          component: Priority,
          props: {
            dots: item.task.priority,
          },
        },
        badge: {
          component: Badge,
          props: {
            text: item.status === 'overdue_by_manager' ? 'm' : 't',
            value: '',
            type: 'task',
            big: false,
          },
        },
      };
    });
  },
  { dependsOn: [allTasks] },
);
</script>

<style lang="scss" scoped>
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
