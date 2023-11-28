<template>
  <label class="checkbox">
    <input
      type="checkbox"
      @input="setCheckbox()"
      :checked="checked.state"
      :disabled="isDisabled"
    />
    <span :class="'checkmark' + (checked.state && 'border border-[#dad9f7]')" v-if="checked.state">
      <img v-if="minusIcon" src="@/assets/icons/orange-minus-checkbox.svg" width="17" height="17" alt="logo"/>
      <img v-else src="@/assets/icons/orange-checked-ckeckbox.svg" width="18" height="18" alt="logo"/>
    </span>
    <span class="checkmark" v-else> </span>
    <slot></slot>
  </label>
</template>

<script setup>
import { ref, toRef } from 'vue';
const props = defineProps({
  minusIcon: { type: Boolean, default: false },
  isDisabled: { type: Boolean, default: false },
  checkedProp: { type: Object, default: {
    id: null,
    state: false,
  } },
});
const emit = defineEmits(['checkboxChecked']);
const checked = toRef(props, 'checkedProp');

function setCheckbox() {
  emit('checkboxChecked', checked.value);
}
</script>

<style lang="scss" scoped>
.checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 1;
  font-feature-settings: 'zero' on;
  color: #38405b;
}

.checkmark {
  position: relative;
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  border-radius: 0.25em;
  border: 1px solid #dad9f7;
  background: #ffffff;
  border-radius: 4px;
  margin-right: 0.5em;
  transition: background-color 0.2s, border-color 0.2s;
}

.checkmark-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

input[type='checkbox'] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

input[type='checkbox']:disabled ~ .checkmark {
  opacity: 0.6;
  cursor: not-allowed;
}
label {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  font-feature-settings: 'zero' on;
  color: $default;
}
</style>
