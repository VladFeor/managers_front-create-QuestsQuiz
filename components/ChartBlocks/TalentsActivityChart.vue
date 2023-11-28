<template>
  <ChartSkeleton v-if="talentActivityLoading" />
  <chart-card style="height: 424px" :class="{ 'd-none': talentActivityLoading }">
    <div class="flex justify-between controler">
      <div
        v-if="talentsActivityChartTags && talentsActivityChartTags.length"
        class="flex gap-3 w-3/4 mb-2"
      >
        <Select
          :options="activities"
          class="w-1/3"
          @input="
            activity = $event;
            getChartInfo();
          "
        ></Select>

        <BadgeToggle
          big
          id="all"
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
import { computed, inject, nextTick, onMounted, ref } from 'vue';
import { useTalentsStore } from '~/store/talents';
import { useActivitiesStore } from '~/store/activities';
import { useUserStore } from '~/store';

const activityStore = useActivitiesStore();
const talentsStore = useTalentsStore();
onMounted(() => {
  activityStore.getActivitiesAction();
});
const datesChars = [
  { title: 'D', id: 'd' },
  { title: 'W', id: 'w' },
  { title: 'M', id: 'm' },
  { title: 'Q', id: 'm3' },
  { title: 'Y', id: 'y' },
];
const props = defineProps(['projectId']);
const dataComputed = computed(() => talentsStore.getTalentActivity);
const talentActivityLoading = computed(() => talentsStore.getTalentActivityLoading);
const tagsData = computed(() => activityStore.getActivities);
const talentValue = computed(() => talentsStore.getTalentActivityLabels);
let period = ref('m');
let type = ref('all');
let activity = ref({ name: null });
const renderComponent = ref(true);
const myProject = computed(() => useUserStore().getUserProjectId);
const roles = inject('roles');

const { isSuperAdmin, isCatapultManager } = roles;

const forceRender = async () => {
  renderComponent.value = false;
  await nextTick();
  renderComponent.value = true;
};
const getChartInfo = async () => {
  if (isSuperAdmin.value && !props.projectId) {
    await talentsStore.getTalentActivityLabelsAction(period.value);
    await talentsStore.getTalentActivityAction(period.value, activity.value.id, type.value);
  } else {
    await talentsStore.getTalentActivityLabelsAction(
      period.value,
      myProject.value || props.projectId,
    );
    await talentsStore.getTalentActivityAction(
      period.value,
      activity.value.id,
      type.value,
      myProject.value || props.projectId,
    );
  }

  await forceRender();
};
const isEmptyChart = computed(() => {
  console.log(chart.value.data);
  const arr = chart.value.data.map((item) => {
    return item.data.filter((i) => i === 0).length === item.data.length;
  });

  if (arr.length) {
    return arr.filter((i) => i !== false).length === arr.length;
  } else {
    return false;
  }
});

const talentsActivityChartTags = computed(() => {
  const original = tagsData.value;
  if (original && original.length) {
    let obj = original.map((i) => {
      return {
        title: i.name,
        id: i.id,
      };
    });
    return obj;
  }
});
const allTypes = computed(
  () => {
    const res = [
      {
        title: 'All',
        id: 'all',
        backColor: 'none',
        color: '#000',
        type: 'transparent',
        value: talentValue.value.all,
      },
      {
        title: 'Not Active',
        id: 'not_active',
        backColor: 'none',
        color: '#000',
        type: 'transparent',
        value: talentValue.value.not_active,
      },
    ];
    return res;
  },
  { dependsOn: [talentValue] },
);

const activities = computed(() => {
  const original = tagsData.value;
  const res = [
    {
      name: 'All Directions',
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
      original.labels.length &&
      activity.value &&
      activity.value.name
    ) {
      const dates = [
        {
          borderColor: '#AAA7CC',
          data: original.data,
          pointStyle: 'circle',
          pointRadius: 1,
          label: activity.value.name,
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
  { dependsOn: [dataComputed, activity] },
);
</script>

<style scoped>
.d-none {
  display: none;
}
</style>
