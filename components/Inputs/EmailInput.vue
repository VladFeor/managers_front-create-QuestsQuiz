<template>
  <div class="input">
    <div class="name" v-if="!withoutLabel">Email Address</div>
    <div class="description" v-if="description">{{ description }}</div>
    <div class="relative">
      <div
        v-if="withIcon"
        class="w-10 h-10 bg-[#EAEAFB] border border-[#DAD9F7] p-2 absolute left-0 top-2 rounded-l flex items-center justify-center"
      >
        <Icon name="Email-Default" :size="23" />
      </div>
      <input
        type="text"
        :value="modelValue"
        @input="updateValue"
        @blur="updateValue"
        @focus="updateValue"
        :placeholder="placeholder"
        :class="{ error: isError, withIcon }"
      />
    </div>
    <div class="error-message" v-if="isError">Invalid email address</div>
  </div>
</template>

<script>
export default {
  name: 'EmailInput',
  props: {
    withIcon: {
      type: Boolean,
      default: false,
    },
    withoutLabel: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: 'Input text',
    },
    description: {
      type: String,
      default: '',
    },
    modelValue: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isError: false,
      touched: false,
    };
  },
  methods: {
    updateValue(event) {
      const newValue = event.target.value;
      this.isError = !this.validateEmail(newValue);
      this.$emit('update:modelValue', newValue);
      this.$emit('error', this.isError);
    },
    validateEmail(email) {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return regex.test(email);
    },
  },
};
</script>

<style scoped lang="scss">
.input {
  display: flex;
  flex-direction: column;
  .error {
    border-color: $error-border;
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
  .name {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $section-title;
  }
  .description {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $secondary;
    margin-top: 4px;
    margin-bottom: 8px;
  }
  input {
    margin-top: 8px;
    height: 40px;
    width: 100%;
    outline: none;
    background: $white;
    border: 1px solid $colabs-bg;
    border-radius: 8px;
    padding: 8px 12px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $section-title;
    &::placeholder {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: $colabs-bg;
    }
    &:focus:not(.error) {
      border: 3px solid $default-border;
    }

    &.withIcon {
      border: 1px solid #dad9f7;
      border-bottom-left-radius: 0px;
      border-top-left-radius: 0px;
      margin-left: 40px !important;
      width: calc(100% - 40px);
    }
  }
}
</style>
