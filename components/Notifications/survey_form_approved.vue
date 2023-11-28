<template>
  <div class="request">
    <div class="amount">
      <Talent
        :text="extractUsername(data.project_name)"
        square
        :img="data.project_avatar || defaultBg"
      ></Talent>
    </div>
    <WalletStatus type="executed" text="Accepted"></WalletStatus>
  </div>
</template>
<script setup>
import defaultBg from '@/assets/images/default-avatar.png';

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  project: {
    type: Object,
    default: () => {
      return {
        name: 'Test',
        logo: defaultBg,
        tags: [
          {
            id: 1,
            name: 'test',
          },
          {
            id: 1,
            name: 'test',
          },
          {
            id: 1,
            name: 'test',
          },
          {
            id: 1,
            name: 'test',
          },

          {
            id: 1,
            name: 'test',
          },
          {
            id: 1,
            name: 'test',
          },
        ],
      };
    },
  },
  currency: {
    type: String,
    default: 'eth',
  },
});
function extractUsername(input) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailPattern.test(input)) {
    return input.split('@')[0];
  }
  return input;
}
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
