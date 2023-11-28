<template>
  <div class="notifications-container">
    <div class="notifications-header">
      <PageToggle :buttons="[{ title: 'Notifications', id: 0 }]" :id="0" />
      <ButtonDark
        text="Notification Settings"
        @click="router.push('/notifications-settings')"
        class="!w-[200px]"
      ></ButtonDark>
    </div>
    <div class="notifications-body">
      <div class="block">
        <div class="title">Unread</div>
        <div class="content" @scroll="handleScrollTable1" ref="containerTable1">
          <div v-if="savedResultsTable1 && savedResultsTable1.length" class="w-full">
            <Notification
              v-for="i in savedResultsTable1"
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
              :isEmptySlot="i.type === 'manager_accepted_invite' || i.type === 'join_project'"
              @read="readNotification([i.id])"
            >
              <component :is="components[i.type]" :data="i.data"></component>
            </Notification>
          </div>
          <EmptyStateNotifications v-else></EmptyStateNotifications>
        </div>
      </div>
      <div class="block">
        <div class="title">All the Rest</div>
        <div class="content" @scroll="handleScrollTable2" ref="containerTable2">
          <div v-if="savedResultsTable2 && savedResultsTable2.length" class="w-full">
            <Notification
              v-for="i in savedResultsTable2"
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
              @read="readNotification([i.id])"
              :isEmptySlot="i.type === 'manager_accepted_invite' || i.type === 'join_project'"
            >
              <component :is="components[i.type]" :data="i.data"></component>
            </Notification>
          </div>

          <EmptyStateNotifications v-else></EmptyStateNotifications>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const router = useRouter();
import invite_to_join from '@/components/Notifications/invite_to_join.vue';
import direction_disapproved from '@/components/Notifications/directional_disapproval.vue';
import direction_approved from '@/components/Notifications/directional_approval.vue';
import ambassador_activity from '@/components/Notifications/direction_pending.vue';
import direction_pending from '@/components/Notifications/direction_pending.vue';
import levelup from '@/components/Notifications/levelup.vue';
import task_status from '@/components/Notifications/task_status.vue';
import task_is_overdue from '@/components/Notifications/task_status.vue';
import new_project from '@/components/Notifications/new_project.vue';
import new_task from '@/components/Notifications/new_task.vue';
import new_personal_task from '@/components/Notifications/new_personal_task.vue';
import task_expiration from '@/components/Notifications/task_expiration.vue';
import withdrawal_request from '@/components/Notifications/withdrawal_request.vue';
import survey_form_approved from '@/components/Notifications/survey_form_approved.vue';
import survey_form_rejected from '@/components/Notifications/survey_form_rejected.vue';
import upcoming_task_deadline from '@/components/Notifications/upcoming_task_deadline.vue';
import withdrawal_request_accepted from '@/components/Notifications/withdrawal_request_accepted.vue';
import withdrawal_request_declined from '@/components/Notifications/withdrawal_request_declined.vue';
import { useNotificationsStore } from '~/store';
import AxiosService from '~/service/axiosService';
import defaultBg from '@/assets/images/default-avatar.png';
import levelup_pending from '~/components/Notifications/levelup_pending.vue';
import pending_payments_reminder from '@/components/Notifications/pending_payments_reminder.vue';

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
const components = {
  direction_approved,
  direction_disapproved,
  pending_payments_reminder,
  levelup,
  direction_pending,
  task_status,
  new_personal_task,
  task_expiration,
  withdrawal_request,
  ambassador_activity,
  invite_to_join,
  new_task,
  task_is_overdue,
  levelup_pending,
  new_project,
  upcoming_task_deadline,
  withdrawal_request_declined,
  withdrawal_request_accepted,
  survey_form_approved,
  survey_form_rejected,
};
const readNotification = (ids) => {
  AxiosService.post(useRuntimeConfig().public.apiBase + 'notifications/read', {
    ids: ids,
  }).then(async () => {
    savedResultsTable2.value = [];
    savedResultsTable1.value = [];
    await nextPageTable1();
    await nextPageTable2();
  });
};

const loadingTable1 = ref(false);
const containerTable1 = ref(null);
const pageTable1 = ref(10);
const savedResultsTable1 = ref([]);

const loadingTable2 = ref(false);
const containerTable2 = ref(null);
const pageTable2 = ref(10);
const savedResultsTable2 = ref([]);

const handleScrollTable1 = () => {
  const scrollThreshold = 150;
  if (
    containerTable1.value.scrollHeight -
      containerTable1.value.scrollTop -
      containerTable1.value.clientHeight <=
      scrollThreshold &&
    !loadingTable1.value
  ) {
    loadingTable1.value = true;
    nextPageTable1();
  }
};

const handleScrollTable2 = () => {
  const scrollThreshold = 150;
  if (
    containerTable2.value.scrollHeight -
      containerTable2.value.scrollTop -
      containerTable2.value.clientHeight <=
      scrollThreshold &&
    !loadingTable2.value
  ) {
    loadingTable2.value = true;
    nextPageTable2();
  }
};

const nextPageTable1 = async () => {
  const store = useNotificationsStore();
  await store.getAllUnreadNotificationsAction(pageTable1.value);
  savedResultsTable1.value.push(...store.allUnreadNotifications.data);
  pageTable1.value += 10;
  loadingTable1.value = false;
};

const nextPageTable2 = async () => {
  const store = useNotificationsStore();
  await store.getAllNotificationsAction(pageTable2.value);
  savedResultsTable2.value.push(...store.allNotifications.data);
  pageTable2.value += 10;
  loadingTable2.value = false;
};

onMounted(() => {
  nextPageTable1();
  nextPageTable2();
});

const id = ref(0);

function setIsShowEvents(idProp) {
  id.value = idProp;
}
</script>

<style lang="scss" scoped>
.notifications-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  max-width: 1160px;
  margin: 0 auto;

  .notifications-body {
    display: flex;
    justify-content: space-between;
    gap: 40px;
    margin-top: 48px;
    margin-bottom: 48px;
    .block {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 24px;
      width: 100%;
      height: fit-content;
      .title {
        color: $section-title;
        font-variant-numeric: slashed-zero;
        font-family: 'Basis Grotesque Pro';
        font-size: 24px;
        font-style: normal;
        font-weight: 400;
        line-height: 40px;
      }
      .content {
        width: 100%;
        height: fit-content;
        display: flex;
        padding: 24px;
        flex-direction: column;
        align-items: flex-start;
        gap: 24px;
        align-self: stretch;
        border-radius: 16px;
        border: 1px solid $default-border;
        background: $white;
        max-height: 700px;
        overflow-y: auto;
      }
    }
  }
}
.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-bottom: 48px;
}
</style>
