<template>
  <div class="levelup-requests">
    <h1 class="text-[56px] leading-[72px] text-[#1A1D29] label">Requests</h1>
    <div class="mt-12 flex items-center">
      <div class="relative w-[306px] pr-4 border-r border-r-[#DAD9F7]" v-if="isSuperAdmin">
        <FilterToggle
          class="!min-w-[290px]"
          :disabled="requestsLoading"
          :buttons="menuLinks"
          :id="filterId"
          @select="setLevelupDirectionToggle($event)"
        />
      </div>
      <div
        class="ml-5 flex items-center"
        v-if="levelupDirectionToggle !== LEVELUP_STATE.direction && filterId !== 2 && isSuperAdmin"
      >
        <div class="text-sm font-medium leading-5 text-[#1A1D29]">Current Level</div>
        <div
          v-for="i in [0, 1, 2, 3, 4, 5]"
          :key="keyRandom"
          :class="`flex items-center justify-center w-8 h-8 rounded-lg border border-[#DAD9F7] ml-2 cursor-pointer
          ${levelFilter === i ? 'bg-[#38405B] text-white' : 'bg-white text-[#38405B]'}
          ${requestsLoading ? 'disabled animate-pulse' : ''}
          `"
          @click="getRequestByParam(i)"
        >
          <span class="leading-5.5 font-sm font-medium h-5 slashed-zero">{{ i }}</span>
        </div>
      </div>
      <div class="ml-5 flex items-center" v-if="+filterId === 2 || !isSuperAdmin">
        <Switch @checked="setFavorite" :checkedProp="isFavorite" />
        <div class="text-sm ml-3 font-medium leading-5 text-[#1A1D29]">Postponed Requests Only</div>
      </div>
      <div
        :class="`ml-4 ${requestsLoading ? 'disabled animate-pulse' : ''}`"
        v-if="+filterId !== 2 && isSuperAdmin"
      >
        <CheckboxLabel
          tooltipText="Only requests that have been waiting for approval for more than 3 days."
          text="Urgent Requests Only"
          @checked="setIsUrgentRequests"
        />
      </div>
    </div>
    <div v-if="+filterId !== 2 && isSuperAdmin">
      <div class="mt-[28px]">
        <TableSkeleton v-if="requestsLoading" />
        <EmptyList
          v-if="!requestsLoading && allRequests && allRequests.length <= 0"
          icon="icons8-futurama-bender"
          :title="
            levelupDirectionToggle === LEVELUP_STATE.level_up
              ? 'There are no levelup requests yet'
              : 'There are no direction requests yet'
          "
        />
        <LevelTable
          v-if="!requestsLoading && allRequests && allRequests.length > 0"
          :all-requests="allRequests"
          @levelupAction="levelupRequest"
          @dismissAction="dismissRequest"
          @rows-updated="rowsUpdated"
          @rows-generated="rowsGenerated"
          @showFastView="showFastView"
          :sortFunction="sortRequests"
          :levelup-direction-toggle="levelupDirectionToggle"
          isSorting
        />
      </div>
      <div v-if="pagination">
        <div v-if="pagination.total_pages <= 1">
          <div class="h-8"></div>
        </div>
        <Pagination
          v-if="!requestsLoading && isRequestsLoaded"
          @pageChanged="nextPage($event)"
          :currentPage="currentPage"
          :totalPages="pagination.total_pages"
        />
      </div>
      <div
        v-if="levelupBar.state"
        :class="`absolute bottom-0  h-[72px] px-10 py-6
        border border-[#DAD9F7] border-b-0 bg-white flex justify-between items-center transition-all duration-[700ms]
        ${isSidebarOpen ? 'left-[200px] w-[calc(100vw-200px)]' : 'left-[70px] w-[calc(100vw-70px)]'}
      `"
      >
        <div class="font-normal text-base text-[#1A1D29] leading-6 slashed-zero">
          {{ levelupBar.count }} talents are selected
        </div>
        <div class="flex items-center justify-center">
          <LevelUpButton
            type="dismiss"
            text="Dismiss"
            :multi="true"
            @click.stop="dismissRequest(null, true)"
          />
          <LevelUpButton :multi="true" class="ml-4" @click.stop="levelupRequest(null, true)" />
        </div>
      </div>
    </div>
    <div v-else class="mt-5">
      <TableSkeleton v-if="allAnswersLoading" />
      <CheckTable
        v-else
        :columns="allCols"
        :rows="all"
        @checkActive="handleCheck($event)"
        pointer
        title="You dont have any requests"
        icon="icons8-futurama-bender"
        :checkedRows="checkedRowsIds"
        :updateCheckedRows="updateCheckedRows"
        @prev="prevItem"
        @next="nextItem"
        @current="setCurrent($event)"
      />
      <Pagination
        v-if="allAnswers && allAnswers.pagination"
        :currentPage="currentPage"
        :totalPages="allAnswers.pagination.total_pages"
        @pageChanged="nextPageAnswers($event)"
      />
      <div
        v-if="checkedRowsIds.length && isTableCheckActive"
        class="fixed z-100000 bottom-0 h-[72px] px-10 py-6 border border-[#DAD9F7] border-b-0 bg-white flex justify-between items-center transition-all duration-[700ms] left-0 w-[calc(100vw)]"
      >
        <div class="font-normal text-base text-[#1A1D29] leading-6 slashed-zero">
          {{ checkedRowsIds.length }} requests are selected
        </div>
        <div class="flex items-center justify-center w-[250px] gap-x-[16px]">
          <button-dark text="Decline" @click="decline"></button-dark>
          <base-button text="Accept Now" type="normal" @click="accept"></base-button>
        </div>
      </div>
    </div>

    <BaseModal
      custom-height="95%"
      top="16"
      right-custom="16"
      :width="600"
      @close="fastView = !fastView"
      :visible="fastView"
      btn-left
    >
      <DirectionModalContent
        :requestsLoading="requestsLoading"
        :current-row="currentRow"
        @nextRow="nextRow"
        @prevRow="prevRow"
        :index="currentRowIndex"
      />
      <div class="w-full flex absolute bottom-0 p-10">
        <div class="w-1/2">
          <LevelUpButton
            @click="dismissRequest(currentRow.talent.props.id)"
            type="dismiss"
            multi
            text="Dismiss"
            full-width="true"
            height="h-10"
          />
        </div>
        <div class="w-1/2">
          <LevelUpButton
            @click="levelupRequest(currentRow.talent.props.id)"
            class="ml-4"
            multi
            text="Approve"
            full-width="true"
            height="h-10"
          />
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { LEVELUP_STATE } from '~/constants/levelup';
import { computed, inject, nextTick, onMounted, ref, watch } from 'vue';
import { useDashboardStore } from '~/store';
import { useRequestsStore } from '~/store/requests';
import LevelUpButton from '~/components/Level/LevelUpButton.vue';
import LevelTable from '~/components/LevelTable/LevelTable.vue';
import CheckboxLabel from '~/components/CheckboxLabel.vue';
import level from '../components/Level/Level.vue';
import { formatDateCurrent, keyRandom } from '~/util/helpers';
import { Switch } from '~/components';
import Answers from '~/components/QARequests/Answers.vue';
import FavoriteTalent from '~/components/QARequests/FavoriteTalent.vue';
import Badge from '~/components/Badge.vue';
import Talent from '@/components/Talent.vue';
import AxiosService from '../service/axiosService';

const route = useRoute();
const router = useRouter();
const roles = inject('roles');

const isTableCheckActive = ref(false);
const isFavorite = ref(false);
const checkedRows = ref([]);
const checkedRowsIds = ref([]);
const handleCheck = (event) => {
  isTableCheckActive.value = event;
};

const decline = () => {
  const data = checkedRowsIds.value.map((item) => {
    return {
      id: item,
      status: 'rejected',
    };
  });
  AxiosService.patch(useRuntimeConfig().public.apiBase + 'survey/status', {
    items: data,
  })
    .then(() => {
      handleCheck(false);
      checkedRowsIds.value = [];
      requestStore.getAllAnswersAction(`?only_liked=${isFavorite.value}`, 1);
    })
    .catch((error) => {
      nuxtApp.$alert.show(error.response.data.message, {
        type: 'error',
        timeout: 5000,
      });
    });
};
const accept = () => {
  const data = checkedRowsIds.value.map((item) => {
    return {
      id: item,
      status: 'accepted',
    };
  });
  AxiosService.patch(useRuntimeConfig().public.apiBase + 'survey/status', {
    items: data,
  })
    .then(() => {
      handleCheck(false);
      checkedRowsIds.value = [];
      requestStore.getAllAnswersAction(`?only_liked=${isFavorite.value}`, 1);
    })
    .catch((error) => {
      nuxtApp.$alert.show(error.response.data.message, {
        type: 'error',
        timeout: 5000,
      });
    });
};
const setFavorite = (event) => {
  isFavorite.value = event;
  requestStore.getAllAnswersAction(`?only_liked=${isFavorite.value}`, 1);
  currentPage.value = 1;
};
const updateCheckedRows = (updatedRows) => {
  checkedRowsIds.value = updatedRows;
};
const { isSuperAdmin } = roles;
const menuLinks = computed(() => {
  if (isSuperAdmin.value) {
    return [
      {
        id: 0,
        title: 'Level up',
        name: LEVELUP_STATE.level_up,
      },
      {
        id: 1,
        title: 'Directions',
        name: 'direction',
      },
      {
        id: 2,
        title: 'Q&A Gate',
        name: 'qa_gate',
      },
    ];
  } else {
    return [
      {
        id: 0,
        title: 'Q&A Gate',
        name: 'qa_gate',
      },
    ];
  }
});
onMounted(async () => {
  isMounted = true;

  if (route.query && route.query.status) {
    filterId.value = Number(route.query.status);
  }
  if (route.query && route.query.tab) {
    setLevelupDirectionToggle({ id: +route.query.tab });
  }
  if (route.query && route.query.page) {
    console.log(filterId.value);
    if (+filterId.value !== 2) {
      await nextPage(+route.query.page);
    } else {
      await nextPageAnswers(+route.query.page);
    }
  } else {
    await requestStore.getAllAnswersAction(`?only_liked=${isFavorite.value}`, 1);
  }

  levelupDirectionToggle.value =
    +filterId.value !== 0 ? LEVELUP_STATE.direction : LEVELUP_STATE.level_up;

  if (isSuperAdmin.value && +filterId.value !== 2) {
    await getRequestByParam();
  }
});

let isMounted = false;
let baseRequests = null;
const nuxtApp = useNuxtApp();
const allCols = computed(() => {
  if (isSuperAdmin.value) {
    return [
      { prop: 'talent', label: 'Talent', width: '180%' },
      { prop: 'waiting', label: 'Waiting', width: '100%' },
      { prop: 'project', label: 'Project', width: '180%' },
      { prop: 'view', label: '', width: '10%' },
    ];
  } else {
    return [
      { prop: 'talent', label: 'Talent', width: '140%' },
      { prop: 'waiting', label: 'Waiting', width: '100%' },
      { prop: 'view', label: '', width: '10%' },
    ];
  }
});
const all = computed(() => {
  const answers = allAnswers.value.data;
  if (!answers || (answers && !answers.length)) {
    return [];
  }
  return answers.map((item, index) => {
    return {
      itemId: item.id,
      talent: {
        component: FavoriteTalent,
        props: {
          talent: item.user,
          status: item.is_liked,
        },
      },
      waiting: {
        component: Badge,
        props: {
          text: formatDateCurrent(item.created_at),
        },
      },
      project: {
        component: Talent,
        props: {
          text: item.project.name,
          img: item.project.logo,
          square: true,
        },
      },
      view: {
        component: Answers,
        props: {
          data: currentAnswer.value,
          index: index,
          currentIndex: currentIndex.value,
          currentPage: currentPage.value,
          status: isFavorite.value,
          itsLast: currentIndex.value === allAnswers.value.data.length - 1,
        },
      },
    };
  });
});
const filterId = ref(isSuperAdmin.value ? 0 : 2);
const levelupDirectionToggle = ref(LEVELUP_STATE.level_up);
const levelupBar = ref({
  state: false,
  count: 0,
});
const levelFilter = ref(null);
const currentPage = ref(route.query ? route.query.page : 1);
const isUrgentRequests = ref(false);
const fastView = ref(false);
const currentRow = ref(null);
const currentRowIndex = ref(0);
const currentRows = ref();
const dashboardStore = useDashboardStore();
const requestStore = useRequestsStore();
const allRequestsData = computed(() => requestStore.getRequests);
const allAnswers = computed(() => requestStore.getAnswers);
const allRequests = computed(() => requestStore.getRequests.data);
const pagination = computed(() => requestStore.getRequests.pagination);
const requestsLoading = computed(() => requestStore.getRequestsLoading);
const allAnswersLoading = computed(() => requestStore.getStatus);
const isRequestsLoaded = computed(() => requestStore.getRequestsLoaded);
const isSidebarOpen = computed(() => dashboardStore.getIsSidebarOpen);
function getProperty(obj, prop) {
  const props = prop.split('.');
  const regex = /\[(\d+)\]/;

  return props.reduce((prev, curr) => {
    const matches = regex.exec(curr);
    if (matches) {
      const index = parseInt(matches[1]);
      const arrProp = curr.slice(0, matches.index);
      return prev[arrProp][index];
    } else {
      return prev && prev[curr];
    }
  }, obj);
}
function sortRequests(prop, direction) {
  if (!isMounted) return;

  if (levelupDirectionToggle.value === LEVELUP_STATE.level_up) {
    if (prop === 'talent') {
      sortFunc('name', direction);
    }
    if (prop === 'waiting') {
      sortFunc('level_up_request_at', direction);
    }
    if (prop === 'current_level') {
      sortFunc('level', direction);
    }
  } else {
    if (prop === 'talent') {
      sortFunc('ambassador.name', direction);
    }
    if (prop === 'waiting') {
      sortFunc('created_at', direction);
    }
    if (prop === 'direction') {
      sortFunc('activity.name', direction);
    }
  }
}
function sortFunc(prop, direction) {
  if (direction === 'none') {
    requestStore.setRequests(baseRequests);
    return;
  }
  allRequests.value.sort((a, b) => {
    const valA = getProperty(a, prop);
    const valB = getProperty(b, prop);

    const nameA =
      typeof valA === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(valA)
        ? new Date(valA)
        : valA;
    const nameB =
      typeof valB === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(valB)
        ? new Date(valB)
        : valB;
    if (nameA == null && nameB == null) {
      return 0;
    }
    if (nameA == null) {
      return direction === 'asc' ? -1 : 1;
    }
    if (nameB == null) {
      return direction === 'asc' ? 1 : -1;
    }
    if (nameA < nameB) {
      return direction === 'asc' ? -1 : 1;
    }
    if (nameA > nameB) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
}
function setIsUrgentRequests(value) {
  isUrgentRequests.value = value;
  currentPage.value = 1;
  getRequestByParam();
}
function rowsUpdated(rows) {
  let filteredRows = rows.filter((row) => row.checkbox.props.state);
  let ids = rows.filter((row) => row.checkbox.props.state).map((row) => row.checkbox.props.id);
  levelupBar.value = {
    ids: ids,
    state: filteredRows.length >= 1,
    count: filteredRows.length,
  };
  console.log(levelupBar.value);
}
function nextPage(page) {
  currentPage.value = page;
  getRequestByParam();
}
function nextPageAnswers(page) {
  currentPage.value = page;
  requestStore.getAllAnswersAction(`?only_liked=${isFavorite.value}`, page);
}
function showFastView(rows, row, index) {
  fastView.value = !fastView.value;
  currentRow.value = row;
  currentRows.value = rows;
  currentRowIndex.value = index;
}
function rowsGenerated(rows) {
  currentRows.value = rows;
}
async function nextRow() {
  if (currentRowIndex.value + 1 < allRequests.value.length) {
    currentRow.value = currentRows.value[currentRowIndex.value + 1];
    currentRowIndex.value++;
  } else if (currentPage.value < pagination.value.total_pages) {
    await getRequestByParam();
    currentRowIndex.value = 0;
    currentRow.value = currentRows.value[currentRowIndex.value];
  } else {
    currentRowIndex.value = 9;
  }
}
async function prevRow() {
  if (currentRowIndex.value - 1 >= 0) {
    currentRow.value = currentRows.value[currentRowIndex.value - 1];
    currentRowIndex.value--;
  } else if (currentPage.value > 1) {
    await getRequestByParam();
    currentRowIndex.value = allRequests.value.length - 1;
    currentRow.value = currentRows.value[currentRowIndex.value];
  }
}
async function setLevelupDirectionToggle(value) {
  filterId.value = value.id;
  levelupDirectionToggle.value = value.status;
  await nextTick();
  await router.push({ query: { tab: filterId.value } });
  if (value.id != 2) {
    await getRequestByParam();
  }
}

const currentIndex = ref(0);

const currentAnswer = computed(() => allAnswers.value?.data[currentIndex.value]);
const setCurrent = (index) => {
  currentIndex.value = index;
};
watch(currentIndex, (newIndex) => {
  currentAnswer.value = allAnswers.value.data[newIndex];
});
watch(
  () => allAnswers.value.data,
  (newValue) => {
    if (currentPage.value > 1 && !allAnswersLoading.value && newValue && newValue.length === 0) {
      router.push({
        query: Object.assign({}, route.query, { page: allAnswers.value.pagination.total_pages }),
      });
    }
  },
);

const nextItem = () => {
  if (currentIndex.value < allAnswers.value.data.length - 1) {
    currentIndex.value++;
  }
};

const prevItem = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  } else {
    currentIndex.value = 0;
  }
};
async function levelupRequest(id, multi = false) {
  if (!multi) {
    await requestStore.levelupRequestAction({
      id,
      levelupDirectionToggle,
    });
    nuxtApp.$alert.show(
      levelupDirectionToggle.value === LEVELUP_STATE.level_up
        ? 'You have successfully increased the level of a talent'
        : 'You have successfully approved the direction of a talent',
      {
        type: 'success',
        timeout: 1000,
      },
    );
  } else {
    await requestStore.levelupMultiRequestAction({ ids: levelupBar.value.ids });
    nuxtApp.$alert.show(
      levelupDirectionToggle.value === LEVELUP_STATE.level_up
        ? `You have successfully increased the level of ${levelupBar.value.ids.length} talent`
        : `You have successfully approved the direction of ${levelupBar.value.ids.length} talent`,
      {
        type: 'success',
        timeout: 1000,
      },
    );
  }

  levelupBar.value = { state: false, count: 0 };
  fastView.value = false;
  await getRequestByParam();
}
async function dismissRequest(id, multi = false) {
  if (!multi) {
    await requestStore.dismissRequestAction({
      id,
      levelupDirectionToggle,
    });
    nuxtApp.$alert.show('You have successfully dismiss the request', {
      type: 'danger',
      timeout: 1000,
    });
  } else {
    await requestStore.dismissMultiRequestAction({ ids: levelupBar.value.ids });
    nuxtApp.$alert.show(`You have successfully dismiss ${levelupBar.value.ids.length} requests`, {
      type: 'danger',
      timeout: 1000,
    });
  }
  fastView.value = false;
  levelupBar.value = { state: false, count: 0 };
  await getRequestByParam();
}
async function getRequestByParam(level = null) {
  levelFilter.value = level === levelFilter.value ? null : level;
  console.log({
    page: currentPage.value,
    level: levelFilter.value,
    urgent: isUrgentRequests.value,
    levelupDirectionToggle: levelupDirectionToggle.value,
  });
  await requestStore.getRequestsAction({
    page: currentPage.value,
    level: levelFilter.value,
    urgent: isUrgentRequests.value,
    levelupDirectionToggle: levelupDirectionToggle.value,
  });
}

watch(allRequestsData, (value) => {
  if (value) {
    baseRequests = JSON.parse(JSON.stringify(value));
  }
});
watch(filterId, (newValue) => {
  localStorage.setItem('filterId', newValue);
});

watch(
  () => route.query.tab,
  (value) => {
    if (value) {
      filterId.value = +value;
      isTableCheckActive.value = false;
    }
  },
);
</script>
<style lang="scss" scoped>
.levelup-requests {
  font-family: 'Basis Grotesque Pro', serif;
  .label {
    font-weight: 350;
  }
  .disabled {
    pointer-events: none;
  }
}
</style>
