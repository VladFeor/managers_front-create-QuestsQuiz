<template>
  <label class="checkbox">
    <input
      type="checkbox"
      :checked="checked"
      @change="toggleChecked"
      :disabled="props.isDisabled"
    />
    <span class="checkmark" v-if="checked" :style="checkboxStyle">
      <Icon class="checkmark-icon" name="Tik" :size="16" />
    </span>
    <span class="checkmark" v-else> </span>
    <slot></slot>
  </label>
</template>

<script setup>
import { ref, watch, toRef } from 'vue';

const props = defineProps({
  isDisabled: { type: Boolean, default: false },
  checkedProp: { type: Boolean, default: false },
});

const emit = defineEmits(['checked']);

const checked = ref(props.checkedProp);

const checkedPropRef = toRef(props, 'checkedProp');

const checkboxStyle = computed(() => {
  if (checked.value) {
    return { backgroundColor: '#FC660C', border: '1px solid #FC660C' };
  } else {
    return { backgroundColor: '#ffffff' };
  }
});

watch(checkedPropRef, (value) => {
  emit('checked', value);
  checked.value = value;
});

function toggleChecked() {
  checked.value = !checked.value;
  emit('checked', checked.value);
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
  background: #ffffff;
  border: 1px solid #dad9f7;
  border-radius: 4px;
  margin-right: 0.5em;
  transition: background-color 0.2s, border-color 0.2s;
}

.checkmark-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(279deg) brightness(107%) contrast(106%);
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
