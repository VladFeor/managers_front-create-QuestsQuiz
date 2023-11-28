<template>
  <ChartSkeleton v-if="talentActivityLoading" />
  <chart-card style="height: 424px" :class="{ 'd-none': talentActivityLoading }">
    <div class="flex justify-between controler">
      <div class="flex gap-3 w-1/3 mb-2">
        <Select
          :options="allProjects"
          class="w-full"
          @input="
            project = $event;
            getChartInfo();
          "
        ></Select>
      </div>
      <div>
        <info-toggle
          :buttons="datesChars"
          :id="2"
          @select="
            period = $event;
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
        !talentActivityLoading &&
        !isEmptyChart
      "
      :data="chart.data"
      :labels="chart.labels"
    ></BaseLineChart>

    <EmptyChart v-else title="No talent has yet joined you" icon="icons8-futurama-amy-wong" />
  </chart-card>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';
import { useProjectsStore } from '~/store/projects';
import { useActivitiesStore } from '~/store/activities';

const projectsStore = useProjectsStore();
const datesChars = [
  { title: 'D', id: 'd' },
  { title: 'W', id: 'w' },
  { title: 'M', id: 'm' },
  { title: 'Q', id: 'm3' },
  { title: 'Y', id: 'y' },
];
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

const dataComputed = computed(() => projectsStore.getProjectsMembersChart);
const talentActivityLoading = computed(() => projectsStore.getProjectsMembersChartLoading);
const projects = computed(() => projectsStore.getProjects);
let period = ref('m');
let project = ref(0);
const renderComponent = ref(true);

const forceRender = async () => {
  renderComponent.value = false;
  await nextTick();
  renderComponent.value = true;
};
const getChartInfo = async () => {
  await projectsStore.getProjectsMembersChartAction(period.value, project.value.id);
  await forceRender();
};
const allProjects = computed(() => {
  const original = projects.value;
  const res = [
    {
      name: 'All Projects',
      id: 0,
    },
    ...original,
  ];
  return res;
});
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
      const dates = [
        {
          borderColor: '#AAA7CC',
          data: original.data,
          pointStyle: 'circle',
          pointRadius: 1,
          label: project.value.name,
          id: '',
        },
      ];
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
