<template>
  <div class="container">
    <div class="wrapper">
      <div class="toggles">
        <div class="toggles-item">
          <FilterToggle
            v-if="!isSuperAdmin && !isProjectManager && !isCatapultManager"
            :buttons="[
              {
                title: `Talentum`,
                id: 0,
                name: 'Talentum',
              },
              {
                title: `My Project`,
                id: 1,
                name: 'My Project',
              },
            ]"
            :id="id"
            @select="setTable($event)"
          />
          <div class="line" v-if="!isSuperAdmin && !isProjectManager && !isCatapultManager"></div>
          <FilterToggle
            :buttons="[
              {
                title: `All`,
                id: 0,
                name: 'All',
              },
              {
                title: `Social Influence`,
                id: 1,
                name: 'Social Influence',
              },
              {
                title: `Content Making`,
                id: 2,
                name: 'Content Making',
              },
              {
                title: `Copywriting`,
                id: 3,
                name: 'Copywriting',
              },
              {
                title: `Development`,
                id: 4,
                name: 'Development',
              },
              {
                title: `Design`,
                id: 5,
                name: 'Design',
              },
              {
                title: `Testing`,
                id: 6,
                name: 'Testing',
              },
            ]"
            :id="filterId"
            @select="addTags({ ...$event, type: 'activity_id' })"
          />
          <div class="filters">
            <MultiSelectFilter
              v-if="!status && (isSuperAdmin || isCatapultManager) && !project"
              :options="projects"
              name="Project"
              @select="addTags({ ...$event, type: 'project_id' })"
              :reset="reset"
              :deleted="deletedId"
              :limit="1"
              :reduceLength="16"
              :leftAlign="false"
            ></MultiSelectFilter>
            <MultiSelectLevel
              v-if="id === 0"
              @selectLvl="addLevel"
              :reset="resetLvl"
              @reset="removeLevel"
              type="lvl"
              :leftAlign="false"
            ></MultiSelectLevel>
            <SelectWithSearch
              v-if="id === 1"
              :options="discordRoles"
              class="select"
              :reset="resetRole"
              :default="'Role'"
              :reduceLength="5"
              @input="addTags({ ...$event, type: 'discord_role' })"
              name="role"
              :leftAlign="false"
            ></SelectWithSearch>
          </div>
          <div v-if="showClearButton" class="clear" @click="clear">Clear All</div>
        </div>
      </div>
    </div>
  </div>

  <TableSkeleton v-if="!loaded" />
  <BaseTable
    v-else
    :columns="tasksColumns"
    :rows="leaderBoardRows"
    pointer
    title="No Data"
    icon="icons8-futurama-bender"
    :sortFunction="sortTasks"
    :sortDirection="sortDirection"
    :setSortDirection="setSortDirection"
    :setSortColumn="setSortColumn"
    :sortColumn="sortColumn"
    isSorting
  />
  <Pagination
    :currentPage="talents.pagination.current_page"
    @pageChanged="nextPage($event)"
    v-if="loaded && leaderBoardRows && leaderBoardRows.length"
    :totalPages="talents.pagination.total_pages"
  />
  <div v-else style="margin-bottom: 40px"></div>
</template>

<script setup>
import Talent from '@/components/Talent.vue';
import Level from '@/components/Level/Level.vue';
import Rank from '@/components/Leaderboard/Rank.vue';
import defaultBg from '@/assets/images/default-avatar.png';
import { useProjectsStore } from '~/store/projects';
import { useDashboardStore } from '~/store/dashboard';
import { ref, toRef, computed, onMounted, inject, nextTick } from 'vue';
import { useTalentsStore } from '~/store/talents';
import { useUserStore } from '~/store';
import { useRoute, useRouter } from 'vue-router';
import { useDiscordStore } from '~/store';
import MultiBadge from '~/components/InnerWallet/MultiBadge.vue';
import Badge from '@/components/Badge.vue';

const props = defineProps(['defaultProject']);
const emit = defineEmits(['pagData']);
const roles = inject('roles');
const { isSuperAdmin, isProjectOwner, isProjectManager, isCatapultManager } = roles;
const deletedId = ref();
const sort = ref();
const tags = ref([]);
const dashboardStore = useDashboardStore();
const projectsStore = useProjectsStore();
const talentsStore = useTalentsStore();
const discordStore = useDiscordStore();
const route = useRoute();
const router = useRouter();
const filterId = ref(0);

watch(tags.value, (newValue) => {
  sort.value = null;
  sortDirection.value = null;
  sortColumn.value = null;

  talentsStore.getLeaderBoardAction(1, setParrams(newValue), status.value);
});

const showClearButton = computed(() => {
  const filteredTags = tags.value.filter(
    ({ type }) => type !== 'activity_id' && type !== 'discord_role' && type !== 'lvl',
  );
  return filteredTags.length > 0;
});

const myStore = useUserStore();
const currentProject = ref(null);
const myProject = computed(() => myStore.getUserProjectId);

const setParrams = (data) => {
  const params = {};
  if (status.value) {
    params['project_id'] = myProject.value;
  }
  data.forEach((item) => {
    const { id, type, value } = item;

    if (type === 'project_id' && !status.value) {
      params['project_id'] = id;
      currentProject.value = id;
    }
    if (type === 'lvl') {
      params['levels'] = value;
    } else if (id) {
      params[`${type}`] = id;
    }
  });

  if (sort.value) {
    params['sort[key]'] = sort.value.sortKey;
    params['sort[type]'] = sort.value.sortType;
  }

  return params;
};

watch(
  sort,
  async () => {
    await router.push({ query: Object.assign({}, route.query, { page: 1 }) });
    await talentsStore.getLeaderBoardAction(1, setParrams(tags.value), status.value);
    await nextTick();
  },
  { deep: true },
);

const sortTasks = (prop, direction) => {
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
  sortDirection.value = value;
};
const setSortColumn = (value) => {
  sortColumn.value = value;
};
const removeLevel = () => {
  const index = tags.value.findIndex((el) => el.type === 'lvl');
  if (index !== -1) {
    tags.value.splice(index, 1);
    resetLvl.value = true;
  }
};
const addTags = (item) => {
  deletedId.value = '';
  if (item) {
    if (
      item.type === 'xp' ||
      item.type === 'task' ||
      item.type === 'activity_id' ||
      item.type === 'discord_role'
    ) {
      const index = tags.value.findIndex((el) => el.type === item.type);
      if (index !== -1) {
        tags.value.splice(index, 1);
        resetLvl.value = false;
      }
    }
    if (
      item.type === 'project_id' &&
      tags.value.filter((i) => i.type === 'project_id' && item.id !== i.id).length >= 1
    ) {
      const index = tags.value.findIndex((el) => el.type === item.type);
      if (index !== -1) {
        tags.value.splice(index, 1);
      }
    }

    if (item.type === 'activity_id') {
      filterId.value = item.id;
    }

    const newTags = [...tags.value, item];
    const groups = newTags.reduce((acc, item) => {
      const key = JSON.stringify(item);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const itemsToRemove = newTags.filter((item) => groups[JSON.stringify(item)] !== 1);

    itemsToRemove.forEach((itemToRemove) => {
      const indexToRemove = tags.value.findIndex(
        (item) => JSON.stringify(item) === JSON.stringify(itemToRemove),
      );
      if (indexToRemove !== -1) {
        tags.value.splice(indexToRemove, 1);
      }
    });

    if (!itemsToRemove.includes(item)) {
      tags.value.push(item);
    }
  }
};
const addLevel = async (item) => {
  const index = tags.value.findIndex((el) => el.type === 'lvl');
  if (index !== -1) {
    tags.value.splice(index, 1);
  }
  tags.value.push(item);
};
const reset = ref(false);
const resetLvl = ref(false);
const resetRole = ref(false);
const clear = async () => {
  reset.value = true;
  resetLvl.value = true;
  resetRole.value = true;
  filterId.value = 0;
  await nextTick();
  tags.value.splice(0, tags.value.length);
  reset.value = false;
  resetLvl.value = false;
  resetRole.value = false;
  sort.value = null;
  sortDirection.value = null;
  sortColumn.value = null;
};
onMounted(async () => {
  await projectsStore.getProjectsAction();

  if (myProject.value) {
    await discordStore.getDiscordRolesAction(myProject.value);
  }

  if (isProjectManager.value) {
    status.value = true;
  }
  if (route.query && route.query.page) {
    await nextPage(route.query.page);
  }
  if (project.value) {
    addTags({
      id: project.value.id,
      name: project.value.name,
      logo: project.value.logo,
      type: 'project_id',
    });
  } else if (route.query && route.query.status && !isSuperAdmin.value) {
    status.value = 1;
    id.value = 1;
    await talentsStore.getLeaderBoardAction(
      currentPage.value,
      status.value ? setParrams(tags.value) : '',
      status.value,
    );
  } else {
    await talentsStore.getLeaderBoardAction(
      currentPage.value,
      status.value ? setParrams(tags.value) : '',
      status.value,
    );
  }

  if (route.query && route.query.table) {
    await setTable({ id: +route.query.table });
  }

  if (route.query && route.query.type) {
    await addTags({ id: +route.query.type, type: 'activity_id' });
  }

  isMounted = true;

  if (route.query && route.query.page) {
    await nextPage(route.query.page);
  }
});
const talents = computed(() => talentsStore.getLeaderBoard);
const loaded = computed(() => talentsStore.getLeaderBoardLoaded);
const projects = computed(() =>
  projectsStore.getProjects.map((item) => ({
    id: item.id,
    name: item.name,
    logo: item.logo,
  })),
);
const discordRoles = computed(() => discordStore.getDiscordRoles);

const project = toRef(props, 'defaultProject');
const priority = ref('');
const direction = ref('');
let isMounted = false;
const currentPage = ref(route.query ? route.query.page : 1);
const nextPage = async (page) => {
  await talentsStore.getLeaderBoardAction(page, setParrams(tags.value), status.value);
  currentPage.value = page;
};
const id = ref(isProjectManager.value ? 1 : 0);

const tasksColumns = computed(() => {
  if (
    !isSuperAdmin.value &&
    !isProjectManager.value &&
    !isCatapultManager.value &&
    id.value === 0
  ) {
    if (!status.value) {
      return [
        { prop: 'rank', label: '#', width: '25%' },
        { prop: 'talent', label: 'Talent', width: '140%' },
        { prop: 'level', label: 'Level', width: '60%' },
        {
          prop: 'qp',
          label: 'QP',
          width: '60%',
        },

        { prop: 'completed_tasks', label: 'Completed Tasks', width: '50%' },
      ];
    } else {
      return [
        { prop: 'rank', label: '#', width: '25%' },
        { prop: 'talent', label: 'Talent', width: '280%' },
        {
          prop: 'qp',
          label: 'QP',
          width: '60%',
        },
        {
          prop: 'credits',
          label: 'Credits',
          width: '60%',
        },
        { prop: 'completed_tasks', label: 'Completed Tasks', width: '50%' },
      ];
    }
  } else {
    if (isSuperAdmin.value && filterId.value === 0) {
      if (!status.value) {
        return [
          { prop: 'rank', label: '#', width: '25%' },
          { prop: 'talent', label: 'Talent', width: '140%' },
          { prop: 'level', label: 'Level', width: '60%' },
          {
            prop: 'qp',
            label: 'QP',
            width: '60%',
          },
          { prop: 'completed_tasks', label: 'Completed Tasks', width: '50%' },
        ];
      } else {
        return [
          { prop: 'rank', label: '#', width: '25%' },
          { prop: 'talent', label: 'Talent', width: '280%' },
          {
            prop: 'qp',
            label: 'QP',
            width: '60%',
          },
          { prop: 'completed_tasks', label: 'Completed Tasks', width: '50%' },
        ];
      }
    } else {
      if (!status.value) {
        return [
          { prop: 'rank', label: '#', width: '25%' },
          { prop: 'talent', label: 'Talent', width: '140%' },
          { prop: 'level', label: 'Level', width: '60%' },
          {
            prop: 'qp',
            label: 'QP',
            width: '60%',
          },
          {
            prop: 'credits',
            label: 'Credits',
            width: '60%',
          },
          { prop: 'completed_tasks', label: 'Completed Tasks', width: '50%' },
        ];
      } else {
        return [
          { prop: 'rank', label: '#', width: '25%' },
          { prop: 'talent', label: 'Talent', width: '150%' },
          {
            prop: 'discord',
            label: 'Discord Role',
            width: '90%',
            cantSort: true,
          },
          {
            prop: 'qp',
            label: 'QP',
            width: '60%',
          },
          {
            prop: 'credits',
            label: 'Credits',
            width: '60%',
          },
          { prop: 'completed_tasks', label: 'Completed Tasks', width: '50%' },
        ];
      }
    }
  }
});

const status = ref(id.value !== 0);

const setTable = async (item) => {
  status.value = item.id !== 0;
  await clear();
  await talentsStore.getLeaderBoardAction(1, setParrams(tags.value), status.value);
  id.value = item.id;
  await router.push(
    route.query && route.query.type
      ? `leaderboard?tab=1&table=${item.id}&type=${route.query.type}`
      : `leaderboard?tab=1&table=${item.id}`,
  );
};

const leaderBoardRows = computed(
  () => {
    const tasksArray = talents.value.data;
    if (!tasksArray || (tasksArray && !tasksArray.length)) {
      return [];
    }
    return tasksArray.map((item) => {
      return {
        to: `/talent/${item.id}`,
        isTop: item.position <= 3,
        rank: {
          component: Rank,
          props: {
            value: item.position,
            isTop: item.position <= 3,
          },
        },
        credits: {
          content: item.credits ? item.credits : '0',
        },
        talent: {
          component: Talent,
          props: {
            text: item.name,
            big: true,
            img: item.avatar ? item.avatar : defaultBg,
            reduceLength: 15,
          },
        },
        discord: {
          component: MultiBadge,
          props: {
            badges:
              item.discord_roles &&
              item.discord_roles.length > 0 &&
              item.discord_roles.map((name) => ({
                component: Badge,
                props: {
                  text: name,
                  value: '',
                  type: 'info',
                },
                id: 2,
              })),
            type: 'info',
          },
        },
        level: {
          component: Level,
          props: {
            level: item.level,
            text: item.level,
          },
        },
        qp: {
          content: item.tasks_points,
        },
        completed_tasks: {
          content: item.tasks_done,
        },
      };
    });
  },
  { dependsOn: [talents] },
);

watch(
  () => filterId.value,
  (value) => {
    if (!isSuperAdmin.value && !isProjectManager.value && !isCatapultManager.value) {
      router.push(`leaderboard?tab=1&type=${value}&table=${id.value}`);
    } else {
      router.push(`leaderboard?tab=1&type=${value}`);
    }
  },
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
    background: $default-badge-border;
  }
  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    font-feature-settings: 'zero' on;
    color: $secondary;
  }
}
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toggles {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 8px;

  &-item {
    display: flex;
    flex-direction: row;
    gap: 8px;
  }
}

.filters {
  display: flex;
  align-items: center;
  gap: 8px;
}
.container {
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
.tags-block {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
  .title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 32px;
    margin-right: 12px;
    hanging-punctuation: first last;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on, 'ordn' on, 'ss04' on;
    color: $default;
  }
}

.clear {
  display: flex;
  align-items: center;
  width: fit-content;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  font-feature-settings: 'zero' on;
  color: $secondary;
  &:hover {
    cursor: pointer;
  }
}

.tag {
  display: flex;
  align-items: center;
  background: $default-badge-border;
  border-radius: 8px;
  cursor: pointer;
  padding: 4px 8px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  font-feature-settings: 'zero' on;
  color: $default;
  &:hover {
    cursor: pointer;
    background: $colabs-bg;
    color: $white;
    box-shadow: 0px 2px 8px rgba(56, 64, 91, 0.16);
  }
}

.remove-tag {
  margin-left: 10px;
  cursor: pointer;
}

.controller-talents {
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  max-width: 100vw;
  width: 100%;
  z-index: 999999;
  left: 0;
  height: 72px;
  padding: 16px 40px;
  align-items: center;
  gap: 16px;
  border-top: 1px solid $default-border;
  background: $white;
  box-shadow: 0px 4px 16px 0px rgba(56, 64, 91, 0.24);
  .counts {
    color: $section-title;
    font-size: 16px;
    font-family: 'Basis Grotesque Pro';
    line-height: 24px;
  }
  .controllers {
    display: flex;
    align-items: center;
    gap: 12px;
    .remove {
      color: $red;
      font-size: 16px;
      font-family: 'Basis Grotesque Pro';
      font-weight: 500;
      line-height: 24px;
    }
    .invite {
      display: flex;
      height: 40px;
      padding: 7px 12px;
      justify-content: center;
      align-items: center;
      gap: 8px;
      border-radius: 8px;
      background: $orange;
      color: $white;
      font-size: 16px;
      font-family: 'Basis Grotesque Pro';
      font-weight: 500;
      line-height: 24px;
      &:hover {
        cursor: pointer;
        background: $orange-active;
      }
    }
  }
}

.line {
  align-self: stretch;
  height: 32px;
  border: 0.25px solid $default-border;
}
</style>
