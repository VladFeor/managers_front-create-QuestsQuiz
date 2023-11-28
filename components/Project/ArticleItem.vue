<template>
  <a
    :href="post.link"
    class="h-[308px] min-w-[280px] w-[calc(33.333333%-12px)] shrink-0 grow-0 rounded-2xl border border-[#DAD9F7] bg-white"
    target="_blank"
  >
    <div
      class="h-[200px] w-full rounded-t-2xl"
      :style="{
        background: `url(${post.thumbnail})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }"
    />
    <div class="p-4 h-[108px] flex flex-col justify-between">
      <h5 class="slashed-zero font-medium text-[#38405B] text-lg leading-6 h-12">
        {{ reduceStringLength(post.title, 48) }}
      </h5>
      <div class="text-sm text-[#6A6D8F] font-medium leading-5 flex items-center h-5">
        <span>{{ pubDate }}</span>
        <span class="ml-2 h-[3px] w-[3px] bg-[#6A6D8F]"></span>
        <span class="ml-2">{{ post.readTime }}</span>
      </div>
    </div>
  </a>
</template>

<script setup>
import { reduceStringLength } from '@/util/helpers';

import { computed } from 'vue';
import { formatDateMonthNameAndDay } from '~/util/helpers';
const props = defineProps({
  post: {
    type: Object,
    default: null,
  },
  image: {
    type: String,
    default: '0',
  },
});
const pubDate = computed(() => formatDateMonthNameAndDay(props.post.pubDate));
</script>

<style scoped lang="scss"></style>
