<template>
  <div class="custom-select" :tabindex="tabindex" ref="selectContainer">
    <div class="selected" :class="{ open }" @click="toggle">
      <img src="@/assets/icons/dots.svg" />
    </div>
    <div class="items" :class="{ selectHide: !open }">
      <div v-for="(option, i) in options" :key="i">
        <input
          type="checkbox"
          :id="option.id"
          @change="onCheckedChanged(option)"
          :checked="selectedOptions.includes(option.id)"
          :value="option.id"
        />
        <label :for="option.id"
          >{{ option.title }} {{ option.value }}
          <icon v-if="selectedOptions.includes(option.id)" icon="Tik" :size="20"></icon>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watchEffect } from 'vue';

export default {
  name: 'HiddenSelect',
  props: {
    options: {
      type: Array,
      required: true,
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0,
    },
    resetButtonsFlag: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['select'],
  setup(props, { emit }) {
    const selectedOptions = ref([]);
    const open = ref(false);
    const selectContainer = ref(null);

    const toggle = () => {
      open.value = !open.value;
    };

    const handleClickOutside = (event) => {
      if (selectContainer.value && !selectContainer.value.contains(event.target)) {
        open.value = false;
      }
    };

    const onCheckedChanged = (item) => {
      const index = selectedOptions.value.indexOf(item.id);
      if (index >= 0) {
        selectedOptions.value.splice(index, 1);
      } else {
        selectedOptions.value.push(item.id);
      }
      emit('select', selectedOptions.value);
    };

    const resetButtons = () => {
      selectedOptions.value = [];
      //emit('select', selectedOptions.value);
    };

    watchEffect(() => {
      if (props.resetButtonsFlag) {
        resetButtons();
      }
    }, [props.resetButtonsFlag]);

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    return {
      selectedOptions,
      open,
      selectContainer,
      toggle,
      onCheckedChanged,
      resetButtons,
    };
  },
};
</script>

<style scoped lang="scss">
input {
  display: none;
}
.custom-select {
  position: relative;
  text-align: left;
  outline: none;
  height: 47px;
  z-index: 100000;
  line-height: 47px;
}

.custom-select .selected {
  display: flex;
  justify-content: center;
  padding: 4px;
  gap: 4px;
  width: 32px;
  height: 32px;
  border: 1px solid #eaeafb;
  border-radius: 8px;
  img {
    width: 18px;
  }
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
  top: 12px;
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

.custom-select .items {
  background: $white;
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  border-radius: 8px;
  margin-top: 5px;
  padding: 4px 8px;
  line-height: 20px;
  color: $default;
  overflow: hidden;
  border: 1px solid $default-badge-border;
  position: absolute;
  min-width: 120px;
  width: 150px;
  left: 0;
  right: 0;
  z-index: 1;
}

.custom-select .items div {
  color: $default;
  cursor: pointer;
  user-select: none;
  padding: 4px 8px;
  label {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.custom-select .items div:hover {
  background-color: $default-border;
}
input:checked {
  background-color: $default-border;
}
.selectHide {
  display: none;
}
</style>
