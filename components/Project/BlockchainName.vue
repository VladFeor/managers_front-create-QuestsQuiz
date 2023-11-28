<template>
  <div class="rounded-md py-[3px] px-[8px] h-6">
    <span class="text-xs leading-4 font-medium h-4 text-[#38405B] flex items-center">
      <Blockchain v-if="icon" :name="icon" :size="22" />
      <span class="ml-2">{{ text }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import Blockchain from '~/components/Blockchain.vue';
const props = defineProps({
  text: {
    type: String,
    default: null,
  },
  icon: {
    type: String,
    default: null,
  },
});
</script>

<style scoped lang="scss"></style>
