<template>
  <BtnSkeleton v-if="loading" />
  <nuxt-link v-else :to="to" class="custom-link">
    <span>{{ text }}</span>
    <Icon name="Right-Arrow" :size="20" class="color" color="#6A6D8F" />
  </nuxt-link>
</template>

<script>
export default {
  name: 'CustomLink',
  props: {
    text: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    loading: { type: Boolean, default: false },
  },
};
</script>

<style scoped lang="scss">
.color {
  filter: invert(43%) sepia(14%) saturate(759%) hue-rotate(197deg) brightness(96%) contrast(91%);
}
.custom-link {
  font-family: 'Basis Grotesque Pro';
  text-decoration: none;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $secondary;
  display: inline-flex;
  align-items: center;
  padding: 9px 12px;
  border-radius: 8px;

  &:hover {
    background: $default-badge-border;
  }
}

.arrow {
  margin-left: 5px;
}
</style>
