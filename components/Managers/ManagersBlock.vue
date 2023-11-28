<template>
  <div :class="`tasks-container ${fullWidth && 'fullWidth'}`">
    <div class="tasks-header" v-if="!hideHeader">
      <PageToggle v-if="!hideTitle" :buttons="[{ title: 'Managers', id: 0 }]" :id="0" />
      <div class="tasks-modify flex items-center">
        <InputWithSearch
          v-if="isSuperAdmin && !hideFindManager"
          :placeholder="'Find Manager...'"
          :iconSize="24"
          v-model="search"
          :intervalFunc="searchInManager"
        />
        <base-button
          text="Invite Manager"
          @click="inviteManager"
          v-if="inviteManagerPosition === 'top' && !isProjectAdministrator"
        ></base-button>
      </div>
    </div>
    <div class="tasks-body flex flex-col">
      <div class="filters">
        <div class="toggles_wrapper">
          <FilterToggle
            v-if="isSuperAdmin && !hideTopFilter"
            :buttons="[
              {
                title: `All`,
                id: 0,
                name: 'All',
              },
            ]"
            :id="0"
            @select="selectTab"
          />
          <FilterToggle
            v-if="!isSuperAdmin && !hideMyTeamFilter"
            :buttons="[
              {
                title: `My Team`,
                id: 2,
                name: 'My Team',
              },
              {
                title: `Talentum Team`,
                id: 3,
                name: 'Talentum Team',
              },
            ]"
            :id="id - 2"
            @select="selectTab"
            class="min-w-[200px]"
          />
          <div class="line" v-if="isSuperAdmin && !hideLine"></div>
          <div class="flex items-center gap-x-3" v-if="isSuperAdmin">
            <MultiSelectFilter
              v-if="!hideProjectFilter"
              :options="projects"
              name="Project"
              @select="addTag({ ...$event, type: 'project_id' })"
              :reset="reset"
              :reduceLength="17"
              :limit="1"
            ></MultiSelectFilter>
            <MultiSelectFilter
              :options="rolesList"
              name="Role"
              @select="addTag({ ...$event, type: 'role_id' })"
              :reset="reset"
              :limit="1"
            ></MultiSelectFilter>
            <Checkbox
              label="Talentum Manager"
              @check="addTag({ ...$event, type: 'talentum_manager' })"
              :reset="reset"
            ></Checkbox>
            <Checkbox
              v-if="!hideWaitingForReply"
              label="Waiting for Reply"
              @check="addTag({ ...$event, type: 'waiting_for_reply' })"
              :reset="reset"
            ></Checkbox>

            <div
              class="clear-filtrers"
              @click="clear"
              v-if="!hideClearAll && generateUrlParams(filters)"
            >
              <span>Clear All </span>
            </div>
          </div>
          <base-button
            class="ml-auto"
            text="Invite Manager"
            @click="inviteManager"
            v-if="inviteManagerPosition === 'bottom'"
          />
        </div>
      </div>
      <TableSkeleton v-if="!loaded" />
      <BaseTable
        :columns="allCols"
        :rows="all"
        pointer
        title="You don't have managers in your team yet"
        icon="icons8-futurama-bender"
        isMultiComponents
        v-if="loaded && isSuperAdmin"
        :sortFunction="sortTasks"
        :sortDirection="sortDirection"
        :setSortDirection="setSortDirection"
        :setSortColumn="setSortColumn"
        :sortColumn="sortColumn"
        isSorting
      />
      <BaseTable
        v-else-if="!isSuperAdmin && loaded"
        :columns="talentumTeamCols"
        :rows="talentumTeam"
        pointer
        title="You don't have managers in your team yet"
        icon="icons8-futurama-bender"
        :sortFunction="sortTasks"
        :sortDirection="sortDirection"
        :setSortDirection="setSortDirection"
        :setSortColumn="setSortColumn"
        :sortColumn="sortColumn"
        isSorting
      />

      <Pagination
        v-if="id === 0 && all && all.length && allManagers && loaded"
        :currentPage="allManagers.pagination.current_page"
        :totalPages="allManagers.pagination.total_pages"
        @pageChanged="nextPage($event)"
      />
      <Pagination
        v-if="id === 2 && talentumTeam && talentumTeam.length && loaded"
        :currentPage="allManagersInProject.pagination.current_page"
        :totalPages="allManagersInProject.pagination.total_pages"
        @pageChanged="nextPage($event)"
      />
      <Pagination
        v-if="id === 3 && talentumTeam && talentumTeam.length && loaded"
        :currentPage="allManagersIntalentumTeam.pagination.current_page"
        :totalPages="allManagersIntalentumTeam.pagination.total_pages"
        @pageChanged="nextPage($event)"
      />
      <InviteToProjectNewManager v-if="showInvite && isSuperAdmin" @close="showInvite = false" />
      <InviteNewManagerInProject
        :project="projectInfo"
        v-if="showInvite && !isSuperAdmin"
        @close="showInvite = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, computed, nextTick, watch } from 'vue';
import { useManagersStore, useProjectsStore, useUserStore, useAssetsStore } from '~/store';
import Talent from '~/components/Talent.vue';
import RoleAndStatus from '~/components/Managers/RoleAndStatus.vue';
import SelfTalent from '~/components/Managers/SelfTalent.vue';
import TalentManagerInProject from '~/components/Managers/TalentManagerInProject.vue';
import StatusManager from '~/components/Managers/StatusManager.vue';
import RoleStatus from '~/components/Managers/RoleStatus.vue';
import Badge from '@/components/Badge.vue';
import defaultBg from '@/assets/images/default-avatar.png';
const asset = useAssetsStore();
import { formatDateCurrent } from '@/util/helpers';
import { useRoute, useRouter } from 'vue-router';
const loaded = computed(() => managerStore.getLoadingTable);
const projectInfo = computed(() => myStore.getUser.projects[0]);
const rolesList = computed(() => asset.getRoles);
let isMounted = false;
const sort = ref({});
const tab = ref(3);
onMounted(() => {
  projectsStore.getProjectsAction();
  asset.getRolesAction();
  isMounted = true;
  if (route.query && route.query.tab) {
    selectTab({ id: +route.query.tab });
  }
  if (route.query && route.query.page) {
    console.log(route.query.page);
    nextPage(+route.query.page);
  }
  if (id.value === 0) {
    managerStore.getAllManagersAction();
  } else if (id.value === 2) {
    managerStore.getAllManagersInProjectAction(projectId.value);
    selectTab({ id: 2 });
  } else if (id.value === 3) {
    managerStore.getAllManagersInTalentumTeamAction(projectId.value);
  }
});
const managerStore = useManagersStore();
const sortTasks = async (prop, direction) => {
  if (!isMounted) return;
  await router.push({ query: Object.assign({}, route.query, { page: 1 }) });
  await nextTick();
  currentPage.value = 1;
  if (prop === 'manager') {
    sortHandle('name', direction);
    return;
  }
  sortHandle(prop, direction);
};
const sortDirection = ref('');
const sortColumn = ref('');
const sortHandle = async (name, type) => {
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
const props = defineProps({
  fullWidth: {
    type: Boolean,
    default: false,
  },
  hideTopFilter: {
    type: Boolean,
    default: false,
  },
  hideProjectFilter: {
    type: Boolean,
    default: false,
  },
  hideWaitingForReply: {
    type: Boolean,
    default: false,
  },
  hideClearAll: {
    type: Boolean,
    default: false,
  },
  hideMyTeamFilter: {
    type: Boolean,
    default: false,
  },
  hideLine: {
    type: Boolean,
    default: false,
  },
  hideProjects: {
    type: Boolean,
    default: false,
  },
  hideTitle: {
    type: Boolean,
    default: false,
  },
  hideFindManager: {
    type: Boolean,
    default: false,
  },
  inviteManagerPosition: {
    type: String,
    default: 'top',
  },
  hideHeader: {
    type: Boolean,
    default: false,
  },
  managersForProject: {
    type: Boolean,
    default: false,
  },
});
const roles = inject('roles');
const reset = ref(false);
const projectsStore = useProjectsStore();
const myStore = useUserStore();
const projectId = computed(() => myStore.getUserProjectId);

const showInvite = ref(false);
const {
  isProjectManager,
  isProjectOwner,
  isSuperAdmin,
  isProjectAdministrator,
  isCatapultManager,
} = roles;
const projects = computed(() =>
  projectsStore.getProjects.map((item) => ({
    id: item.id,
    name: item.name,
    logo: item.logo,
  })),
);

const id = ref(isSuperAdmin.value ? 0 : 2);
const search = ref('');
const prop = ref();
const route = useRoute();
const router = useRouter();
const filters = ref([]);
function selectTab(e) {
  id.value = +e.id;
  clear();
  if (id.value === 0) {
    managerStore.getAllManagersAction();
  } else if (id.value === 2) {
    managerStore.getAllManagersInProjectAction(projectId.value);
  } else if (id.value === 3) {
    managerStore.getAllManagersInTalentumTeamAction(projectId.value);
  }
  router.push(`managers?tab=${id.value}`);
}
watch(filters.value, (newValue) => {
  sort.value = {};
  if (id.value === 0) {
    managerStore.getAllManagersAction(generateUrlParams(newValue));
  } else if (id.value === 2) {
    managerStore.getAllManagersInProjectAction(projectId.value);
  } else if (id.value === 3) {
    managerStore.getAllManagersInTalentumTeamAction(projectId.value);
  }
});
const renderComponent = ref(true);
const forceRender = async () => {
  renderComponent.value = false;
  await nextTick();
  renderComponent.value = true;
};
watch(
  () => route.query.tab,
  (value) => {
    if (value) {
      id.value = +value;
    }
  },
);
watch(
  sort,
  async (newValue) => {
    if (newValue.sortKey && newValue.sortType) {
      if (id.value === 0) {
        managerStore.getAllManagersAction(generateUrlParams(filters.value));
      } else if (id.value === 2) {
        managerStore.getAllManagersInProjectAction(
          projectId.value,
          1,
          null,
          null,
          generateUrlParams([]),
        );
      } else if (id.value === 3) {
        managerStore.getAllManagersInTalentumTeamAction(projectId.value, 1, generateUrlParams([]));
      }
    } else {
      if (id.value === 0) {
        managerStore.getAllManagersAction(generateUrlParams(filters.value), currentPage.value);
      } else if (id.value === 2) {
        managerStore.getAllManagersInProjectAction(
          projectId.value,
          currentPage.value,
          null,
          null,
          generateUrlParams([]),
        );
      } else if (id.value === 3) {
        managerStore.getAllManagersInTalentumTeamAction(
          projectId.value,
          currentPage.value,
          generateUrlParams([]),
        );
      }
    }
    await nextTick();
  },
  { deep: true },
);

const currentPage = ref(route.query ? route.query.page : 1);
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

  if (sort.value.sortKey && sort.value.sortType) {
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
  let index = filters.value.findIndex((el) => el.type === item.type && el.id !== item.id);
  if (index !== -1) {
    filters.value.splice(index, 1, item);
    return;
  }
  index = filters.value.findIndex((el) => el.type === item.type && el.id === item.id);
  if (index !== -1) {
    filters.value.splice(index, 1);
  } else {
    filters.value.push(item);
  }
}

function inviteManager() {
  showInvite.value = true;
}

const clear = async () => {
  reset.value = true;
  await nextTick();
  filters.value.splice(0, filters.value.length);
  reset.value = false;
};
const nextPage = (page) => {
  currentPage.value = page;
  if (id.value === 0) {
    managerStore.getAllManagersAction(generateUrlParams(filters.value), page);
  } else if (id.value === 2) {
    managerStore.getAllManagersInProjectAction(
      projectId.value,
      page,
      null,
      null,
      generateUrlParams([]),
    );
  } else if (id.value === 3) {
    managerStore.getAllManagersInTalentumTeamAction(projectId.value, page, generateUrlParams([]));
  }
};
const searchInterval = ref(0);
function searchInManager() {
  clearTimeout(searchInterval.value);
  searchInterval.value = setTimeout(() => {
    router.push({
      query: Object.assign({}, route.query, { page: 1 }),
    });
    managerStore.getAllManagersAction(generateUrlParams(filters.value));
  }, 500);
}
const allManagers = computed(() => managerStore.getAllManagers);
const allManagersInProject = computed(() => managerStore.getAllManagerInProject);
const allManagersIntalentumTeam = computed(() => managerStore.getAllManagerInTalentumTeam);
const projectWithTalent = (item) => {
  if (item.project_members.length) {
    return item.project_members.map((i, index) => {
      return {
        component: TalentManagerInProject,
        props: {
          status: index === 0 && item.talentum_manager,
          project: {
            img: i.project.logo || defaultBg,
            name: i.project.name || 'No Projects',
          },
        },
      };
    });
  } else {
    return [
      {
        component: TalentManagerInProject,
        props: {
          status: item.talentum_manager,
          project: {
            img: defaultBg,
            name: 'No Projects',
          },
        },
      },
    ];
  }
};
const rolesWithTalent = (item) => {
  if (item.project_members.length) {
    return item.project_members.map((i) => {
      return {
        component: RoleAndStatus,
        props: {
          role: i.role.name,
          status: i.invitation_status,
          talent: item,
          project: i.project,
          id: id.value,
          filter: generateUrlParams(filters.value),
        },
      };
    });
  } else {
    return [
      {
        component: RoleAndStatus,
        props: {
          role: item.talentum_manager ? 'Talentum Manager' : 'No role',
          talent: item,
          project: null,
          id: 0,
          filter: generateUrlParams(filters.value),
        },
      },
    ];
  }
};
const allCols = computed(() => {
  if (props.hideProjects) {
    return [
      { prop: 'manager', label: 'Manager', width: '150%' },
      { prop: 'roles', label: 'Roles', width: '100%' },
    ];
  } else {
    return [
      { prop: 'manager', label: 'Manager', width: '150%' },
      { prop: 'projects', label: 'Projects', width: '100%' },
      { prop: 'roles', label: 'Roles', width: '100%' },
    ];
  }
});
const all = computed(() => {
  const managers = allManagers.value.data;
  if (!managers || (managers && !managers.length)) {
    return [];
  }
  return managers.map((item) => {
    return {
      manager: {
        component: Talent,
        props: {
          text: item.name,
          img: item.avatar || defaultBg,
        },
      },
      projects: {
        components: projectWithTalent(item),
      },
      roles: {
        components: rolesWithTalent(item),
      },
    };
  });
});
const talentumTeamCols = computed(() => {
  if (id.value === 2) {
    return [
      { prop: 'name', label: 'Manager', width: '150%' },
      { prop: 'created_at', label: 'On Platform', width: '60%' },
      { prop: 'role', label: 'Role', width: '130%' },
      { prop: 'created_tasks', label: 'Created Tasks', width: '50%' },
      { prop: 'reviewed_tasks', label: 'Reviewed', width: '40%' },
      { prop: 'overdue_tasks', label: 'Overdue', width: '60%' },
      { prop: 'status', label: '', width: '40%' },
    ];
  } else {
    return [
      { prop: 'name', label: 'Manager', width: '150%' },
      { prop: 'created_at', label: 'On Platform', width: '80%' },
      { prop: 'created_tasks', label: 'Created Tasks', width: '50%' },
      { prop: 'reviewed_tasks', label: 'Reviewed', width: '40%' },
      { prop: 'overdue_tasks', label: 'Overdue', width: '60%' },
      { prop: 'projects_count', label: 'Projects', width: '50%' },
      { prop: 'status', label: '', width: '80%' },
    ];
  }
});
const myID = computed(() => myStore.getUser.id);
const talentumTeam = computed(() => {
  let managers;
  if (id.value === 2) {
    managers = allManagersInProject.value.data;
  } else {
    managers = allManagersIntalentumTeam.value.data;
  }
  if (!managers || (managers && !managers.length)) {
    return [];
  }
  return managers.map((item) => {
    return {
      name: {
        component: SelfTalent,
        props: {
          status: item.role && item.role.name === 'Project Owner',
          talent: {
            img: item.avatar || defaultBg,
            name: item.name,
          },
          isYou: item.id === myID.value,
        },
      },
      created_at: {
        component: Badge,
        props: {
          text: formatDateCurrent(item.registered_at),
        },
      },
      role: {
        component: RoleStatus,
        props: {
          role: item.role ? item.role.name : '',
          isTM: item.talentum_manager,
          status: item.invitation_status,
        },
      },
      created_tasks: {
        content: item.created_tasks,
      },
      reviewed_tasks: {
        content: item.reviewed_tasks,
      },
      overdue_tasks: {
        content: item.overdue_tasks,
      },
      projects_count: {
        content: item.projects_count,
      },
      status: {
        component: StatusManager,
        props: {
          talent: item,
          status: item.invitation_status,
          isActionRole: id.value === 2,
          role: item.role ? item.role.name : null,
        },
      },
    };
  });
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
  padding-bottom: 80px;

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
