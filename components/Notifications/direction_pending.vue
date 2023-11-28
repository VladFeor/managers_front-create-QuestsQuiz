<template>
  <div class="flex gap-x-4 items-center">
    <Direction
        v-for="activity in data.activities"
        :direction="activity"
        :key="activity.id"
    ></Direction>
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
