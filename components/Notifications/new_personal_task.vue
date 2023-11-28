<template>
  <div class="new-task">
    <div class="title">{{ data.task_name }}</div>
    <div class="rewards">
      <div class="flex gap-x-[4px]">
        <Coin :name="data.coin_type.code + '-Default'" :size="24" />

        <div class="amount">{{ balance }} {{ data.coin_type.code }}</div>
        <Icon icon="Discord-Default" :size="24" v-if="data.task_rewards[1]" />
      </div>
      <Icon name="Crown" color="#F5F5FD" :size="24"></Icon>
    </div>
  </div>
</template>
<script setup>
import { getCuttencyIcon } from '~/util/helpers';
import { computed } from 'vue';
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
const balance = computed(() => {
  console.log(props.data.value);
  let num = parseFloat(props.data.task_rewards[0].value);
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
.new-task {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  .title {
    color: $default;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-family: 'Basis Grotesque Pro';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px; /* 150% */
  }
  .rewards {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4px;
    .amount {
      color: $default;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      font-family: 'Basis Grotesque Pro';
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px; /* 150% */
    }
  }
}
</style>
