<template>
  <ChartSkeleton v-if="managersEffectivenessLoading" />
  <chart-card style="height: 424px" :class="{ 'd-none': managersEffectivenessLoading }">
    <div class="flex justify-between controler">
      <div
        v-if="talentsActivityChartTags && talentsActivityChartTags.length"
        class="flex gap-3 w-3/4"
      >
        <Select
          :options="allManagers"
          scrollHorizontalHidden
          class="w-1/3"
          @input="
            manager = $event;
            getChartInfo();
          "
          :stringLengthSelected="16"
          :string-length="14"
        ></Select>

        <BadgeToggle
          big
          id="reviewed"
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
        !managersEffectivenessLoading &&
        !isEmptyChart
      "
      :data="chart.data"
      :labels="chart.labels"
    ></BaseLineChart>
    <EmptyChart v-else title="The managers are still resting" icon="icons8-futurama-fry" />
  </chart-card>
</template>

<script setup>
import { computed, inject, nextTick, onMounted, ref } from 'vue';
import { useManagersStore } from '~/store/managers';
import { useUserStore } from '~/store';
const userStore = useUserStore();
const projectID = computed(() => userStore.getUserProjectId);
const managersStore = useManagersStore();
onMounted(() => {
  getChartInfo();
  if (!isSuperAdmin.value) {
    managersStore.getManagersAction('', userStore.getUserProjectId);
  } else {
    managersStore.getAutocompleteAction();
  }
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
const props = defineProps(['projectId']);

const dataComputed = computed(() => managersStore.getManagersEffectiveness);
const managersEffectivenessLoading = computed(() => managersStore.getManagersEffectivenessLoading);
const managers = computed(() => managersStore.getManagers);
const autocomplete = computed(() => managersStore.getAutocomplete);
const labelsValue = computed(() => managersStore.getManagersEffectivenessLabels);

let period = ref('m');
let type = ref('reviewed');
let manager = ref(0);
const renderComponent = ref(true);

const forceRender = async () => {
  renderComponent.value = false;
  await nextTick();
  renderComponent.value = true;
};
const roles = inject('roles');

const { isSuperAdmin, isProjectAdministrator } = roles;
const getChartInfo = async () => {
  await managersStore.getManagersEffectivenessLabelsAction(
    period.value,
    manager.value?.id || 0,
    props.projectId || projectID.value,
  );

  await managersStore.getManagersEffectivenessAction(
    period.value,
    type.value,
    manager.value?.id || null,
    props.projectId || projectID.value,
  );

  await forceRender();
};

const talentsActivityChartTags = computed(() => {
  let original;
  if (!isSuperAdmin.value) {
    original = managers.value;
  } else {
    original = autocomplete.value;
  }

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
        title: 'Reviewed Tasks',
        id: 'reviewed',
        backColor: 'none',
        color: '#000',
        type: 'transparent',
        value: labelsValue.value.reviewed,
      },
      {
        title: 'Overdue',
        id: 'overdue',
        backColor: 'none',
        color: '#000',
        type: 'transparent',
        value: labelsValue.value.overdue,
      },
    ];
    return res;
  },
  { dependsOn: [labelsValue] },
);

const allManagers = computed(() => {
  let original;

  console.log(original, 777);

  if (!isSuperAdmin.value) {
    original = managers.value;
  } else {
    original = autocomplete.value;
  }
  console.log(original, 777);

  const res = [
    {
      name: 'All Managers',
      id: null,
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
          label: '',
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
