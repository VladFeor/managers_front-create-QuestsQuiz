<template>
  <div :class="`tasks-container ${fullWidth && 'fullWidth'}`">
    <div class="tasks-body flex flex-col">
      <div class="filters">
        <div class="toggles_wrapper">
          <div class="flex items-center gap-x-3" v-if="isSuperAdmin">
            <MultiSelectFilter
              :options="rolesList"
              name="Role"
              @select="setRole"
              :reset="reset"
              :limit="1"
            ></MultiSelectFilter>
            <Checkbox label="Talentum Manager" @check="setIsTM" :reset="reset"></Checkbox>
          </div>
          <base-button class="ml-auto" text="Invite Manager" @click="inviteManager" />
        </div>
      </div>
      <TableSkeleton v-if="!loaded" />
      <BaseTable
        v-else
        :columns="talentumTeamCols"
        :rows="talentumTeam"
        pointer
        title="You don't have managers in your team yet"
        icon="icons8-futurama-bender"
      />
      <Pagination
        v-if="talentumTeam && talentumTeam.length && loaded"
        :currentPage="allManagersInProject.pagination.current_page"
        :totalPages="allManagersInProject.pagination.total_pages"
        @pageChanged="nextPage($event)"
      />
      <InviteToProjectNewManager
        :default-project="project"
        v-if="showInvite && isSuperAdmin"
        @close="showInvite = false"
      />
      <InviteNewManagerInProject
        :project="project"
        v-if="showInvite && !isSuperAdmin"
        @close="showInvite = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, computed, nextTick } from 'vue';
import { useManagersStore, useProjectsStore, useUserStore, useAssetsStore } from '~/store';
import SelfTalent from '~/components/Managers/SelfTalent.vue';
import StatusManager from '~/components/Managers/StatusManager.vue';
import RoleStatus from '~/components/Managers/RoleStatus.vue';
import Badge from '@/components/Badge.vue';
import defaultBg from '@/assets/images/default-avatar.png';
const asset = useAssetsStore();
import { formatDateCurrent } from '@/util/helpers';
const loaded = computed(() => managerStore.getLoadingTable);
const rolesList = computed(() => asset.getRoles);
onMounted(() => {
  projectsStore.getProjectsAction();
  asset.getRolesAction();
});
const managerStore = useManagersStore();
const props = defineProps({
  project: {
    type: Object,
    default: null,
  },
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
const showInvite = ref(false);
const { isProjectManager, isSuperAdmin, isProjectAdministrator, isCatapultManager } = roles;
const projects = computed(() =>
  projectsStore.getProjects.map((item) => ({
    id: item.id,
    name: item.name,
    logo: item.logo,
  })),
);

const page = ref(1);
const id = ref(isSuperAdmin.value ? 0 : 2);
const search = ref('');
const prop = ref();
const role_id = ref(null);
const isTM = ref(false);
const setRole = (value) => {
  role_id.value = value.id;
};
const setIsTM = (value) => {
  isTM.value = value;
};

watch(role_id, (newValue) => {
  managerStore.getAllManagersInProjectAction(
    props.project.id,
    page.value,
    newValue,
    isTM.value.value,
  );
});

watch(isTM, (newValue) => {
  managerStore.getAllManagersInProjectAction(
    props.project.id,
    page.value,
    role_id.value,
    newValue.value,
  );
});

watch(
  props.project,
  (newValue) => {
    managerStore.getAllManagersInProjectAction(newValue.id, page.value);
  },
  { deep: true, immediate: true },
);

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
  managerStore.getAllManagersInProjectAction(props.project.id, page);
};
const allManagersInProject = computed(() => managerStore.getAllManagerInProject);
const talentumTeamCols = computed(() => {
  return [
    { prop: 'talent', label: 'Manager', width: '110%' },
    { prop: 'role', label: 'Role', width: '100%' },
    { prop: 'reviewed', label: 'Reviewed', width: '80%' },
    { prop: 'overdue', label: 'Overdue', width: '60%' },
    { prop: 'on_revision_tasks', label: 'On Revision', width: '40%' },
    { prop: 'status', label: '', width: '30%' },
  ];
});
const myID = computed(() => myStore.getUser.id);
const talentumTeam = computed(() => {
  let managers;
  managers = allManagersInProject.value.data;
  console.log('talentumTeam managers', managers);

  if (!managers || (managers && !managers.length)) {
    return [];
  }
  return managers.map((item) => {
    return {
      talent: {
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
      role: {
        component: RoleStatus,
        props: {
          role: item.role ? item.role.name : '',
          isTM: item.talentum_manager,
          status: item.invitation_status,
        },
      },
      reviewed: {
        content: item.reviewed_tasks,
      },
      overdue: {
        content: item.overdue_tasks,
      },
      on_revision_tasks: {
        content: item.on_revision_tasks,
      },
      projects: {
        content: item.projects_count,
      },
      status: {
        component: StatusManager,
        props: {
          talent: item,
          status: item.invitation_status,
          isActionRole: isSuperAdmin,
          project_id: props.project.id,
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
  flex-direction: column;
  width: 100%;
  margin-top: 28px;
  margin-bottom: 150px;
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
