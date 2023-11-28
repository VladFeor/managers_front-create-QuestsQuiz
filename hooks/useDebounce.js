import { ref, onMounted, onUnmounted } from 'vue';

export function useDebounce(fn, delay) {
  const timeout = ref(null);

  function debouncedFn(...args) {
    clearTimeout(timeout.value);
    timeout.value = setTimeout(() => {
      fn(...args);
    }, delay);
  }

  onMounted(() => {
    onUnmounted(() => clearTimeout(timeout.value));
  });

  return debouncedFn;
}
