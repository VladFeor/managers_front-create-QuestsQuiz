<template>
  <div v-if="amounts.length <= 4" class="amount">
    <Coin
      v-for="item in amounts"
      :key="item.id"
      :name="item.props.currency.toUpperCase() + '-Default'"
      :size="24"
    />
  </div>
  <div v-else class="amount">
    <Icon
      v-for="item in amounts.slice(0, 3)"
      :key="item.id"
      :name="getCuttencyIcon(item.props.currency.toLowerCase())"
      :size="24"
    />
    <div v-if="amounts.length - 3 > 0" class="multi-amounts-count">
      <span>+{{ amounts.length - 3 }}</span>
    </div>
  </div>
</template>

<script>
import bnbIcon from '@/assets/icons/tokens/bnb.svg';
import { getCuttencyIcon } from '@/util/helpers';

export default {
  name: 'Amount',
  data() {
    return {
      bnbIcon,
      getCuttencyIcon,
    };
  },
  props: {
    amounts: { type: Array, default: null },
    amount: {
      type: String,
      default: '',
    },
    currency: { type: String, default: '' },
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
.multi-amounts-count {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 24px;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 6px;
  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $default;
  }
}
.amount {
  display: flex;
  align-items: center;
  gap: 8px;
  > span {
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
