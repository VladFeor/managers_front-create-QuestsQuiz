<template>
  <div class="role-pr gap-x-4">
    <div
      class="tooltip-icon"
      v-if="status"
      @mouseover="isHovered = true"
      @mouseout="isHovered = false"
    >
      <div class="tooltip-checkbox" v-if="isHovered">Talentum Manager</div>
      <div class="talent-manager-icon"><Icon icon="TM" :size="18"></Icon></div>
    </div>
    <Talent square :text="project.name" :img="project.img" class="project"></Talent>
  </div>
</template>
<script setup>
const props = defineProps({
  status: {
    type: Boolean,
    default: false,
  },
  project: {
    type: Object,
    default: () => {},
  },
});
const isHovered = ref(false);
</script>
<style scoped lang="scss">
.role-pr {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .talent-manager-icon {
    display: flex;
    padding: 4px;
    align-items: flex-start;
    border-radius: 24px;
    background: $rounded-bg;

    width: fit-content;
  }
}
.tooltip-icon {
  position: relative;
  cursor: pointer;
  margin-left: -45px;
  margin-right: 2px;
}
.tooltip-checkbox {
  position: absolute;
  bottom: -10px;
  min-width: 120px;
  width: fit-content;
  left: 50%;
  background: $default;
  box-shadow: 0px 2px 8px rgba(26, 29, 41, 0.24);
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 12px;
  z-index: 999;
  transform: translateY(100%) translateX(-50%);
  margin-bottom: 5px;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $white;

  &::after {
    content: '';
    position: absolute;
    width: 28px;
    height: 18px;
    background: $default;
    transform: rotate(45deg) translateX(-50%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: -1;
    top: 10px;
    left: 50%;
  }
}
</style>
