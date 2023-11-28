<template>
  <div :class="`flex flex-wrap text-xs gap-y-[1px] ${align ? align : 'justify-center'}`">
    <template v-if="categories && categoriesPropToRef.length > 0">
      <template v-for="(cat, index) in categoriesPropToRef" :key="cat.tag.id + index">
        <div
          v-if="index <= tagLimit || expandTags || showAllTags"
          class="rounded-md py-[3px] px-[8px] h-6 mr-1 flex items-center"
          :style="{
            backgroundColor: withSelect
              ? selectedTags.some((c) => c === cat.tag.id)
                ? cat.tag.colors.light
                : catBg
              : catBg
              ? catBg
              : cat.tag.colors.light,
            ...styles,
          }"
          @click="setCategory(cat.tag)"
        >
          <div :style="{ color: catTxtColor ? catTxtColor : cat.tag.colors.dark }">
            {{ cat.tag?.name }}
          </div>
          <Icon
            v-if="withDelete"
            class="ml-2 cursor-pointer"
            name="Delete"
            :size="13"
            @click="deleteCategory(cat)"
          />
        </div>
        <div
          v-if="index > tagLimit && index === categories.length - 1 && !expandTags && !showAllTags"
          class="rounded-md py-[3px] px-[8px] h-6 ml-1 cursor-pointer"
          :style="{ backgroundColor: tagLimitBg }"
        >
          <span class="text-[#6A6D8F]" @click="expandAllTags">
            +{{ categories.length - tagLimit - 1 }}
          </span>
        </div>
      </template>
    </template>
    <template v-if="withAddMore">
      <div class="relative flex items-center">
        <Tags
          is-open
          default
          class="w-[140px]"
          :options="options"
          :model-value="categories"
          @update:modelValue="setNewCategories"
          label="Directions"
          select-box-as-slot
          style="margin-left: 0"
        >
          <button
            type="button"
            class="rounded-md py-[3px] px-[8px] flex items-center border"
            :style="styles"
            @click="showTagInput = true"
          >
            <span>Add</span>
            <Icon class="ml-1" name="Create" :size="16" />
          </button>
        </Tags>
      </div>
    </template>
  </div>
</template>

<script setup>
import { toRef, ref } from 'vue';
const tagLimitBg = '#F5F5FD';

const props = defineProps({
  tagLimit: {
    type: Number,
    default: 2,
  },
  expand: {
    type: Boolean,
    default: false,
  },
  show: {
    type: Boolean,
    default: false,
  },
  styles: {
    type: Object,
    default: {},
  },
  align: {
    type: String,
    default: 'justify-center',
  },
  categories: {
    type: Array,
    default: null,
  },
  catBg: {
    type: String,
    default: null,
  },
  options: {
    type: Array,
    default: [],
  },
  catTxtColor: {
    type: String,
    defauly: null,
  },
  withSelect: {
    type: Boolean,
    default: false,
  },
  withDelete: {
    type: Boolean,
    default: false,
  },
  withAddMore: {
    type: Boolean,
    default: false,
  },
});
const expandTags = toRef(props, 'expand');
const showAll = toRef(props, 'show');
const categoriesPropToRef = toRef(props, 'categories');
// const categories = ref(props.categories);
const selectedTags = ref([]);
const showAllTags = ref(false);
const showTagInput = ref(false);

const emits = defineEmits(['setCategory', 'removeCategory']);
const expandAllTags = () => {
  if (showAll) {
    showAllTags.value = true;
  }
};
const setCategory = (cat) => {
  if (selectedTags.value.some((c) => c === cat.id)) {
    selectedTags.value = selectedTags.value.filter((c) => c !== cat.id);
  } else {
    selectedTags.value.push(cat.id);
  }
  emits('setCategory', selectedTags.value);
};

const setNewCategories = (cats) => {
  emits('setNewCategories', cats);
};

const deleteCategory = (cat) => {
  categoriesPropToRef.value = categoriesPropToRef.value.filter((c) => c.tag.id !== cat.tag.id);
  emits('deleteCategory', categoriesPropToRef);
};
</script>

<style scoped lang="scss"></style>
