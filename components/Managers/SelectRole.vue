<template>
  <div :class="`custom-select ${mainStyles}`" :tabindex="tabindex" ref="selectContainer">
    <div
      class="selected flex justify-between"
      :class="`${open && 'open'} !${selectedStyle}`"
      @click="toggle"
    >
      <div :class="`${selectedLabelStyle}`">
        {{ selected && selected.name ? selected.name : '' }}
      </div>
      <Icon name="Up" :size="24" :class="{ rotate: open }"></Icon>
    </div>
    <div
      class="items"
      :class="{ selectHide: !open }"
      :style="{ overflowX: scrollHorizontalHidden ? 'hidden' : '', maxHeight: height + 'px' }"
    >
      <div class="first" @click="toggle">
        {{ selected && selected.name ? selected.name : '' }} <icon icon="Tik" :size="20"></icon>
      </div>
      <hr />
      <div
        v-for="(option, i) in options.filter((i) => i.name !== selected.name)"
        :key="i"
        @click.stop="selectOption(option)"
      >
        {{ option.name }}
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, onBeforeMount } from 'vue';
import { reduceStringLength } from '@/util/helpers';
import Icon from '../Icon';

export default {
  name: 'ProjectSelect',
  components: { Icon },
  data() {
    return {
      reduceStringLength,
    };
  },
  props: {
    mainStyles: {
      type: Object,
      default: {},
    },
    arrowStyle: {
      type: Object,
      default: {},
    },
    selectedStyle: {
      type: Object,
      default: {},
    },
    selectedLabelStyle: {
      type: Object,
      default: {},
    },
    tasty: {
      type: Boolean,
      default: false,
    },
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
    scrollHorizontalHidden: {
      type: Boolean,
      default: false,
    },
    height: {
      type: Number,
      default: 200,
    },
  },
  setup(props, { emit }) {
    const selected = ref(props.default || (props.options.length > 0 ? props.options[0] : null));
    const open = ref(false);
    const selectContainer = ref(null);

    const toggle = () => {
      open.value = !open.value;
    };

    const selectOption = (option) => {
      selected.value = option;
      toggle();
      emit('input', option);
    };

    const handleClickOutside = (event) => {
      if (selectContainer.value && !selectContainer.value.contains(event.target)) {
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
.custom-select {
  position: relative;
  max-width: 100%;
  text-align: left;
  outline: none;
  line-height: 47px;
}

.custom-select .selected {
  background: $white;
  border-radius: 8px;
  border: 1px solid #dad9f7;

  cursor: pointer;
  user-select: none;
  font-size: 16px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  padding: 7px 12px;
  align-items: center;
  gap: 4px;
  color: #38405b;
}

.custom-select .selected.open {
  background: #ffffff;
  border: 1px solid #eaeafb;
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';

  color: $default;
}

.custom-select .selected:after {
  position: absolute;
  content: '';
  top: 16px;
  right: 1em;
  width: 12px;
  height: 7px;
  border: none;
}

.arrow {
  position: absolute;
  content: '';
  top: 16px;
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
  max-height: 200px;
  overflow: scroll;
  border: 1px solid $default-badge-border;
  position: absolute;
  left: 0;
  right: 0;
  z-index: 1;
}
hr {
  margin: 8px 0;
  color: #dad9f7;
}
.custom-select .items div {
  color: $default;
  cursor: pointer;
  user-select: none;
  padding: 4px 8px;
}

.custom-select .items div:hover {
  background-color: $default-border;
  border-radius: 8px;
}

.selectHide {
  display: none;
}
.rotate {
  transform: rotate(180deg);
  transition-duration: 0.25s;
}
</style>
