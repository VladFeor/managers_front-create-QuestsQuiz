<template>
  <div>
    <icon icon="Left-Arrow" class="icon" :size="24"></icon>
    Back
  </div>
</template>

<script>
export default {
  name: 'BackButton',
};
</script>

<style scoped lang="scss">
div {
  padding: 7px 12px 7px 6px;
  height: 40px;
  width: 96px;
  background: $default-border;
  border-radius: 8px;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $default;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;

  &:hover {
    cursor: pointer;
    background: $transparent-hover-text;
    color: $white;
  }

  &:hover > .icon {
    filter: invert(100%) sepia(9%) saturate(0%) hue-rotate(44deg) brightness(108%) contrast(101%);
  }
}
</style>