<template>
  <div class="flex gap-x-4 items-center">
    <Direction :direction="data.activity" status="approve"></Direction>
  </div>
</template>
<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
</script>
<style scoped lang="scss"></style>
