<template>
  <div class="rating">
    <span v-for="n in 5" :key="n" @click="updateRating(n)">
      <Icon v-if="n <= rating" name="Star-Y" :size="26" />
      <Icon v-else name="Star-0" :size="26" />
    </span>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const rating = ref(0);

const emit = defineEmits(['setRate']);

function updateRating(n) {
  rating.value = n;
  emit('setRate', rating.value);
}
</script>

<style lang="scss" scoped>
.rating {
  width: 130px;
  cursor: pointer;
}
</style>
