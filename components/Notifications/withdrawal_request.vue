<template>
  <div class="task">
    <div class="title">
      {{ balance }} {{ data.coinType.code }}
      <Coin :name="data.coinType.code + '-Default'" :size="24" />
    </div>
    <div class="footer">
      <div class="text">Blockchain</div>
      <Badge type="transparent" :text="data.coinType.name"></Badge>
    </div>
  </div>
</template>
<script setup>
import { formatPastDate, getCuttencyIcon } from '@/util/helpers';
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
.task {
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
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .footer {
    display: flex;
    align-items: center;
    gap: 8px;
    .text {
      color: $secondary;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      font-family: 'Basis Grotesque Pro';
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px; /* 133.333% */
      letter-spacing: 0.168px;
    }
  }
}
</style>
