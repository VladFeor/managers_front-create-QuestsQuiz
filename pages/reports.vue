<template>
  <div class="reports-page">
    <h1 class="text-gray-900 text-[56px] leading-[72px] label">Reports</h1>
    <div class="mt-12 flex">
      <Select
        class="w-[182px] h-8"
        v-if="allProjects && allProjects.length > 0"
        :options="allProjects"
        @input="setProject"
        selected-label-style="!w-[140px] !break-all"
        :string-length="18"
      />

      <Select
        class="w-[142px] h-8 ml-[8px]"
        v-if="allReasons && allReasons.length > 0"
        :options="allReasons"
        @input="setReason"
        selected-label-style="!w-[120px] !break-all"
        :string-length-selected="16"
        :string-length-first="12"
        :string-length="20"
      />
    </div>
    <div class="mt-7">
      <BaseTable
        :columns="columns"
        :rows="rows"
        pointer
        title="You don't have reports in your projects"
        icon="icons8-futurama-bender"
        :sortFunction="sortReports"
        isSorting
        @clickFromComponent="openFastView"
      />
      <Pagination
        @pageChanged="nextPage($event)"
        :currentPage="page"
        v-if="!loading && loaded && rows && rows.length && allReports"
        :totalPages="pagination.total_pages"
      />
      <BaseModal
        custom-height="96%"
        top="16"
        right-custom="16"
        :width="600"
        @close="fastView = !fastView"
        :visible="fastView"
        btn-left
        body-classes="!h-full"
      >
        <ReportFastView
          :report="report"
          :loading="loading"
          @nextRow="nextRow"
          @prevRow="prevRow"
          @resolve="resolveReport"
          @unread="unreadReport"
          @delete="deleteReport"
        />
      </BaseModal>
    </div>
  </div>
</template>

<script setup>
import { useNuxtApp } from '#app';
import { useProjectsStore, useReportsStore } from '~/store';
import { Badge, Talent } from '~/components';
import defaultAvatar from '@/assets/images/User.png';
import defaultLogo from 'assets/images/protocol-oasis-bg.png';
import { formatDateCurrent, getProperty } from '~/util/helpers';
import ReadStatus from '~/components/ReadStatus.vue';
import NavigateArrow from '~/components/NavigateArrow.vue';

let baseReports = [];
let isMounted = false;
const nuxtApp = useNuxtApp();
const reportsStore = useReportsStore();
const projectStore = useProjectsStore();
const page = ref(1);
const project = ref(null);
const reason = ref(null);
const report = ref(null);
const reportIndex = ref(0);
const fastView = ref(false);
const route = useRoute();

onMounted(async () => {
  await projectStore.getProjectsAction();
  await projectStore.getReportTypesAction();
  if (route.query && route.query.page) {
    await nextPage(route.query.page);
  } else {
    await reportsStore.getReportsAction({
      page: page.value,
    });
  }
  isMounted = true;
});

const allProjects = computed(() => [{ id: 0, name: 'All Projects' }, ...projectStore.getProjects]);
const allReasons = computed(() => [
  { id: 0, name: 'All Reasons' },
  ...projectStore.getReportTypes.map((reason) => ({ id: reason.id, name: reason.type })),
]);
const allReports = computed(() => reportsStore.getReports.data);
const pagination = computed(() => reportsStore.getReports.pagination);
const loaded = computed(() => reportsStore.getLoaded);
const loading = computed(() => reportsStore.getLoading);

const getReportsByParams = (params = {}) => {
  reportsStore.getReportsAction({
    page: params.page ? params.page : page.value,
    project_id: project.value && project.value.id > 0 ? project.value.id : null,
    type_id: reason.value && reason.value.id > 0 ? reason.value.id : null,
  });
};

const columns = ref([
  { prop: 'status', label: '', width: '15%' },
  { prop: 'talent', label: 'Talent', width: '150%' },
  { prop: 'project', label: 'Project', width: '100%' },
  { prop: 'date', label: 'Date', width: '100%' },
  { prop: 'reason', label: 'Reason', width: '100%' },
  { prop: 'goto', label: '', width: '10%' },
]);
const rows = ref([]);
async function nextRow() {
  if (reportIndex.value + 1 < allReports.value.length) {
    report.value = allReports.value[reportIndex.value + 1];
    reportIndex.value++;
  } else if (page.value < pagination.value.total_pages) {
    page.value = page.value + 1;
    await getReportsByParams();
    reportIndex.value = 0;
    report.value = allReports.value[reportIndex.value];
  }
}
async function prevRow() {
  if (reportIndex.value - 1 >= 0) {
    report.value = allReports.value[reportIndex.value - 1];
    reportIndex.value--;
  } else if (page.value > 1) {
    page.value = page.value - 1;
    await getReportsByParams();
    reportIndex.value = allReports.value.length - 1;
    report.value = allReports.value[reportIndex.value];
  }
}

const setProject = (value) => {
  project.value = value;
  getReportsByParams({ page: 1 });
};
const setReason = (value) => {
  reason.value = value;
  getReportsByParams({ page: 1 });
};
const sortReports = (prop, direction) => {
  if (!isMounted) return;

  if (prop === 'talent') {
    sortFunc('ambassador.name', direction);
  }
  if (prop === 'project') {
    sortFunc('project.name', direction);
  }
  if (prop === 'date') {
    sortFunc('created_at', direction);
  }
  if (prop === 'reason') {
    sortFunc('type.type', direction);
  }
};
const sortFunc = (prop, direction) => {
  if (direction === 'none') {
    reportsStore.setReports(baseReports);

    console.log(reportsStore.getReports);
    return;
  }

  allReports.value.sort((a, b) => {
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
};
const nextPage = (data) => {
  page.value = data;
  getReportsByParams();
};

const openFastView = (value) => {
  report.value = value;
  report.value.status = 1;
  fastView.value = true;
  reportsStore.updateReportAction({
    id: report.value.id,
    status: 1,
  });
  getReportsByParams();
};
const resolveReport = async (value) => {
  let res = await reportsStore.updateReportAction({
    id: report.value.id,
    status: 2,
  });
  await getReportsByParams();
  if (res && res?.status !== 204) {
    nuxtApp.$alert.show(res.response.data.message, {
      type: 'error',
      timeout: 5000,
    });
  } else {
    fastView.value = false;
    report.value = null;
    nuxtApp.$alert.show('You have successfully resolved the report', {
      type: 'success',
      timeout: 5000,
    });
  }
};
const unreadReport = async (value) => {
  let res = await reportsStore.updateReportAction({
    id: report.value.id,
    status: 0,
  });
  await getReportsByParams();

  if (res && res?.status !== 204) {
    nuxtApp.$alert.show(res.response.data.message, {
      type: 'error',
      timeout: 5000,
    });
  } else {
    fastView.value = false;
    report.value = null;
    nuxtApp.$alert.show('You have successfully changed status of the report', {
      type: 'success',
      timeout: 5000,
    });
  }
};
const deleteReport = async (value) => {
  let res = await reportsStore.deleteReportAction(report.value.id);
  await getReportsByParams();
  if (res && res?.status !== 204) {
    nuxtApp.$alert.show(res.response.data.message, {
      type: 'error',
      timeout: 5000,
    });
  } else {
    fastView.value = false;
    report.value = null;
    nuxtApp.$alert.show('You have successfully deleted the report', {
      type: 'success',
      timeout: 5000,
    });
  }
};

watch(
  allReports,
  (reports) => {
    if (reports) {
      baseReports = (() => reports)();
      rows.value = reports.map((r) => ({
        status: {
          component: ReadStatus,
          props: {
            value: r.status,
          },
        },
        talent: {
          component: Talent,
          props: {
            text: r.ambassador.name,
            img: r.ambassador.avatar ?? defaultAvatar,
            square: false,
          },
        },
        project: {
          component: Talent,
          props: {
            text: r.project.name,
            img: r.project.logo ?? defaultLogo,
            square: true,
          },
        },
        date: {
          component: Badge,
          props: {
            text: formatDateCurrent(r.created_at),
            transparent: true,
          },
        },
        reason: {
          component: Badge,
          props: {
            text: r.type.type,
            transparent: true,
            noBorder: true,
          },
        },
        goto: {
          component: NavigateArrow,
          props: {
            value: r,
          },
        },
      }));
    }
  },
  { deep: true },
);
</script>

<style scoped lang="scss">
.reports-page {
  font-family: 'Basis Grotesque Pro';
  .label {
    font-weight: 350;
  }
}
</style>
