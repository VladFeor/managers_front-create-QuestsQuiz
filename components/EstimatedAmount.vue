<template>
  <div class="estimated-amount">
    <div class="estimated-amount-title">Estimated Amount</div>
    <div v-if="!isUnactive && !amount.min" class="estimated-amount-value">
      <Coin :name="currency.toUpperCase() + '-Default'" :size="24" v-if="currency" />
      <span>{{ formatNumber(getAmount(amount)) }}</span>
    </div>
    <div
      v-else-if="!isUnactive && String(amount.min) && String(amount.max)"
      class="estimated-amount-value"
      :class="{ long: String(amount.min).length > 7 || String(amount.max).length > 7 }"
    >
      <Coin :name="currency.toUpperCase() + '-Default'" :size="24" v-if="currency" />
      <span>{{
        String(amount.min).includes('.') ? amount.min.toFixed(2) : formatNumber(amount.min)
      }}</span>
      <span>-</span>
      <span>{{
        String(amount.max).includes('.') ? amount.max.toFixed(2) : formatNumber(amount.max)
      }}</span>
    </div>
    <div v-else class="estimated-amount-value">
      <TooltipIcon
        class="estimated-tooltip"
        tooltipText="The estimated amount cannot be calculated because you have indicated an unlimited number of talents who can take the task in work"
      />
      <span>Undefined</span>
    </div>
  </div>
</template>

<script setup>
import { formatNumber } from '~/util/helpers';

const props = defineProps({
  currency: { type: String, default: 'bnb' },
  amount: { type: String, default: '0' },
  isUnactive: { type: Boolean, default: false },
});

const getAmount = (value) => {
  if (value && value.min && value.max) return `${value.min} - ${value.max}`;
  else if (value && value.total) return value.total;
  else return 0;
};
</script>

<style lang="scss" scoped>
.estimated-tooltip {
  height: 44px;
}
.estimated-amount {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 9px 12px 7px;
  gap: 4px;

  width: 240px;
  min-height: 80px;

  border: 1px solid $default-border;
  border-radius: 8px;

  &-title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $secondary;
  }
  &-value {
    display: flex;
    align-items: center;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 40px;
    color: $secondary;
    gap: 8px;
    &.long {
      flex-direction: column;
    }
  }
}
</style>
