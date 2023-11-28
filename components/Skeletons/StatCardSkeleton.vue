<template>
  <div
    :style="{ width: width, height: height }"
    style="border-radius: 16px"
    role="status"
    class="h-fit p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse md:p-6"
  >
    <div class="flex items-center flex-col justify-between">
      <div class="flex justify-between">
        <div>
          <div :class="{ 'h-12': isLarge, 'h-8': !isLarge }" class="bg-gray-300 w-12 mb-2.5"></div>
        </div>
        <div class="ml-1">
          <div
            :class="{ 'h-2.5': isLarge, 'h-2': !isLarge }"
            class="bg-gray-300 m-1 rounded-full w-12"
          ></div>
          <div
            :class="{ 'h-2.5': isLarge, 'h-2': !isLarge }"
            class="bg-gray-300 m-1 rounded-full w-12"
          ></div>
          <div
            :class="{ 'h-2.5': isLarge, 'h-2': !isLarge }"
            class="bg-gray-300 m-1 rounded-full w-12"
          ></div>
        </div>
      </div>
      <div class="flex-col">
        <div
          :class="{ 'h-2.5': isLarge, 'h-2': !isLarge }"
          class="bg-gray-300 m-1 rounded-full w-24"
        ></div>
        <div
          :class="{ 'h-2.5': isLarge, 'h-2': !isLarge }"
          class="bg-gray-300 m-1 rounded-full w-24"
        ></div>
        <div
          :class="{ 'h-2.5': isLarge, 'h-2': !isLarge }"
          class="bg-gray-300 m-1 rounded-full w-24"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup props="size">
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: 'normal',
    validator: (value) => {
      return ['small', 'normal', 'large'].includes(value);
    },
  },
});

const width = computed(() => {
  if (props.size === 'large') {
    return '178px';
  } else if (props.size === 'normal') {
    return '172px';
  } else {
    return '178px';
  }
});

const height = computed(() => {
  if (props.size === 'large') {
    return '204px';
  } else if (props.size === 'normal') {
    return '160px';
  } else {
    return '120px';
  }
});

const isLarge = computed(() => props.size === 'large');
</script>

<style lang="scss" scoped></style>
