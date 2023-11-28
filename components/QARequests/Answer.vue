<template>
  <div class="answer">
    <div class="head">
      <div class="number">{{ num }}</div>
      <div class="name">{{ item.question.value }}</div>
    </div>
    <div class="content">
      {{ item.value }}
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
  count: {
    type: Number,
    default: 1,
  },
});
const num = computed(() => (props.count > 9 ? props.count : `0${props.count}`));
</script>
<style scoped lang="scss">
.answer {
  display: flex;
  flex-direction: column;
  gap: 16px;
  .head {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    width: 100%;
    .number {
      color: $dot_bg;
      font-variant-numeric: slashed-zero;
      font-family: 'Basis Grotesque Pro';
      font-size: 32px;
      font-style: normal;
      font-weight: 400;
      line-height: 40px;
    }
    .name {
      color: $section-title;
      font-variant-numeric: lining-nums tabular-nums ordinal slashed-zero;
      font-feature-settings: 'dlig' on, 'ss04' on;
      font-family: 'Basis Grotesque Pro';
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      line-height: 32px;
    }
  }
  .content {
    color: $section-title;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-family: 'Basis Grotesque Pro';
    font-size: 16px;
    font-style: normal;
    text-align: left;
    font-weight: 400;
    line-height: 24px;
    width: 100%;
  }
}
</style>
