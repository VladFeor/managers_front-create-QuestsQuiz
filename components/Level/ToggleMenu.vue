<template>
  <button
    v-if="toggle"
    type="button"
    class="h-[32px] w-[32px] bg-[#38405B] rounded-[8px] py-[9px] px-[8px]"
    @click="toggleCheckboxes"
  >
    <img src="@/assets/icons/LevelMenu.svg" width="16" height="13" alt="logo" />
  </button>
  <button
    v-else
    type="button"
    class="h-[32px] w-[32px] hover:bg-[#DAD9F7] rounded-[8px] py-[9px] px-[8px]"
    @click="toggleCheckboxes"
  >
    <img src="@/assets/icons/LevelMenu-black.svg" width="16" height="13" alt="logo" />
  </button>
</template>

<script setup>
import { ref } from 'vue';
const toggle = ref(false);
const emit = defineEmits(['toggleCheckboxes']);
function toggleCheckboxes() {
  toggle.value = !toggle.value;
  emit('toggleCheckboxes', toggle.value);
}
</script>

<style scoped lang="scss"></style>
