<template>
  <ChartSkeleton v-if="isChartTasksLoaded" />
  <chart-card style="height: 424px" :class="{ 'd-none': isChartTasksLoaded }">
    <div class="flex justify-between controler">
      <div class="flex gap-3 w-3/4 mb-2">
        <Select
          v-if="tasks && tasks.length > 0"
          :options="tasks"
          class="w-1/3"
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
import { computed, inject, nextTick, onMounted, ref } from 'vue';
import { useProjectsStore } from '~/store/projects';
import { useActivitiesStore } from '~/store/activities';
import { getBadgeTypeByName, getColorByClassName } from '@/util/helpers';
import BadgeCheckbox from '../BadgeCheckbox';

const props = defineProps(['projectId']);
const activityStore = useActivitiesStore();
const projectsStore = useProjectsStore();
onMounted(() => {
  activityStore.getActivitiesAction();
});
const roles = inject('roles');
const {
  isProjectAdministrator,
  isSuperAdmin,
  isProjectManager,
  isProjectOwner,
  isCatapultManager,
} = roles;

const datesChars = [
  { title: 'D', id: 'd' },
  { title: 'W', id: 'w' },
  { title: 'M', id: 'm' },
  { title: 'Q', id: 'm3' },
  { title: 'Y', id: 'y' },
];

const tasks = computed(() => {
  if (isProjectManager.value) {
    return [
      { name: 'Reviewed', id: 'reviewed' },
      { name: 'Overdue', id: 'overdue' },
    ];
  } else {
    return [
      { name: 'Created', id: 'created' },
      { name: 'Reviewed', id: 'reviewed' },
      { name: 'Overdue', id: 'overdue' },
    ];
  }
});
const dataComputed = computed(() => projectsStore.getTasksChart);
const isChartTasksLoaded = computed(() => projectsStore.getTasksChartLoading);
const chartLabels = computed(() => projectsStore.getTaskChartLabels);
let period = ref('m');
const selectedElements = ref([0]);
let task = ref(isProjectAdministrator.value ? { id: 'reviewed' } : { id: 'created' });

const renderComponent = ref(true);

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
const projectId = computed(() => props.projectId);
const handleSelectedIds = async (selectedIds) => {
  selectedElements.value = selectedIds;
  await getChartInfo();
};
const getLabels = async () => {
  selectedElements.value = [0];
  await projectsStore.getTasksChartLabelsAction(projectId.value, task.value.id, period.value);
  await resetBtns();
};
const getChartInfo = async () => {
  await projectsStore.getTasksChartAction(
    projectId.value,
    task.value.id,
    period.value,
    selectedElements.value,
  );
  //id, type, period, activity
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
          value: original.in_progress,
          title: 'In progress',
        },
        {
          value: original.on_revision,
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
          backColor: '#AAA7CC',
          color: '#AAA7CC',
          value: chartLabels.value.all,
          checked: true,
        },
        ...projectChartTags.value,
      ];
    } else {
      console.log(chartLabels.value.all);
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
      const dates = original.data.map((i) => {
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
