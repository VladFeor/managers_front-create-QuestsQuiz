<template>
  <div class="multi-select" ref="multiSelect" @click="toggleDropdown">
    <div class="selected">
      <div v-if="showLabelAndLenght" class="flex items-center justify-center">
        <div>{{ label }}</div>
        <div
          v-if="selectedItems.length > 0"
          class="bg-[#FC660C] rounded-[50%] text-[12px] text-white w-[20px] h-[20px] flex items-center justify-center ml-2"
        >
          <div>{{ selectedItems.length }}</div>
        </div>
      </div>
      <div v-else>
        {{ selectedItems.length > 0 ? selectedItems.join(', ') : options[0].name }}
      </div>
      <span class="arrow" :class="{ 'arrow-up': open }"></span>
    </div>
    <transition name="dropdown">
      <div
        class="items"
        v-if="open"
        :style="{ overflowX: scrollHorizontalHidden ? 'hidden' : '', maxHeight: height + 'px' }"
      >
        <div class="first" @click.stop="toggleOption(options[0], true)">
          {{ options[0].name }}
          <icon
            v-if="selectedItems.some((opt) => opt === options[0].name)"
            icon="Tik"
            :size="20"
          ></icon>
        </div>
        <hr />
        <div
          v-for="(option, i) in options.filter((o) => o.name !== options[0].name)"
          :key="i"
          @click.stop="toggleOption(option)"
          :class="{
            'item-selected': isSelected(option),
            flex: true,
            'justify-between': true,
            'items-center': true,
          }"
          :style="{
            background: isSelected(option) ? option.colors.light : '',
            borderRadius: '8px',
          }"
        >
          <div :style="{ color: option.colors.dark }">{{ option.name }}</div>
          <icon
            v-if="selectedItems.some((opt) => opt === option.name)"
            icon="Tik"
            :size="20"
          ></icon>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'MultiSelect',
  props: {
    withoutColor: {
      type: Boolean,
      default: false,
    },
    showLabelAndLenght: {
      type: Boolean,
      requred: false,
      default: false,
    },
    options: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: Array,
      required: false,
      default: () => [],
    },
    height: {
      type: Number,
      default: 200,
    },
    label: {
      type: String,
      default: 200,
    },
    scrollHorizontalHidden: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const multiSelect = ref(null);
    const open = ref(false);
    const selectedItems = ref(props.modelValue);

    const isSelected = (option) => selectedItems.value.includes(option.name);

    const toggleOption = (option, first = false) => {
      if (isSelected(option)) {
        selectedItems.value = selectedItems.value.filter((item) => item !== option.name);
      } else {
        if (first) {
          selectedItems.value = [option.name];
        } else {
          selectedItems.value = selectedItems.value.filter((o) => o !== props.options[0].name);
          selectedItems.value.push(option.name);
        }
      }
      emit('update:modelValue', selectedItems.value);
    };

    const toggleDropdown = () => {
      open.value = !open.value;
    };

    const handleClickOutside = (event) => {
      if (multiSelect.value && !multiSelect.value.contains(event.target)) {
        open.value = false;
      }
    };

    onMounted(() => {
      window.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
      window.removeEventListener('click', handleClickOutside);
    });

    return {
      multiSelect,
      open,
      selectedItems,
      isSelected,
      toggleOption,
      toggleDropdown,
    };
  },
};
</script>

<style scoped lang="scss">
.multi-select {
  cursor: pointer;
  position: relative;
  display: inline-block;
  user-select: none;
}

.first {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
}

.selected {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  padding: 4px 8px;
  color: #38405b;
}

.items {
  margin-top: 5px;
  padding: 4px 8px;
  position: absolute;
  background: $white;
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: $default;
  overflow: hidden;
  border: 1px solid $default-badge-border;
  border-radius: 8px;
  max-height: 200px;
  width: 100%;
  overflow-y: auto;
  z-index: 10;
  margin-top: 5px;
}

.items div {
  padding: 4px 8px;
  margin-top: 2px;
  color: $default;
}

.items div:hover {
  border-radius: 8px;
  background-color: $default-border;
  color: $default;
}
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter,
.dropdown-leave-to {
  max-height: 0;
  opacity: 0;
}

.arrow {
  background: url('@/assets/images/select.svg');
  background-repeat: no-repeat;
  transition: transform 0.2s;
  margin-right: 5px;
  width: 12px;
  height: 7px;
}

.arrow-up {
  background: url('@/assets/images/select.svg');
  background-repeat: no-repeat;
  transform: rotate(180deg);
  width: 12px;
  height: 7px;
}
hr {
  margin: 8px 0;
  color: #dad9f7;
}
</style>
