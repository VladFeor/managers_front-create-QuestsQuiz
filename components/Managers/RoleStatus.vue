<template>
  <div class="status w-full">
    <Icon icon="Clock" v-if="status === 'invited' && !hideClock" :size="24"></Icon>
    <Badge :text="role"></Badge>
    <div
      class="tooltip-icon"
      v-if="isTM"
      @mouseover="isHovered = true"
      @mouseout="isHovered = false"
    >
      <div class="tooltip-checkbox" :class="[{ hoverWide: hoverWide }]" v-if="isHovered">
        Talentum Manager
      </div>
      <div class="talent-manager-icon"><Icon icon="TM" :size="18"></Icon></div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  role: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: '',
  },
  hideClock: {
    type: Boolean,
    default: false,
  },
  hoverWide: {
    type: Boolean,
    default: false,
  },
  isTM: {
    type: Boolean,
    default: false,
  },
});
const isHovered = ref(false);
</script>

<style scoped lang="scss">
.status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  .talent-manager-icon {
    display: flex;
    padding: 4px;
    align-items: flex-start;
    border-radius: 24px;
    background: $rounded-bg;
  }
}
.tooltip-icon {
  position: relative;
  cursor: pointer;
}
.tooltip-checkbox {
  position: absolute;
  bottom: -10px;
  min-width: 90px;
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

  &.hoverWide {
    min-width: 120px;
  }

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
