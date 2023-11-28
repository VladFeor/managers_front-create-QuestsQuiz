<template>
  <div class="switch-modal">
    <div class="switch-modal-header">
      <div class="switch-modal-title">Failed to Transfer</div>
      <div class="switch-modal-subtitle">
        <img :src="error" alt="" />
        <span>{{ message }}</span>
      </div>
    </div>

    <!-- <BaseButton text="Reconnect" type="normal" @click="action" /> -->
  </div>
</template>

<script setup>
import { error } from '@/constants/icons';

const props = defineProps({
  action: { type: Function, default: null },
  message: { type: String, default: '' },
});
</script>

<style lang="scss" scoped>
.switch-modal {
  display: flex;
  flex-direction: column;
  padding: 32px;

  &-header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 240px;
  }

  &-title {
    color: #1a1d29;
    font-variant-numeric: slashed-zero;
    font-family: Basis Grotesque Pro;
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 40px; /* 166.667% */
    text-align: center;
  }
  &-subtitle {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 10px;

    color: #1a1d29;
    text-align: center;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-family: Basis Grotesque Pro;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 150% */
    margin-bottom: 60px;
  }
}
</style>
