<template>
  <div class="cursor-pointer w-full h-10 mt-[52px] p-1 bg-violet-100 rounded-lg justify-start items-center gap-0.5 inline-flex">
    <div
        :class="`w-40 h-8 px-2 rounded-md justify-center items-center gap-1 flex ${activeMenu.title === menu.title && 'bg-slate-700'}`"
        v-for="menu in menus"
        @click="setActiveMenu(menu)"
    >
      <div class="pb-0.5 justify-start items-start gap-2.5 flex">
        <div :class="`text-center text-[16px] font-medium leading-normal
        ${activeMenu.title === menu.title ? 'text-white' : 'text-slate-500'}`">
          {{ menu.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emits = defineEmits(['setActiveMenu'])
const props = defineProps({
  menus: {
    type: Array,
    default: []
  },
  activeMenu: {
    type: Object,
    default: null
  }
})
const setActiveMenu = (menu) => emits('setActiveMenu', menu)

</script>

<style scoped lang="scss">

</style>