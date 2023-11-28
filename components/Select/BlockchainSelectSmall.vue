<template>
  <div
    class="custom-select-blockchain-small"
    :class="{
      isError: props.isError,
      project: type === 'project',
      create: type === 'create',
      disabled: props.isDisabled,
      isBig,
      isSmall,
    }"
    :tabindex="tabindex"
    ref="selectContainer"
  >
    <div class="selected" :class="{ open }" @click="isEdit ? toggle() : emit('editAction')">
      <Blockchain v-if="!open" :name="selected.name" :size="18" />
      {{ reduceStringLength(selected.name, props.reduceLength) }}
      <span v-if="isEdit" class="arrow" :class="{ flipped: open }"></span>
      <Icon class="edit-icon" v-else name="Edit" :size="18" />
    </div>
    <div class="items" :class="{ selectHide: !open }">
      <div v-if="filter" class="input-project-wrapper">
        <Icon class="search-icon" name="Search" :size="18" />
        <input @input="filterProjects($event)" type="text" placeholder="Find a Project..." />
      </div>

      <div v-for="(option, i) in customOptions" :key="i" @click.stop="selectOption(option)">
        <div class="blockchain_wrapper">
          <Blockchain :name="option.name" :size="18" />
          <span> {{ reduceStringLength(option.name, props.reduceLength) }}</span>
        </div>
        <Icon v-if="selected.id === option.id" name="Tik" :size="20" color="#38405B" />
      </div>
      <div class="empty-options" v-if="!customOptions || (customOptions && !customOptions.length)">
        <span>No projects</span>
      </div>
    </div>
    <div v-if="errorText && isError" class="select-error">
      {{ errorText }}
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, onBeforeMount, nextTick, computed } from 'vue';
import { reduceStringLength } from '@/util/helpers';

const props = defineProps({
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
  type: { type: String, default: '' },
  filter: { type: Boolean, default: false },
  setIsFilterActive: { type: Function, default: () => console.log('filter projects') },
  isDisabled: { type: Boolean, default: false },
  isError: { type: Boolean, default: false },
  isSmall: { type: Boolean, default: false },
  errorText: { type: String, default: '' },
  reduceLength: {
    type: Number,
    required: false,
    default: 25,
  },
  isBig: { type: Boolean, default: false },
  isEdit: { type: Boolean, default: false },
});

const emit = defineEmits(['input', 'editAction']);

const selected = ref(props.default || (props.options.length > 0 ? props.options[0] : null));
const open = ref(false);
const filteredOptions = ref(props.options);
const selectContainer = ref(null);

const defaultPropRef = toRef(props, 'default');

watch(defaultPropRef, (value) => {
  if (value) {
    selected.value = value;
  }
});

const customOptions = computed(() => filteredOptions.value);

const toggle = () => {
  if (props.isDisabled) return;
  open.value = !open.value;
};

const selectOption = (option) => {
  if (props.filter) {
    props.setIsFilterActive(false);
  }
  selected.value = option;
  toggle();
  nextTick();
  emit('input', option);
};

const handleClickOutside = (event) => {
  if (selectContainer.value && !selectContainer.value.contains(event.target)) {
    open.value = false;
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
  },
);

onBeforeMount(() => {
  if (props.options.length > 0) {
    filteredOptions.value = props.options;
  }
  //   emit('input', selected.value);
  document.addEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss">
.blockchain_wrapper {
  display: flex;
  gap: 4px;
}
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
.input-project-wrapper {
  position: relative;
  .search-icon {
    position: absolute;
    left: 14px;
    top: 10px;
  }
  input {
    width: 100%;
    height: 32px;
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
    color: #aaa7cc;
  }
}
.custom-select-blockchain-small {
  position: relative;
  width: 160px;
  height: 32px;
  text-align: left;
  outline: none;
  z-index: 100;
  &.isSmall {
    height: 24px;
    .selected {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 24px;
      line-height: 1.4;
      font-size: 12px;
      &.open {
        line-height: 1.4;
        font-size: 12px;
      }
      .arrow {
        top: 10px;
      }
      .items {
        top: 44px;
      }
    }
  }
  &.isBig {
    height: 40px;
    .selected {
      height: 40px;
      line-height: 2.2;
      &.open {
        line-height: 2.2;
      }
    }
    .arrow {
      top: 17px;
    }
    .items {
      top: 51px;
    }
    &.disabled {
      height: 40px;
      .arrow {
        top: 17px;
      }
      .selected {
        line-height: 2.2;
        background: $default-border;
        color: $secondary;
        cursor: text;
        height: 40px;
        &.open {
          line-height: 2.2;
        }
      }
    }
  }
  &.disabled {
    .selected {
      background: $default-border;
      color: $secondary;
      cursor: text;
    }
  }
  &.isError {
    .selected {
      border: 1px solid $red;
      &.open {
        border: 1px solid $red;
      }
    }
    &.create {
      width: 240px;
      height: 40px;
      .selected {
        width: 240px;
        height: 40px;
        line-height: 2.2;
        &.open {
          line-height: 2.2;
        }
        .arrow {
          top: 16px;
        }
      }
      .items {
        top: 51px;
      }
    }
  }
  &.create {
    width: 240px;
    height: 40px;
    .selected {
      width: 240px;
      height: 40px;
      line-height: 2.2;
      &.open {
        line-height: 2.2;
      }
      .arrow {
        top: 16px;
      }
    }
    .items {
      top: 51px;
    }
    // .selected.open {
    //   box-shadow: none;
    // }
  }
  &.project {
    width: 200px;
    .selected {
      width: 200px;
      background: $white;
      color: $transparent-active-text;
      border: 1px solid $default-border;
    }
  }
}

.custom-select-blockchain-small .selected {
  background: $default-badge-border;
  border: 1px solid $default-bg;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.7;
  padding: 4px 8px;
  width: 160px;
  height: 32px;
  color: #38405b;
}

.custom-select-blockchain-small .selected.open {
  background: $white;
  border: 1px solid $default-badge-border;
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.7;
  color: $default;
  box-shadow: 0 0 0 3px $default-border;
}

.custom-select-blockchain-small .selected:after {
  position: absolute;
  content: '';
  top: 12px;
  right: 1em;
  width: 12px;
  height: 7px;
  border: none;
}

.arrow {
  position: absolute;
  content: '';
  top: 12px;
  right: 1em;
  width: 12px;
  height: 7px;
  border: none;
  transition: transform 0.2s;

  background: url('@/assets/images/select.svg');
  background-repeat: no-repeat;
}

.edit-icon {
  position: absolute;
  content: '';
  top: 3px;
  right: 1em;
  width: 12px;
  height: 7px;
  border: none;
  transition: transform 0.2s;
}

.arrow.flipped {
  transform: rotate(180deg);
}

.custom-select-blockchain-small .items {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  top: 40px;
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

.custom-select-blockchain-small .items div:not(.empty-options) {
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
.custom-select-blockchain-small .items div:not(.input-project-wrapper, .empty-options):hover {
  background-color: $default-border;
  border-radius: 8px;
}
</style>
