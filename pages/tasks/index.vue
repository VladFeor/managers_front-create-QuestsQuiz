<template>
  <div class="tasks-container">
    <div class="tasks-header">
      <PageToggle
        :buttons="[
          { title: 'Tasks', id: 0 },
          { title: 'On Review', id: 1 },
        ]"
        :id="taskTabId"
        @select="setIsShowEvents($event)"
      />
      <div v-if="id === 0" class="tasks-modify">
        <InputWithSearch
          :placeholder="'Find a Task...'"
          :iconSize="24"
          v-model="pagData.search"
          :intervalFunc="searchTasks"
        />
        <TypeTasksSelect
          v-if="!isProjectManager"
          text="Create a Task"
          :handleOpen="handleOpen"
          :isOpenMenu="isOpenMenu"
          :setIsOpenMenu="setIsClearMenu"
          :options="types"
          :reduceLength="14"
        />
      </div>
    </div>
    <div class="tasks-body" v-if="renderComponent">
      <Tasks @pagData="setPagData($event)" v-if="id === 0" :search="pagData.search" />
      <OnReview v-else />
    </div>
  </div>
  <BaseModal
    :width="600"
    :top="10"
    :rightCustom="10"
    :bottom="10"
    customHeight="auto"
    @close="handleClose($event)"
    :visible="visible"
    btnLeft
    @openConfirmationModal="isConfirmModalOpen = true"
    isConfirm
  >
    <CreateTask :typeTask="typeTask" @close="handleClose(false)" />
  </BaseModal>
  <BaseModal
    isCloseBtnInvisible
    :width="480"
    customHeight="248px"
    @close="handleCloseConfirm($event)"
    :visible="isConfirmModalOpen"
  >
    <div class="confirm-modal">
      <div class="confirm-modal_title">Rejection of the Task Creation</div>
      <div class="confirm-modal_subtitle">
        Confirm that this decision if you dont want to complete the creation
      </div>

      <div class="confirm-modal_btns-wrapper">
        <BaseButton text="Cancel" type="secondary" @click="handleCloseConfirm(false)" />
        <BaseButton
          text="Reject"
          type="normal"
          @click="
            handleCloseConfirm(false);
            handleClose(false);
          "
        />
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseButton from '@/components/BaseButton.vue';
import { useTasksStore } from '~/store/tasks';
import { ref, onMounted, reactive, provide, inject, onBeforeUpdate, watch, nextTick } from 'vue';
import { useProjectsStore } from '~/store/projects';
import { useDashboardStore } from '~/store/dashboard';
import { useAmbassadorsStore } from '~/store/ambassadors';
import { useActivitiesStore } from '~/store/activities';
import { useCoinsStore } from '~/store/coins';
import { useRouter, useRoute } from 'vue-router';
import { clearBaseTableSortCache } from '~~/util/helpers';
import { useBlockchainsStore } from '~/store/blockchains';

const roles = inject('roles');
const type = ref('');

const types = [
  {
    name: 'Regular Task',
    label: 'Regular',
    id: 'regular',
  },
  // {
  //   name: 'Auto Check Task',
  //   label: 'Auto Check',
  //   id: 'auto',
  // },
  {
    name: 'On-Chain Task',
    label: 'On-Chain',
    id: 'on-chain',
  },
  // {
  //   name: 'Quest',
  //   label: 'Quest',
  //   id: 'quest',
  // },
];

const {
  isProjectOwner,
  isSuperAdmin,
  isProjectAdministrator,
  isAdminSupport,
  isProjectManager,
  isCatapultManager,
} = roles;

const route = useRoute();
const router = useRouter();

const blockchainsStore = useBlockchainsStore();

onMounted(() => {
  blockchainsStore.getBlockchainsAction();
  if (localStorage.social) {
    visible.value = true;
  }
  projectsStore.getProjectsAction();
  dashboardStore.getDashboardAction();
  ambassadorsStore.getAmbassadorsAction({ levels: null, activity_id: null });
  activityStore.getActivitiesAction();
  coinsStore.getCoinsAction();

  if (route.query && route.query.status) {
    id.value = 1;
    taskTabId.value = 1;
    overviewStatus.value = route.query.status;
  }
  if (!route.query) {
    setIsShowEvents(0);
  }
});

onUnmounted(() => {
  clearBaseTableSortCache();
});

const activityStore = useActivitiesStore();
const projectsStore = useProjectsStore();
const tasksStore = useTasksStore();
const dashboardStore = useDashboardStore();
const ambassadorsStore = useAmbassadorsStore();
const coinsStore = useCoinsStore();

const overviewStatus = ref(false);
const visible = ref(null);
const typeTask = ref(false);
const isConfirmModalOpen = ref(false);
const searchInterval = ref(null);
const id = ref(0);
const taskTabId = ref(0);

provide('overviewStatus', overviewStatus);

const handleClose = (value) => {
  visible.value = value;
};
const handleOpen = (value, type) => {
  typeTask.value = type;
  visible.value = value;
};

const handleCloseConfirm = (value) => {
  isConfirmModalOpen.value = value;
};

const pagData = reactive({
  status: 'available',
  page: 1,
  search: '',
});

const setPagData = (data) => {
  pagData.status = data.status;
  pagData.page = data.page;
  pagData.search = data.search;
  if (data.reward_type) {
    pagData.reward_type = data.reward_type;
  } else {
    pagData.reward_type = '';
  }
  if (data.priority) {
    pagData.priority = data.priority;
  } else {
    pagData.priority = '';
  }
  if (data.activity_id) {
    pagData.activity_id = data.activity_id;
  } else {
    pagData.activity_id = '';
  }
  if (data.project_id) {
    pagData.project_id = data.project_id;
  } else {
    pagData.project_id = '';
  }
};
const searchTasks = () => {
  clearTimeout(searchInterval.value);
  searchInterval.value = setTimeout(() => {
    tasksStore.getTasksAction(pagData);
  }, 500);
};
const renderComponent = ref(true);
function setIsShowEvents(idProp) {
  id.value = idProp;
  taskTabId.value = idProp;
  pagData.search = '';
  clearBaseTableSortCache();
  overviewStatus.value = false;
  router.push(`tasks?tab=${idProp}`);
}
const forceRender = async () => {
  renderComponent.value = false;
  await nextTick();
  renderComponent.value = true;
};
watch(
  () => route.query.tab,
  (value) => {
    if (value) {
      forceRender();
      setIsShowEvents(+value);
    }
  },
);

watch(
  () => route.query.status,
  (value) => {
    forceRender();
    if (value) {
      id.value = 1;
      taskTabId.value = 1;
      overviewStatus.value = value;
    }
  },
);
watch(
  () => route.query.tasksStatus,
  () => {
    if (id.value === 0) forceRender();
  },
);
</script>

<style lang="scss" scoped>
.confirm-modal {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 32px;
  gap: 24px;
  &_title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 40px;
    color: $section-title;
  }
  &_subtitle {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
    text-align: center;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $section-title;
  }
  &_btns-wrapper {
    width: 100%;
    display: flex;
    gap: 24px;
  }
}

.tasks-container {
  display: flex;
  justify-content: center;
  //   align-items: center;
  flex-direction: column;
  //   width: 100%;
  max-width: 1160px;
  margin: 0 auto;
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
</style>
