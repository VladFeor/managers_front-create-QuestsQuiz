<template>
  <div class="dots-container" :class="{ high: dots === 'high' }">
    <div
      :class="[
        'dot',
        {
          active: dots === 'low' || dots === 'medium' || dots === 'high',
          medium: dots === 'medium',
          high: dots === 'high',
        },
      ]"
    ></div>
    <div
      :class="[
        'dot',
        {
          active: dots === 'medium' || dots === 'high',
          medium: dots === 'medium',
          high: dots === 'high',
        },
      ]"
    ></div>
    <div :class="['dot', { active: dots === 'high', high: dots === 'high' }]"></div>
  </div>
</template>

<script>
export default {
  name: 'Priority',
  props: {
    dots: {
      type: String,
      required: true,
      validator: (value) => {
        return ['low', 'medium', 'high'].includes(value);
      },
    },
  },
};
</script>

<style scoped lang="scss">
.dots-container {
  display: flex;
}

.dot {
  width: 8px;
  height: 4px;
  background: $default-border;
  border-radius: 4px;
  margin-right: 5px;
  &.active {
    background: $active-dot;
  }
  &.medium {
    &.active {
      background: #e69900;
    }
  }
  &.high {
    &.active {
      background: #b83333;
    }
  }
}
</style>
