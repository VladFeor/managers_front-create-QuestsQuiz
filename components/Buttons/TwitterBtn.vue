<template>
  <div class="twitter-btn" :class="{ disabled }" @click="handleClick">
    <span>{{ text }}</span>
    <Icon :name="img" :size="24" />
  </div>
</template>

<script setup>
const props = defineProps({
  text: { type: String, default: '' },
  img: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(['action']);

const handleClick = () => {
  if (props.disabled) return;
  emit('action');
};
</script>

<style lang="scss" scoped>
.twitter-btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 7px 12px;
  gap: 8px;
  cursor: pointer;

  width: 154px;
  height: 40px;

  background: $default-border;
  border-radius: 8px;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $secondary;
  white-space: nowrap;

  &:hover {
    background: $default-bg;
  }

  &.disabled {
    background: transparent;
    color: $default-border;
    border-radius: 8px;
    border: 1px solid $default-border;
    &:hover {
      background: transparent;
      color: $default-border;
      border-radius: 8px;
      border: 1px solid $default-border;
    }
  }
}
</style>
