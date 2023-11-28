<template>
  <div class="flex justify-between gap-x-4" style="min-width: 80px">
    <div
      class="tooltip-icon"
      v-if="!isActionRole && status === 'pending'"
      @mouseover="isHovered = true"
      @mouseout="isHovered = false"
    >
      <div class="tooltip-checkbox" v-if="isHovered">
        The manager is invited and waiting for his reply.
      </div>
      <Icon icon="Clock" :size="24"></Icon>
    </div>
    <div class="status" v-if="!isActionRole && status === 'revoked'">
      <Icon icon="Delete" class="icon"></Icon>Refused
    </div>
    <nuxt-link :to="`manager/${talent.id}`" class="selector" v-if="status !== 'invited'">
      <Icon class="icon" icon="View" :size="24"></Icon>
    </nuxt-link>
    <div class="invite" v-if="!isActionRole && !status" @click.prevent="inviteShow = true">
      Invite <Icon icon="Create"></Icon>
    </div>
    <div
      class="selector"
      ref="containerRoles"
      @click="toggleTooltipRoles"
      v-if="isActionRole && !isProjectAdministrator && !itsMe"
    >
      <Icon class="icon" icon="More" :size="24"></Icon>
    </div>
    <div v-if="showRoles" id="tooltip-confirmation-links">
      <div class="tooltip-arrow"></div>
      <div class="menu">
        <div class="link" v-for="role in roles" :key="role.id" @click="changeRoleCheck(role)">
          {{ role.name }}
        </div>
      </div>
    </div>
    <div
      class="selector"
      ref="container"
      @click="toggleTooltip"
      v-if="isActionRole && !itsMe && role !== 'Project Owner'"
    >
      <Icon class="icon" icon="Cancel" :size="24"></Icon>
    </div>
    <div v-if="show" id="tooltip-confirmation">
      <div class="tooltip-arrow"></div>
      <div class="menu">
        <div class="alert">You are going to revoke access to the project</div>
        <div class="w-full flex justify-around mt-2">
          <div class="link" @click="toggleTooltip">Cancel</div>
          <div class="revoke" @click="revokeAccess">Revoke</div>
        </div>
      </div>
    </div>
  </div>
  <InviteManagerInCurrentProject
    v-if="inviteShow"
    @close="inviteShow = false"
    @send="changeRoleCheck($event)"
    :project="projectInfo"
  ></InviteManagerInCurrentProject>

  <ProjectOwnerChange
    v-if="showPoChange"
    @changeRole="changeProjectOwner()"
    @close="showPoChange = false"
    :talent="talent"
  ></ProjectOwnerChange>
</template>
<script setup>
import { computed, inject, onMounted, ref } from 'vue';
import { useAssetsStore, useManagersStore, useUserStore } from '~/store';
const plRoles = inject('roles');
const { isProjectAdministrator, isProjectOwner } = plRoles;
const myStore = useUserStore();
import AxiosService from '@/service/axiosService';
import { useRouter } from 'vue-router';
const myProject = computed(() => (props.project_id ? props.project_id : myStore.getUserProjectId));
const projectInfo = computed(() => myStore.getUser.projects[0]);
const router = useRouter();
const itsMe = computed(() => {
  console.log(myStore.getUser.id === props.talent.id);
  console.log(myStore.getUser.id, props.talent.id);
  return myStore.getUser.id === props.talent.id;
});
const props = defineProps({
  status: {
    type: String,
    default: '',
  },
  talent: {
    type: Object,
    default: () => {},
  },
  role: {
    type: String,
    default: '',
  },
  isActionRole: {
    type: Boolean,
    default: false,
  },
  project_id: {
    type: Number,
    default: null,
  },
});
const asset = useAssetsStore;
const selectedRole = ref(null);
const roles = computed(() =>
  useAssetsStore().getRoles.filter(
    (item) => item.name !== props.role && item.name !== 'Talentum Manager',
  ),
);

function goToProfile() {
  router.push(`/manager/${props.talent.id}`);
}
const show = ref(false);
const showRoles = ref(false);
const isHovered = ref(false);
const inviteShow = ref(false);
const showPoChange = ref(false);
const nuxtApp = useNuxtApp();
const managerStore = useManagersStore();

const toggleTooltip = () => {
  show.value = !show.value;
};

const changeRoleCheck = (role) => {
  selectedRole.value = role;
  if (role.name === 'Project Owner' && isProjectOwner.value) {
    showPoChange.value = true;
  } else {
    changeRole();
  }
};

function changeRole() {
  if (props.talent.invitation_status === 'accepted') {
    AxiosService.put(useRuntimeConfig().public.apiBaseV2 + `managers/${props.talent.id}/roles`, {
      role_id: selectedRole.value.id,
      project_id: myProject.value,
    })
      .then(() => {
        managerStore.getAllManagersInProjectAction(myProject.value);
        managerStore.getAllManagersInTalentumTeamAction(myProject.value);
        nuxtApp.$alert.show('Success', {
          type: 'success',
          timeout: 5000,
        });
      })
      .catch((e) => {
        nuxtApp.$alert.show(e.response.data.message, {
          type: 'error',
          timeout: 5000,
        });
      });
  } else {
    AxiosService.post(useRuntimeConfig().public.apiBaseV2 + `managers`, {
      role_id: selectedRole.value.id,
      project_id: myProject.value,
      email: props.talent.email,
    })
      .then(() => {
        managerStore.getAllManagersInProjectAction(myProject.value);
        managerStore.getAllManagersInTalentumTeamAction(myProject.value);
        nuxtApp.$alert.show('Success', {
          type: 'success',
          timeout: 5000,
        });
      })
      .catch((e) => {
        nuxtApp.$alert.show(e.response.data.message, {
          type: 'error',
          timeout: 5000,
        });
      });
  }
}

function revokeAccess() {
  AxiosService.delete(
    useRuntimeConfig().public.apiBaseV2 +
      `managers/${props.talent.id}/${
        props.talent.invitation_status === 'accepted' ? 'projects' : 'invites'
      }/${myProject.value}`,
  )
    .then(() => {
      managerStore.getAllManagersInProjectAction(myProject.value);
      nuxtApp.$alert.show('Success', {
        type: 'success',
        timeout: 5000,
      });
    })
    .catch((e) => {
      nuxtApp.$alert.show(e.response.data.message, {
        type: 'error',
        timeout: 5000,
      });
    });
}
function changeProjectOwner() {
  AxiosService.put(
    useRuntimeConfig().public.apiBaseV2 + `projects/${myProject.value}/owner/${props.talent.id}`,
    {},
  )
    .then(() => {
      managerStore.getAllManagersInProjectAction(myProject.value);
      nuxtApp.$alert.show('Success', {
        type: 'success',
        timeout: 5000,
      });
    })
    .catch((e) => {
      console.log(213213213212);
      nuxtApp.$alert.show(e.response.data.message, {
        type: 'error',
        timeout: 5000,
      });
    });
}
const toggleTooltipRoles = () => {
  showRoles.value = !showRoles.value;
};

const container = ref(null);
const containerRoles = ref(null);
const handleClickOutside = (event) => {
  if (show.value && !container.value.contains(event.target)) {
    show.value = false;
  }

  if (showRoles.value && !containerRoles.value.contains(event.target)) {
    showRoles.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss">
.invite {
  display: flex;
  padding: 4px 12px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  background: #eaeafb;
  color: #6a6d8f;
  font-size: 14px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  cursor: pointer;
}
.status {
  display: flex;
  padding: 3px 10px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 6px;
  border: 1px solid #ffc0b7;
  color: #cc2d14;
  text-align: right;
  /* Label */
  font-size: 12px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  letter-spacing: 0.168px;
  .icon {
    filter: invert(100%) sepia(87%) saturate(2242%) hue-rotate(349deg) brightness(79%)
      contrast(104%);
  }
}
.selector {
  display: flex;
  padding: 4px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  &:hover {
    border-radius: 8px;
    background: $not-active-text;
    .icon {
      filter: invert(223%) sepia(0%) saturate(0%) hue-rotate(349deg) brightness(102%) contrast(258%);
    }
  }
}

#tooltip-confirmation-links {
  position: absolute;
  height: fit-content;
  margin-top: 35%;
  background: $white;
  margin-left: -95px;
  padding: 8px;
  box-shadow: 0px 4px 16px rgba(56, 64, 91, 0.24);
  border-radius: 8px;
  width: 190px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  z-index: 99;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  .tooltip-arrow {
    position: absolute;
    top: -6px;
    left: 80%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid $white;
  }
  .menu {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    gap: 8px;
    .red {
      color: $red !important;
    }
    .link {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      font-feature-settings: 'zero' on;
      color: $section-title;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 3px 8px;
      width: 100%;
      height: 24px;
      background: $white;
      border-radius: 6px;
      &:hover {
        background: $default-bg;
        cursor: pointer;
      }
    }
  }
}
#tooltip-confirmation {
  position: absolute;
  height: fit-content;
  margin-top: 35%;
  background: $white;
  margin-left: -95px;
  padding: 8px;
  box-shadow: 0px 4px 16px rgba(56, 64, 91, 0.24);
  border-radius: 8px;
  width: 190px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  z-index: 99;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  .tooltip-arrow {
    position: absolute;
    top: -6px;
    left: 80%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid $white;
  }
  .menu {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    gap: 8px;
    .link {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      font-feature-settings: 'zero' on;
      color: $default;
      &:hover {
        cursor: pointer;
      }
    }
    .alert {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      text-align: center;
      letter-spacing: 0.014em;
      hanging-punctuation: first last;
      list-style-position: outside;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: #38405b;
    }
    .revoke {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      font-feature-settings: 'zero' on;
      color: $red;
      &:hover {
        cursor: pointer;
      }
    }
    hr {
      color: $default-border;
    }
  }
}
.tooltip-icon {
  position: relative;
  cursor: pointer;
}
.tooltip-checkbox {
  position: absolute;
  bottom: -10px;
  width: 200px;
  left: 50%;
  background: $default;
  box-shadow: 0px 2px 8px rgba(26, 29, 41, 0.24);
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 12px;
  z-index: 999;
  transform: translateY(100%) translateX(-50%);
  margin-bottom: 5px;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $white;

  &::after {
    content: '';
    position: absolute;
    width: 28px;
    height: 18px;
    background: $default;
    transform: rotate(45deg) translateX(-50%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: -1;
    top: 10px;
    left: 50%;
  }
}
</style>
