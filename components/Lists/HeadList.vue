<template>
  <div class="item">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "HeadList"
}
</script>

<style scoped lang="scss">
.item {
  background: $default-badge-border;
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  color: $header-text-list;
  margin: 4px 8px;
  height: 64px;
  align-items: center;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;

}

</style>