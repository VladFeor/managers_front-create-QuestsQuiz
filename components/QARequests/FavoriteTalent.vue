<template>
  <div class="flex items-center justify-between min-w-[400px] max-w-[600px] w-full">
    <Talent :text="talent.name" :img="talent.avatar"></Talent>
    <Icon name="Like" :size="18" v-if="status"></Icon>
  </div>
</template>
<script setup>
import defaultBg from 'assets/images/default-avatar.png';
const props = defineProps({
  talent: {
    type: Object,
    default: {
      name: 'Adams',
      avatar: defaultBg,
    },
  },
  status: {
    type: Boolean,
    default: false,
  },
});
</script>
<style scoped lang="scss"></style>
