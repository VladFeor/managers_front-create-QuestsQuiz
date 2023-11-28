<template>
  <div class="item" ref="container">
    <badge :text="role"></badge>
    <div class="flex items-center justify-between gap-x-4">
      <nuxt-link :to="`manager/${talent.id}`" class="selector" v-if="status !== 'invited'">
        <Icon class="icon" icon="View" :size="24"></Icon>
      </nuxt-link>
      <div
        class="tooltip-icon"
        v-if="status === 'invited' || status === 'pending'"
        @mouseover="isHovered = true"
        @mouseout="isHovered = false"
      >
        <div class="tooltip-checkbox" v-if="isHovered">
          The manager is invited and waiting for his reply.
        </div>
        <Icon icon="Clock" :size="24"></Icon>
      </div>
      <div class="selector" v-else-if="project" @click="toggleTooltip">
        <Icon class="icon" icon="More" :size="24"></Icon>
      </div>
      <div v-if="show" id="tooltip-confirmation-links">
        <div class="tooltip-arrow"></div>
        <div class="menu">
          <div class="link" v-for="role in roles" :key="role.id" @click="changeRole(role)">
            {{ role.name }}
          </div>
          <div class="link red" @click="removeFromTalent()">Revoke Access</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, inject, onMounted } from 'vue';
import AxiosService from '~/service/axiosService';
import { useAssetsStore, useManagersStore, useUserStore } from '~/store';
import { useRouter } from 'vue-router';
const managerStore = useManagersStore();
const nuxtApp = useNuxtApp();
const myStore = useUserStore();

const props = defineProps({
  role: { type: String, default: '' },
  status: { type: String, default: '' },
  talent: { type: String, default: '' },
  project: { type: Object, default: () => {} },
  id: { type: String, default: '' },
  filter: { type: String, default: '' },
});
const router = useRouter();

const show = ref(false);
const isHovered = ref(false);
const roles = computed(() => useAssetsStore().getRoles);
const toggleTooltip = () => {
  show.value = !show.value;
};
const myProject = computed(() => myStore.getUserProjectId);
function goToProfile() {
  router.push(`/manager/${props.talent.id}`);
}
const container = ref(null);

const rolesPr = inject('roles');

const { isSuperAdmin, isProjectOwner, isProjectAdministrator, isCatapultManager } = rolesPr;
const handleClickOutside = (event) => {
  if (show.value && !container.value.contains(event.target)) {
    show.value = false;
  }
};

function changeRole(role) {
  AxiosService.put(useRuntimeConfig().public.apiBaseV2 + `managers/${props.talent.id}/roles`, {
    role_id: role.id,
    project_id: props.project.id,
  })
    .then(() => {
      if (props.id == 0) {
        managerStore.getAllManagersAction(props.filter);
      } else if (props.id == 2) {
        managerStore.getAllManagersInProjectAction(props.filter);
      } else if (props.id == 3) {
        managerStore.getAllManagersInTalentumTeamAction(props.filter);
      }
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
function removeFromTalent() {
  AxiosService.delete(
    useRuntimeConfig().public.apiBaseV2 +
      `managers/${props.talent.id}/projects/${props.project.id}`,
    {},
  )
    .then(() => {
      managerStore.getAllManagersAction();
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
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss">
.item {
  display: flex;
  justify-content: space-between;
  width: 300px;
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
        filter: invert(223%) sepia(0%) saturate(0%) hue-rotate(349deg) brightness(102%)
          contrast(258%);
      }
    }
  }
}
#tooltip-confirmation-links {
  position: absolute;
  height: fit-content;
  top: 38px;
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
  z-index: 999;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  .tooltip-arrow {
    position: absolute;
    top: -6px;
    left: 60%;
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
