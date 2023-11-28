<template>
  <div class="amount">
    <Icon class="isCoefficient" v-if="isCoefficient" name="Coefficient" :size="24" />
    <div class="img-wrapper" v-for="currency in currencies" :key="currency">
      <img v-if="currency === 'credits'" :src="creditsIcon" alt="" />
      <Coin v-else :name="getCuttencyIcon(currency?.toLowerCase())" :size="24" />
    </div>
  </div>
</template>

<script>
import bnbIcon from '@/assets/icons/tokens/bnb.svg';
import creditsIcon from '@/assets/icons/Credits.svg';

export default {
  name: 'Amount',
  data() {
    return {
      bnbIcon,
      creditsIcon,
    };
  },
  props: {
    amount: {
      type: String,
      default: '',
    },
    currencies: { type: Array, default: ['Ethereum1', 'BNB1', 'RenBTC1'] },
    isCoefficient: { type: Boolean, default: false },
  },
  methods: {
    getCuttencyIcon(currency) {
      switch (currency) {
        case 'discord':
          return 'Discord-Circle';
        case 'credits':
          return creditsIcon;
        default:
          return currency.toUpperCase() + '-Default';
      }
    },
  },
};
</script>

<style scoped lang="scss">
.img-wrapper {
  width: 24px;
  height: 24px;
  img {
    width: 100%;
    height: 100%;
  }
}
.isCoefficient {
  position: absolute;
  left: 14px;
}
.amount {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
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
