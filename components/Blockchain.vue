<template>
  <icomoon
    :class="large ? 'custom-icoomon-large' : 'custom-icomoon'"
    :iconSet="iconSet"
    v-bind="iconProp"
  />
</template>

<script>
import { Icomoon } from 'vue-icomoon';
import iconSet from '@/assets/icons/blockchains.json';
import { ref, toRefs } from 'vue';

export default {
  name: 'Blockchain',
  components: { Icomoon },
  props: {
    large: Boolean,
    icon: String,
    size: [String, Number],
    name: [String],
  },
  setup(props) {
    const { icon, size, name } = toRefs(props);
    const computedSize = ref(typeof size.value === 'number' ? `${size.value}px` : size.value);
    const computedName = ref(
      typeof name.value === 'string' ? `${name.value.replace(' ', '-')}` : name.value,
    );
    const iconProp = {
      icon: icon,
      size: computedSize,
      name: computedName,
    };
    return {
      iconSet,
      icon,
      computedSize,
      computedName,
      iconProp,
    };
  },
};
</script>
