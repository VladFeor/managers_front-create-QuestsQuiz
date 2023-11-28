<template>
  <div
    class="multi-select"
    ref="multiSelect"
    @click="toggleDropdown"
    :style="{
      marginLeft: '3px',
    }"
  >
    <div
      class="selected"
      :style="{
        border: selectBoxAsSlot && '0 !important',
        padding: 0,
      }"
    >
      <template v-if="selectBoxAsSlot">
        <slot></slot>
      </template>

      <template v-else>
        <div v-if="showLabelAndLenght" class="flex items-center justify-center">
          <div>{{ label }}</div>
          <div
            v-if="selectedItems.length > 0"
            class="bg-[#FC660C] rounded-[50%] text-white w-[20px] h-[20px] flex items-center justify-center ml-2"
          >
            <div>{{ selectedItems.length }}</div>
          </div>
        </div>
        <div v-else>
          {{ selectedItems.length > 0 ? selectedItems.join(', ') : 'Select a tag' }}
        </div>
        <span class="arrow" :class="{ 'arrow-up': open }"></span>
      </template>
    </div>

    <transition name="dropdown">
      <div
        class="items"
        v-if="open"
        :style="{ overflowX: scrollHorizontalHidden ? 'hidden' : '', maxHeight: height + 'px' }"
      >
        <div
          v-for="(option, i) in options"
          :key="i"
          @click.stop="toggleOption(option)"
          :class="{
            'item-selected': isSelected(option),
            flex: true,
            'justify-between': true,
            'items-center': true,
          }"
          :style="{ background: isSelected(option) ? '#f5f5fd' : '', borderRadius: '8px' }"
        >
          <div>{{ option.name }}</div>
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

<script setup>
import { ref } from 'vue';
import { useNuxtApp } from '#app';

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  selectBoxAsSlot: {
    type: Boolean,
    default: false,
  },
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
});
const multiSelect = ref(null);
const open = ref(false);
const modelValue = toRef(props, 'modelValue');
const selectedItems = ref(modelValue);
const nuxtApp = useNuxtApp();

const isSelected = (option) => {
  return selectedItems.value.some((i) => i.tag.name === option.name);
};

const toggleOption = (option, first = false) => {
  // console.log(option)
  if (isSelected(option)) {
    const item = selectedItems.value.find((i) => i.tag.id === option.id);
    const index = selectedItems.value.indexOf(item);
    selectedItems.value.splice(index, 1);
  } else {
    if (first) {
      // selectedItems.value = [option.name]
    } else {
      if (selectedItems && selectedItems.value.length >= 10) {
        nuxtApp.$alert.show('No more than 10 tags for a project', {
          type: 'error',
          timeout: 5000,
        });
        return;
      }
      selectedItems.value.push({
        id: null,
        tag: {
          id: option.id,
          name: option.name,
        },
      });
    }
  }

  emits('update:modelValue', selectedItems.value);
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

watch(
  modelValue,
  (newV, oldV) => {
    selectedItems.value = newV;
  },
  { deep: true, immediate: true },
);
</script>

<style scoped lang="scss">
.multi-select {
  cursor: pointer;
  position: relative;
  display: inline-block;
  user-select: none;
  margin-left: 8px;
}

.first {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 12px;
}

.selected {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: $white;
  border: 1px solid $default-badge-border;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  padding: 4px 8px;
  color: #38405b;
  height: 32px;
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
  font-size: 12px;
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
  background-color: #f5f5fd;
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
  background: url('assets/images/select.svg');
  background-repeat: no-repeat;
  transition: transform 0.2s;
  margin-right: 5px;
  width: 12px;
  height: 7px;
}

.arrow-up {
  background: url('assets/images/select.svg');
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
