<template>
  <div class="input">
    <div class="name">
      {{ name }}
      <span class="forgot" @click="forgotHandler" v-if="forgot">Forgot a password</span>
    </div>
    <div class="input-wrapper">
      <input
        :type="inputType"
        :value="modelValue"
        @input="updateValue"
        :class="{ error: isError || rule }"
        :placeholder="placeholder"
        @focus="updateValue"
      />
      <Icon class="toggle-visibility" :icon="visibilityIcon" @click="toggleVisibility" :size="24" />
    </div>
    <div class="error-message" v-if="isError || rule">
      {{ error || 'Incorrect password, try again' }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasswordInput',
  props: {
    placeholder: {
      type: String,
      default: 'Input password',
    },
    name: {
      type: String,
      default: 'Password',
    },
    modelValue: {
      type: String,
      default: '',
    },
    forgot: {
      type: Boolean,
      default: false,
    },
    rule: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isVisible: false,
      isError: false,
    };
  },
  computed: {
    inputType() {
      return this.isVisible ? 'text' : 'password';
    },
    visibilityIcon() {
      return this.isVisible ? 'View' : 'View-No';
    },
  },
  methods: {
    forgotHandler() {
      // this.$router.push({ path: '/reset-password' });
      window.location.href = '/reset-password';
    },
    updateValue(event) {
      const newValue = event.target.value;
      this.isError = !newValue;
      this.$emit('update:modelValue', newValue);
    },
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    },
  },
};
</script>

<style scoped lang="scss">
.input {
  display: flex;
  flex-direction: column;
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
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .forgot {
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.014em;
      color: $orange;
      cursor: pointer;
    }
  }
  .error {
    border: 1px solid $error-border !important;
  }

  .input-wrapper {
    position: relative;

    input {
      height: 40px;
      width: 100%;
      outline: none;
      background: $white;
      border: 1px solid $colabs-bg;
      border-radius: 8px;
      padding: 8px 12px;
      padding-right: 40px;
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

      &:focus {
        border: 3px solid $default-border;
      }
    }

    .toggle-visibility {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
    }
  }
}
</style>
