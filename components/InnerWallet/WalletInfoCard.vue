<template>
  <div class="inner-wallet-info">
    <div class="inner-wallet-info_header">
      <div class="inner-wallet-info_header-title" :class="{ 'mt-1': noTooltip }">
        {{ props.title }}
      </div>
      <TooltipIcon v-if="!noTooltip" :tooltipText="text" />
    </div>
    <div v-if="!noTooltip" class="inner-wallet-info_body">
      <Blockchain v-if="title === 'Blockchain'" :name="currentSymbol || symbol" :size="24" />
      <Coin v-else :name="props.symbol + '-Default'" :size="24" />
      <span> {{ props.amount }}</span> <span>{{ props.symbol }}</span>
    </div>
    <div v-if="items && items.length" class="inner-wallet-info_list">
      <div
        v-for="item in items"
        :key="item.amount + item.title"
        class="inner-wallet-info_list-item"
      >
        <div class="inner-wallet-info_list-item-amount">{{ item.amount }}</div>
        <span>{{ item.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  amount: { type: String, defalut: '' },
  symbol: { type: String, defalut: '' },
  title: { type: String, defalut: '' },
  text: { type: String, defalut: '' },
  noTooltip: { type: Boolean, default: false },
  iconName: { type: String, default: 'Ethereum-Circle' },
  items: { type: Array, defalut: null },
});

const currentSymbol = ref('');

const symbolToRef = toRef(props, 'symbol');

watch(symbolToRef, (value) => {
  currentSymbol.value = value;
});

onMounted(() => {
  currentSymbol.value = props.symbol;
});
</script>

<style lang="scss" scoped>
.inner-wallet-info {
  width: 180px;
  height: 120px;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &_list {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 1px;
    height: 100px;
    width: 100%;
    &-item {
      display: flex;
      gap: 5px;
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 24px;
      font-feature-settings: 'zero' on;
      &-amount {
        color: $orange;
      }
      span {
        color: $default;
      }
    }
  }
  &_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-title {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.014em;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: $secondary;
    }
  }
  &_body {
    display: flex;
    align-items: center;
    gap: 10px;

    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 24px;
    font-feature-settings: 'zero' on;
    color: $default;
    span {
      padding-top: 5px;
    }
  }
}
</style>
