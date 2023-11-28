<template>
  <button type="button" @click.stop="emits('clicked')" class="w-[71px] h-8 px-2 py-1 bg-violet-50 rounded-lg justify-start items-center gap-2 inline-flex">
    <div class="justify-start items-start gap-2.5 flex">
      <div class="text-slate-500 text-[14px] font-medium leading-tight">{{ title }}</div>
    </div>
  </button>
</template>

<script setup>
  const props = defineProps({
    title: {
      type: String,
      default: null
    }
  })
  const emits = defineEmits(['clicked'])
</script>

<style scoped lang="scss">

</style>