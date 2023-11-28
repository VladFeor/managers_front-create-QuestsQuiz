<template>
  <div ref="select" class="select-container-highlight-user relative" :class="{ isInvisibleBg }">
    <div @click="showList = true" class="flex items-center justify-between w-full">
      <input
        class="select-input"
        type="text"
        v-model="search"
        placeholder="Enter Email or Username"
        @focus="
          search = '';
          showList = true;
          selectOption({ name: '', id: null });
        "
        @blur="emit('blur', search)"
      />

      <Icon name="Up" :size="24" :class="{ rotate: showList }"></Icon>
    </div>
    <ul
      v-show="showList && filteredOptions.length"
      class="select-list"
      :class="{ 'select-list-top': top }"
    >
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
    </ul>
  </div>
</template>

<script setup>
import defaultBg from '@/assets/images/default-avatar.png';

import { ref, computed, onMounted } from 'vue';
import { useManagersStore } from '~/store';

const props = defineProps({
  top: { type: Boolean, default: false },
  withTalents: { type: Boolean, default: false },
  isInvisibleBg: { type: Boolean, default: false },
});
const managers = useManagersStore();

const mappedManagers = computed(() =>
  managers.getAutocomplete.map((item) => ({
    id: item.id,
    name: item.name,
    logo: item.logo,
    email: item.email,
  })),
);

const search = ref('');
const showList = ref(false);
const select = ref(null);
const selectedOption = ref(null);

const filteredOptions = computed(() => {
  return mappedManagers.value.filter(
    (option) => option.name && option?.name.toLowerCase().includes(search.value.toLowerCase()),
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
  managers.getAutocompleteAction(`?with_talents=${props.withTalents}`);
  document.addEventListener('click', handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
const highlightMatch = (option) => {
  const regex = new RegExp(`(${search.value})`, 'gi');
  return option.name.replace(regex, '<span class="highlight">$1</span>');
};
</script>

<style lang="scss">
.select-container-highlight-user {
  display: flex;
  padding: 7px 12px;
  align-items: center;
  gap: 4px;
  border-radius: 8px;
  border: 1px solid #dad9f7;
  background: #fff;
  .proj {
    width: 32px;
    height: 32px;
    border-radius: 28px;
    background: $default-border;
  }

  .select-input {
    box-sizing: border-box;
    color: #38405b;
    font-size: 16px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    outline: none;
    background: white;
    width: 100%;
    &::placeholder {
      color: #aaa7cc;
    }
  }

  .select-list {
    position: absolute;
    bottom: 50px;
    display: flex;
    width: 100%;
    padding: 8px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    z-index: 100;

    border-radius: 8px;
    background: $white;
    margin-left: -15px;
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
    border: 1px solid $colabs-bg;
  }
  .select-list-top {
    position: absolute;
    margin-top: 55px !important;
    top: 0;
    display: flex;
    width: 100%;
    padding: 7px 12px;
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
    transform: rotate(180deg);
    transition-duration: 0.25s;
  }
}
</style>
