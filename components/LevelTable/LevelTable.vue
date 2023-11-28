<template>
  <div class="requests-table w-full">
    <div
      class="header bg-[#EAEAFB] h-[64px] w-full rounded-[16px] flex flex-row items-center pl-6 pr-4 w-full"
    >
      <div
        class="text-xs leading-4 font-medium text-[#38405B] grow-0 shrink-0 basis-[25px]"
        v-if="checkboxMenu && levelupDirectionToggle === LEVELUP_STATE.level_up"
      >
        <LevelCheckbox
          :minus-icon="true"
          :checked-prop="headerCheckbox"
          @checkboxChecked.stop="headerCheckboxChecked"
        />
      </div>
      <div
        v-for="col in columns"
        :key="keyRandom"
        :class="`cursor-pointer text-xs leading-4 font-medium text-[#38405B] grow-0 shrink-0 ${col.basis}`"
        @click.stop="sortByColumn(col.prop)"
      >
        <div class="flex">
          {{ col.label }}
          <Sort
            v-if="col.label && isSorting && col.prop !== 'upto'"
            :direction="sortColumn === modifyStringSpaces(col.label) ? sortDirection : 'none'"
          />
        </div>
      </div>
      <div class="text-xs leading-4 font-medium text-[#38405B] ml-auto">
        <ToggleMenu
          v-if="levelupDirectionToggle === LEVELUP_STATE.level_up"
          @toggleCheckboxes.stop="toggleCheckboxes"
        />
      </div>
    </div>
    <div
      class="body bg-white h-[64px] w-full rounded-[16px] mt-2 flex flex-row items-center pl-6 pr-4 text-xs cursor-pointer hover:border hover:border-[#38405B]"
      v-for="(row, index) in rows"
      :key="keyRandom"
      @mouseenter="setHover(index)"
      @mouseleave="setHover"
    >
      <div
        class="grow-0 shrink-0 basis-[25px]"
        v-if="checkboxMenu && levelupDirectionToggle === LEVELUP_STATE.level_up && row.checkbox"
      >
        <LevelCheckbox
          :checked-prop="row.checkbox.props"
          @checkboxChecked.stop="talentCheckboxChecked"
        />
      </div>
      <div class="grow-0 shrink-0 basis-[30%]">
        <nuxt-link :to="`/talent/${row.talent.props.talentId || row.talent.props.id}`">
          <Talent :text="row.talent.props.text" :img="row.talent.props.img" />
        </nuxt-link>
      </div>
      <div class="grow-0 shrink-0 basis-[20%] text-[#1a1d29] font-medium">
        <div class="border border-[#DAD9F7] w-fit px-[8px] py-[3px] rounded-md">
          <div v-if="row.waiting.props.text.diffInDays > 0">
            <span
              :class="row.waiting.props.text.diffInDays > 3 ? 'text-[#CC2D14]' : 'text-[#38405B]'"
            >
              {{ row.waiting.props.text.diffInDays }} days
            </span>
            <span class="text-[#6A6D8F]"> since </span>
            <span
              :class="row.waiting.props.text.diffInDays > 3 ? 'text-[#CC2D14]' : 'text-[#38405B]'"
            >
              {{ row.waiting.props.text.diffInDaysSince }}
            </span>
          </div>
          <div v-else-if="row.waiting.props.text.diffInHours > 0">
            <span class="text-[#38405B]">{{ row.waiting.props.text.diffInHours }} hours</span>
          </div>
          <div v-else>
            <span class="text-[#38405B]">{{ row.waiting.props.text.diffInMinutes }} minutes</span>
          </div>
        </div>
      </div>
      <div
        class="grow-0 shrink-0 basis-[30%] text-[#1a1d29] text-xs"
        v-if="levelupDirectionToggle === LEVELUP_STATE.direction && row.direction"
      >
        <div
          :class="`py-[3px] px-[8px] rounded-md w-fit directions ${getBadgeTypeByName(
            row.direction.props.text,
          )} active`"
        >
          {{ row.direction.props.text }}
        </div>
      </div>
      <template v-if="levelupDirectionToggle === LEVELUP_STATE.level_up">
        <div class="grow-0 shrink-0 basis-[10%] text-base">
          <Level
            v-if="row.current_level"
            :level="row.current_level.props.level"
            :text="row.current_level.props.text"
          />
        </div>
        <div class="grow-0 shrink-0 basis-[5%] text-base">
          <Icon name="Right-Arrow" :size="20" />
        </div>
        <div class="grow-0 shrink-0 basis-[10%] text-[#1a1d29] text-base">
          <span v-if="row.upto">
            {{ row.upto.props.text }}
          </span>
        </div>
      </template>
      <LevelUpButton
        visible
        class="ml-auto"
        @click.stop="emit('dismissAction', row.talent.props.id)"
        type="dismiss"
        :text="levelupDirectionToggle === LEVELUP_STATE.level_up ? 'Dismiss' : 'Dismiss'"
      />
      <LevelUpButton
        visible
        @click.stop="emit('levelupAction', row.talent.props.id)"
        class="ml-4"
        :text="levelupDirectionToggle === LEVELUP_STATE.level_up ? 'Level Up' : 'Approve'"
      />
      <FastView
        v-if="levelupDirectionToggle === LEVELUP_STATE.direction"
        @click.stop="showFastView(rows, row, index)"
        class="ml-4"
        visible
      />
    </div>
  </div>
</template>

<script setup>
import Talent from '~/components/Talent.vue';
import { ref, toRef } from 'vue';
import defaultBg from '@/assets/images/default-avatar.png';
import { getBadgeTypeByName, modifyStringSpaces, keyRandom } from '~/util/helpers';
import { LEVELUP_STATE } from '~/constants/levelup';

const checkboxMenu = ref(false);
const title = ref('Empty requests list');
const hover = ref(false);
const hoverIndex = ref(-1);
const headerCheckbox = ref({
  id: null,
  key: 'header',
  state: false,
});
const emit = defineEmits(['levelup', 'dismiss', 'rowsUpdated', 'rowsGenerated', 'showFastView']);
const props = defineProps({
  allRequests: Array,
  isSorting: { type: Boolean, default: false },
  sortFunction: { type: Function, default: null },
  levelupDirectionToggle: { type: String, default: LEVELUP_STATE.level_up },
  requestsLoading: { type: Boolean, default: false },
});
const columns = ref([]);
const sortColumn = ref(null);
const sortDirection = ref('none');
const isSorting = toRef(props, 'isSorting');
const allRequests = toRef(props, 'allRequests');
const levelupDirectionToggle = toRef(props, 'levelupDirectionToggle');
const rows = ref([]);
const router = useRouter();

function setHover(index = -1) {
  hover.value = !hover.value;
  hoverIndex.value = index;
}
function headerCheckboxChecked() {
  headerCheckbox.value.state = !headerCheckbox.value.state;
  rows.value = rows.value.map((row) => {
    row.checkbox.props.state = headerCheckbox.value.state;
    return row;
  });
  emit('rowsUpdated', rows.value);
}
function talentCheckboxChecked(value) {
  rows.value = rows.value.map((row, index) => {
    return index === value.index
      ? {
          ...row,
          checkbox: {
            ...row.checkbox,
            props: {
              ...row.checkbox.props,
              state: !row.checkbox.props.state,
            },
          },
        }
      : row;
  });
  emit('rowsUpdated', rows.value);
  headerCheckbox.value.state = rows.value.some((row) => row.checkbox.props.state === true);
}
function toggleCheckboxes(value) {
  checkboxMenu.value = value;
}
function sortByColumn(column) {
  if (!isSorting.value) return;
  if (column === 'upto') return;
  if (sortColumn.value === column) {
    if (sortDirection.value === 'asc') {
      sortDirection.value = 'desc';
    } else if (sortDirection.value === 'desc') {
      sortDirection.value = 'none';
    } else {
      sortDirection.value = 'asc';
    }
    props.sortFunction(column, sortDirection.value);
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc';
    props.sortFunction(column, sortDirection.value);
  }
}
function generateRows(data) {
  return data && data.length > 0 && props.levelupDirectionToggle === LEVELUP_STATE.direction
    ? data.map((item, index) => ({
        talent: {
          props: {
            id: item.id,
            talentId: item.ambassador ? item.ambassador.id : 0,
            index: index,
            text: item.ambassador && item.ambassador.name ? item.ambassador.name : '',
            img: item.ambassador && item.ambassador.avatar ? item.ambassador.avatar : defaultBg,
          },
        },
        waiting: {
          props: {
            text: formatDate(
              props.levelupDirectionToggle === LEVELUP_STATE.direction
                ? item.created_at
                : item.levelup_request_at,
            ),
          },
        },
        direction: {
          props: {
            text: item.activity?.name,
          },
        },
        portfolio: item.ambassador.activity_links
          .filter((activityLink) => activityLink.activity_link.activity_id === item.activity_id)
          .map((activityLink) => ({
            icon: activityLink.activity_link?.link?.icon
              ? activityLink.activity_link.link.icon
              : null,
            linkName: activityLink.activity_link.link.name,
            link: activityLink.content,
          })),
      }))
    : data.map((item, index) => ({
        checkbox: {
          props: {
            id: item.id,
            state: false,
            index: index,
          },
        },
        talent: {
          props: {
            id: item.id,
            index: index,
            text: item.name ?? '',
            img: item.avatar ?? defaultBg,
          },
        },
        waiting: {
          props: {
            text: formatDate(item.level_up_request_at),
          },
        },
        current_level: {
          props: {
            text: item.level !== null ? item.level : '',
            level: item.level !== null ? item.level : '',
          },
        },
        upto: {
          props: {
            text: item.level + 1,
          },
        },
      }));
}
function generateCols() {
  return props.levelupDirectionToggle === LEVELUP_STATE.direction
    ? [
        { prop: 'talent', label: 'Talent', basis: 'basis-[30%]' },
        { prop: 'waiting', label: 'Waiting', basis: 'basis-[20%]' },
        { prop: 'direction', label: 'Direction', basis: 'basis-[20%]' },
      ]
    : [
        { prop: 'talent', label: 'Talent', basis: 'basis-[30%]' },
        { prop: 'waiting', label: 'Waiting', basis: 'basis-[20%]' },
        { prop: 'current_level', label: 'Current Level', basis: 'basis-[10%]' },
        { prop: 'level_arrow', label: '', basis: 'basis-[5%]' },
        { prop: 'upto', label: 'Up to', basis: 'basis-[10%]' },
      ];
}
function formatDate(datetime) {
  const date = new Date(datetime);
  const currentDate = new Date();
  const timeDiff = currentDate - date;
  const diffInDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(timeDiff / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(timeDiff / (1000 * 60));

  return {
    diffInDays: diffInDays,
    diffInDaysSince:
      diffInDays > 0
        ? `${date.toLocaleString('en-us', {
            month: 'long',
          })} ${date.getDate()}, ${date.getFullYear()}`
        : 0,
    diffInHours: diffInHours,
    diffInMinutes,
  };
}
function showFastView(rows, row, index) {
  emit('showFastView', rows, row, index);
}

watch(
  allRequests,
  (newValue) => {
    if (newValue && !props.requestsLoading.value) {
      columns.value = generateCols();
      rows.value = generateRows(newValue);
      emit('rowsGenerated', rows.value);
    }
  },
  { immediate: true, deep: true },
);

watch(levelupDirectionToggle, () => {
  headerCheckbox.value.state = false;
  checkboxMenu.value = false;
});
</script>

<style scoped lang="scss"></style>
