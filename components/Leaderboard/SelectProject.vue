<template>
  <div ref="select" class="select-container-highlight relative" :class="{ isInvisibleBg }">
    <div @click="showList = true" class="flex items-center justify-between w-full">
      <img class="proj" v-if="selectedOption" :src="selectedOption.logo || defaultBg" />
      <div class="proj" v-else />

      <input
        class="select-input"
        type="text"
        v-model="search"
        placeholder="Select a Project..."
        @focus="
          search = '';
          showList = true;
          selectOption({ name: '', id: null });
        "
      />

      <Icon name="Up" :size="24" class="rotate" :class="{ 'rotate-anim': !showList }"></Icon>
    </div>
    <ul v-show="showList" class="select-list" :class="{ 'select-list-top': top }">
      <li
        v-for="(option, index) in filteredOptions"
        :key="index"
        @click="selectOption(option)"
        class="select-option"
      >
        <img class="proj" v-if="option.logo" :src="option.logo" />
        <img class="proj" v-else :src="defaultBg" />
        <div v-html="highlightMatch(option)" style="width: 70%; text-align: left"></div>
      </li>
      <li v-if="!filteredOptions.length" class="select-option">No results</li>
    </ul>
  </div>
</template>

<script setup>
import defaultBg from '@/assets/images/default-avatar.png';

import { ref, computed, onMounted } from 'vue';
import { useProjectsStore } from '~/store';
const props = defineProps({
  top: { type: Boolean, default: false },
  isInvisibleBg: { type: Boolean, default: false },
  default: { type: Object, default: null },
  selected: { type: Boolean, default: false },
});
const projectsStore = useProjectsStore();
const projects = computed(() =>
  projectsStore.getProjects.map((item) => ({
    id: item.id,
    name: item.name,
    logo: item.logo,
  })),
);

const search = ref('');
const showList = ref(false);
const select = ref(null);

const selectedOption = ref(null);
if (props.selected) {
  selectedOption.value = projects.value[0];
  search.value = projects.value[0].name;
}
const filteredOptions = computed(() => {
  return projects.value.filter((option) =>
    option?.name.toLowerCase().includes(search.value.toLowerCase()),
  );
});
const emit = defineEmits(['select']);

const selectOption = (option) => {
  search.value = option.name;
  selectedOption.value = option;
  showList.value = false;
  emit('select', selectedOption.value);
};
const handleClickOutside = (event) => {
  if (select.value && !select.value.contains(event.target)) {
    showList.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

watch(
  props.default,
  (newV) => {
    if (newV) {
      console.log(newV);
      selectOption(newV);
    }
  },
  { immediate: true, deep: true },
);

const highlightMatch = (option) => {
  const regex = new RegExp(`(${search.value})`, 'gi');
  return option.name.replace(regex, '<span class="highlight">$1</span>');
};
</script>

<style lang="scss">
.isInvisibleBg {
  background: white !important;
  .proj {
    background: $default-badge-border !important;
  }
  .select-input {
    background: white !important;
  }
}
.select-container-highlight {
  display: flex;
  min-width: 200px;
  justify-content: space-between;
  max-width: 296px;
  padding: 7px 12px;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1px solid $default-border;
  background: $default-badge-border;
  .proj {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: $default-border;
  }
  .select-input {
    width: 80%;
    height: 30px;
    padding: 4px 12px 4px;
    box-sizing: border-box;
    color: $section-title;
    font-size: 16px;
    font-family: 'Basis Grotesque Pro';
    font-weight: 500;
    line-height: 24px;
    background: $default-badge-border;
    outline: none;
  }

  .select-list {
    position: absolute;
    bottom: 70px;
    display: flex;
    width: 296px;
    padding: 8px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    border-radius: 8px;
    background: $white;
    margin-left: -15px;
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
    border: 1px solid $colabs-bg;
    z-index: 100;
  }
  .select-list-top {
    position: absolute;
    margin-top: 55px !important;
    top: 0;
    display: flex;
    width: 100%;
    padding: 8px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    border-radius: 8px;
    background: $white;
    margin-left: -15px;
    max-height: 325px;
    overflow-y: auto;
    height: fit-content;
    overflow-x: hidden;
    border: 1px solid $colabs-bg;
  }

  .select-option {
    display: flex;
    width: 100%;
    align-items: center;
    padding: 4px 12px;
    gap: 12px;
    cursor: pointer;
    color: $default;
    font-size: 16px;
    font-family: 'Basis Grotesque Pro';
    font-weight: 500;
    line-height: 24px;
  }

  .select-option:hover {
    background: $default-badge-border;
  }

  .highlight {
    color: $orange;
  }

  .rotate {
    transform: rotate(0deg);
    transition-duration: 0.25s;
    &-anim {
      transform: rotate(180deg);
    }
  }
}
</style>
