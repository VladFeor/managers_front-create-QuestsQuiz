<template>
  <div class="custom-select" :tabindex="tabindex" ref="selectContainer">
    <div class="selected" :class="{ open: isOpen }" @click="toggleOpen">
      Levels {{ selectedOptitonsValue }}
      <div class="count" v-if="selectedOptions.length"></div>
      <span class="arrow" :class="{ flipped: isOpen }"></span>
    </div>
    <div
      v-show="isOpen"
      class="flex flex-col container-lvl"
      :class="{ right: !leftAlign, left: leftAlign }"
    >
      <div
        class="tooltip-arrow"
        :class="{ 'tooltip-arrow-left': leftAlign, 'tooltip-arrow-right': !leftAlign }"
      ></div>
      <div class="items">
        <div
          v-for="(option, index) in lvls"
          :key="index"
          class="item"
          @click.stop="toggleOption(option)"
          :class="{ 'selected-item': isSelected(option) }"
        >
          {{ option.name }}
        </div>
      </div>
      <div class="controller">
        <div class="cancel" @click="clear">Clear</div>
        <div class="save" @click="apply()">Apply</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

export default {
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
    reset: {
      type: Boolean,
      default: false,
    },
    leftAlign: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['select-lvl', 'reset'],
  setup(props, { emit }) {
    const isOpen = ref(false);
    const search = ref('');
    const selectedOptions = ref(props.modelValue);

    const lvls = [
      {
        id: 0,
        name: 0,
      },
      {
        id: 1,
        name: 1,
      },
      {
        id: 2,
        name: 2,
      },
      {
        id: 3,
        name: 3,
      },
      {
        id: 4,
        name: 4,
      },
      {
        id: 5,
        name: 5,
      },
    ];

    watch(
      () => props.reset,
      () => {
        if (props.reset) {
          clear();
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
        (selectedOption) => selectedOption.name === option.name,
      );

      if (index === -1) {
        selectedOptions.value.push(option);
      } else {
        selectedOptions.value.splice(index, 1);
      }
    };

    const selectedOptitonsValue = computed(() => {
      const selectedIds = selectedOptions.value.map((option) => option.id).sort((a, b) => a - b);
      if (selectedIds.length === 0) return;

      return selectedIds
        .reduce((acc, id, index) => {
          if (index === 0 || selectedIds[index - 1] !== id - 1) {
            acc.push(id);
          } else if (index === selectedIds.length - 1 || selectedIds[index + 1] !== id + 1) {
            acc[acc.length - 1] = `${acc[acc.length - 1]}-${id}`;
          }
          return acc;
        }, [])
        .join(', ');
    });

    const isSelected = (option) => {
      return selectedOptions.value.some((selectedOption) => selectedOption.name === option.name);
    };

    const handleOutsideClick = (event) => {
      if (!event.target.closest('.custom-select')) {
        isOpen.value = false;
      }
    };
    const apply = () => {
      if (selectedOptions.value.length) {
        emit('select-lvl', {
          name: `Levels: ${selectedOptions.value
            .map((level) => level.name)
            .sort()
            .join(', ')}`,
          type: 'lvl',
          value: selectedOptions.value.map((level) => level.name),
        });
      } else {
        emit('reset');
      }
      isOpen.value = false;
    };
    const clear = () => {
      selectedOptions.value = [];
      emit('reset');
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
      selectedOptitonsValue,
      toggleOpen,
      toggleOption,
      isSelected,
      lvls,
      apply,
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
  z-index: 100000;
  line-height: 47px;
  max-width: 180px;
  min-width: fit-content;
  height: 32px;
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
  align-items: center;
  color: $default;
  height: 32px;
  display: flex;
  gap: 16px;
  .count {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 8px;
    height: 8px;
    background: $orange;
    border-radius: 100%;
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
.container-lvl {
  max-width: 228px;
  max-height: 96px;
  position: absolute;
  z-index: 1;
  padding: 8px;
  background: $white;
  border: 1px solid $default-badge-border;
  border-radius: 8px;
  margin-top: 8px;
}
.left {
  left: 0;
}
.right {
  right: 0;
}

.custom-select .items {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: $default;
  display: flex;
  justify-content: space-between;
  gap: 4px;

  width: 100%;
}
hr {
  margin: 4px 0;
  color: $default-border;
}

.item:hover {
  background-color: $default-border;
  border-radius: 8px;
}
.selected-item {
  color: $white !important;
  background-color: $transparent-hover-text !important;
}
.item {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: end;
  font-feature-settings: 'zero' on;
  padding: 4px 8px;
  gap: 8px;
  color: $default;
  cursor: pointer;
  width: 32px;
  height: 32px;
  background: $white;
  /* Secondary/80 Moon Raker */

  border: 1px solid $default-border;
  border-radius: 8px;
}
.selectHide {
  display: none;
}
.search-container {
  position: relative;
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
  padding-left: 30px;

  &::placeholder {
    color: $colabs-bg;
  }
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: $colabs-bg;
  pointer-events: none; /* чтобы иконка не блокировала события ввода */
}
.controller {
  margin-top: 16px;
  display: flex;
  gap: 8px;
  .cancel {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 4px 8px;
    gap: 8px;
    height: 32px;
    background: $default-border;
    border-radius: 8px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    width: 100%;

    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $default;
  }
  .save {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 4px 8px;
    gap: 8px;
    width: 100%;
    height: 32px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $white;
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
