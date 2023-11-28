<template>
  <ChartSkeleton v-if="chartDataLoading || !isChartDataLoaded" />
  <chart-card style="height: 424px" :class="{ 'd-none': chartDataLoading || !isChartDataLoaded }">
    <div class="flex justify-between controler">
      <div v-if="allTagsOptions && allTagsOptions.length" class="flex mb-5 gap-3 w-3/4">
        <BadgeCheckbox
          big
          :buttons="allTagsOptions.length > 9 ? allTagsOptions.slice(0, 9) : allTagsOptions"
          @selected-ids="handleSelectedIds"
          :hiddenSelected="selectedId && selectedId.length > 0"
          :resetButtonsFlag="reset"
        ></BadgeCheckbox>
        <HiddenSelect
          v-if="allTagsOptions.length > 8"
          :resetButtonsFlag="reset"
          :options="allTagsOptions.slice(9)"
          @select="handleSelectedId"
        ></HiddenSelect>
      </div>
      <div>
        <info-toggle :buttons="datesChars" :id="2" @select="selectPeriod($event)"></info-toggle>
      </div>
    </div>

    <BaseLineChart
      v-if="
        chartProjects &&
        chartProjects.labels &&
        chartProjects.labels.length &&
        chartProjects.data &&
        chartProjects.data.length &&
        renderComponent &&
        !chartDataLoading &&
        isChartDataLoaded &&
        !isEmptyChart
      "
      :data="chartProjects.data"
      :labels="chartProjects.labels"
    ></BaseLineChart>
    <EmptyChart
      v-else
      title="No project has yet been established"
      icon="icons8-futurama-zoidberg"
    />
  </chart-card>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';
import { useDashboardStore } from '~/store/dashboard';
import { useProjectsStore } from '~/store/projects';
import EmptyChart from './EmptyChart';
const dashboardStore = useDashboardStore();
const projectsStore = useProjectsStore();

onMounted(() => {
  dashboardStore.getTagsAction();
  getLabels();
  getChartInfo();
});
const datesChars = [
  { title: 'D', id: 'd' },
  { title: 'W', id: 'w' },
  { title: 'M', id: 'm' },
  { title: 'Q', id: 'm3' },
  { title: 'Y', id: 'y' },
];

const isEmptyChart = computed(() => {
  const arr = chartProjects.value.data.map((item) => {
    return item.data.filter((i) => i === 0).length === item.data.length;
  });

  if (arr.length) {
    return arr.filter((i) => i !== false).length === arr.length;
  } else {
    return false;
  }
});

const dataComputed = computed(() => projectsStore.getProjectsChart);
const chartDataLoading = computed(() => projectsStore.getChartDataLoading);
const isChartDataLoaded = computed(() => projectsStore.getIsChartDataLoaded);
const tagsData = computed(() => projectsStore.getProjectChartLabels);
let period = ref('m');
let tag = ref(0);
let reset = ref(false);
const renderComponent = ref(true);

const forceRender = async () => {
  renderComponent.value = false;
  await nextTick();
  renderComponent.value = true;
};
const getLabels = async () => {
  await projectsStore.getProjectChartLabelsAction(period.value);
  await resetBtns();
};
const getChartInfo = async () => {
  const ids = [...selectedElements.value, ...selectedId.value];
  await projectsStore.getProjectsChartAction(period.value, ids);
  await forceRender();
};
const resetBtns = async () => {
  reset.value = true;
  selectedElements.value = [0];
  selectedId.value = '';
  await nextTick();
  reset.value = false;
};

let selectedElements = ref([0]);
let selectedId = ref([]);
const handleSelectedIds = async (selectedIds) => {
  selectedElements.value = selectedIds;
  await getChartInfo();
};
const handleSelectedId = async (id) => {
  selectedId.value = id;
  await getChartInfo();
};

const projectChartTags = computed(
  () => {
    const original = tagsData.value;
    if (original && original.labels && original.labels.length) {
      return original.labels.map((i) => {
        return {
          title: i.name,
          id: i.id,
          value: i.count,
          backColor: i.colors.main,
          color: '#ffffff',
          colors: i.colors,
        };
      });
    }
  },
  { dependsOn: [tagsData] },
);
const allTagsOptions = computed(
  () => {
    if (projectChartTags.value) {
      return [
        {
          title: 'All',
          id: 0,
          type: 'transparent',
          backColor: '#AAA7CC',
          color: '#AAA7CC',
          value: tagsData.value.all,
        },
        ...projectChartTags.value,
      ];
    } else {
      return [
        {
          title: 'All',
          id: 0,
          type: 'transparent',
          value: 0,
          backColor: '#AAA7CC',
          color: '#AAA7CC',
        },
      ];
    }
  },
  { dependsOn: [projectChartTags] },
);

const chartProjects = computed(
  () => {
    const original = dataComputed.value;
    if (
      original &&
      original.data &&
      original.data.length &&
      original.labels &&
      original.labels.length &&
      allTagsOptions.value &&
      allTagsOptions.value.length
    ) {
      const dates = original.data.map((i) => {
        return {
          borderColor: allTagsOptions.value.find((item) => item.id == i.id).backColor,
          data: i.value,
          pointStyle: 'circle',
          pointRadius: 1,
          label: i.name,
          id: i.id,
        };
      });
      return {
        data: dates,
        labels: original.labels,
      };
    } else {
      return null;
    }
  },
  { dependsOn: [dataComputed, projectChartTags] },
);

const selectPeriod = async (e) => {
  period.value = e;

  await getLabels();
  await getChartInfo();
};
</script>

<style scoped>
.d-none {
  display: none;
}
</style>
