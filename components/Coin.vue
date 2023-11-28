<template>
  <icomoon
    :class="large ? 'custom-icoomon-large' : 'custom-icomoon'"
    :iconSet="iconSet"
    v-bind="iconProp"
  />
</template>

<script>
import { Icomoon } from 'vue-icomoon';
import iconSet from '@/assets/icons/coins.json';
import { ref, toRefs } from 'vue';

export default {
  name: 'Coin',
  components: { Icomoon },
  props: {
    large: Boolean,
    icon: String,
    size: [String, Number],
  },
  setup(props) {
    const { icon, size } = toRefs(props);
    const computedSize = ref(typeof size.value === 'number' ? `${size.value}px` : size.value);
    const iconProp = {
      icon: icon,
      size: computedSize,
    };
    return {
      iconSet,
      icon,
      computedSize,
      iconProp,
    };
  },
};
</script>
