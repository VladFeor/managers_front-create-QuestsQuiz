<template>
  <div>
    <div class="multiselect_name_wrapper">
      <div class="name">{{ name }}</div>
      <TooltipIcon v-if="isTooltip" :tooltipText="tooltipText" />
    </div>

    <div class="multiselect-with-tags" ref="multiselectContainer" :class="{ error: !rule }">
      <div class="selected-tags" @click="toggle">
        <span v-if="selectedItems.length === 0" class="placeholder">{{ placeholder }}</span>
        <span v-for="(item, index) in selectedItems" :key="item.id" class="tag">
          {{ item.name }}
          <Icon class="remove-tag" @click.stop="removeTag(index)" icon="Delete" :size="16"></Icon>
        </span>
        <span class="arrow" :class="{ flipped: open }"></span>
      </div>
      <div class="options" v-show="open">
        <div class="search-container" v-if="filter">
          <Icon class="search-icon" icon="Search" :size="16"></Icon>
          <input class="search" type="text" v-model="search" placeholder="Search..." />
        </div>
        <div
          v-for="(option, index) in filteredOptions"
          :key="option.id"
          :class="['option', { selected: isSelected(option) }]"
          @click.stop="selectOption(option)"
        >
          {{ option.name }} <icon v-if="isSelected(option)" icon="Tik" :size="20"></icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, toRef } from 'vue';
import Icon from '../Icon';

export default {
  name: 'MultiSelectWithTags',
  components: { Icon },
  props: {
    options: {
      type: Array,
      required: true,
    },
    selectedRewards: {
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
    isTooltip: {
      type: Boolean,
      default: false,
    },
    tooltipText: {
      type: String,
      default: '',
    },
    filter: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const open = ref(false);
    const search = ref('');
    const selectedItems = ref([]);
    const multiselectContainer = ref(null);

    const toggle = () => {
      open.value = !open.value;
    };

    onMounted(() => {
      selectedItems.value = props.selectedRewards;
    });

    const selectedRewardsProp = toRef(props, 'selectedRewards');

    watch(selectedRewardsProp, (value) => {
      selectedItems.value = value;
    });

    const filteredOptions = computed(() => {
      return props.options.filter((option) =>
        option.name.toLowerCase().includes(search.value.toLowerCase()),
      );
    });

    const isSelected = (option) => {
      return selectedItems.value.some((item) => item.id === option.id);
    };

    const selectOption = (option) => {
      const index = selectedItems.value.findIndex((item) => item.id === option.id);
      if (index === -1) {
        selectedItems.value.push(option);
      } else {
        if (selectedItems.value.length > 1) {
          selectedItems.value.splice(index, 1);
        }
      }
      emit('selected-items', selectedItems.value);
    };

    const removeTag = (index) => {
      selectedItems.value.splice(index, 1);
      if (!selectedItems.value || (selectedItems.value && !selectedItems.value.length)) {
        selectedItems.value = [
          {
            name: 'Coins',
            id: 1,
          },
        ];
      }
      emit('selected-items', selectedItems.value);
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
      selectedItems,
      multiselectContainer,
      toggle,
      filteredOptions,
      isSelected,
      selectOption,
      removeTag,
    };
  },
};
</script>

<style scoped lang="scss">
$name-font: 'Basis Grotesque Pro';
.multiselect_name_wrapper {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 8px;
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
}

.multiselect-with-tags {
  position: relative;
  display: inline-block;
  padding: 4px;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 8px;
  min-height: 38px;
  width: 100%;
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
  height: 32px;
}

.remove-tag {
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    filter: invert(22%) sepia(30%) saturate(660%) hue-rotate(189deg) brightness(40%) contrast(100%);
  }
}

.options {
  position: absolute;
  right: 0;
  top: 46px;
  background-color: $white;
  border: 1px solid $secondary-border;
  border-radius: 8px;
  padding: 8px;
  z-index: 100;
  max-height: 250px;
  width: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
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
