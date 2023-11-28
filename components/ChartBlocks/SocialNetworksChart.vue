<template>
  <ChartSkeleton
    v-if="
      socialNetworkChartLoading ||
      !isChartSocialNetworkDataLoaded ||
      projectLoading ||
      !isProjectLoaded
    "
  />
  <chart-card
    style="height: 424px"
    :class="{
      'd-none':
        socialNetworkChartLoading ||
        !isChartSocialNetworkDataLoaded ||
        projectLoading ||
        !isProjectLoaded,
    }"
  >
    <div class="flex justify-between controler">
      <div class="flex gap-3 w-3/4 mb-5">
        <BadgeToggle
          big
          :id="type"
          :buttons="allTypes"
          @select="
            type = $event;
            getChartInfo();
          "
        ></BadgeToggle>
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
        !socialNetworkChartLoading &&
        isChartSocialNetworkDataLoaded &&
        !projectLoading &&
        isProjectLoaded &&
        !isEmptyChart
      "
      :data="chart.data"
      :labels="chart.labels"
    ></BaseLineChart>
    <EmptyChart
      v-else
      title="Looks like you don’t have any followers yet"
      icon="icons8-telegram-app"
    />
  </chart-card>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';
import { useProjectsStore } from '~/store/projects';

const projectsStore = useProjectsStore();
onMounted(() => {
  getChartInfo();
});

const props = defineProps(['projectId']);
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

let period = ref('m');
let type = ref('discord');
const projectId = computed(() => props.projectId);

const projectLoading = computed(() => projectsStore.getProjectLoading);
const isProjectLoaded = computed(() => projectsStore.getIsProjectLoaded);
const socialNetworkChartLoading = computed(() => projectsStore.getSocialNetworkChartLoading);
const dataComputed = computed(() => projectsStore.getSocialNetworkChart);
const isChartSocialNetworkDataLoaded = computed(
  () => projectsStore.getIsChartSocialNetworkDataLoaded,
);
const renderComponent = ref(true);

const forceRender = async () => {
  renderComponent.value = false;
  await nextTick();
  renderComponent.value = true;
};
const getChartInfo = async () => {
  projectsStore.getSocialNetworkChartAction(projectId.value, type.value, period.value);
  await forceRender();
};

const allTypes = computed(() => {
  return [
    {
      title: 'Telegram',
      id: 'telegram',
      backColor: 'none',
      color: '#000',
      type: 'transparent',
    },
    {
      title: 'Twitter',
      id: 'twitter',
      backColor: 'none',
      color: '#000',
      type: 'transparent',
    },
    {
      title: 'Discord',
      id: 'discord',
      backColor: 'none',
      color: '#000',
      type: 'transparent',
    },
    {
      title: 'Reddit',
      id: 'reddit',
      backColor: 'none',
      color: '#000',
      type: 'transparent',
    },
  ];
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
          label: '',
        },
      ];
      return {
        data: dates,
        labels: original.labels,
      };
    } else {
      return [];
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
