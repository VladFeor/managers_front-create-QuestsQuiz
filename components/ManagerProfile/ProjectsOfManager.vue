<template>
  <div class="card">
    <div class="card-bg" :style="`background-image: url(${bg ? bg : `${defaultBg}`})`"></div>
    <div class="project-token" :class="{ 'logo-active': logo }">
      <img v-if="logo" :src="logo" alt="" />
      <img v-else src="@/assets/icons/project/eth.svg" alt="" />
    </div>
    <div class="content">
      <div ref="selectContainer" v-if="role && notMy">
        <div class="project" @click.stop="handleAction()" ref="menu">
          {{ role ? role.name : '' }}
          <div class="arrow ml-2" :class="{ flipped: showTooltips }"></div>
        </div>
        <div v-if="showTooltips" id="tooltip-confirmation">
          <div class="tooltip-arrow"></div>
          <div class="menu">
            <div class="link" v-for="i in availableRoles" :key="i.id" @click="resetRole(i)">
              {{ i.name }}
            </div>
            <hr />
            <div class="revoke" @click="kick">Revoke Access</div>
          </div>
        </div>
      </div>
      <div ref="selectContainer">
        <div class="project" ref="menu">
          {{ role ? role.name : '' }}
        </div>
      </div>
      <div class="name">
        {{ type === 'small' ? reduceStringLength(protocol, 18) : protocol }}
      </div>

      <div class="cards" v-if="created_tasks || reviewed_tasks || overdue_tasks">
        <div class="card">
          <span class="value">{{ created_tasks }}</span>
          <span class="info">created tasks</span>
        </div>
        <div class="card">
          <span class="value">{{ reviewed_tasks }}</span>
          <span class="info">reviewed tasks</span>
        </div>
        <div class="card">
          <span class="value">{{ overdue_tasks }}</span>
          <span class="info">overdue tasks</span>
        </div>
      </div>
      <div
        v-if="description"
        class="desc"
        :class="{
          small: type === 'small' || windowWidth < 830,
        }"
      >
        {{ description.replace(/<[^>]*>/g, '') }}
      </div>
      <div
        v-if="tags && tags.length"
        class="tags"
        :class="{ small: type === 'small' || windowWidth < 830 }"
      >
        <badge v-for="tag in tags" :key="tag.id" :text="tag.tag.name" type="transparent"></badge>
      </div>
      <icon
        v-if="isSuperAdmin || isCatapultManager"
        icon="Right-Arrow"
        :size="24"
        class="redirect pointer"
        @click="router.push(`/projects/${id}`)"
      ></icon>
    </div>
  </div>
  <Modal v-if="projectOwnerChange" @close="projectOwnerChange = false">
    <span class="title">Project Owner Change</span>
    <hr class="line" />
    <div class="projects">
      <div class="search">
        <Icon icon="Search" :size="24"></Icon>
        <input
          type="text"
          v-model="search"
          @input="searchInProject"
          placeholder="Find a Manager..."
        />
      </div>
      <div
        class="project"
        v-for="i in managers"
        :key="i"
        @click="selectManager(i)"
        :class="{ active: selected.name === i.name }"
      >
        <img :src="i.avatar || defaultLogo" />
        <div class="name">{{ i.name }}</div>
      </div>
    </div>
    <div class="change-PO" @click="showPoChange = true">Done</div>
  </Modal>
  <ProjectOwnerChange
    v-if="showPoChange && selected"
    @changeRole="changeProjectOwner()"
    @close="showPoChange = false"
    :talent="selected"
    :po="manager"
  ></ProjectOwnerChange>
</template>

<script setup>
import { computed, inject, onBeforeMount, ref } from 'vue';
import defaultBg from '@/assets/images/def-cover-project.svg';
import defaultLogo from '@/assets/images/default-avatar.png';
import windowSizeMixin from '@/mixins/windowSizeMixin';
import { isTaskHasLongWord, reduceStringLength } from '@/util/helpers';
import { useUserStore } from '~/store/user';
import Icon from '../Icon';
import { useAssetsStore } from '~/store/assets';
import { useManagersStore } from '~/store/managers';
import AxiosService from '~/service/axiosService';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const assetsStore = useAssetsStore();
const search = ref('');
const showPoChange = ref(false);
let showTooltips = ref(false);
const props = defineProps({
  bg: { type: String },
  logo: { type: String, default: '' },
  protocol: { type: String, default: 'Oasis protocol' },
  type: String,
  created_tasks: String,
  overdue_tasks: String,
  reviewed_tasks: String,
  role: Object,
  description: String,
  tags: Array,
  notMy: Boolean,
  id: String,
  project: Object,
});
const handleAction = () => {
  if (props.role && props.role.name === 'Project Owner') {
    projectOwnerChange.value = true;
  } else {
    showTooltips.value = !showTooltips.value;
  }
};

const managers = computed(() => {
  if (isSuperAdmin.value) {
    return managersStore.getAutocomplete;
  } else {
    return managersStore.getManagers.data;
  }
});

const selected = ref('');
const router = useRouter();

const rolesPR = inject('roles');

const { isSuperAdmin, isCatapultManager, isProjectAdministrator } = rolesPR;
const selectManager = (item) => {
  selected.value = item;
};
const changeProjectOwner = () => {
  AxiosService.put(
    useRuntimeConfig().public.apiBaseV2 + `projects/${props.id}/owner/${selected.value.id}`,
    {},
  )
    .then(async () => {
      await managersStore.getManagerByIdAction(manager.value.id);
      await managersStore.getManagerProjectsByIdAction(manager.value.id);
      await nuxtApp.$alert.show('Success', {
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
};
const roles = computed(() => {
  if (isProjectAdministrator.value) {
    return assetsStore.getRoles.filter(
      (i) => i.name !== 'Talentum Manager' && i.name !== 'Project Owner',
    );
  } else {
    return assetsStore.getRoles.filter((i) => i.name !== 'Talentum Manager');
  }
});
const availableRoles = computed(() => roles.value.filter((i) => i.name !== props.role?.name));
const projectOwnerChange = ref(false);
const managersStore = useManagersStore();
const manager = computed(() => managersStore.getManager);
const nuxtApp = useNuxtApp();
let timeOut = ref('');
onMounted(() => {
  if (isSuperAdmin.value) {
    managersStore.getAutocompleteAction();
  } else {
    managersStore.getManagersAction('', userStore.getUserProjectId);
  }
});
const searchInProject = () => {
  clearTimeout(timeOut.value);
  timeOut.value = setTimeout(() => {
    if (isSuperAdmin.value) {
      managersStore.getAutocompleteAction(`?search=${search.value}`);
    } else {
      managersStore.getManagersAction(search.value, userStore.getUserProjectId);
    }
  }, 300);
};
const resetRole = (role) => {
  AxiosService.put(useRuntimeConfig().public.apiBaseV2 + `managers/${manager.value.id}/roles`, {
    project_id: props.id,
    role_id: role.id,
    email: manager.value.email,
  })
    .then(async () => {
      await managersStore.getManagerByIdAction(manager.value.id);
      await managersStore.getManagerProjectsByIdAction(manager.value.id);
      await nuxtApp.$alert.show('Success', {
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
};
const kick = () => {
  AxiosService.delete(
    useRuntimeConfig().public.apiBaseV2 + `managers/${manager.value.id}/projects/${props.id}`,
  )
    .then(async () => {
      await managersStore.getManagerByIdAction(manager.value.id);
      await managersStore.getManagerProjectsByIdAction(manager.value.id);
      await nuxtApp.$alert.show('Success', {
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
};
const selectContainer = ref(null);
const handleClickOutside = (event) => {
  if (selectContainer.value && !selectContainer.value.contains(event.target)) {
    showTooltips.value = false;
  }
};

onBeforeMount(() => {
  document.addEventListener('click', handleClickOutside);
});

const { windowWidth, windowHeight, isMobile } = windowSizeMixin;
</script>

<style scoped lang="scss">
.card {
  position: relative;
  background: $white;
  max-width: 760px;
  width: 100%;
  border: 1px solid $default-border;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  #tooltip-confirmation {
    position: absolute;
    z-index: 9999999;
    width: 200px;
    height: fit-content;
    margin-top: 15px;
    background: $white;
    padding: 13px 16px;
    box-shadow: 0px 4px 16px rgba(56, 64, 91, 0.24);
    border-radius: 8px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    .tooltip-arrow {
      position: absolute;
      top: -6px;
      left: 78%;
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

  .project-token {
    position: absolute;
    width: 32px;
    height: 32px;
    left: 24px;
    top: 24px;
    background: #f5f5fd;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 32px;
      height: 32px;
      border-radius: 24px;
    }
    &.logo-active {
      background-color: transparent;
    }
  }
  &.small {
    height: fit-content;
    max-width: 360px;
    min-height: 256px;
    align-items: flex-start;
    .content {
      padding: 0 16px;
    }
  }
  .card-bg {
    background-repeat: no-repeat;
    background-size: cover;
    height: 160px;
    width: 100%;
    overflow: hidden;
    border-radius: 16px 16px 0 0;
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 160px;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.48) 0%, rgba(0, 0, 0, 0) 100%);
    }
    &.small {
      height: 136px;
      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 136px;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.48) 0%, rgba(0, 0, 0, 0) 100%);
      }
    }
  }
  .avatar {
    border: 2px solid $white;
    border-radius: 100%;
    margin: -40px auto 16px;
    width: 90px;
    height: 90px;
  }
  .content {
    padding: 0 14px;
    margin-bottom: 16px;
    flex-direction: column;
    margin-right: auto;
    .project {
      position: absolute;
      top: 148px;
      left: 40px;
      background: $default-bg;
      border-radius: 6px;
      padding: 5px 8px;
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      display: flex;
      align-items: center;
      line-height: 20px;
      letter-spacing: 0.014em;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: $default;
      z-index: 1000;
      &.small {
        top: 124px;
        left: 15px;
      }
    }
    .name {
      position: absolute;
      top: 90px;
      left: 25px;
      padding: 10px 16px 0 16px;
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 400;
      font-size: 32px;
      line-height: 40px;
      color: $white;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      &.small {
        top: 60px;
        left: 5px;
      }
    }
    .desc {
      max-width: 704px;
      min-height: 20px;
      height: 72px;
      position: relative;
      overflow: hidden;
      text-overflow: ellipsis;
      z-index: 10;
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: $default;
      margin-top: 30px;
      padding-left: 14px;
      word-break: break-word;
      &.small {
        display: none;
      }
    }
    .tags {
      margin-top: 16px;
      display: flex;
      justify-content: flex-start;
      align-content: center;
      flex-wrap: wrap;
      gap: 4px;
      padding-left: 14px;
      &.small {
        margin-top: 30px;
        padding-left: 0;
      }
    }
  }
  .cards {
    display: flex;
    margin-top: 32px;
    gap: 8px;
    .card {
      width: 110px;
      height: 64px;
      background: $default-bg;
      border: 1px solid $default-badge-border;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 10px 12px;
      gap: 2px;
      isolation: isolate;
      .value {
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        line-height: 24px;
        font-feature-settings: 'zero' on;
        color: $default;
      }
      .info {
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
        letter-spacing: 0.014em;
        font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
        color: $default;
      }
    }
  }
  .redirect {
    cursor: pointer;
    position: absolute;
    bottom: 0;
    right: 0;
    margin-right: 15px;
    margin-bottom: 15px;
  }
}
.arrow {
  width: 12px;
  height: 7px;
  border: none;
  transition: transform 0.2s;

  background: url('@/assets/images/select.svg');
  background-repeat: no-repeat;
}

.arrow.flipped {
  transform: rotate(180deg);
}
.title {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 40px;
  color: $section-title;
  text-align: center;
}
.line {
  margin-top: 28px;
  color: $default-border;
  width: 100%;
}
.search {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 7px 12px;
  gap: 8px;
  width: 100%;
  height: 40px;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 8px;
  input {
    background: $white;
    outline: none;
    width: 100%;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    margin-top: 2px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $section-title;
    &::placeholder {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: $colabs-bg;
    }
  }
}
.change-PO {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 7px 12px;
  gap: 8px;
  height: 40px;
  background: $orange;
  border-radius: 8px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $white;
  &:hover {
    background: $orange-active;
  }
}
.projects {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 450px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 6px;
    height: 90%;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    margin-bottom: 10px;
    margin-left: 30px;
  }

  &::-webkit-scrollbar-thumb {
    background: $secondary;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: $secondary;
  }
  .project {
    width: 100%;
    padding: 4px 8px 4px 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    img {
      width: 32px;
      height: 32px;
      border-radius: 8px;
    }
    .name {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      display: flex;
      align-items: center;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: $default;
      width: 100%;
    }
    .status {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.014em;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: $colabs-bg;
      display: flex;
      align-items: center;
      .icon {
        margin-left: 8px;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 4px;
        gap: 16px;
        width: 24px;
        height: 24px;
        border-radius: 6px;
        &:hover {
          background: $colabs-bg;
          cursor: pointer;
          .delete {
            filter: invert(0%) sepia(58%) saturate(0) hue-rotate(354deg) brightness(142%)
              contrast(100%);
          }
          .more {
            filter: invert(54%) sepia(0%) saturate(0) hue-rotate(360deg) brightness(184%)
              contrast(211%);
          }
        }
      }
      #tooltip-confirmation {
        position: absolute;
        width: 200px;
        height: fit-content;
        margin-top: 145px;
        background: $white;
        padding: 13px 16px;
        box-shadow: 0px 4px 16px rgba(56, 64, 91, 0.24);
        border-radius: 8px;
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
        letter-spacing: 0.014em;
        font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
        .tooltip-arrow {
          position: absolute;
          top: -6px;
          left: 33%;
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
      #tooltip-confirmation-links {
        position: absolute;
        height: fit-content;
        margin-top: 105px;
        background: $white;
        padding: 8px;
        box-shadow: 0px 4px 16px rgba(56, 64, 91, 0.24);
        border-radius: 8px;
        width: fit-content;
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
        letter-spacing: 0.014em;
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
    }
    .invite {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 3px 8px;
      gap: 8px;
      height: 24px;
      background: $orange;
      border-radius: 6px;
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.014em;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: $white;
      &:hover {
        cursor: pointer;
        background: $orange-active;
      }
      &:focus {
        cursor: pointer;
        background: $orange-active;
      }
    }
    &:hover {
      border-radius: 8px;
      background: $default-badge-border;
      .status {
        color: $secondary;
      }
    }
  }
  .active {
    border-radius: 8px;
    background: $default-badge-border;
  }
}
</style>
