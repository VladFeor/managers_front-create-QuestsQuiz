<template>
  <ChartSkeleton v-if="allTasksLoading || !isChartAllTasksLoaded" />
  <chart-card
    style="height: 424px"
    :class="{ 'd-none': allTasksLoading || !isChartAllTasksLoaded }"
  >
    <div class="flex justify-between controler">
      <div class="flex gap-3 w-3/4 mb-2">
        <Select
          :options="tasks"
          style="width: 160px"
          @input="
            task = $event;
            getLabels();
            getChartInfo();
          "
        ></Select>
        <BadgeCheckbox
          v-if="allTagsOptions && allTagsOptions.length"
          big
          :buttons="allTagsOptions"
          @selected-ids="handleSelectedIds"
          :resetButtonsFlag="reset"
        ></BadgeCheckbox>
      </div>
      <div>
        <info-toggle
          :buttons="datesChars"
          :id="2"
          @select="
            period = $event;
            getLabels();
            getChartInfo();
          "
        ></info-toggle>
      </div>
    </div>
    <BaseLineChart
      v-if="
        chart &&
        chart.labels &&
        chart.labels.length &&
        chart.data &&
        chart.data.length &&
        renderComponent &&
        !allTasksLoading &&
        isChartAllTasksLoaded &&
        !isEmptyChart
      "
      :data="chart.data"
      :labels="chart.labels"
      :stats="stats"
    ></BaseLineChart>
    <EmptyChart
      v-else
      title="You haven’t created a single task yet"
      icon="icons8-futurama-nibbler"
    />
  </chart-card>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';
import { useProjectsStore } from '~/store/projects';
import { useActivitiesStore } from '~/store/activities';
import { getBadgeTypeByName, getColorByClassName, formatNumberMore10K } from '@/util/helpers';
import BadgeCheckbox from '../BadgeCheckbox';

const activityStore = useActivitiesStore();
const projectsStore = useProjectsStore();
onMounted(() => {
  activityStore.getActivitiesAction();
});

const isEmptyChart = computed(() => {
  const arr = chart.value.data.map((item) => {
    return item.data.filter((i) => i === 0).length === item.data.length;
  });

  if (arr.length) {
    return arr.filter((i) => i !== false).length === arr.length;
  } else {
    return false;
  }
});

const datesChars = [
  { title: 'D', id: 'd' },
  { title: 'W', id: 'w' },
  { title: 'M', id: 'm' },
  { title: 'Q', id: 'm3' },
  { title: 'Y', id: 'y' },
];
const tasks = [
  { name: 'Created', id: 'created' },
  { name: 'Reviewed', id: 'reviewed' },
  { name: 'Overdue', id: 'overdue' },
];
const dataComputed = computed(() => projectsStore.getAllTasksChart);
const allTasksLoading = computed(() => projectsStore.getAllTasksChartLoading);
const isChartAllTasksLoaded = computed(() => projectsStore.getIsChartAllTasksLoaded);
const chartLabels = computed(() => projectsStore.getAllTaskChartLabels);
let period = ref('m');
let task = ref({ id: 'created' });

const renderComponent = ref(true);
const selectedElements = ref([0]);

const handleSelectedIds = async (selectedIds) => {
  console.log(selectedIds);
  selectedElements.value = selectedIds;
  await getChartInfo();
};
const forceRender = async () => {
  renderComponent.value = false;
  await nextTick();
  renderComponent.value = true;
};
let reset = ref(false);
const resetBtns = async () => {
  reset.value = true;
  await nextTick();
  reset.value = false;
};

const getLabels = async () => {
  selectedElements.value = [0];
  await projectsStore.getAllTasksChartLabelsAction(task.value.id, period.value);
  await resetBtns();
};
const getChartInfo = async () => {
  await projectsStore.getAllTasksChartAction(task.value.id, period.value, selectedElements.value);
  await forceRender();
};

const projectChartTags = computed(
  () => {
    const original = chartLabels.value;
    if (original && original.labels && original.labels.length) {
      return original.labels.map((i) => {
        return {
          title: i.name,
          id: i.id,
          type: getBadgeTypeByName(i.name),
          value: i.count,
        };
      });
    }
  },
  { dependsOn: [chartLabels] },
);
const stats = computed(
  () => {
    const original = chartLabels.value;
    if (original) {
      return [
        {
          value: formatNumberMore10K(+original.in_progress),
          title: 'In progress',
        },
        {
          value: formatNumberMore10K(+original.on_revision),
          title: 'On revision',
        },
      ];
    }
  },
  { dependsOn: [chartLabels] },
);
const allTagsOptions = computed(
  () => {
    if (projectChartTags.value) {
      return [
        {
          title: 'All',
          id: 0,
          type: 'transparent',
          value: formatNumberMore10K(+chartLabels.value.all),
          backColor: '#AAA7CC',
          color: '#AAA7CC',
          checked: true,
        },
        ...projectChartTags.value,
      ];
    } else {
      return [
        {
          title: 'All',
          id: 0,
          type: 'transparent',
          value: chartLabels.value.all || 0,
          backColor: '#AAA7CC',
          color: '#AAA7CC',
          checked: true,
        },
      ];
    }
  },
  { dependsOn: [projectChartTags] },
);

const chart = computed(
  () => {
    const original = dataComputed.value;
    if (
      original &&
      original.data &&
      original.data.length &&
      original.labels &&
      original.labels.length
    ) {
      const dates = original.data.map((i, idx) => {
        console.log(getColorByClassName(getBadgeTypeByName(i.name)));
        return {
          borderColor: getColorByClassName(getBadgeTypeByName(i.name)),
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
  { dependsOn: [dataComputed] },
);
</script>

<style scoped>
.d-none {
  display: none;
}
</style>
