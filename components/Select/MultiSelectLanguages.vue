<template>
  <div>
    <div class="multiselect-with-tags" ref="multiselectContainer">
      <div class="selected-tags">
        <span v-for="(item, index) in selectedItems" :key="item.id" class="tag">
          {{ item.name }}
          <Icon class="remove-tag" @click.stop="removeTag(index)" icon="Cancel" :size="16"></Icon>
        </span>
        <div class="arrow" @click="toggle"><Icon icon="Create" :size="16"></Icon></div>
      </div>
      <div class="options" v-show="open">
        <div class="search-container">
          <Icon class="search-icon" icon="Search" :size="16"></Icon>
          <input
            class="search"
            type="text"
            v-model="search"
            @blur="touched = true"
            @focus="touched = false"
            placeholder="Find language..."
          />
        </div>
        <div
          v-for="option in filteredOptions"
          :key="option.id"
          :class="['option', { selected: isSelected(option) }]"
          @click.stop="selectOption(option)"
        >
          {{ option.name }} <icon v-if="isSelected(option)" icon="Tik" :size="20"></icon>
        </div>
      </div>
    </div>
    <div v-if="!rule && touched" class="error-message">Select at least one {{ name }}</div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import Icon from '../Icon';

export default {
  name: 'MultiSelectLanguages',
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
    limit: {
      type: Number,
      default: null,
    },
    initialSelectedItems: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      touched: false,
    };
  },
  setup(props, { emit }) {
    const open = ref(false);
    const search = ref('');
    const selectedItems = ref(props.initialSelectedItems);
    const multiselectContainer = ref(null);

    const toggle = () => {
      open.value = !open.value;
    };
    const selectOption = (option) => {
      const index = selectedItems.value.findIndex((item) => item.id === option.id);
      if (index === -1) {
        if (props.limit === null || selectedItems.value.length < props.limit) {
          selectedItems.value.push(option);
        }
      } else {
        selectedItems.value.splice(index, 1);
      }
      emit('selected-items', selectedItems.value);
    };
    const filteredOptions = computed(() => {
      return props.options.filter((option) =>
        option.name.toLowerCase().includes(search.value.toLowerCase()),
      );
    });

    const isSelected = computed(() => (option) => {
      return selectedItems.value.some((item) => item.id === option.id);
    });

    const removeTag = (index) => {
      selectedItems.value.splice(index, 1);
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
.error {
  border-color: $error-border !important;
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
  font-family: $name-font;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $default;
  margin-bottom: 8px;
}

.multiselect-with-tags {
  position: relative;
  display: inline-block;
  padding: 4px;
  min-height: 38px;
  &:hover {
    cursor: pointer;
  }
  .title {
    /* Label */

    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    text-align: right;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $secondary;
  }
}

.multiselect-with-tags .options div {
  color: $default;
  cursor: pointer;
  user-select: none;

  &:not(:first-child) {
    margin-top: 8px;
  }
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
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
  border: 1px solid $default-badge-border;
  border-radius: 8px;
  cursor: pointer;
  padding: 5px 8px;
  font-family: $name-font;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  font-feature-settings: 'zero' on;
  color: $default;
}

.remove-tag {
  margin-left: 10px;
  cursor: pointer;
}

.options {
  position: absolute;
  right: 0;
  top: 40px;
  background-color: $white;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  padding: 8px;
  z-index: 100;
  max-height: 250px;
  width: 200px;
  overflow-y: auto;
}

.search-container {
  position: relative;
}

.search {
  width: 100%;
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
  padding: 4px 8px;
  gap: 8px;
  display: flex;
  align-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid $default-badge-border;
  border-radius: 8px;
  &:focus {
    background: $default-badge-border;
  }
  &:hover {
    background: $default-badge-border;
  }
}

.arrow.flipped {
  transform: rotate(180deg);
}
.hidden-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  height: 0;
  width: 0;
}
</style>
