<template>
  <div class="flex gap-[8px] items-center">
    <div class="number">{{ count }}</div>
    <div class="question w-full">
      <input
        type="text"
        :value="modelValue"
        @input="updateValue"
        :placeholder="modelValue || 'Enter your question'"
      />
      <img
        :src="deleteIcon"
        class="cursor-pointer remove"
        @click="remove()"
        v-if="canDelete"
        width="24"
        height="24"
        alt="remove"
      />
    </div>
  </div>
</template>
<script setup>
import deleteIcon from '@/assets/icons/tasks/delete-icon.svg';

const props = defineProps({
  count: {
    type: Number,
    default: 1,
  },
  canDelete: {
    type: Boolean,
    default: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['update:modelValue', 'remove']);

function updateValue(event) {
  const newValue = event.target.value;
  emit('update:modelValue', newValue);
}
function remove() {
  emit('remove');
}
</script>
<style scoped lang="scss">
.number {
  display: flex;
  width: 40px;
  height: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  background: $default-badge-border;
  color: $secondary;
  text-align: center;
  font-variant-numeric: lining-nums tabular-nums slashed-zero;
  font-family: 'Basis Grotesque Pro';
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  padding: 16px;
}
.question {
  display: flex;
  padding: 7px 12px;
  align-items: center;
  gap: 4px;
  border-radius: 8px;
  border: 1px solid $default-border;
  background: $white;
  input {
    background: $white;
    color: $section-title;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-family: 'Basis Grotesque Pro';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    border: none;
    outline: none;
    width: 100%;
  }
  .remove {
    display: none !important;
  }
  &:hover {
    border-radius: 8px;
    border: 1px solid #aaa7cc;
    .remove {
      display: block !important;
    }
  }
}
</style>
