<template>
  <Tooltip :tooltipText="`${estimatedAmount} ${currency}`"
    ><div class="text">Estimated Amount</div></Tooltip
  >
</template>
<script setup>
import { formatNumber } from '~/util/helpers';

const props = defineProps({
  currency: { type: String, default: 'bnb' },
  amount: { type: String, default: '0' },
});

const estimatedAmount = computed(() => {
  if (!props.amount.min) {
    return formatNumber(getAmount(props.amount)) || 0;
  } else {
    return `${
      String(props.amount.min).includes('.')
        ? props.amount.min.toFixed(2)
        : formatNumber(props.amount.min)
    }
     -${
       String(props.amount.max).includes('.')
         ? props.amount.max.toFixed(2)
         : formatNumber(props.amount.max)
     }`;
  }
});
const getAmount = (value) => {
  if (value && value.min && value.max) return `${value.min} - ${value.max}`;
  else if (value && value.total) return value.total;
  else return 0;
};
</script>

<style scoped lang="scss">
.text {
  color: $colabs-bg;
  font-variant-numeric: slashed-zero;
  font-family: 'Basis Grotesque Pro';
  text-decoration: underline dashed;
  text-underline-offset: 3px;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 142.857% */
  &:hover {
    color: $default;
    line-height: 20px;
    text-decoration: none;
  }
}
</style>
