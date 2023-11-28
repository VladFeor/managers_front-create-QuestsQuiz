<template>
  <div class="h-10 border border-[#DAD9F7] rounded-lg flex w-[250px]">
    <div class="w-2/3 bg-white rounded-l-lg">
      <input
        type="number"
        class="w-full h-9 outline-none py-[7px] px-[12px] rounded-l-lg overflow-hidden bg-white"
        placeholder="Number of coins"
        v-model="input"
      />
    </div>
    <div
      @click="showOptions = !showOptions"
      class="cursor-pointer relative w-1/3 py-[7px] px-[12px] bg-[#EAEAFB] rounded-r-lg outline-none font-medium text-sm leading-5 text-[#38405B]"
    >
      <div class="flex justify-between items-center h-full">
        <div>{{ reduceStringLength(selected[nameProp], 5) }}</div>
        <img src="@/assets/images/select.svg" height="25px" alt="select image" />
      </div>
      <div
        v-if="showOptions"
        :class="`absolute top-10 left-0 w-full rounded-b-lg bg-white border border-[#DAD9F7] border-t-0 overflow-y-auto overflow-x-hidden ${height}`"
      >
        <div
          class="mb-1 cursor-pointer hover:bg-[#DAD9F7] p-1 pl-3 rounded-lg text-left"
          v-for="option in options"
          @click="setOption(option)"
        >
          {{ reduceStringLength(option[nameProp], 5) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reduceStringLength } from '@/util/helpers';
const props = defineProps({
  input: {
    type: Number,
    value: null,
    default: null,
  },
  options: {
    type: Array,
    value: [],
    default: {},
  },
  default: {
    type: Object || String,
    value: {
      name: String,
    },
    default: {},
  },
  nameProp: {
    type: String,
    default: 'name',
  },
  height: {
    type: String,
    default: 'h-50',
  },
});
const input = ref(props.input || null);
const selected = ref(props.default || (props.options.length > 0 ? props.options[0] : null));
const showOptions = ref(false);
let inputValueEmitTimer: ReturnType<typeof setTimeout>;

const emits = defineEmits(['setOption', 'setInputValue']);
const setOption = (data: { id: number; name: string }) => {
  selected.value = data;
  emits('setOption', data);
};

const defaultPropRef = toRef(props, 'default');

watch(defaultPropRef, (value) => {
  selected.value = value;
});

watch(input, (newValue) => {
  clearTimeout(inputValueEmitTimer);
  inputValueEmitTimer = setTimeout(() => {
    emits('setInputValue', newValue);
  }, 500);
});
</script>

<style scoped lang="scss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
