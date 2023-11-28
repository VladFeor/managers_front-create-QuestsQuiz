<template>
  <Tooltip tooltipText="Report not yet read">
    <div v-if="value <= 0" class="w-2 h-2 bg-orange-500 rounded-full"></div>
  </Tooltip>
</template>

<script setup lang="ts">
const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="scss"></style>
