<template>
  <div class="lvl-card">
    <div class="flex w-full items-center justify-between">
      <div class="title">Level {{ data.level }}</div>
      <div class="title">{{ data.points }} / {{ data.need_points }} QP</div>
    </div>
    <div class="box">
      <div
        class="progress"
        :style="`width: ${
          data.points > data.need_points ? 100 : (data.points * 100) / data.need_points
        }%`"
      ></div>
    </div>
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
.lvl-card {
  display: flex;
  width: 320px;
  padding: 12px 12px 20px 12px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  border-radius: 8px;
  border: 1px solid $default-badge-border;
  background: $default-bg;
  .title {
    color: #38405b;
    font-variant-numeric: slashed-zero;
    font-family: 'Basis Grotesque Pro';
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
  }
  .box {
    border: 1px solid $default-badge-border;
    background: var(--Paper, #fff);
    border-radius: 16px;
    padding: 2px;
    width: 100%;
    .progress {
      height: 12px;
      background: linear-gradient(90deg, #fc660c 0%, #ff9844 100%);
      border-radius: 16px;
    }
  }
}
</style>
