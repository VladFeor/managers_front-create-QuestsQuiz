<template>
  <div class="input_wrapper">
    <input
      ref="inputElement"
      type="text"
      :placeholder="placeholder"
      @input="updateValue"
      :value="modelValue"
    />
  </div>
</template>

<script>
export default {
  name: 'InputName',
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Shen Yufei',
    },
    modelValue: {
      type: String,
      default: '',
    },
  },
  methods: {
    resizeInput() {
      const input = this.$refs.inputElement;
      input.style.width = 'auto';
      input.style.width = input.scrollWidth + 'px';
    },
    updateValue(event) {
      const newValue = event.target.value;
      this.resizeInput();
      this.$emit('update:modelValue', newValue);
    },
  },
  mounted() {
    this.resizeInput();
  },
};
</script>

<style scoped lang="scss">
.input_wrapper {
  width: 100%;
}
input {
  display: block;
  width: fit-content;
  max-width: 1000px;
  background: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 350;
  font-size: 56px;
  line-height: 72px;
  outline: none;
  color: $default;
  font-feature-settings: 'zero' on;
  &::placeholder {
    padding: 5px;
    color: $default;
  }
  &:focus {
    background: $default-badge-border;
  }
}
</style>
