<template>
  <label class="checkbox-container">
    <input type="checkbox" v-model="isChecked" @change="change" />
    <span class="checkmark"></span>
    <span class="label">
      {{ label }}
    </span>
  </label>
</template>

<script>
import { watch } from 'vue';

export default {
  data() {
    return {
      isChecked: false,
    };
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    reset: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    change() {
      this.$emit('check', { value: this.isChecked });
    },
  },
  watch: {
    reset() {
      this.isChecked = false;
    },
  },
};
</script>

<style scoped>
.checkbox-container {
  display: block;
  position: relative;
  padding-left: 28px;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 3px;
  left: 0;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #dad9f7;
  background: #fff;
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 7px;
  top: 4px;
  width: 5px;
  height: 8px;
  border: solid #38405b;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.label {
  color: #38405b;
  /* Button */
  font-size: 14px;
  font-family: 'Basis Grotesque Pro';
  font-weight: 500;
}
</style>
