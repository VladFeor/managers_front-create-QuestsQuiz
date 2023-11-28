<template>
  <div class="task">
    <Talent :text="data.project_name" square :img="data.project_avatar"></Talent>
    <div class="title">{{ data.task_name }}</div>
    <div class="footer">
      <div class="text">Deadline in</div>
      <Badge
        :text="formatFutureDate(data.ended_at * 1000)"
        type="transparent"
        :pastDate="data.ended_at"
      ></Badge>
    </div>
  </div>
</template>
<script setup>
import defaultBg from '@/assets/images/default-avatar.png';
import { formatFutureDate } from '~/util/helpers';
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  task: {
    type: Object,
    default: () => {
      return {
        name: 'Test',
        deadline: '5 days',
      };
    },
  },
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
