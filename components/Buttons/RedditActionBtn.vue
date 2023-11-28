<template>
  <div class="twitter-action-btn">
    <div class="twitter-action-btn_main" :class="{ disabled: isDisabled }" @click="handleAction">
      <Icon :name="iconName" :size="26" />
      <span>{{ title }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '' },
  isDisabled: { type: Boolean, default: false },
  iconName: { type: String, default: 'Twitter-Default' },
});
const emit = defineEmits(['action']);

const handleAction = () => {
  if (props.isDisabled) return;
  else emit('action');
};
</script>

<style lang="scss" scoped>
loading-dots {
  position: absolute;
  bottom: 0;
  left: 100%;
  display: inline-block;
  letter-spacing: 2px;
  margin-left: 5px;
}

.loading-dot:nth-child(1) {
  animation: loadingAnimation 3s infinite;
  animation-delay: 0s;
}
.loading-dot:nth-child(2) {
  animation: loadingAnimation2 3s infinite;
  animation-delay: 0s;
}
.loading-dot:nth-child(3) {
  animation: loadingAnimation3 3s infinite;
  animation-delay: 0s;
}

@keyframes loadingAnimation {
  0%,
  20% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
  60% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
}
@keyframes loadingAnimation2 {
  0%,
  20% {
    opacity: 0;
  }
  40% {
    opacity: 0;
  }
  60% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
}
@keyframes loadingAnimation3 {
  0%,
  20% {
    opacity: 1;
  }
  40% {
    opacity: 0;
  }
  60% {
    opacity: 0;
  }
  80% {
    opacity: 1;
  }
}
.checked-icon {
  filter: invert(99%) sepia(100%) saturate(2%) hue-rotate(117deg) brightness(105%) contrast(101%);
}
.twitter-action-btn {
  display: flex;
  gap: 2px;
  width: 100%;

  color: $default;
  font-variant-numeric: lining-nums tabular-nums slashed-zero;
  font-family: Basis Grotesque Pro;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  &_main {
    display: flex;
    padding: 7px 16px;
    align-items: center;
    gap: 8px;

    width: 100%;
    height: 40px;
    border-radius: 8px;

    cursor: pointer;

    background: #dad9f7;
    &.disabled {
      color: #6a6d8f;
      border-radius: 8px;
      background: #eaeafb;
    }
  }
  &_secondary {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 40px;
    border-radius: 0px 8px 8px 0px;
    background: #dad9f7;
    cursor: pointer;
    &.checked {
      background: #38405b;
    }
    &.disabled {
      color: #6a6d8f;
      background: #eaeafb;
    }
  }
}
</style>
