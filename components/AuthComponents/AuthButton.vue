<template>
  <button :type="type" class="base" @click="submit">
    <span>{{ text }}</span>
  </button>
</template>

<script>
export default {
  name: 'AuthButton',
  props: {
    text: String,
    type: {
      type: String,
      default: 'button',
    },
  },
  data() {
    return {
      currentIndex: 0,
    };
  },
  methods: {
    submit() {
      const inputs = document.querySelectorAll('input');
      inputs.forEach((input, index) => {
        input.focus();
        input.blur();
      });
    },
  },
};
</script>

<style scoped lang="scss">
.base {
  padding: 8px 12px;
  border-radius: 8px;
  width: 100%;
  height: 40px;
  background: $orange;
  display: flex;
  cursor: pointer;
  align-items: center;
  &:hover {
    background: $orange-active;
  }
  span {
    margin: 0 auto;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: $white;
  }
}
</style>
