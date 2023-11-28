<template>
<div class="card">
  <slot>

  </slot>
</div>
</template>

<script>
export default {
  name: "ChartCard"
}
</script>

<style scoped lang="scss">
  div {
    padding: 24px;
    background: $white;
    border: 1px solid $default-border;
    border-radius: 16px;
  }
</style>