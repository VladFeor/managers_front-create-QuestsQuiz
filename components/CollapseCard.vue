<template>
  <div class="container-block">
    <div
      class="title w-full relative flex justify-between items-center"
      @click="isCollapsed = !isCollapsed"
    >
      {{ title }}
      <div class="arrow" :class="{ flipped: isCollapsed }">
        <Icon name="Down" :size="26"></Icon>
      </div>
    </div>
    <div v-if="isCollapsed" class="collapse">
      <slot></slot>
    </div>
  </div>
</template>
<script setup>
const props = defineProps(['title']);
const isCollapsed = ref(false);
</script>
<style scoped lang="scss">
.container-block {
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
  border-radius: 16px;
  border: 1px solid #dad9f7;
  background: $white;
  .title {
    color: $secondary;
    font-variant-numeric: slashed-zero;
    font-family: 'Basis Grotesque Pro';
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px; /* 133.333% */
  }
  .arrow {
    transition: transform 0.2s;
  }

  .arrow.flipped {
    transform: rotate(180deg);
  }
}
</style>
