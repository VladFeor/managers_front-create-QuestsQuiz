<template>
  <div :class="`flex flex-wrap text-xs ${align ? align : 'justify-center'}`">
    <template v-if="languages && languages.length > 0">
      <template v-for="(lng, index) in languages">
        <div
            v-if="index <= tagLimit || expandTags || showAllTags"
            class="rounded-md py-[3px] px-[8px] h-6 mr-1 flex items-center border"
            :style="{...styles}"
        >
          <div>
            {{ lng }}
          </div>
        </div>
        <div
            v-if="(index > tagLimit && index === (languages.length - 1)) && !expandTags && !showAllTags"
            class="rounded-md py-[3px] px-[8px] h-6 ml-1 cursor-pointer"
        >
        <span class="text-[#6A6D8F]" @click="expandAllTags">
          +{{ (languages.length - tagLimit - 1) }}
        </span>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup>
const tagLimit = 2;
const props = defineProps({
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
    default: 'justify-center'
  },
  languages: {
    type: Array,
    default: null
  },
  options: {
    type: Array,
    default: [],
  },
})
const expandTags = toRef(props, 'expand');
const showAll = toRef(props, 'show');
const languages = ref(props.languages);
const showAllTags = ref(false);

const emits = defineEmits(['setCategory', 'removeCategory'])
const expandAllTags = () => {
  if(showAll) {
    showAllTags.value = true
  }
}
</script>

<style scoped lang="scss">

</style>