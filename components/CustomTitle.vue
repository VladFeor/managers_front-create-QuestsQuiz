<template>
  <TitleSkeleton v-if="loading" style="margin-bottom: 18px" />
  <h1 v-else class="custom-title" :class="{ light }">{{ text }}</h1>
</template>

<script>
export default {
  name: 'CustomTitle',
  props: {
    text: {
      type: String,
      required: true,
    },
    light: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },
};
</script>

<style scoped lang="scss">
.custom-title {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 40px;
  color: $section-title;
  &.light {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 40px;
    color: $secondary;
  }
}
</style>
