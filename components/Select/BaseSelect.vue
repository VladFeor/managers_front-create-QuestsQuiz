<template>
  <div>
    <div class="name">{{ name }}</div>
    <div class="custom-select" ref="selectContainer" :class="{ error: showError }">
      <div class="selected" :class="[{ open }, { placeholder: !selected }]" @click="toggle">
        {{ selected ? reduceStringLength(selected.name, 18) : placeholder }}
        <span class="arrow" :class="{ flipped: open }"></span>
      </div>
      <div class="items" :class="{ selectHide: !open }">
        <div v-if="selected" class="first" @click="toggle">
          {{ selected.name }}
          <Icon icon="Tik" :size="20"></Icon>
        </div>
        <hr v-if="selected" />
        <div v-for="(option, i) in options" :key="i" @click.stop="selectOption(option)">
          {{ option.name }}
        </div>
      </div>
    </div>
    <div v-if="showError" class="error-message">{{ errorMsg || 'Please select an option.' }}</div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { reduceStringLength } from '@/util/helpers';
import Icon from '../Icon';

export default {
  name: 'BaseSelect',
  components: { Icon },
  props: {
    options: {
      type: Array,
      required: true,
    },
    name: {
      type: String,
      default: '',
    },
    errorMsg: {
      type: String,
      default: '',
    },
    rule: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    initialSelected: {
      type: Object,
      default: null,
    },
  },
  setup(props, { emit }) {
    const selected = ref(props.initialSelected);
    const open = ref(false);
    const selectContainer = ref(null);
    const showError = ref(false);

    const toggle = () => {
      open.value = !open.value;
      if (!selected.value) {
        showError.value = true;
      } else {
        showError.value = false;
      }
    };

    const selectOption = (option) => {
      selected.value = option;
      toggle();
      emit('input', option);
    };

    const handleClickOutside = (event) => {
      if (selectContainer.value && !selectContainer.value.contains(event.target)) {
        open.value = false;
        if (!selected.value) {
          showError.value = true;
        }
      }
    };

    watch(
      () => props.initialSelected,
      (newValue) => {
        selected.value = newValue;
      },
    );

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    return {
      selected,
      open,
      selectContainer,
      toggle,
      selectOption,
      reduceStringLength,
      showError,
    };
  },
};
</script>

<style scoped lang="scss">
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

.custom-select .selected.error {
  border-color: $error-border !important;
}
.placeholder {
  color: $not-active-border !important;
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
}
.custom-select {
  position: relative;
  max-width: 100%;
  text-align: left;
  outline: none;
  height: 40px;
  z-index: 10;
  line-height: 47px;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 8px;
  padding: 8px 12px;
}

.custom-select .selected {
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $section-title;
}

.arrow {
  position: absolute;
  top: 15px;
  right: 1em;
  width: 12px;
  height: 7px;
  border: none;
  transition: transform 0.2s;
  background: url('@/assets/images/select.svg');
  background-repeat: no-repeat;
}

.arrow.flipped {
  transform: rotate(180deg);
}

.first {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}

.custom-select .items {
  background: $white;
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  border-radius: 8px;
  margin-top: 10px;
  padding: 4px 8px;
  line-height: 20px;
  color: $default;
  max-height: 250px;
  overflow: auto;
  border: 1px solid $default-badge-border;
  position: absolute;
  left: 0;
  right: 0;
  z-index: 11;
}

hr {
  margin: 4px 0;
  color: #dad9f7;
}

.custom-select .items div {
  color: $default;
  cursor: pointer;
  user-select: none;
  padding: 4px 8px;
}

.custom-select .items div:hover {
  background-color: $default-border;
  border-radius: 8px;
}

.selectHide {
  display: none;
}

.error {
  border-color: $error-border;
}
</style>
