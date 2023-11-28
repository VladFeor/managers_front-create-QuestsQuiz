<template>
  <div class="custom-select" :tabindex="tabindex" ref="selectContainer">
    <div class="selected" :class="{ open }" @click="toggle">
      <div v-if="selected">{{ selected.name }}</div>
      <div class="dashed-line" :class="{ open }"></div>
      <span class="arrow" :class="{ flipped: open }">
        <img src="@/assets/images/select.svg" alt="" />
      </span>
    </div>
    <div class="items" :class="{ selectHide: !open }">
      <div v-for="(option, i) in options" :key="i" @click.stop="selectOption(option, i)">
        {{ option.name }}
        <Icon
            v-if="selected.name === option.name"
            name="Tik"
            :size="20"
            color="#38405B" />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onBeforeMount, ref } from 'vue';

export default {
  name: 'Select',
  props: {
    options: {
      type: Array,
      required: true,
    },
    default: {
      type: Object || null,
      required: false,
      default: null,
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const selected = ref(props.default || (props.options.length > 0 ? props.options[0] : null));
    const open = ref(false);
    const selectContainer = ref(null);

    const toggle = () => {
      open.value = !open.value;
    };

    const selectOption = (option, i) => {
      selected.value = option;
      toggle();
      emit('input', option, i);
    };

    const handleClickOutside = (event) => {
      if (!selectContainer.value.contains(event.target)) {
        open.value = false;
      }
    };

    onBeforeMount(() => {
      emit('input', selected.value);
      document.addEventListener('click', handleClickOutside);
    });

    return {
      selected,
      open,
      selectContainer,
      toggle,
      selectOption,
    };
  },
};
</script>
<style scoped lang="scss">
.dashed-line {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0px;
  width: 100%;
  border-top: 3px dashed $default-border;

  &.open {
    display: none;
  }
}
.custom-select {
  position: relative;
  z-index: 16;
  width: fit-content;
  margin-bottom: 47px;
  text-align: left;
  outline: none;
  height: auto;
  line-height: 47px;
}

.custom-select .selected {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 350;
  font-size: 48px;
  // line-height: 64px;
  padding: 14px 14px 14px 0;
  color: $default;
  text-decoration: dotted;
  border-bottom: 3px solid transparent;
}

.custom-select .selected.open {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: $white;
  border-bottom: 3px solid $default-border;
  border-radius: 8px 8px 0px 0px;
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 350;
  font-size: 48px;
  // line-height: 64px;
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
  content: '';
  width: 20px;
  height: 20px;
  border: none;
  transition: transform 0.2s;
  img {
    width: 20px;
    height: 20px;
  }
}

.arrow.flipped {
  transform: rotate(180deg);
}

.custom-select .items {
  width: fit-content;
  box-shadow: 0px 4px 16px rgba(56, 64, 91, 0.24);
  border-radius: 8px;
  background: $white;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: $default;
  padding: 8px;
  position: absolute;
  margin-top: 10px;
  left: 0;
  right: 0;
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  &::after {
    content: '';
    position: absolute;
    width: 28px;
    height: 18px;
    background: $white;
    transform: rotate(45deg) translateX(-50%); /* add translateX(-50%) to center horizontally */
    z-index: -1;
    top: 10px;
    left: 50%; /* use left: 50% to center horizontally */
  }
}

.custom-select .items div {
  display: flex;
  justify-content: space-between;
  color: $default;
  cursor: pointer;
  user-select: none;
  padding: 4px 8px;
  white-space: nowrap;
}

.custom-select .items div:hover {
  background-color: $default-border;
  border-radius: 8px;
}

.selectHide {
  display: none;
}
</style>
