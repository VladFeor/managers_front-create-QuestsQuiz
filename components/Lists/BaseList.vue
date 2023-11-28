<template>
  <div class="item">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "BaseList",
};
</script>

<style scoped lang="scss">
.item {
  background: $white;
  border: 1px solid $default-border;
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  font-family: "Basis Grotesque Pro";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: $default;
  margin: 4px 8px;
  height: 64px;
  align-items: center;

  &:hover {
    border: 1px solid $default;
  }
}
</style>
