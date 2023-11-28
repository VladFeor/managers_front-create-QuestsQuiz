<template>
  <div class="notification-container">
    <div class="header">
      <div class="title">
        Notifications
        <div class="count" v-if="data && data.unread_count">
          {{ data.unread_count }}
        </div>
      </div>
      <div class="controller" ref="menu">
        <Icon class="icon" name="More" @click="toggleTooltip()" :size="24"></Icon>
        <div v-if="showActions" id="tooltip-confirmation-links">
          <div class="menu">
            <div class="link" @click="readNotification(data.data.map((i) => i.id))">
              Mark all as read
            </div>
            <hr />
            <div
              class="link"
              @click="
                toggleTooltip();
                goTo('/notifications');
                $emit('hide');
              "
            >
              View All Notifications
            </div>
            <div
              class="link"
              @click="
                toggleTooltip();
                goTo('/notifications-settings');
                $emit('hide');
              "
            >
              Notification Settings
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div v-if="data && data.data.length">
        <Notification
          v-for="i in data.data"
          :key="i.id"
          :time="i.created_at"
          :read="i.read"
          :id="i.id"
          :data="i.data"
          :title="i.data.message"
          :isProject="
            !i.data.hasOwnProperty('ambassador_avatar') &&
            !i.data.hasOwnProperty('manager_avatar') &&
            i.data.hasOwnProperty('project_name') &&
            checkType(i.type)
          "
          :logo="
            checkType(i.type) &&
            (i.data.hasOwnProperty('ambassador_avatar')
              ? i.data.ambassador_avatar || defaultBg
              : i.data.hasOwnProperty('manager_avatar')
              ? i.data.manager_avatar || defaultBg
              : i.data.project_name || defaultBg)
          "
          @read="
            readNotification([i.id]);
            $emit('hide');
          "
          :isEmptySlot="i.type === 'manager_accepted_invite' || i.type === 'join_project'"
        >
          <component :is="components[i.type]" :data="i.data"></component>
        </Notification>
      </div>
      <EmptyStateNotifications v-else></EmptyStateNotifications>
    </div>
    <div class="footer cursor-pointer">
      <div
        @click="
          goTo('/notifications');
          $emit('hide');
        "
      >
        All Notifications
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted } from 'vue';
import invite_to_join from '@/components/Notifications/invite_to_join.vue';
import direction_pending from '@/components/Notifications/direction_pending.vue';
import direction_disapproved from '@/components/Notifications/directional_disapproval.vue';
import direction_approved from '@/components/Notifications/directional_approval.vue';
import survey_form_approved from '@/components/Notifications/survey_form_approved.vue';
import survey_form_rejected from '@/components/Notifications/survey_form_rejected.vue';
import levelup from '@/components/Notifications/levelup.vue';
import task_status from '@/components/Notifications/task_status.vue';
import new_task from '@/components/Notifications/new_task.vue';
import new_project from '@/components/Notifications/new_project.vue';
import new_personal_task from '@/components/Notifications/new_personal_task.vue';
import task_expiration from '@/components/Notifications/task_expiration.vue';
import upcoming_task_deadline from '@/components/Notifications/upcoming_task_deadline.vue';
import withdrawal_request_accepted from '@/components/Notifications/withdrawal_request_accepted.vue';
import withdrawal_request_declined from '@/components/Notifications/withdrawal_request_declined.vue';
import withdrawal_request_canceled from '@/components/Notifications/withdrawal_request_canceled.vue';
import ambassador_activity from '@/components/Notifications/direction_pending.vue';
import pending_payments_reminder from '@/components/Notifications/pending_payments_reminder.vue';
import withdrawal_request from '@/components/Notifications/withdrawal_request.vue';

import { useNotificationsStore } from '~/store';
import levelup_pending from '@/components/Notifications/levelup_pending.vue';
import AxiosService from '~/service/axiosService';
import defaultBg from '@/assets/images/default-avatar.png';
import task_is_overdue from '~/components/Notifications/task_status.vue';
const checkType = (type) => {
  return (
    type !== 'new_project' &&
    type !== 'task_is_overdue' &&
    type !== 'task_expiration' &&
    type !== 'manager_accepted_invite' &&
    type !== 'invite_to_join' &&
    type !== 'survey_form_approved' &&
    type !== 'survey_form_rejected'
  );
};

const props = defineProps({
  data: {
    type: Object,
    default: {
      data: [],
      unread_count: 0,
    },
  },
});

const components = {
  direction_pending,
  direction_approved,
  direction_disapproved,
  levelup,
  task_status,
  new_personal_task,
  task_expiration,
  invite_to_join,
  pending_payments_reminder,
  ambassador_activity,
  new_project,
  levelup_pending,
  withdrawal_request,
  new_task,
  upcoming_task_deadline,
  withdrawal_request_declined,
  withdrawal_request_accepted,
  withdrawal_request_canceled,
  task_is_overdue,
  survey_form_approved,
  survey_form_rejected,
};
const readNotification = (ids) => {
  AxiosService.post(useRuntimeConfig().public.apiBase + 'notifications/read', {
    ids: ids,
  }).then(async () => {
    await useNotificationsStore().getNotificationsAction();
  });
};
const router = useRouter();
const showActions = ref(false);
const menu = ref(null);
const handleClickOutside = (event) => {
  if (menu.value && !menu.value.contains(event.target)) {
    showActions.value = false;
  }
};
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
function goTo(link) {
  router.push(link);
}
const toggleTooltip = () => {
  showActions.value = !showActions.value;
};
</script>
<style scoped lang="scss">
.notification-container {
  display: flex;
  width: 360px;
  flex-direction: column;
  align-items: flex-start;
  height: fit-content;
  position: absolute;
  top: 66px;
  right: 0;
  border-radius: 8px;
  overflow: hidden;
  padding: 8px 16px;
  background: $white;
  gap: 8px;
  box-shadow: 0px 4px 16px 0px rgba(56, 64, 91, 0.24);

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .title {
      color: $section-title;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      font-family: 'Basis Grotesque Pro';
      font-size: 18px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px;
      display: flex;
      align-items: center;
      gap: 8px;
      .count {
        font-family: 'Basis Grotesque Pro';
        text-align: center;
        font-variant-numeric: lining-nums tabular-nums slashed-zero;

        color: $white;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: 16px;
        display: flex;
        padding: 4px;
        padding-top: 6px;
        height: 16px;
        min-width: 16px;
        justify-content: center;
        align-items: center;
        border-radius: 16px;
        background: $orange;
      }
    }
    .controller {
      width: 40px;
      height: 40px;
      display: flex;
      padding: 10px;
      align-items: center;
      gap: 8px;
      border-radius: 8px;
      cursor: pointer;
      position: relative;
      &:hover {
        background: $transparent-active-text;
        .icon {
          filter: invert(100%) sepia(7%) saturate(2%) hue-rotate(111deg) brightness(115%)
            contrast(100%);
        }
      }
      #tooltip-confirmation-links {
        position: absolute;
        height: fit-content;
        top: 45px;
        background: $white;
        padding: 8px;
        right: 0;
        box-shadow: 0px 4px 16px rgba(56, 64, 91, 0.24);
        border-radius: 8px;
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
        letter-spacing: 0.014em;
        width: 168px;
        font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
        z-index: 100;

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
  }
  .content {
    width: 100%;
    display: flex;
    gap: 16px;
    flex-direction: column;
    max-height: 75vh;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .footer {
    display: flex;
    padding: 8px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    border-radius: 0px 0px 8px 8px;
    background: $default-bg;
    text-align: center;
    margin-right: -16px;
    margin-left: -16px;
    margin-bottom: -8px;
    div {
      color: $secondary;
      font-variant-numeric: slashed-zero;
      font-family: 'Basis Grotesque Pro';
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px;
    }
  }
}
</style>
