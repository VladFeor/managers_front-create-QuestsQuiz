<template>
  <div class="password-validation">
    <div v-for="rule in rules" :key="rule.id" class="list">
      <div :class="rule.valid">
        <Icon
          :icon="rule.valid === 'valid' && password ? 'Tik' : 'Cancel'"
          :size="16"
          class="icon"
        ></Icon
        ><span :class="rule.valid === 'invalid'">{{ rule.name }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, reactive, watch, onMounted } from 'vue';
import { oneUpperCase, oneLowerCase, oneDigit, minimumLength } from '@/util/validations';

export default {
  name: 'PasswordValidation',
  props: {
    password: {
      type: String,
      default: '',
    },
  },
  emits: ['validation'],
  setup(props, { emit }) {
    const oneUpperCaseFn = oneUpperCase();
    const oneLowerCaseFn = oneLowerCase();
    const oneDigitFn = oneDigit();
    const minimumLengthFn = minimumLength();

    const rules = reactive([
      { valid: false, name: 'Minimum of ten characters', id: 0 },
      { valid: false, name: 'One number', id: 1 },
      { valid: false, name: 'One lowercase letter', id: 2 },
      { valid: false, name: 'One uppercase letter', id: 3 },
    ]);
    onMounted(() => {
      checkPassword();
    });
    const checkPassword = () => {
      const validationFunctions = [
        { fn: minimumLengthFn, ruleId: 0 },
        { fn: oneDigitFn, ruleId: 1 },
        { fn: oneLowerCaseFn, ruleId: 2 },
        { fn: oneUpperCaseFn, ruleId: 3 },
      ];

      console.log(props.password, 666);

      validationFunctions.forEach(({ fn, ruleId }) => {
        if (props.password) {
          rules[ruleId].valid = fn.test(props.password) ? 'valid' : 'invalid';
        } else {
          rules[ruleId].valid = 'def';
        }
      });

      const isAllRulesValid = rules.every((rule) => rule.valid === 'valid');
      emit('validation', isAllRulesValid);
    };

    watch(() => props.password, checkPassword);

    return { rules };
  },
};
</script>

<style scoped lang="scss">
.password-validation {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-top: 8px;
  .list {
    margin-right: 8px;
    .invalid {
      color: $red;
      .icon {
        filter: invert(25%) sepia(67%) saturate(3146%) hue-rotate(353deg) brightness(81%)
          contrast(96%);
      }
    }
    .def {
      color: $colabs-bg;
      .icon {
        filter: invert(74%) sepia(11%) saturate(661%) hue-rotate(206deg) brightness(90%)
          contrast(89%);
      }
    }
    .valid {
      color: $secondary;
      .icon {
        filter: invert(63%) sepia(11%) saturate(6234%) hue-rotate(74deg) brightness(85%)
          contrast(66%);
      }
    }
    div {
      align-items: center;
      .icon {
        margin-right: 4px;
      }

      span {
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        letter-spacing: 0.014em;
        font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      }
    }
  }
}
</style>
