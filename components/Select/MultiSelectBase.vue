<template>
  <div class="multi-select" ref="multiSelect" @click="toggleDropdown">
    <div class="selected">
      {{ selectedItems.length > 0 ? selectedItems.join(', ') : 'Выберите элементы...' }}
      <span class="arrow" :class="{ 'arrow-up': open }"></span>
    </div>
    <transition name="dropdown">
      <div class="items" v-if="open">
        <div
            v-for="(option, i) in options"
            :key="i"
            @click.stop="toggleOption(option)"
            :class="{ 'item-selected': isSelected(option) }"
        >
          {{ option }}
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
    options: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const multiSelect = ref(null);
    const open = ref(false);
    const selectedItems = ref(props.modelValue);

    const isSelected = (option) => selectedItems.value.includes(option);

    const toggleOption = (option) => {
      if (isSelected(option)) {
        selectedItems.value = selectedItems.value.filter((item) => item !== option);
      } else {
        selectedItems.value.push(option);
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

  width: 100%;
  cursor: pointer;
  position: relative;
  display: inline-block;
  user-select: none;

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

  color: #38405B;
}

.items {
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
  border-right: 1px solid $default-badge-border;
  border-left: 1px solid $default-badge-border;
  border-bottom: 1px solid $default-badge-border;
  border-radius: 0 0 4px 4px;
  max-height: 200px;
  width: 100%;

  overflow-y: auto;
  z-index: 10;
}

.items div {
  padding: 4px 8px;

  color: $default;

}

.items div:hover,
.items div.item-selected {

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
  background: url("@/assets/images/select.svg");
  background-repeat: no-repeat;
  transition: transform 0.2s;
  margin-right: 5px;
  width: 12px;
  height: 7px;
}

.arrow-up {
  background: url("@/assets/images/select.svg");
  background-repeat: no-repeat;
  transform: rotate(180deg);
  width: 12px;
  height: 7px;
}
</style>
