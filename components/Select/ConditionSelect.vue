<template>
  <div
    class="custom-select-condition"
    :class="{ open, edit: !!bg, disabled: !!disabled }"
    :tabindex="tabindex"
    ref="selectContainer"
  >
    <div class="selected" :class="{ open, edit: !!bg, disabled: !!disabled }" @click="toggle">
      <div class="selected-name" v-if="selected">{{ selected.name }}</div>
      <span class="arrow" :class="{ flipped: open }">
        <img src="@/assets/images/select.svg" alt="" />
      </span>
    </div>
    <div class="items" :class="{ selectHide: !open, fullWidth: !fullWidth, disabled: !!disabled }">
      <div v-for="(option, i) in options" :key="i" @click.stop="selectOption(option, i)">
        <div class="title-container">
          <Blockchain :name="option.icon" :size="20"/>
          <span> {{ option.name }}</span>
        </div>
        <Icon v-if="selected.name === option.name" name="Tik" :size="20" color="#38405B" />
      </div>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, ref } from 'vue';

export default {
  name: 'ConditionSelect',
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
    disabled: {
      type: Boolean,
      required: false,
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0,
    },
    selected: {
      required: true,
    },
    fullWidth: {
      type: Boolean,
      required: false,
      default: '100%',
    },
    bg: {
      type: Boolean,
      required: false,
    },
  },

  setup(props, { emit }) {
    const open = ref(false);
    const selectContainer = ref(null);

    const toggle = () => {
      if (!props.disabled) {
        open.value = !open.value;
      }
    };

    const selectOption = (option, i) => {
      emit('select', option);
      toggle();
    };

    const handleClickOutside = (event) => {
      if (selectContainer.value && !selectContainer.value.contains(event.target)) {
        open.value = false;
      }
    };

    onBeforeMount(() => {
      document.addEventListener('click', handleClickOutside);
    });

    return {
      open,
      selectContainer,
      toggle,
      selectOption,
    };
  },
};
</script>
<style scoped lang="scss">
.custom-select-condition {
  position: relative;
  width: 100%;
  text-align: left;
  outline: none;
  padding: 4px 12px 4px 52px;
  height: auto;
  background: #fff;
  outline: 1px solid #dad9f7;
  line-height: 32px;
  border-radius: 8px;
}

.custom-select-condition.open {
  outline: 3px solid #dad9f7;
}

.custom-select-condition .selected {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  font-size: 16px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  color: $default;
  text-decoration: dotted;
  color: #1a1d29;
}
.selected-name {
  max-width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.custom-select-condition .selected.open {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: $white;
  border-radius: 8px 8px 0px 0px;
  cursor: pointer;
  user-select: none;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  color: $default;
}

.custom-select-condition .selected:after {
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
  width: 12px;
  height: 7px;
  border: none;
  transition: transform 0.2s;
  img {
    width: 12px;
    height: 7px;
  }
}

.arrow.flipped {
  transform: rotate(180deg);
}
.fullWidth {
  width: 100%;
}
.custom-select-condition .items {
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
  overflow-x: hidden;
  margin-top: 10px;
  right: 0;
  right: 0;
  z-index: 1000;
  max-height: 240px;
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

  & .title-container {
    align-items: center;
    display: flex;
    gap: 8px;
    max-width: 200px;

    & > span {
      max-width: 180px;
      white-space: wrap;
    }
  }
}

.custom-select-condition .items div {
  display: flex;
  justify-content: space-between;
  color: $default;
  cursor: pointer;
  user-select: none;
  padding: 4px 8px;
  white-space: nowrap;
  align-items: center;
}

.custom-select-condition .items div:hover {
  background-color: $default-border;
  border-radius: 8px;
}
.edit {
  background-color: #dad9f7;
}
.selectHide {
  display: none;
}
.disabled {
  cursor: not-allowed !important;
}

.edit-condition-modal {
  .custom-select-condition {
    background-color: #fff;
    .edit{
      background-color: #fff;
    }
    
  }
}
</style>
