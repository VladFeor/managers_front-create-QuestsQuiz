<template>
  <div class="custom-select" ref="selectContainer">
    <div class="selected" :class="{ open: isOpen }" @click="toggleOpen">
      {{ name }}
      <div class="count" v-if="hasDiff"></div>
      <span class="arrow" :class="{ flipped: isOpen }"></span>
    </div>
    <div v-if="isOpen" class="flex flex-col container-lvl">
      <div class="tooltip-arrow"></div>
      <div class="inputs">
        <input v-model="value[0]" @input="updateValue($event, 0)" /> —

        <input v-model="value[1]" @input="updateValue($event, 1)" />
      </div>
      <div class="slider-demo-block">
        <el-slider :step="step" v-model="value" range :min="range[0]" :max="range[1]" />
      </div>
      <div class="controller">
        <div class="cancel" @click="clear">Clear</div>
        <div class="save" @click="apply">Apply</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const isOpen = ref(false);
const handleOutsideClick = (event) => {
  if (!event.target.closest('.custom-select')) {
    isOpen.value = false;
  }
};
const props = defineProps({
  range: {
    type: Array,
    required: true,
  },
  step: {
    type: Number,
    default: 1,
  },
  reset: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
  prefix: {
    type: String,
    default: '',
  },
});

watch(
  () => props.reset,
  (newValue) => {
    if (newValue) {
      clear();
      hasDiff.value = false;
      value.value[0] = 0;
    }
  },
);
const toggleOpen = () => {
  if (isOpen.value) {
    isOpen.value = false;
  } else {
    isOpen.value = true;
    document.dispatchEvent(new CustomEvent('close-other-selects', { detail: selectId.value }));
  }
};
const emit = defineEmits(['select']);
const hasDiff = ref(false);
const max = props.range[1];
const apply = () => {
  emit('select', {
    name: `${formatValue(value.value[0])} - ${formatValue(+value.value[1])}  ${props.prefix}`,
    type: props.type,
    min: formatValue(+value.value[0]),
    max: formatValue(+value.value[1]),
  });
  isOpen.value = false;
  hasDiff.value = true;
};
const formatValue = (event) => {
  if (isNaN(event) || event < 0) return; // Check if the parsed value is not a number or negative
  if (props.step) {
    return event;
  }
  const newValue = event.toString().replace(/[.,]/g, '');
  let value;
  value = newValue.toString().replace(/[^0-9.]/g, '');
  value = newValue.toString().replace(/(\..*)\./g, '$1');
  value = newValue.toString().replace(/^0+(?=\d)/, '');
  if (/^\./.test(value)) {
    value = '0' + value;
  }
  if (/[\d.]+/.test(value)) {
    return value;
  }
};
const clear = () => {
  value.value = [+props.range[0], +props.range[1]];
  hasDiff.value = false;
};
const closeOtherSelects = (event) => {
  if (selectId.value !== event.detail) {
    isOpen.value = false;
  }
};

watch(isOpen, (newValue) => {
  if (newValue) {
    document.addEventListener('click', handleOutsideClick);
  } else {
    document.removeEventListener('click', handleOutsideClick);
  }
});
const selectId = ref(null);

onBeforeMount(() => {
  selectId.value = Date.now() + Math.random();
});
onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('close-other-selects', closeOtherSelects);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick);
  document.removeEventListener('close-other-selects', closeOtherSelects);
});
const value = ref(props.range);

const updateValue = (event, index) => {
  if (!event.target.value) {
    clear();
    return;
  }
  value.value[index] = formatValue(event.target.value);
  value.value[index] > max
    ? (value.value[index] = +max)
    : (value.value[index] = +value.value[index]);
};
watch(value, () => {
  const cache = value.value[0];
  if (value.value[0] > value.value[1]) {
    value.value[0] = +value.value[1];
    value.value[1] = +cache;
  }
});
</script>
<style scoped lang="scss">
.slider-demo-block {
  display: flex;
  align-items: center;
}

.custom-select {
  position: relative;
  max-width: 100%;
  text-align: left;
  outline: none;
  z-index: 100000;
  line-height: 47px;
  min-width: fit-content;
  height: 32px;
}

.custom-select .selected {
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
  padding: 8px;
  align-items: center;
  color: $default;
  height: 32px;
  display: flex;
  gap: 16px;
  .count {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 8px;
    height: 8px;
    background: $orange;
    border-radius: 100%;
  }
}

.custom-select .selected.open {
  background: $white;
  border: 1px solid $default-badge-border;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  color: $default;
  box-shadow: 0 0 0 3px $default-border;
}

.custom-select .selected:after {
  position: relative;
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
  top: 50%;
  transform: translateY(-50%);
  right: 8px;
  width: 24px;
  height: 24px;
  border: none;
  transition: transform 0.2s;

  background: url('@/assets/images/select.svg');
  background-repeat: no-repeat;
  background-position: center;
}

.arrow.flipped {
  transform: rotate(180deg) translateY(50%);
}
.first {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
}
.container-lvl {
  width: 200px;
  height: 136px;
  position: absolute;
  left: 0;
  right: 0;
  z-index: 1;
  padding: 8px;
  background: $white;
  border: 1px solid $default-badge-border;
  border-radius: 8px;
  margin-top: 8px;
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
  padding-left: 30px;

  &::placeholder {
    color: $colabs-bg;
  }
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: $colabs-bg;
  pointer-events: none; /* чтобы иконка не блокировала события ввода */
}
.controller {
  margin-top: 8px;
  display: flex;
  gap: 8px;
  .cancel {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 4px 8px;
    gap: 8px;
    width: 88px;
    height: 32px;
    background: $default-border;
    border-radius: 8px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $default;
  }
  .save {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 4px 8px;
    gap: 8px;
    width: 88px;
    height: 32px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $white;
    background: $orange;
    border-radius: 8px;
  }
}
.inputs {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;

  width: 184px;
  height: 32px;

  border-radius: 16px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  /* identical to box height, or 133% */

  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;

  margin-bottom: 8px;
  color: $secondary;

  input {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 4px 8px;
    gap: 8px;
    font-feature-settings: 'zero' on;

    width: 83px;
    height: 32px;

    /* Paper

    Text on Dark Bg
    Chips, Cards, Fields Bgs
    */
    background: $white;
    /* Secondary/80 Moon Raker */

    border: 1px solid $default-border;
    border-radius: 8px;

    outline: none;
    &::placeholder {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      /* identical to box height, or 143% */

      font-feature-settings: 'zero' on;

      /* Secondary/50 Oxford Blue */

      color: $default;
    }
  }
}
.tooltip-arrow {
  position: absolute;
  top: -6px;
  left: 25%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid $white;
}
</style>
