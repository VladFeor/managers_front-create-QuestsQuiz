<template>
  <div class="switch-modal">
    <div class="switch-modal-header">
      <div class="switch-modal-title">Switch Blockchain</div>
      <div class="switch-modal-subtitle">
        Please switch your blockchain in your wallet app, then press “Continue” button.
      </div>
    </div>

    <BaseButton text="Continue" type="normal" @click="action" />
    <!-- <div class="switch-modal-btn"></div> -->
  </div>
</template>

<script setup>
const props = defineProps({
  action: { type: Function, default: null },
});

const emit = defineEmits('close');

const handleAction = async () => {
  props.action();
  emit('close');
};
</script>

<style lang="scss" scoped>
.switch-modal {
  display: flex;
  flex-direction: column;
  padding: 32px;

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
