<template>
  <div class="flex items-center justify-content">
    <template v-if="activeMenu.key === 'tasks'">
      <Select
        class="min-w-40"
        :options="options"
        main-styles="!h-auto ml-1"
        selected-style="border-0"
        arrow-style="top-[10px]"
        @input="setOption"
      />
      <Select
        class="min-w-40"
        :options="options"
        main-styles="!h-auto ml-1"
        selected-style="border-0"
        arrow-style="top-[10px]"
        @input="setOption"
      />
      <Select
        class="min-w-40"
        :options="options"
        main-styles="!h-auto ml-1"
        selected-style="border-0"
        arrow-style="top-[10px]"
        @input="setOption"
      />
      <Select
        class="min-w-40"
        :options="options"
        main-styles="!h-auto ml-1"
        selected-style="border-0"
        arrow-style="top-[10px]"
        @input="setOption"
      />
      <ClearAllButton title="Clear All" @clicked="" />
      <OrangeButton title="Create a task" @clicked="" />
    </template>
    <template v-if="activeMenu.key === 'managers'">
      <Select
        class="min-w-40"
        :options="optionsRoles"
        main-styles="!h-auto ml-1"
        selected-style="border-0"
        arrow-style="top-[10px]"
        @input="setOption"
      />

      <CheckboxLabel class="ml-3" text="Talentum manager" hide-tooltip-icon @checked="" />

      <OrangeButton title="Invite manager" />
    </template>
    <template v-if="activeMenu.key === 'talents'">
      <Select
        class="min-w-40"
        :options="options"
        main-styles="!h-auto ml-1"
        selected-style="border-0"
        arrow-style="top-[10px]"
        @input="setOption"
      />
      <Select
        class="min-w-40"
        :options="options"
        main-styles="!h-auto ml-1"
        selected-style="border-0"
        arrow-style="top-[10px]"
        @input="setOption"
      />
      <Select
        class="min-w-40"
        :options="options"
        main-styles="!h-auto ml-1"
        selected-style="border-0"
        arrow-style="top-[10px]"
        @input="setOption"
      />
      <Select
        class="min-w-40"
        :options="options"
        main-styles="!h-auto ml-1"
        selected-style="border-0"
        arrow-style="top-[10px]"
        @input="setOption"
      />
      <CheckboxLabel class="ml-3" text="Active" hide-tooltip-icon @checked="" />

      <OrangeButton title="Invite a talent" @clicked="" />
    </template>
    <template v-if="activeMenu.key === 'leaderboard'">
      <div class="ml-auto text-slate-700 text-[20px] font-normal leading-loose">
        {{ talents.pagination.total }} talents
      </div>
    </template>
  </div>
</template>

<script setup>
import { keyRandom } from '~/util/helpers';
import { LEVELUP_STATE } from '~/constants/levelup';
import { useTalentsStore } from '~/store/talents';

const talentsStore = useTalentsStore();

const talents = computed(() => talentsStore.getLeaderBoard);

console.log('talentsStore talents', talents);

const props = defineProps({
  activeMenu: {
    type: Object,
    default: null,
  },
});
const levelFilter = ref(0);
const options = ref([
  {
    name: 'Dummy Data',
  },
  {
    name: 'Dummy Data2',
  },
]);
const optionsRoles = ref([
  {
    name: 'Role',
  },
]);
const optionsDirections = ref([
  {
    name: 'All directions',
  },
]);
const setOption = () => {};
</script>

<style scoped lang="scss"></style>
