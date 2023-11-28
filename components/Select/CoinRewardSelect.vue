<template>
  <div
    class="custom-select"
    :class="{ isError, isFull, isOnTop }"
    :tabindex="tabindex"
    ref="selectContainer"
    tabindex="0"
  >
    <div class="selected" :class="{ open }">
      <input
        ref="selectedAmount"
        v-model="amount"
        @input="handleInput($event.target.value)"
        class="selected-amount"
        pattern="[0-9]"
        type="text"
      />
      <div class="selected-name" @click="toggle">
        {{ reduceStringLength(selected.symbol ? selected.symbol : '', 4) }}
      </div>

      <span class="arrow" :class="{ flipped: open }" @click="toggle"></span>
    </div>
    <div class="items" :class="{ selectHide: !open }">
      <div v-if="filter" class="input-project-wrapper">
        <Icon class="search-icon" name="Search" :size="18" />
        <input @input="filterProjects($event)" type="text" placeholder="Find a Project..." />
      </div>
      <div v-for="(option, i) in customOptions" :key="i" @click.stop="selectOption(option)">
        <div class="name_wrapper">
          <span class="option-name">{{ reduceStringLength(option.name, 17) }}</span>
          <span class="option-symbol">{{
            option.symbol ? reduceStringLength(option.symbol, 5) : ''
          }}</span>
        </div>
        <Icon v-if="selected.id === option.id" name="Tik" :size="20" color="#38405B" />
      </div>
      <div class="empty-options" v-if="!customOptions || (customOptions && !customOptions.length)">
        <span>No options</span>
      </div>
    </div>
  </div>
  <div v-if="errorText && isError" class="select-error">
    {{ errorText }}
  </div>
</template>

<script setup>
import { onMounted, ref, onBeforeMount, computed, nextTick } from 'vue';
import { reduceStringLength } from '@/util/helpers';

const props = defineProps({
  amount: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    required: true,
  },
  default: {
    type: String,
    required: false,
    default: null,
  },
  tabindex: {
    type: Number,
    required: false,
    default: 0,
  },
  coinId: {
    type: Number,
    default: null,
  },
  type: { type: String, default: '' },
  filter: { type: Boolean, default: false },
  isClear: { type: Boolean, default: false },
  setIsFilterActive: { type: Function, default: () => console.log('filter projects') },
  setIsClear: { type: Function, default: () => console.log('set is clear') },
  isError: { type: Boolean, default: false },
  isFull: { type: Boolean, default: false },
  isOnTop: { type: Boolean, default: false },
  errorText: { type: String, default: '' },
});
const emit = defineEmits(['input', 'outside', 'amountChange']);
const selected = ref(
  props.default ||
    (props.options.length > 0 && props.coinId
      ? props.options.find((item) => item.id === props.coinId)
      : props.options.length > 0 && !props.coinId
      ? props.options[0]
      : null),
);
const handleInput = (value) => {
  value = value.replace(/[^0-9.]/g, '');
  value = value.replace(/(\..*)\./g, '$1');
  value = value.replace(/^0+(?=\d)/, '');
  if (/^\./.test(value)) {
    value = '0' + value;
  }
  amount.value = value;
  if (/[\d.]+/.test(value)) {
    emit('amountChange', value);
  }
};

const open = ref(false);
const amount = ref(props.amount);
const filteredOptions = ref(props.options);
const selectContainer = ref(null);
const selectedAmount = ref(null);
const amountPropRef = toRef(props, 'amount');
const coinIdPropRef = toRef(props, 'coinId');
const defaultPropRef = toRef(props, 'default');

watch(defaultPropRef, (value) => {
  console.log('defaultPropRef', value);
  selected.value = value;
});

watch(amountPropRef, (value) => {
  amount.value = value;
});

watch(coinIdPropRef, (value) => {
  const currentOption = props.options.find((item) => item.id === value);
  if (currentOption) {
    selected.value = currentOption;
  }
});

const customOptions = computed(() => filteredOptions.value);

const toggle = () => {
  open.value = !open.value;
};

const selectOption = (option) => {
  if (props.filter) {
    props.setIsFilterActive(false);
  }
  selected.value = option;
  toggle();
  emit('input', option);
};

const handleClickOutside = (event) => {
  if (selectContainer.value && !selectContainer.value.contains(event.target)) {
    open.value = false;
    let isParentClicked = event.target.getAttribute('data-parent-id');
    if (!isParentClicked) {
      emit('outside');
    }
  }
};

const filterProjects = (event) => {
  props.setIsFilterActive(true);
  if (event.target.value) {
    filteredOptions.value = props.options.filter((item) =>
      item.name.toLowerCase().includes(event.target.value.toLowerCase()),
    );
  } else {
    filteredOptions.value = props.options;
  }
};

watch(
  () => props.options,
  (newOptions) => {
    filteredOptions.value = newOptions;
    emit('input', newOptions[0]);
  },
);

watch(
  () => props.isClear,
  (value) => {
    if (value) {
      selectOption(props.options[0]);
      open.value = false;
      props.setIsClear(false);
    }
  },
);

onBeforeMount(() => {
  if (props.options.length > 0) {
    filteredOptions.value = props.options;
  }
  // emit('input', selected.value);
  document.addEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss">
.select-error {
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
.name_wrapper {
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  .option-symbol {
    color: $colabs-bg;
  }
}
.input-project-wrapper {
  position: relative;
  .search-icon {
    position: absolute;
    left: 14px;
    top: 10px;
  }
  input {
    width: 240px;
    height: 40px;
    background: #ffffff;
    border: 1px solid #dad9f7;
    border-radius: 8px;
    padding-left: 30px;
    outline: none;

    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 24px;
    display: flex;
    align-items: center;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $colabs-bg;
  }
}
.custom-select {
  position: relative;
  width: 240px;
  height: 40px;
  text-align: left;
  outline: none;
  z-index: 1;
  &.isOnTop {
    z-index: 100;
  }
  &.isFull {
    width: 100%;
    .selected {
      justify-content: space-between;
    }
  }
  &.isError {
    .selected {
      border: 1px solid $red;
    }
  }
}

.custom-select .selected {
  display: flex;
  border: 1px solid $default-border;
  border-radius: 8px;
  input[type='number']::-webkit-outer-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}

.custom-select .selected .selected-amount {
  background: $white;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 2.2;
  padding: 7px 12px;
  width: 152px;
  height: 40px;
  color: $default;
  outline: none;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
}
.custom-select .selected .selected-name {
  display: block;
  background: $white;
  background: $default-badge-border;
  border-left: 1px solid $default-border;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 2.5;
  padding: 4px 8px;
  width: 92px;
  height: 40px;
  color: $default;
}

.custom-select .selected.open {
  background: $white;
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.7;
  color: $default;
  border: 1px solid #aaa7cc;
  box-shadow: 0 0 0 3px $default-border;
}

.custom-select .selected:after {
  position: absolute;
  content: '';
  top: 12px;
  right: 1em;
  width: 12px;
  height: 7px;
}

.arrow {
  position: absolute;
  content: '';
  top: 17px;
  right: 0.8em;
  width: 12px;
  height: 7px;
  border: none;
  transition: transform 0.2s;

  background: url('@/assets/images/select.svg');
  background-repeat: no-repeat;
  cursor: pointer;
}

.arrow.flipped {
  transform: rotate(180deg);
}

.custom-select .items {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px;
  background: $white;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  border-radius: 0 0 4px 4px;
  line-height: 20px;
  color: $default;
  overflow: hidden;
  border-right: 1px solid $default-badge-border;
  border-left: 1px solid $default-badge-border;
  border-bottom: 1px solid $default-badge-border;
  position: absolute;
  left: 0;
  right: 0;
  top: 53px;
  z-index: 1;
  border-radius: 8px;
  overflow: inherit;
  max-height: 368px;
  overflow-y: scroll;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 6px;
    height: 100%;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    margin-top: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: $secondary;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: $secondary;
  }
  &.selectHide {
    display: none;
  }
  &::after {
    content: '';
    position: absolute;
    width: 28px;
    height: 18px;
    background: $white;
    z-index: -1;
    top: 14px;
    left: 50%;
    right: 50%;
    transform: rotate(45deg) translate(-50%, -10%);
  }
}

.custom-select .items div:not(.empty-options) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: $default;
  cursor: pointer;
  user-select: none;
  padding: 4px 8px;
  white-space: nowrap;
}
.empty-options {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  padding: 4px 8px;
}
.custom-select .items div:not(.input-project-wrapper, .empty-options):hover {
  background-color: $default-border;
  border-radius: 8px;
}
</style>
