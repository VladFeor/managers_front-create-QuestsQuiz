<template>
  <div class="flex items-center gap-x-1">
    <Icon v-if="status" icon="Crown" :size="24" class="icon"></Icon>
    <Talent :text="talent.name" :img="talent.img"></Talent>
    <div class="you" v-if="isYou">(You)</div>
  </div>
</template>
<script setup>
const props = defineProps({
  talent: {
    type: Object,
    default: () => {},
  },
  status: {
    type: Boolean,
    default: false,
  },
  isYou: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="scss">
.you {
  color: #aaa7cc;
  font-size: 14px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
}
.icon {
  filter: invert(49%) sepia(55%) saturate(2983%) hue-rotate(352deg) brightness(97%) contrast(105%);
}
</style>
