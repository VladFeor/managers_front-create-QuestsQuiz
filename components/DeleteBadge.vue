<template>
  <div
      @mouseover="hoverDelete = true"
      @mouseleave="hoverDelete = false"
      @click.stop="toggleDelete"
      :class="`w-8 h-8 p-1 rounded-lg justify-center items-center gap-2 inline-flex cursor-pointer relative
      ${hoverDelete
        ? (hoverBgClass ? hoverBgClass : 'bg-slate-700')
        : (defaultBgClass ? defaultBgClass : 'bg-violet-50')
      }
      ${clickedDelete && '!bg-slate-700'}
      `"
  >
    <img v-if="hoverDelete && !clickedDelete" class="w-6 h-6 relative" :src="hoverBgIcon"  alt=""/>
    <img v-if="!hoverDelete && !clickedDelete" class="w-6 h-6 relative" :src="defaultBgIcon"  alt=""/>
    <img v-if="clickedDelete" class="w-6 h-6 relative" :src="activeBgIcon"  alt=""/>


    <div v-if="clickedDelete" class="absolute top-10 right-0 w-[216px] h-[88px] p-2 bg-white rounded-lg shadow flex-col justify-center items-center gap-2 flex">
      <div class="self-stretch text-slate-700 text-[14px] font-medium leading-tight">
        {{ confirmDeleteText }}
      </div>
      <div class="self-stretch justify-start items-start gap-2 inline-flex">
        <button type="button" @click.stop="clickedDelete = false" class="grow shrink basis-0 bg-white rounded-md flex-col justify-center items-center gap-2.5 inline-flex">
          <div class="text-slate-500 text-[12px] font-medium leading-none tracking-wide">Cancel</div>
        </button>
        <button type="button" @click.stop="confirmDelete"  class="grow shrink basis-0 bg-white rounded-md flex-col justify-center items-center gap-2.5 inline-flex">
          <div class="text-orange-700 text-[12px] font-medium leading-none tracking-wide">Confirm</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  const props = defineProps({
    hoverBgClass: {
      type: String,
      default: null
    },
    defaultBgClass: {
      type: String,
      default: null
    },
    activeBgClass: {
      type: String,
      default: null
    },
    defaultBgIcon: {
      type: String,
      default: null
    },
    hoverBgIcon: {
      type: String,
      default: null
    },
    activeBgIcon: {
      type: String,
      default: null
    },
    confirmDeleteText: {
      type: String,
      default: "Are you sure for delete this item ?"
    },
    isConfirm: {
      type: Boolean,
      default: false
    }
  })
  const emits = defineEmits(['confirm'])
  const clickedDelete = ref(false);
  const hoverDelete = ref(false);
  const toggleDelete = () => {
    clickedDelete.value = !clickedDelete.value
  }
  const confirmDelete = () => {
    clickedDelete.value = false
    emits('confirm')
  }
</script>

<style scoped>

</style>