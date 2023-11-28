<template>
  <div class="card">
      <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    avatar: String,
    name: {
      type: String,
      default: "artem",
    },
  },
};
</script>

<style scoped lang="scss">
.card {
  padding: 20px 24px;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 16px;
  width: fit-content;
  height: fit-content;
  min-width: 360px;
  cursor: pointer;
  display: flex;
  &:hover {
    border: 1px solid $default;
  }
}
</style>
