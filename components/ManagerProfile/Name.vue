<template>
  <div class="input_wrapper">
    {{ placeholder }}
  </div>
</template>

<script>
export default {
  name: 'InputName',
  props: {
    placeholder: {
      type: String,
      default: 'Shen Yufei',
    },
  },
};
</script>

<style scoped lang="scss">
.input_wrapper {
  display: block;
  width: fit-content;
  background: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 350;
  font-size: 56px;
  line-height: 72px;
  outline: none;
  color: $default;
  font-feature-settings: 'zero' on;
}
</style>
