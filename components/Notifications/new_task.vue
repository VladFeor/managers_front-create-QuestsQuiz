<template>
  <div class="new-task">
    <Talent :text="data.project_name" square :img="data.project_avatar || defaultBg"></Talent>
    <div class="title">{{ data.task_name }}</div>
    <div class="rewards">
      <Coin v-if="isCoins" :name="data.coin_type.code + '-Default'" :size="24" />
      <div v-if="isCoins" class="amount">
        {{ isCoins.formatted_value }} {{ data.coin_type.code }}
      </div>
      <Icon icon="Discord-Default" v-if="isRole" :size="24" />
      <div v-if="isCredits" class="amount">{{ isCredits.formatted_value }}</div>
      <img
        src="@/assets/icons/Credits.svg"
        v-if="isCredits"
        class="w-[24px] h-[24px]"
        alt="credits"
      />
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

const isRole = computed(() => props.data.task_rewards.find((i) => i.type === 'discord_role'));
const isCoins = computed(() => props.data.task_rewards.find((i) => i.type === 'coins'));
const isCredits = computed(() => props.data.task_rewards.find((i) => i.type === 'credits'));
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
