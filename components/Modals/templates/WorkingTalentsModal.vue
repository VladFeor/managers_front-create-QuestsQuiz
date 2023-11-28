<template>
  <div class="working-talents">
    <div class="working-talents_title"><span>Talents {{ statusLabel }} on the Task</span></div>
    <div class="working-talents_filter"> 
      <FilterToggle
        :buttons="buttons"
        bgLight
        :id="0"
        @select="setIsShowWorkingTalent($event)"
        :centered="true"
      />
    </div>
    
    <div v-if="talents && talents.length" class="working-talents_cards">
      <div v-for="talent in talents" :key="talent.id" class="working-talents_card">
        <Talent :text="talent.name" :img="talent.avatar.original_url" />
      </div>
    </div>
  </div>
</template>

<script setup>
import axiosService from '~~/service/axiosService';
import { ref, onMounted } from 'vue';
import { reduceStringLength, checkIsPropertyExist, modifyStringSpaces } from '@/util/helpers';

onMounted(() => {
  if (props.taskId) {
    getTalents();
    getTalentsLabels();
  }
});

const props = defineProps({
  taskId: { type: Number, default: null },
  isOnChain: { type: Boolean, default: false },
  statusByDates: { type: String, default: "available" }
});

const selectedTalent = ref(0);
const talents = ref([]);
const counts = ref([]);
const labels = ref([]);

const statusLabel = computed(() => {
  return props.statusByDates === 'available' ? 'working' : 'worked'
});

const buttons = computed(() => {
  if (props.isOnChain) {
    const defaultButtons = [
      {
        title: `All ${labels.value && checkIsPropertyExist(labels.value, 'total') ? labels.value.total : ''}`,
        id: 0,
        name: `All`,
      }
    ];
    if (props.statusByDates === "available") {
      return [
        ...defaultButtons,
        {
          title: `In Progress ${
            labels.value && checkIsPropertyExist(labels.value, 'in_progress') ? labels.value.in_progress : ''
          }`,
          id: 1,
          name: 'In Progress',
        },
        {
          title: `Done ${
            labels.value && checkIsPropertyExist(labels.value, 'completed') ? labels.value.completed : ''
          }`,
          id: 4,
          name: 'Done',
        },
      ];
    } else if (props.statusByDates === "finished") {
      return [
        ...defaultButtons,
        {
          title: `Done ${
            labels.value && checkIsPropertyExist(labels.value, 'completed') ? labels.value.completed : ''
          }`,
          id: 4,
          name: 'Done',
        },
        {
          title: `Overdue ${
            labels.value && checkIsPropertyExist(labels.value, 'overdue') ? labels.value.overdue : ''
          }`,
          id: 7,
          name: 'Overdue',
        }
      ]
    }
  } else {
    return [
      {
        title: `All ${labels.value && checkIsPropertyExist(labels.value, 'total') ? labels.value.total : ''}`,
        id: 0,
        name: 'All',
      },
      {
        title: `In Progress ${
          labels.value && checkIsPropertyExist(labels.value, 'in_progress') ? labels.value.in_progress : ''
        }`,
        id: 1,
        name: 'In Progress',
      },
      {
        title: `Waiting for Review ${
          labels.value && checkIsPropertyExist(labels.value, 'waiting_for_review')
            ? labels.value.waiting_for_review
            : ''
        }`,
        id: 2,
        name: 'Waiting for Review',
      },
      {
        title: `On Revision ${
          labels.value && checkIsPropertyExist(labels.value, 'on_revision') ? labels.value.on_revision : ''
        }`,
        id: 3,
        name: 'On Revision',
      },
      {
        title: `Done ${
          labels.value && checkIsPropertyExist(labels.value, 'completed') ? labels.value.completed : ''
        }`,
        id: 4,
        name: 'Done',
      },
      {
        title: `Rejected ${
          labels.value && checkIsPropertyExist(labels.value, 'rejected') ? labels.value.rejected : ''
        }`,
        id: 5,
        name: 'Rejected',
      },
      {
        title: `Returned ${
          labels.value && checkIsPropertyExist(labels.value, 'returned') ? labels.value.returned : ''
        }`,
        id: 6,
        name: 'Returned',
      },
      {
        title: `Overdue ${
          labels.value && checkIsPropertyExist(labels.value, 'overdue') ? labels.value.overdue : ''
        }`,
        id: 7,
        name: 'Overdue',
      },
    ]
  }
})

const setIsShowWorkingTalent = (items) => {
  talents.value = [];
  selectedTalent.value = items.id;
  switch (+items.id) {
    case 0:
      getTalents();
      break;
    case 1:
      getTalents('in_progress');
      break;
    case 2:
      getTalents('waiting_for_review');
      break;
    case 3:
      getTalents('on_revision');
      break;
    case 4:
      getTalents('done');
      break;
    case 5:
      getTalents('rejected');
      break;
    case 6:
      getTalents('returned');
      break;
    case 7:
      getTalents('overdue');
      break;
    default:
      getTalents();
      break;
  }
};

const getTalents = async (status) => {
  const params = {};

  if (status) {
    params.status = status;
  }

  const { data } = await axiosService.get(
    useRuntimeConfig().public.apiBase + `tasks/${props.taskId}/talents-working`,
    params,
  );
  talents.value = data.data;
};

const getTalentsLabels = async () => {
  const { data } = await axiosService.get(
    useRuntimeConfig().public.apiBase + `tasks/${props.taskId}/talents-working/labels`,
  );
  labels.value = data;
};
</script>

<style lang="scss" scoped>
.working-talents {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 24px;
  &_title {
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 400;
      font-size: 24px;
      line-height: 40px;
      color: $section-title;
    }
  }
  &_filter {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  &_cards {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  &_card {
    background: #ffffff;
    border: 1px solid #dad9f7;
    border-radius: 8px;
  }
}
</style>
