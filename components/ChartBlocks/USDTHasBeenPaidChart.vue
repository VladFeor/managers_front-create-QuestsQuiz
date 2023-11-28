<template>
  <ChartSkeleton v-if="isChartDataLoaded" />
  <chart-card style="height: 424px" :class="{ 'd-none': isChartDataLoaded }">
    <div class="flex justify-between controler">
      <div v-if="allTagsOptions && allTagsOptions.length" class="flex gap-3 w-3/4">
        <BadgeToggle
          big
          id="all"
          :buttons="allTagsOptions"
          @select="
            activity = $event;
            getChartInfo();
          "
        ></BadgeToggle>
      </div>
      <div>
        <info-toggle :buttons="datesChars" :id="2" @select="selectPeriod($event)"></info-toggle>
      </div>
    </div>
    <BaseLineChart
      v-if="
        chart &&
        chart.labels &&
        chart.labels.length &&
        chart.data &&
        chart.data.length &&
        !isEmptyChart &&
        !isChartDataLoaded
      "
      :data="chart.data"
      :labels="chart.labels"
      :stats="stats"
    ></BaseLineChart>
    <EmptyChart v-else title="You haven’t paid a cent yet" icon="icons8-futurama-bender" />
  </chart-card>
</template>

<script setup>
import { computed, inject, nextTick, onMounted, ref } from 'vue';
import { useInnerWalletStore } from '~/store/innerWallet';
import EmptyChart from './EmptyChart';
import { formatNumber } from '~/util/helpers';
import { useUserStore } from '~/store';
const innerWalletStore = useInnerWalletStore();

onMounted(() => {
  getLabels();
  getChartInfo();
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
const dataComputed = computed(() => innerWalletStore.getUSDTChart);
const isChartDataLoaded = computed(() => innerWalletStore.isChartUSDTDataLoaded);
const tagsData = computed(() => innerWalletStore.getUSDTLabels);
let period = ref('m');
let activity = ref('all');
let reset = ref(false);
const renderComponent = ref(true);

const forceRender = async () => {
  renderComponent.value = false;
  await nextTick();
  renderComponent.value = true;
};
const props = defineProps(['projectId']);

const getLabels = async () => {
  if (isSuperAdmin.value && !props.projectId) {
    await innerWalletStore.getUSDTLabelsChartAction(period.value);
  } else {
    await innerWalletStore.getUSDTLabelsChartAction(
      period.value,
      myProject.value || props.projectId,
    );
  }
  await resetBtns();
};
const stats = computed(
  () => {
    const original = tagsData.value;
    if (original) {
      return [
        {
          value:
            (original.are_pending_withdraw ? formatNumber(original.are_pending_withdraw, 5) : 0) +
            ' talents',
          title: 'are pending withdraw',
        },
        {
          value: original.total_to_be_paid
            ? formatNumber(original.total_to_be_paid, 5) + ' USDT'
            : '0' + ' USDT',
          title: 'total to be paid',
        },
      ];
    }
  },
  { dependsOn: [tagsData] },
);
const roles = inject('roles');

const { isSuperAdmin } = roles;
const myProject = computed(() => useUserStore().getUserProjectId);
const getChartInfo = async () => {
  if (isSuperAdmin.value && !props.projectId) {
    await innerWalletStore.getUSDTChartAction(period.value);
  } else {
    await innerWalletStore.getUSDTChartAction(period.value, myProject.value || props.projectId);
  }
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

const USDTChartTags = computed(
  () => {
    const original = tagsData.value;
    if (original && original.labels && original.labels.length) {
      return original.labels.map((i) => {
        return {
          title: i.name,
          id: 'all',
          backColor: 'none',
          color: '#000',
          type: 'transparent',
          value: i.count,
        };
      });
    }
  },
  { dependsOn: [tagsData] },
);
const allTagsOptions = computed(
  () => {
    if (USDTChartTags.value) {
      return [...USDTChartTags.value];
    }
  },
  { dependsOn: [USDTChartTags] },
);

const chart = computed(
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
      const dates = [
        {
          borderColor: '#AAA7CC',
          data: original.data.map((i) => {
            return i ? formatNumber(i) : 0;
          }),
          pointStyle: 'circle',
          pointRadius: 1,
          label: 'All',
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
  { dependsOn: [dataComputed, USDTChartTags] },
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
.controler {
  margin-bottom: 24px;
}
</style>
