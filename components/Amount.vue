<template>
  <div class="amount">
    <Coin v-if="!isNotShowImg" :name="currency.toUpperCase() + '-Default'" :size="24" />
    <span>
      {{ amount && String(amount).includes('.') ? Number(amount).toFixed(5) : amount }}
      {{ currency.toUpperCase() }}</span
    >
  </div>
</template>

<script>
import bnbIcon from '@/assets/icons/tokens/bnb.svg';

export default {
  name: 'Amount',
  data() {
    return {
      bnbIcon,
    };
  },
  props: {
    amount: {
      type: String,
      default: '',
    },
    currency: { type: String, default: '' },
    isNotShowImg: { type: Boolean, default: false },
  },
  methods: {
    getCurrencyIcon(currency) {
      console.log('getCuttencyIcon currency', currency);
      switch (currency) {
        case 'discord':
          return 'Discord-Circle';
        default:
          return currency.toUpperCase() + '-Default';
      }
    },
  },
};
</script>

<style scoped lang="scss">
.amount {
  display: flex;
  align-items: center;
  gap: 8px;
  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $section-title;
  }
  .img {
    background: $default-bg;
    border-radius: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    border-radius: 40px;
  }
}
</style>
