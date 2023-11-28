<template>
  <div class="custom-select" :tabindex="tabindex" ref="selectContainer">
    <div class="selected" :class="{ open: isOpen }" @click="toggleOpen">
      {{ name }}
      <div class="count" v-if="selectedOptions.length > 1">{{ selectedOptions.length }}</div>
      <div class="count-solo" v-if="selectedOptions.length === 1"></div>
      <span class="arrow" :class="{ flipped: isOpen }"></span>
    </div>
    <div
      v-show="isOpen"
      class="flex flex-col container"
      :class="{ right: !leftAlign, left: leftAlign }"
    >
      <div
        class="tooltip-arrow"
        :class="{ 'tooltip-arrow-left': leftAlign, 'tooltip-arrow-right': !leftAlign }"
      ></div>

      <div v-if="showSearch" class="search-container">
        <Icon class="search-icon" icon="Search" :size="16"></Icon>
        <input
          class="search"
          type="text"
          v-model="search"
          :placeholder="`Find ${name}...`"
          @click.stop
        />
      </div>

      <div class="items">
        <div v-if="filteredOptions.length === 0">No results</div>
        <div
          v-for="(option, index) in filteredOptions"
          :key="index"
          class="item"
          @click.stop="toggleOption(option)"
        >
          {{ reduceStringLength(option.name, reduceLength) }}
          <icon v-if="isSelected(option)" icon="Tik" :size="20"></icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { reduceStringLength } from '~/util/helpers';

export default {
  methods: { reduceStringLength },
  props: {
    options: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
    tabindex: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Select an option',
    },
    reset: {
      type: Boolean,
      default: false,
    },
    leftAlign: {
      type: Boolean,
      default: true,
    },
    reduceLength: {
      type: Number,
      default: 25,
    },
    type: {
      type: String,
      default: '',
    },
    deleted: {
      type: String,
      default: '',
    },
    limit: {
      type: Number,
      default: 100,
    },
  },
  emits: ['select'],
  setup(props, { emit }) {
    const isOpen = ref(false);
    const search = ref('');
    const selectedOptions = ref(props.modelValue);
    const showSearch = computed(() => {
      return props.name !== 'Directions';
    });
    watch(
      () => props.reset,
      (newValue) => {
        if (newValue) {
          selectedOptions.value = [];
          //emit('select', selectedOptions.value);
        }
      },
    );
    watch(
      () => props.deleted,
      (newValue) => {
        console.log(newValue);
        if (newValue) {
          //selectedOptions.value.filter((el) => el.name !== newValue);
          selectedOptions.value = selectedOptions.value.filter((el) => el.name !== newValue);
        }
      },
    );
    const toggleOpen = () => {
      if (isOpen.value) {
        isOpen.value = false;
      } else {
        isOpen.value = true;
        document.dispatchEvent(new CustomEvent('close-other-selects', { detail: selectId.value }));
      }
    };

    const toggleOption = (option) => {
      const index = selectedOptions.value.findIndex(
        (selectedOption) => selectedOption.id === option.id,
      );

      if (index === -1) {
        if (props.limit === null || selectedOptions.value.length < props.limit) {
          selectedOptions.value.push(option);
        } else {
          selectedOptions.value.splice(index, 1);
          selectedOptions.value.push(option);
        }
      } else {
        selectedOptions.value.splice(index, 1);
      }
      emit('select', option);
    };

    const isSelected = (option) => {
      return selectedOptions.value.some((selectedOption) => selectedOption.id === option.id);
    };

    const filteredOptions = computed(() => {
      if (!search.value) {
        return props.options;
      }

      return props.options.filter((option) =>
        option.name.toLowerCase().includes(search.value.toLowerCase()),
      );
    });

    const handleOutsideClick = (event) => {
      if (!event.target.closest('.custom-select')) {
        isOpen.value = false;
      }
    };

    const closeOtherSelects = (event) => {
      if (selectId.value !== event.detail) {
        isOpen.value = false;
      }
    };

    watch(isOpen, (newValue) => {
      if (newValue) {
        document.addEventListener('click', handleOutsideClick);
      } else {
        document.removeEventListener('click', handleOutsideClick);
      }
    });
    const selectId = ref(null);
    const clear = () => {
      selectedOptions.value = [];
      emit('reset');
    };
    onBeforeMount(() => {
      selectId.value = Date.now() + Math.random();
    });
    onMounted(() => {
      document.addEventListener('click', handleOutsideClick);
      document.addEventListener('close-other-selects', closeOtherSelects);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('close-other-selects', closeOtherSelects);
    });
    return {
      isOpen,
      search,
      selectedOptions,
      toggleOpen,
      toggleOption,
      isSelected,
      showSearch,
      filteredOptions,
      clear,
    };
  },
};
</script>

<style scoped lang="scss">
.custom-select {
  position: relative;
  max-width: 100%;
  text-align: left;
  outline: none;
  z-index: 99;
  line-height: 47px;
  max-width: 140px;
  height: 32px;
  min-width: fit-content;
}

.custom-select .selected {
  background: $white;
  border: 1px solid $default-badge-border;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  padding: 6px 8px;
  height: 32px;

  color: $default;
  display: flex;
  gap: 16px;
  .count {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding-top: 1px;
    gap: 10px;
    width: 18px;
    height: 18px;
    background: $orange;
    border-radius: 100%;
    color: $white;
    text-align: center;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  }
  .count-solo {
    width: 6px;
    height: 6px;
    background: $orange;
    border-radius: 100%;
    margin: auto 0;
  }
}

.custom-select .selected.open {
  background: $white;
  border: 1px solid $default-badge-border;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  color: $default;
  box-shadow: 0 0 0 3px $default-border;
}

.custom-select .selected:after {
  position: relative;
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
  top: 50%;
  transform: translateY(-50%);
  right: 8px;
  width: 24px;
  height: 24px;
  border: none;
  transition: transform 0.2s;

  background: url('@/assets/images/select.svg');
  background-repeat: no-repeat;
  background-position: center;
}

.arrow.flipped {
  transform: rotate(180deg) translateY(50%);
}
.first {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
}

.container {
  min-width: 200px;
  position: absolute;
  z-index: 1;
  padding: 8px;
  background: $white;
  border: 1px solid $default-badge-border;
  border-radius: 8px;
  margin-top: 8px;
  max-height: 250px;
}

.left {
  left: 0;
}
.right {
  right: 0;
}

.custom-select .items {
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  border-radius: 8px;
  margin-top: 5px;
  line-height: 20px;
  color: $default;
  overflow-x: hidden;
  max-height: 200px;
  overflow-y: scroll;
}
hr {
  margin: 4px 0;
  color: $default-border;
}
.custom-select .items div {
  color: $default;
  cursor: pointer;
  user-select: none;

  &:not(:first-child) {
    margin-top: 8px;
  }
}

.item:hover {
  background-color: $default-border;
  border-radius: 8px;
}
.item {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 4px 8px;
}
.selectHide {
  display: none;
}
.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search {
  width: 100%;
  height: 32px;
  border: 1px solid $default-badge-border;
  background: none !important;
  outline: none !important;
  border-radius: 8px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $default;
  padding-left: 32px;

  &::placeholder {
    color: $colabs-bg;
  }
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: $colabs-bg;
  pointer-events: none; /* чтобы иконка не блокировала события ввода */
}

.controller {
  margin-top: 24px;
  display: flex;
  gap: 8px;
  .cancel {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 4px 8px;
    gap: 8px;
    width: 88px;
    height: 32px;
    background: $default-border;
    border-radius: 8px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $default;
  }
  .save {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 4px 8px;
    gap: 8px;
    width: 88px;
    height: 32px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $white !important;
    background: $orange;
    border-radius: 8px;
  }
}
.tooltip-arrow {
  position: absolute;
  top: -6px;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid $white;
  &-left {
    left: 15%;
  }
  &-right {
    right: 10%;
  }
}
</style>
