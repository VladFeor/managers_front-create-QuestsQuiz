<template>
  <div class="request">
    <div class="amount">
      <Coin :name="data.coin_type.code + '-Default'" :size="24" />
      {{ balance }} {{ data.coin_type.code }}
    </div>
    <WalletStatus type="executed" text="executed"></WalletStatus>
  </div>
</template>
<script setup>
import { getCuttencyIcon, formatNumber, formatNumberAddComma } from '~/util/helpers';
import { computed } from 'vue';
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});

const balance = computed(() => {
  console.log(props.data.value);
  let num = parseFloat(props.data.value);
  if (num) {
    let splitNum = num.toString().split('.');
    if (splitNum[1] && splitNum[1].length > 4) {
      return parseFloat(num.toFixed(4));
    } else {
      return num;
    }
  } else return 0;
});
</script>

<style scoped lang="scss">
.request {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  .amount {
    color: $default;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-family: 'Basis Grotesque Pro';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
}
</style>
