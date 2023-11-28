<template>
  <div class="action">
    <Icon name="Right-Arrow" :size="24" @click="showPreview"></Icon>
  </div>
  <BaseModal
    :width="600"
    :top="10"
    :rightCustom="10"
    :bottom="10"
    customHeight="auto"
    :visible="show"
    btnLeft
    @close="showPreview"
  >
    <div class="modal-container">
      <div class="head">
        <span class="title">{{ item.name }}</span>
        <div class="controller">
          <div class="switch">
            <Icon name="Left" :size="24" @click="$emit('prev')"></Icon>
          </div>
          <div class="switch">
            <Icon name="Right" :size="24" @click="$emit('next')"></Icon>
          </div>
        </div>
      </div>
      <div class="go-to" @click="router.push(`tasks/task/${item.id}`)">
        Go to the Task <Icon name="Right-Arrow" :size="24"></Icon>
      </div>
      <div class="info">
        <Badge :text="formatDateCurrent(timestampToString(item.started_at))" type="transparent" /> -
        <Badge :text="formatDateCurrent(timestampToString(item.ended_at))" type="transparent" />
        <Status :status="item.status"></Status>
        <Badge text="Invites" :value="item.number_of_invites || 'Unlimited'" type="transparent" />
        <Badge text="Referrers" :value="item.ambassadors_count || '0'" type="transparent" />
        <Badge text="Referred Talents" :value="item.referrals_count || '0'" type="transparent" />
      </div>
      <div>
        <TasksSelect
          class="referrals-list"
          :isClear="isClear"
          :setIsClear="setIsClear"
          filter
          :options="options"
          type="project"
          :setIsFilterActive="setIsProjectsFilterActive"
          :reduceLength="14"
          @input="filter"
        />
      </div>
      <CollapseTable
        :columns="allCols"
        :rows="referralsTable"
        pointer
        title="No referrals yet"
        icon="icons8-futurama-bender"
      />
    </div>
  </BaseModal>
</template>
<script setup>
import { computed, ref } from 'vue';
import { formatDateCurrent, timestampToString } from '~/util/helpers';
import Talent from '~/components/Talent.vue';
import defaultBg from '@/assets/images/default-avatar.png';
import Badge from '~/components/Badge.vue';
import EmptyComponent from '~/components/EmptyComponent.vue';
const router = useRouter();

const show = ref(false);
const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
  index: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['current']);

const showPreview = () => {
  show.value = !show.value;
  emit('current', props.index);
};

const isProjectsFilterActive = ref(false);

const setIsProjectsFilterActive = (value) => {
  isProjectsFilterActive.value = value;
};
const isClear = ref(false);

const setIsClear = (value) => {
  isClear.value = value;
};
const options = computed(() => {
  const refs = props.item.referrals.map((i) => {
    return {
      name: i.ambassador.name,
      id: i.ambassador.id,
    };
  });

  const referrals = [
    {
      name: 'All Referrers',
      id: '',
    },
  ].concat(refs);
  return referrals;
});
const dataList = computed(() => props.item.referrals);
const filter = (el) => {
  const newList = dataList.value.filter((item) => item.ambassador.name === el.name);
  if (newList.length > 0) {
    dataList.value = props.item.referrals.filter((item) => item.ambassador.name === el.name);
  } else {
    dataList.value = props.item.referrals;
  }
};
const referralsTable = computed(() => {
  const data = dataList.value;
  console.log(data);
  if (!data || (data && !data.length)) {
    return [];
  }

  return data.map((item) => {
    const talents = item.referrals.map((el, i) => {
      return {
        component: Talent,
        props: {
          text: el.referral.name,
          img: el.referral.avatar || defaultBg,
        },
        id: i,
      };
    });
    const dates = item.referrals.map((el, i) => {
      return {
        component: Badge,
        props: {
          text: formatDateCurrent(el.created_at),
        },
        id: i,
      };
    });
    return {
      referr: {
        component: Talent,
        props: {
          text: item.ambassador ? item.ambassador.name : '',
          img: item.ambassador.avatar || defaultBg,
        },
      },

      talents: {
        singleComponent: {
          component: Badge,
          props: {
            text: `${item.referrals.length || 0}  ${
              item.referrals.length > 1 ? 'talents' : 'talent'
            }`,
          },
        },
        components: talents,
      },
      date: {
        singleComponent: {
          component: EmptyComponent,
        },
        components: dates,
      },
    };
  });
});
const allCols = computed(() => {
  return [
    { prop: 'referr', label: 'Referrer & Amount', width: '180%' },
    { prop: 'talents', label: 'Referred Talents', width: '150%' },
    { prop: 'date', label: 'Date', width: '120%' },
  ];
});
</script>

<style scoped lang="scss">
.action {
  display: flex;
  width: 32px;
  height: 32px;
  padding: 4px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: $default-badge-border;
  cursor: pointer;
}

.modal-container {
  display: flex;
  flex-direction: column;
  padding: 40px;
  min-height: 100vh;
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      color: $default;
      font-family: 'Basis Grotesque Pro';
      font-size: 32px;
      font-style: normal;
      font-weight: 400;
      line-height: 40px;
    }
    .controller {
      display: flex;
      gap: 8px;
      align-items: center;
      .switch {
        display: flex;
        width: 32px;
        height: 32px;
        padding: 4px;
        align-items: center;
        gap: 8px;
        border-radius: 8px;
        background: $default-badge-border;
        cursor: pointer;
      }
    }
  }
  .go-to {
    margin: 16px 0;
    display: flex;
    gap: 8px;
    color: $secondary;
    font-family: 'Basis Grotesque Pro';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
  }
  .info {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    width: 70%;
  }
  .referrals-list {
    margin: 16px 0;
  }
}
</style>
