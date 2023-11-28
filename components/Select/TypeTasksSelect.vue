<template>
  <div class="custom-select-type-task" :tabindex="tabindex" ref="selectContainer">
    <base-button v-if="!isProjectManager" @click="toggle" text="Create a Task"></base-button>
    <div class="items" :class="{ selectHide: !open }">
      <div v-for="(option, i) in customOptions" :key="i" @click.stop="openModalCreate(option)">
        <span v-html="highlightMatch(reduceStringLength(option.name, props.reduceLength))"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import { reduceStringLength } from '@/util/helpers';
const props = defineProps({
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
  handleOpen: { type: Function, default: () => console.log('type create tasks') },
  type: { type: String, default: '' },
  reduceLength: {
    type: Number,
    required: false,
    default: 25,
  },
});
const emit = defineEmits(['input']);
const open = ref(false);
const filteredOptions = ref(props.options);
const selectContainer = ref(null);
const searchValue = ref('');
const customOptions = computed(() => filteredOptions.value);
const toggle = () => {
  if (props.isDisabled) return;
  open.value = !open.value;
};
const handleClickOutside = (event) => {
  if (selectContainer.value && !selectContainer.value.contains(event.target)) {
    open.value = false;
  }
};
const openModalCreate = (event) => {
  props.handleOpen(true, event);
};
const highlightMatch = (name) => {
  const regex = new RegExp(`(${searchValue.value})`, 'gi');
  return name.replace(regex, '<span class="highlight">$1</span>');
};
onBeforeMount(() => {
  if (props.options.length > 0) {
    filteredOptions.value = props.options;
  }
  document.addEventListener('click', handleClickOutside);
});
</script>

<style lang="scss">
.custom-select-type-task {
  position: relative;
  width: 156px;
  height: 40px;
  text-align: left;
  outline: none;
  z-index: 700;
  &.create {
    width: 240px;
    height: 40px;
    .selected {
      width: 240px;
      height: 40px;
      line-height: 2.2;
      &.open {
        line-height: 2.2;
      }
      .arrow-task {
        top: 16px;
      }
    }
    .items {
      top: 51px;
    }
  }
}
.custom-select-task .selected {
  background: $white;
  border: 1px solid $default-border;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.7;
  padding: 4px 8px;
  width: 160px;
  height: 32px;
  color: #38405b;
}
.custom-select-task .selected.open {
  background: $white;
  border: 1px solid $default-badge-border;
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.7;
  color: $default;
  box-shadow: 0 0 0 3px $default-border;
}
.custom-select-task .selected:after {
  position: absolute;
  content: '';
  top: 12px;
  right: 1em;
  width: 12px;
  height: 7px;
  border: none;
}
.arrow-task {
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
.arrow-task.flipped {
  transform: rotate(180deg);
}
.custom-select-type-task .items {
  display: flex;
  flex-direction: column;
  padding: 8px;
  background: $white;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  border-radius: 0 0 4px 4px;
  line-height: 20px;
  color: $default;
  overflow: hidden;
  border-right: 1px solid $default-badge-border;
  border-left: 1px solid $default-badge-border;
  border-bottom: 1px solid $default-badge-border;
  position: absolute;
  left: 0;
  right: 0;
  top: 50px;
  z-index: 555;
  border-radius: 8px;
  overflow: inherit;
  max-height: 368px;
  overflow-y: scroll;
  overflow-x: hidden;
  & > div {
    margin-top: 8px;
    margin-bottom: 8px;
  }
  // & > div:last-child::before {
  //   content: '';
  //   display: block;
  //   height: 1px;
  //   margin-bottom: 8px;
  //   width: 100%;
  //   top: -8px;
  //   left: 0;
  //   position: absolute;
  //   background-color: #dad9f7;
  // }
  & > div:last-child {
    position: relative;
    margin-top: 8px;
  }
  &.selectHide {
    display: none;
  }
  &::after {
    content: '';
    position: absolute;
    width: 28px;
    height: 18px;
    background: $white;
    z-index: -1;
    top: 14px;
    left: 50%;
    right: 50%;
    transform: rotate(45deg) translate(-50%, -10%);
  }
}
.custom-select-type-task .items div:not(.empty-options) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: $default;
  cursor: pointer;
  user-select: none;
  padding: 4px 8px;
  white-space: nowrap;
}
.empty-options {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  padding: 4px 8px;
}
.custom-select-type-task .items div:not(.input-project-wrapper, .empty-options):hover {
  background-color: $default-border;
  border-radius: 8px;
}
</style>
