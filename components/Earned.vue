<template>
  <div
    v-if="card"
    class="rating_card_wrapper"
    @mouseover="isHovered = true"
    @mouseout="isHovered = false"
  >
    {{ props.rating ? props.rating : 0 }}
    <Icon v-if="props.rating > 0" name="Star-Y" :size="16" />
    <Icon v-else name="Star-01" :size="16" />
    <EarnedTooltip :active="isHovered" />
  </div>
  <div v-else class="rating_wrapper">
    <span v-if="!isRight"
      >{{ props.rating ? props.rating : 0 }} <span v-if="isPoints">Points</span>
    </span>
    <Icon v-for="rate in props.rating" :key="rate" name="Star-Y" :size="20" />
    <Icon v-for="rate in emtryRates" :key="rate" name="Star-0" :size="20" />
    <span v-if="isRight"
      >{{ props.rating ? props.rating : 0 }} <span v-if="isPoints">Points</span>
    </span>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  rating: { type: Number, default: 0 },
  card: { type: Boolean, default: false },
  isRight: { type: Boolean, default: false },
  isPoints: { type: Boolean, default: false },
});

const isHovered = ref(false);

const emtryRates = computed(() => 5 - props.rating);
</script>

<style lang="scss" scoped>
.rating_card_wrapper {
  position: relative;
  display: flex;
  gap: 5px;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  position: relative;
  border: 1px solid $default-border;
  background: transparent;
  padding: 0 5px;

  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  }
  color: #38405b;
  &:hover {
    background: $default-bg;
  }
  span {
    color: $default;
  }
}
.rating_wrapper {
  display: flex;
  gap: 7px;
  align-items: center;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $section-title;
}
</style>
