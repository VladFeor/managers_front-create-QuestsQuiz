<template>
  <div class="add-talent-btn_wrapper" ref="multiselectContainer" :class="{ error: !rule }">
    <div class="add-talent-btn" :class="{ isOpen: open }" @click="toggle">
      <span>Add Reward</span>
      <Icon v-if="type !== 'level'" name="Add" :size="20" />
    </div>
    <div class="options" v-if="open">
      <div
        v-for="option in filteredOptions"
        :key="option.id"
        :class="['option', { selected: isSelected(option) }]"
        @click.stop="selectOption(option)"
      >
        {{ option.name }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import Icon from '../Icon';

export default {
  name: 'MultiSelectWithTags',
  components: { Icon },
  props: {
    options: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
      default: 'Select items',
    },
    name: {
      type: String,
      default: 'Select items',
    },
    rule: {
      type: Boolean,
      default: true,
    },
    selectedItems: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    const open = ref(false);
    const search = ref('');
    const multiselectContainer = ref(null);

    const toggle = () => {
      open.value = !open.value;
    };

    const filteredOptions = computed(() => {
      return props.options.filter((option) =>
        props.selectedItems.every((item) => item.id !== option.id),
      );
    });

    const isSelected = (option) => {
      return props.selectedItems.some((item) => item.id === option.id);
    };

    const selectOption = (option) => {
      const index = props.selectedItems.some((item) => item.id === option.id);
      if (index) return;
      emit('selected-item', option);
    };

    const handleClickOutside = (event) => {
      if (multiselectContainer.value && !multiselectContainer.value.contains(event.target)) {
        open.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    return {
      open,
      search,
      multiselectContainer,
      toggle,
      filteredOptions,
      isSelected,
      selectOption,
    };
  },
};
</script>

<style scoped lang="scss">
$name-font: 'Basis Grotesque Pro';
.add-talent-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 126px;
  height: 40px;
  background: $default-badge-border;
  border-radius: 8px;
  cursor: pointer;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  font-feature-settings: 'zero' on;
  color: $default;
}

.isOpen {
  background: $default-border;
}

.error {
  border-color: $error-border !important;
}
.name {
  font-family: $name-font;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $default;
  margin-bottom: 8px;
}

.add-talent-btn_wrapper {
  position: relative;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
}

.placeholder {
  font-family: $name-font;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  margin-top: 2px;
  margin-left: 7px;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $colabs-bg;
}

.tag {
  display: flex;
  align-items: center;
  background: $default-border;
  border-radius: 6px;
  cursor: pointer;
  padding: 5px 12px;
  font-family: $name-font;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  font-feature-settings: 'zero' on;
  color: $section-title;
}

.remove-tag {
  margin-left: 10px;
  cursor: pointer;
}

.options {
  position: absolute;
  left: 0px;
  top: 48px;
  background-color: $white;
  border: 1px solid $secondary-border;
  border-radius: 8px;
  padding: 8px;
  z-index: 100;
  max-height: 250px;
  width: 122px;
  overflow-y: auto;
  gap: 10px;
  display: flex;
  flex-direction: column;
  &::-webkit-scrollbar {
    width: 6px;
    height: 90%;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    margin-top: 30px;
  }

  &::-webkit-scrollbar-thumb {
    background: $secondary;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: $secondary;
  }
}

.search-container {
  position: relative;
}

.search {
  width: 184px;
  padding: 4px 8px;
  height: 32px;
  border: 1px solid $default-badge-border;
  background: none !important;
  outline: none !important;
  border-radius: 8px;
  font-family: $name-font;
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
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: $colabs-bg;
  pointer-events: none; /* чтобы иконка не блокировала события ввода */
}
.option {
  padding: 4px 8px;
  cursor: pointer;
  font-family: $name-font;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  font-feature-settings: 'zero' on;
  color: $default;
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.option:hover {
  background: $default-badge-border;
  border-radius: 8px;
}

.arrow {
  position: absolute;
  bottom: 15px;
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
</style>
