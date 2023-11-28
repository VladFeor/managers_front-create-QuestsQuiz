<template>
  <div class="input-wrapper">
    <div class="input-container" :class="{ 'input-error': shouldShowError || isCustomError }">
      <div class="icon-container">
        <Icon :icon="icon" :size="24"></Icon>
      </div>
      <input
        class="input-field"
        :value="modelValue"
        @input="onInput"
        @blur="onBlur"
        :placeholder="placeholder"
        @focus="touched = false"
      />
      <div v-if="regex && !showError && touched" class="checkmark-container">
        <Icon icon="Tik" :size="24"></Icon>
      </div>
    </div>
    <div v-if="shouldShowError" class="error-message">{{ error }}</div>
  </div>
</template>

<script>
export default {
  name: 'InputWithIcon',
  props: {
    isCustomError: {
      type: Boolean,
      default: false,
      required: false
    },
    extraClasses: {
      type: String,
      required: false
    },
    icon: {
      type: String,
      required: true,
    },
    regex: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    modelValue: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: '',
    },
    valid: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      touched: false,
    };
  },
  computed: {
    validationRegex() {
      return this.regex ? new RegExp(this.regex) : null;
    },
    showError() {
      return this.touched && this.validationRegex && !this.validationRegex.test(this.modelValue);
    },
    shouldShowError() {
      return (
        (this.required && this.showError) || (!this.required && this.showError && this.modelValue)
      );
    },
  },
  methods: {
    onInput(event) {
      this.touched = false;
      this.$emit('update:modelValue', event.target.value);
    },
    onBlur() {
      this.touched = true;
      if (this.required && !this.modelValue) {
        this.$emit('update:valid', false);
      } else if (this.required) {
        this.$emit('update:valid', !this.showError);
      } else if (!this.required && !this.modelValue) {
        this.$emit('update:valid', true);
      } else {
        this.$emit('update:valid', !this.showError);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.input-wrapper {
  display: flex;
  flex-direction: column;
}

.input-container {
  position: relative;
  display: flex;
  border: 1px solid $default-border;
  background: $white;
  border-radius: 8px;
  overflow: hidden;
  &.input-error {
    border-color: $error-text;
  }
}

.icon-container {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: $default-badge-border;
  border-right: 1px solid $default-border;
}

.input-field {
  padding: 7px 12px 7px 52px;
  height: 40px;
  width: 90%;
  border-radius: 8px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $section-title;
  background: $white;
  outline: none;

  &::placeholder {
    color: $transparent-hover-border;
  }
}

.error-message {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  /* identical to box height, or 133% */

  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $error-text;
  margin-top: 8px;
}

.checkmark-container {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 12px;
  top: 8px;
  width: 24px;
  height: 24px;
  filter: invert(52%) sepia(9%) saturate(3092%) hue-rotate(70deg) brightness(99%) contrast(90%);
}
</style>
