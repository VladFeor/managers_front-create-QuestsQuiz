<template>
  <div
    class="direction flex gap-x-2 items-center"
    :style="{
      ...defaultColor(direction),
    }"
  >
    <div class="name">{{ direction.name }}</div>
    <Icon
      v-if="status"
      :name="status === 'approve' ? 'Tik' : 'Cancel'"
      class="icon"
      :size="18"
    ></Icon>
  </div>
</template>
<script setup>
const props = defineProps({
  direction: {
    type: Object,
    default: () => {
      return {
        name: 'Testing',
        colors: {
          light: '#25b8ae',
        },
      };
    },
  },
  status: {
    type: String,
    default: '',
  },
});

const defaultColor = (activity) => {
  return {
    background: `${activity.colors.dark} !important`,
  };
};
</script>
<style scoped lang="scss">
.direction {
  display: flex;
  padding: 3px 8px;
  align-items: center;
  gap: 8px;
  border-radius: 6px;
  background: var(--talent-content-making-dark, #25b8ae);
  color: $white;
  font-variant-numeric: lining-nums tabular-nums slashed-zero;
  font-family: 'Basis Grotesque Pro';
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.168px;
  .icon {
    filter: invert(226%) sepia(0) saturate(7385%) hue-rotate(180deg) brightness(145%) contrast(110%);
  }
}
</style>
