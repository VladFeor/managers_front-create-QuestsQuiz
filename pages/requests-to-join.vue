<template>
  <div class="tasks-container fullWidth">
    <div class="tasks-header">
      <PageToggle :buttons="[{ title: 'Referrals', id: 0 }]" :id="0" />
    </div>
    <div class="tasks-body flex flex-col">
      <div class="filters">
        <div class="toggles_wrapper">
          <div class="flex items-center gap-x-3" v-if="isSuperAdmin">
            <MultiSelectFilter
              :options="projects"
              name="Project"
              @select="addTag({ ...$event, type: 'project_id' })"
              :reset="reset"
              :limit="1"
            ></MultiSelectFilter>
          </div>
        </div>
      </div>
      <TableSkeleton v-if="!loaded" />

      <BaseTable
        v-else
        :columns="allCols"
        :rows="all"
        pointer
        title="No refferal tasks yet"
        icon="icons8-futurama-bender"
        @prev="prevItem"
        @next="nextItem"
        @current="setCurrent"
        :sortFunction="sortTasks"
        :sortDirection="sortDirection"
        :setSortDirection="setSortDirection"
        :setSortColumn="setSortColumn"
        :sortColumn="sortColumn"
        isSorting
      />
      <Pagination
        v-if="all && all.length && loaded"
        :currentPage="referralsData.pagination.current_page"
        :totalPages="referralsData.pagination.total_pages"
        @pageChanged="nextPage($event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, computed } from 'vue';
import { useReferralsStore, useProjectsStore, useUserStore } from '~/store';
import { formatDateCurrent, timestampToString } from '~/util/helpers';
import Badge from '@/components/Badge.vue';
import Status from '@/components/TasksComponents/Status.vue';
import Talent from '~/components/Talent.vue';
import Preview from '~/components/Referrals/Preview.vue';
import defaultBg from '@/assets/images/default-avatar.png';
let isMounted = false;
const route = useRoute();

onMounted(async () => {
  if (route.query && route.query.page) {
    await nextPage(route.query.page);
  } else {
    await referrals.getReferralsAction();
  }
  await projectsStore.getProjectsAction();

  isMounted = true;
});
const referrals = useReferralsStore();
const roles = inject('roles');
const reset = ref(false);
const projectsStore = useProjectsStore();
const myStore = useUserStore();
const projectId = computed(() => myStore.getUserProjectId);

const { isSuperAdmin } = roles;
const projects = computed(() => {
  const listOfProjects = projectsStore.getProjects.map((item) => ({
    id: item.id,
    name: item.name,
  }));
  return listOfProjects;
});

const id = ref(isSuperAdmin.value ? 0 : 2);
const search = ref('');
const prop = ref();

const filters = ref([]);
const sort = ref();
watch(
  sort,
  (newValue) => {
    // if (newValue && newValue.sortKey && newValue.sortType) {
    referrals.getReferralsAction(generateUrlParams(filters.value));
    // }
  },
  { deep: true },
);

const sortTasks = (prop, direction) => {
  console.log('prop, direction sortTasks', prop, direction);
  if (!isMounted) return;
  sortHandle(prop, direction);
};
const sortDirection = ref('');
const sortColumn = ref('');
const sortHandle = (name, type) => {
  const params = {};
  if (type) {
    params.sortKey = name;
    params.sortType = type;
  }
  sort.value = params;
};

const setSortDirection = (value) => {
  console.log(value);
  sortDirection.value = value;
};
const setSortColumn = (value) => {
  sortColumn.value = value;
};
watch(filters.value, (newValue) => {
  sort.value = null;
  sortDirection.value = null;
  sortColumn.value = null;
  referrals.getReferralsAction(generateUrlParams(newValue));
});
const loaded = computed(() => referrals.getLoaded);

const nextPage = (page) => {
  referrals.getReferralsAction(generateUrlParams(filters.value), page);
};
const referralsData = computed(() => referrals.getReferrals);
function generateUrlParams(arr) {
  let urlParams = arr.map((obj) => {
    let key = obj.type;
    let value = obj.id || obj.value;
    if (key && value !== null) {
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    } else {
      return '';
    }
  });
  let params = '';

  if (search.value) {
    params += 'search=' + encodeURIComponent(search.value);
  }
  urlParams
    .filter((param) => param !== '')
    .forEach((param) => {
      if (params !== '') {
        params += '&';
      }
      params += param;
    });

  if (sort.value && sort.value.sortKey && sort.value.sortType) {
    if (params !== '') {
      params += '&';
    }
    params += `sort[key]=${encodeURIComponent(sort.value.sortKey)}`;
    params += `&sort[type]=${encodeURIComponent(sort.value.sortType)}`;
  }

  let result = params ? '?' + params : null;

  return result;
}

function addTag(item) {
  const index = filters.value.findIndex((el) => el.id === item.id);
  console.log(index);
  if (index !== -1) {
    filters.value.splice(index, 1);
  } else {
    filters.value.splice(0, 1);
    filters.value.push(item);
  }
}

const allCols = computed(() => {
  if (isSuperAdmin.value) {
    return [
      { prop: 'task', label: 'Task', width: '180%' },
      { prop: 'project', label: 'Project', width: '120%' },
      { prop: 'start', label: 'Start', width: '90%' },
      { prop: 'deadline', label: 'Deadline', width: '90%' },
      { prop: 'status', label: 'Status', width: '120%' },
      { prop: 'invites', label: 'Invites', width: '90%' },
      { prop: 'winners', label: 'Winners', width: '60%' },
      { prop: 'referrers', label: 'Referrers', width: '60%' },
      { prop: 'referred_talents', label: 'Referred Talents', width: '90%' },
      { prop: 'action', label: '', width: '40%' },
    ];
  } else {
    return [
      { prop: 'task', label: 'Task', width: '180%' },
      { prop: 'start', label: 'Start', width: '90%' },
      { prop: 'deadline', label: 'Deadline', width: '90%' },
      { prop: 'status', label: 'Status', width: '120%' },
      { prop: 'invites', label: 'Invites', width: '90%' },
      { prop: 'winners', label: 'Winners', width: '60%' },
      { prop: 'referrers', label: 'Referrers', width: '60%' },
      { prop: 'referred_talents', label: 'Referred Talents', width: '90%' },
      { prop: 'action', label: '', width: '40%' },
    ];
  }
});
const currentIndex = ref(0);

const currentItem = computed(() => referralsData.value?.data[currentIndex.value]);
const setCurrent = (index) => {
  currentIndex.value = index;
};
watch(currentIndex, (newIndex) => {
  currentItem.value = referralsData.value.data[newIndex];
});

const nextItem = () => {
  if (currentIndex.value < referralsData.value.data.length - 1) {
    currentIndex.value++;
  }
};

const prevItem = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};
const all = computed(() => {
  const referrals = referralsData.value.data;
  console.log(referralsData.value);
  if (!referrals || (referrals && !referrals.length)) {
    return [];
  }
  return referrals.map((item, index) => {
    return {
      task: {
        content: item.name,
        reduceLength: 28,
      },
      project: {
        component: Talent,
        props: {
          text: item.project.name,
          img: item.project.logo || defaultBg,
          reduceLength: 15,
          square: true,
        },
      },
      start: {
        component: Badge,
        props: {
          text: formatDateCurrent(timestampToString(item.started_at)),
        },
      },
      deadline: {
        component: Badge,
        props: {
          text: formatDateCurrent(timestampToString(item.ended_at)),
        },
      },
      status: {
        component: Status,
        props: {
          status: item.status,
        },
      },
      invites: {
        content: item.number_of_invites > 0 ? item.number_of_invites : 'unlimited',
      },
      winners: {
        content: item.number_of_winners > 0 ? item.number_of_winners : '-',
      },
      referrers: {
        content: item.ambassadors_count > 0 ? item.ambassadors_count : '-',
      },
      referred_talents: {
        content: item.referrals_count > 0 ? item.referrals_count : '-',
      },
      action: {
        component: Preview,
        props: {
          item: currentItem.value,
          index: index,
        },
      },
    };
  });
});
</script>

<style lang="scss" scoped>
.input-wrapper {
  position: relative;
  .search-icon {
    position: absolute;
    left: 8px;
    top: 7px;
  }
  input {
    width: 240px;
    height: 40px;
    background: #ffffff;
    border: 1px solid #dad9f7;
    border-radius: 8px;
    padding-left: 44px;
    outline: none;

    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $default;
  }
}
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
