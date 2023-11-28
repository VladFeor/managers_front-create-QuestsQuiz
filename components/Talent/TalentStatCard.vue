<template>
  <div class="card">
    <div class="title">{{ title }}</div>
    <div class="flex justify-between items-center w-full">
      <div class="count">{{ reduceStringLength(String(info), 7) }}</div>
      <div>
        <Icon :name="icon" :size="24"></Icon>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reduceStringLength } from '@/util/helpers';

const props = defineProps({
  icon: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  info: {
    type: String,
    default: '0',
  },
});
</script>
<style scoped lang="scss">
.card {
  display: flex;
  width: 156px;
  padding: 12px 12px 8px 12px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
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
  .count {
    color: #38405b;
    font-variant-numeric: slashed-zero;
    font-family: 'Basis Grotesque Pro';
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 40px; /* 166.667% */
  }
}
</style>
