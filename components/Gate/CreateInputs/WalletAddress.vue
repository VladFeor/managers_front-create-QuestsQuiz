<template>
  <div>
    <div class="name">List of wallet addresses</div>
    <div class="description mb-2">Specify comma-separated list of wallet addresses.</div>
    <TextArea
      placeholder="Wallet addresses"
      :modelValue="value"
      @update:modelValue="setValue"
      :rule="!props.errors?.adressess?.isError"
    />
    <div class="error-message">{{ props.errors?.adressess?.errorText }}</div>
  </div>
</template>

<script setup>
const emit = defineEmits(['change']);
const props = defineProps(['errors', 'value']);

const value = ref(props?.value || '');

const setValue = (newValue) => {
  value.value = newValue;
  emit('change', newValue);
};
</script>

<style scoped lang="scss">
.description {
  color: #6a6d8f;
  font-size: 12px;
}
.error-message {
  color: $error-text;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  margin-top: 8px;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
}
</style>
