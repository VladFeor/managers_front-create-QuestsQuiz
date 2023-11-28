<template>
  <div class="selector" @click="showPreview()">
    <Icon class="icon" icon="View" :size="24"></Icon>
  </div>
  <BaseModal
    :width="600"
    :top="10"
    :rightCustom="10"
    :bottom="10"
    customHeight="auto"
    :visible="show"
    btnLeft
    @close="showPreview"
  >
    <div class="modal-container">
      <div class="head">
        <span class="title">Request to Join the Project </span>
        <div class="controller">
          <div class="switch" v-if="currentIndex !== 0">
            <Icon name="Left" :size="24" @click="$emit('prev')"></Icon>
          </div>
          <div class="switch" v-if="!itsLast">
            <Icon name="Right" :size="24" @click="$emit('next')"></Icon>
          </div>
        </div>
      </div>
      <div class="answers">
        <div class="header">
          <div class="from">
            From
            <nuxt-link :to="`/talent/${data.user.id}`"
              ><Talent :text="data.user.name" :img="data.user.avatar || defaultBg" />
            </nuxt-link>
            <div v-if="isSuperAdmin" class="flex gap-x-[8px] items-center">
              on
              <nuxt-link :to="`/projects/${data.project.id}`"
                ><Talent square :text="data.project.name || ''" :img="defaultBg" />
              </nuxt-link>
            </div>
          </div>
          <Badge :text="formatDateCurrent(data.created_at)" />
        </div>
        <div class="body">
          <Answer v-for="(i, index) in data.answers" :key="i" :item="i" :count="index + 1"></Answer>
        </div>
      </div>
      <CollapseCard title="More About Talent">
        <div class="flex flex-col gap-y-[24px]">
          <div class="flex flex-col gap-y-[8px]">
            <div class="flex gap-x-[8px] items-center">
              <TalentStatCard
                icon="Star"
                title="Joined Projects"
                :info="data.user.project_members_count"
              ></TalentStatCard>
              <TalentLevel :data="data.user"></TalentLevel>
            </div>
            <div class="flex gap-x-[8px] items-center">
              <TalentStatCard
                icon="Mark"
                title="Tasks in Progress"
                :info="data.user.tasks_in_work_count"
              ></TalentStatCard>
              <TalentStatCard
                icon="Tik-Tik"
                title="Tasks Completed"
                :info="data.user.tasks_is_done_count"
              ></TalentStatCard>
              <TalentStatCard
                icon="Usdt"
                title="USDT Earned"
                :info="data.user.total_payout"
              ></TalentStatCard>
            </div>
          </div>
          <div class="section-info">
            <div class="title">Directions</div>
            <div class="flex gap-[8px] flex-wrap">
              <Badge
                v-for="i in data.user.activities"
                :key="i.activity.id"
                :text="i.activity.name"
                :type="getBadgeTypeByName(i.activity.name)"
              ></Badge>
            </div>
          </div>
          <div class="section-info">
            <div class="title">Skills</div>
            <div class="flex gap-[8px] flex-wrap">
              <Badge v-for="i in data.user.skills" :key="i.skill.id" :text="i.skill.name"></Badge>
            </div>
          </div>
        </div>
      </CollapseCard>
      <div class="actions">
        <ButtonDark revers icon="Like" text="Postpone" @click="postpone()"></ButtonDark>
        <ButtonDark text="Decline" @click="decline()"></ButtonDark>
        <base-button type="normal" text="Accept Now" @click="accept()"></base-button>
      </div>
    </div>
  </BaseModal>
</template>
<script setup>
import { inject, ref } from 'vue';

import defaultBg from 'assets/images/default-avatar.png';
import Answer from '~/components/QARequests/Answer.vue';
import { formatDateCurrent, getBadgeTypeByName } from '~/util/helpers';
import AxiosService from '../service/axiosService';
import { useRequestsStore } from '~/store/requests';
const emit = defineEmits(['current']);
const requestStore = useRequestsStore();
const nuxtApp = useNuxtApp();
const roles = inject('roles');
const { isSuperAdmin } = roles;
const show = ref(false);
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  index: {
    type: Number,
    default: 0,
  },
  currentPage: {
    type: Number,
    default: 0,
  },
  status: {
    type: Boolean,
    default: false,
  },
  itsLast: {
    type: Boolean,
    default: false,
  },
  currentIndex: {
    type: Number,
    default: 0,
  },
});
const showPreview = () => {
  show.value = !show.value;
  emit('current', props.index);
};
onMounted(() => {
  console.log('props.data', props.data);
});
const postpone = () => {
  AxiosService.put(useRuntimeConfig().public.apiBase + `survey/meta/${props.data.id}/toggle-like`)
    .then(() => {
      requestStore.getAllAnswersAction(`?only_liked=${props.status}`, props.currentPage);
    })
    .catch((error) => {
      nuxtApp.$alert.show(error.response.data.message, {
        type: 'error',
        timeout: 5000,
      });
    });
};
const decline = () => {
  AxiosService.patch(useRuntimeConfig().public.apiBase + 'survey/status', {
    items: [
      {
        id: props.data.id,
        status: 'rejected',
      },
    ],
  })
    .then(() => {
      requestStore.getAllAnswersAction(`?only_liked=${props.status}`, props.currentPage);
    })
    .catch((error) => {
      nuxtApp.$alert.show(error.response.data.message, {
        type: 'error',
        timeout: 5000,
      });
    });
};
const accept = () => {
  AxiosService.patch(useRuntimeConfig().public.apiBase + 'survey/status', {
    items: [
      {
        id: props.data.id,
        status: 'accepted',
      },
    ],
  })
    .then(() => {
      requestStore.getAllAnswersAction(`?only_liked=${props.status}`, props.currentPage);
    })
    .catch((error) => {
      nuxtApp.$alert.show(error.response.data.message, {
        type: 'error',
        timeout: 5000,
      });
    });
};
</script>

<style scoped lang="scss">
.modal-container {
  display: flex;
  flex-direction: column;
  padding: 40px;
  min-height: 100vh;
  gap: 32px;
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      color: $default;
      font-family: 'Basis Grotesque Pro';
      font-size: 32px;
      font-style: normal;
      font-weight: 400;
      line-height: 40px;
    }
    .controller {
      display: flex;
      gap: 8px;
      align-items: center;
      .switch {
        display: flex;
        width: 32px;
        height: 32px;
        padding: 4px;
        align-items: center;
        gap: 8px;
        border-radius: 8px;
        background: $default-badge-border;
        cursor: pointer;
      }
    }
  }
  .answers {
    display: flex;
    padding: 20px 24px;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    align-self: stretch;
    border-radius: 16px;
    border: 1px solid $default-border;
    background: $white;
    .header {
      display: flex;
      align-items: center;
      gap: 8px;
      align-self: stretch;
      justify-content: space-between;
      .from {
        color: $colabs-bg;
        font-variant-numeric: lining-nums tabular-nums slashed-zero;
        font-family: 'Basis Grotesque Pro';
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: 0.168px;
        display: flex;
        gap: 8px;
        align-items: center;
      }
    }
    .body {
      margin-top: 16px;
      display: flex;
      gap: 32px;
      flex-direction: column;
      align-items: flex-start;
    }
  }
  .actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .section-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    .title {
      color: #1a1d29;
      font-variant-numeric: slashed-zero;
      font-family: 'Basis Grotesque Pro';
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px; /* 142.857% */
    }
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
</style>
