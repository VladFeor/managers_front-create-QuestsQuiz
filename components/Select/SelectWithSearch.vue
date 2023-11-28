<template>
  <div class="custom-select" :tabindex="tabindex" ref="selectContainer">
    <div class="selected" :class="{ open }" @click="toggle">
      {{ reduceStringLength(selected || selected.name, reduceLength) }}
      <span class="arrow" :class="{ flipped: open }"></span>
    </div>
    <div class="items" :class="{ selectHide: !open, right: !leftAlign, left: leftAlign }">
      <div class="search-container">
        <Icon class="search-icon" icon="Search" :size="16"></Icon>
        <input class="search" type="text" v-model="search" :placeholder="`Find ${name}...`" />
      </div>
      <div v-if="filteredOptions.length === 0">No results</div>
      <div
        v-for="(option, i) in filteredOptions"
        class="item"
        :key="i"
        @click.stop="selectOption(option)"
      >
        {{ option.name }}
        <icon v-if="option.name === selected || selected.name" icon="Tik" :size="20"></icon>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, onBeforeMount } from 'vue';
import { reduceStringLength } from '@/util/helpers';
import Icon from '../Icon';

export default {
  components: { Icon },
  props: {
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
    name: {
      type: String,
      default: '',
    },
    reset: {
      type: Boolean,
      default: false,
    },
    reduceLength: {
      type: Number,
      required: false,
      default: 25,
    },
  },
  setup(props, { emit }) {
    const selected = ref(props.default || (props.options.length > 0 ? props.options[0] : null));
    const open = ref(false);
    const selectContainer = ref(null);
    const search = ref('');

    const toggle = () => {
      open.value = !open.value;
    };

    const selectOption = (option) => {
      if (selected.value === option.name) {
        selected.value = props.default || (props.options.length > 0 ? props.options[0] : null);
        emit('input', selected.value);
      } else {
        selected.value = option.name;
        emit('input', option);
      }

      toggle();
    };

    const handleClickOutside = (event) => {
      if (selectContainer.value && !selectContainer.value.contains(event.target)) {
        open.value = false;
      }
    };

    const filteredOptions = computed(() => {
      if (!search.value) return props.options;
      return props.options.filter((option) =>
        option.name.toLowerCase().includes(search.value.toLowerCase()),
      );
    });

    onBeforeMount(() => {
      //emit('input', selected.value);
      document.addEventListener('click', handleClickOutside);
    });

    watch(
      () => props.reset,
      (newResetValue) => {
        if (newResetValue) {
          selected.value = props.default || (props.options.length > 0 ? props.options[0] : null);
          emit('input', selected.value);
        }
      },
    );

    return {
      selected,
      open,
      selectContainer,
      toggle,
      selectOption,
      search,
      filteredOptions,
      reduceStringLength,
    };
  },
};
</script>

<style scoped lang="scss">
.custom-select {
  position: relative;
  text-align: left;
  outline: none;
  z-index: 95;
  line-height: 47px;
  height: 32px;
  min-width: 104px;
}

.custom-select .selected {
  height: 32px;
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

  color: #38405b;
}

.custom-select .selected.open {
  background: #ffffff;
  border: 1px solid #eaeafb;
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;

  color: $default;
}

.custom-select .selected:after {
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
  top: 14px;
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
.first {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
}
.custom-select .items {
  min-width: 200px;

  background: $white;
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  border-radius: 8px;
  margin-top: 8px;
  padding: 8px;
  line-height: 20px;
  color: $default;
  overflow-x: hidden;
  overflow-y: scroll;
  border: 1px solid $default-badge-border;
  position: absolute;

  z-index: 1;
  max-height: 250px;
  gap: 8px;
}

.left {
  left: 0;
}
.right {
  right: 0;
}

hr {
  margin: 4px 0;
  color: #dad9f7;
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
</style>
