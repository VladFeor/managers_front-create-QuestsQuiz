<template>
  <div
    class="overdue-warning"
    :class="{ active: isHovered }"
    @mouseover="isHovered = true"
    @mouseout="isHovered = false"
  >
    <Icon v-if="isHovered" name="Info-1px-color" :size="24" />
    <Icon v-else name="Info-1px" :size="24" />
    <OverdieTooltip
      :profile="profile"
      width="128px"
      text="Just tasks that you personally overdue"
      :active="isHovered"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({ profile: { type: Boolean, default: false } });
const isHovered = ref(false);
</script>

<style lang="scss" scoped>
.overdue-warning {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  height: auto;
  color: $colabs-bg;
  font-size: 14px;
  border-radius: 50%;
  &.active {
    color: $white;
    cursor: pointer;
  }
}
</style>
