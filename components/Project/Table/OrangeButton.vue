<template>
  <button type="button" @click.stop="emits('clicked')" class="w-[135px] h-8 px-2 py-1 bg-orange-500 rounded-lg justify-start items-center gap-2 inline-flex ml-auto">
    <div class="justify-center items-center gap-2.5 flex">
      <div class="text-white text-[14px] font-medium leading-tight">
        {{ title }}
      </div>
    </div>
    <img src="@/assets/icons/create-white.svg" class="w-4 h-4 relative" />
  </button>
</template>

<script setup>
const emits = defineEmits(['clicked'])
const props = defineProps({
  title: {
    type: String,
    default: null
  }
})

</script>

<style scoped lang="scss">

</style>