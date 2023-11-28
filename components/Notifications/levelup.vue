<template>
  <div class="levelup">
    <Level :level="data.level"></Level>
    {{ data.level }} level
    <Icon name="Tick" :size="16"></Icon>
  </div>
</template>
<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
</script>

<style scoped lang="scss">
.levelup {
  width: fit-content;
  padding: 3px 8px 3px 4px;
  display: flex;
  align-items: center;
  border-radius: 6px;
  background: $default-badge-border;
  gap: 6px;
  color: $default;
  font-variant-numeric: lining-nums tabular-nums slashed-zero;
  font-family: 'Basis Grotesque Pro';
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.168px;
}
</style>
