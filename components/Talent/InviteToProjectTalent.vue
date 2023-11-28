<template>
  <div class="invite" @click="invite()" v-if="!projectStatus || projectStatus === 'revoked'">
    Invite to the Project <Icon class="icon-ref" name="Refferals" :size="24"></Icon>
  </div>
  <div class="invite" @click="kick(projectId)" v-if="projectStatus === 'accepted'">
    Kick Out <Icon class="icon-ref" name="Kick-out" :size="24"></Icon>
  </div>
  <div class="invite" @click="remove(projectId)" v-if="projectStatus === 'pending'">
    Disinvite <Icon class="icon-ref" name="Kick-out" :size="24"></Icon>
  </div>
  <Modal v-if="show" @close="show = false">
    <span class="title">Participation in Projects</span>
    <div class="counts">Talent has joined {{ countOfProjects }} projects</div>
    <hr class="line" />
    <div class="projects">
      <div class="project" v-for="i in projects" :key="i">
        <img :src="i.project.logo || defaultBg" />
        <div class="name">{{ i.project.name }}</div>
        <div class="status" v-if="i.status === 'accepted'">
          Joined
          <div class="icon" @click="toggleTooltip(i)">
            <Icon icon="Delete" :size="16" class="delete"></Icon>
          </div>
          <div v-if="isTooltipActive(i)" id="tooltip-confirmation">
            <div class="tooltip-arrow"></div>
            <div class="menu">
              <div class="alert">Are you sure you want to kick the talent out of the project?</div>
              <div class="w-full flex justify-around mt-2">
                <div class="link" @click="toggleTooltip(i)">Cancel</div>
                <div
                  class="revoke"
                  @click="
                    kick(i);
                    toggleTooltip(i);
                  "
                >
                  Confirm
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="status" v-else-if="i.status === 'invited'">
          Invited...
          <div class="icon" @click="toggleTooltip(i)">
            <Icon icon="More" :size="16" class="more"></Icon>
          </div>
          <div v-if="isTooltipActive(i)" id="tooltip-confirmation-links">
            <div class="tooltip-arrow"></div>
            <div class="menu">
              <div
                class="link"
                @click="
                  add(i);
                  toggleTooltip(i);
                "
              >
                Resend Invite
              </div>
              <div
                class="link"
                @click="
                  remove(i);
                  toggleTooltip(i);
                "
              >
                Disinvite
              </div>
            </div>
          </div>
        </div>
        <div class="invite" v-else @click="add(i)">Invite</div>
      </div>
    </div>
  </Modal>
</template>

<script>
import AxiosService from '~/service/axiosService';
import { computed, inject } from 'vue';
import { useTalentsStore } from '~/store';
import { useUserStore } from '~/store';
import defaultBg from '@/assets/images/default-avatar.png';

export default {
  name: 'InviteToProject',
  data() {
    return {
      activeTooltipIndex: null,
      defaultBg,
    };
  },
  methods: {
    toggleTooltip(index) {
      this.activeTooltipIndex = this.activeTooltipIndex === index ? null : index;
    },
    isTooltipActive(index) {
      return this.activeTooltipIndex === index;
    },
  },
  setup() {
    const roles = inject('roles');

    const { isProjectOwner, isProjectManager, isProjectAdministrator } = roles;
    const show = ref(false);
    const talentsStore = useTalentsStore();
    const userStore = useUserStore();
    const nuxtApp = useNuxtApp();
    const projects = computed(() => talentsStore.getProjects);
    const talent = computed(() => talentsStore.getTalentById);
    const projectId = computed(() => {
      return {
        project: userStore.getUser.projects[0],
      };
    });
    const projectStatus = computed(() => talentsStore.getTalentById.invitation_status);
    const invite = () => {
      if (isProjectOwner.value || isProjectManager.value || isProjectAdministrator.value) {
        add(projectId.value);
      } else {
        show.value = true;
      }
    };
    const search = ref('');
    const remove = (index) => {
      AxiosService.delete(
        useRuntimeConfig().public.apiBaseV2 +
          `ambassadors/${talent.value.id}/invites/${index.project.id}`,
      )
        .then(async () => {
          await talentsStore.getTalentProjectsAction(talent.value.id);
          await talentsStore.getTalentByIdAction(talent.value.id);
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
    };

    const kick = (index) => {
      AxiosService.delete(
        useRuntimeConfig().public.apiBaseV2 +
          `ambassadors/${talent.value.id}/projects/${index.project.id}`,
      )
        .then(async () => {
          await talentsStore.getTalentProjectsAction(talent.value.id);
          await talentsStore.getTalentByIdAction(talent.value.id);
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
    };

    const add = (index) => {
      AxiosService.post(
        useRuntimeConfig().public.apiBaseV2 +
          `ambassadors/${talent.value.id}/invites/${index.project.id}`,
        {},
      )
        .then(async () => {
          await talentsStore.getTalentProjectsAction(talent.value.id);
          await talentsStore.getTalentByIdAction(talent.value.id);
          nuxtApp.$alert.show('Success', {
            type: 'success',
            timeout: 5000,
          });

          window.dataLayer.push({
            event: 'project_talent_invite',
          });
        })
        .catch((e) => {
          nuxtApp.$alert.show(e.response.data.message, {
            type: 'error',
            timeout: 5000,
          });
        });
    };
    const countOfProjects = computed(
      () => projects.value.filter((project) => project.status === 'accepted').length,
    );
    let timeOut = ref('');
    const searchInProject = () => {
      clearTimeout(timeOut.value);
      timeOut.value = setTimeout(() => {
        talentsStore.getTalentProjectsAction(talent.value.id, search.value);
      }, 300);
    };
    return {
      projects,
      remove,
      add,
      search,
      kick,
      searchInProject,
      countOfProjects,
      show,
      invite,
      projectStatus,
      projectId,
    };
  },
};
</script>

<style scoped lang="scss">
.invite {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 7px 12px;
  gap: 8px;
  height: 40px;
  background: $orange;
  border-radius: 8px;
  color: $white;
  width: fit-content;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  cursor: pointer;
  .icon-ref {
    filter: invert(0%) sepia(138%) saturate(0) hue-rotate(358deg) brightness(272%) contrast(147%);
  }
  &:hover {
    background: $orange-active;
  }
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
.counts {
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 3px 8px;
  gap: 8px;
  height: 24px;
  background: $colabs-bg;
  width: fit-content;
  border-radius: 6px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $white;
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
      overflow: hidden;
      text-overflow: ellipsis;
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
}
</style>
