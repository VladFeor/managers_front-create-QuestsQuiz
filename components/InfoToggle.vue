<template>
  <form class="switch-field">
    <div class="switch-item" v-for="(button, idx) in buttons" :key="idx">
      <input
          type="radio"
          :id="`${uniqueId}-${button.title}`"
          :name="uniqueId"
          :value="button.id"
          :checked="id === idx"
      />
      <label @click="$emit('select', button.id)" :for="`${uniqueId}-${button.title}`">{{ button.title }}</label>
    </div>
  </form>
</template>

<script>
export default {
  name: 'InfoToggle',
  props: {
    buttons: {
      type: Array,
      default: Array.of({
        title: { type: String, default: 'click' },
        id: { type: Number, default: 1 },
      }),
    },
    id: { type: Number, default: 0 },
  },
  data() {
    return {
      uniqueId: this.generateUniqueId(),
    };
  },
  methods: {
    generateUniqueId() {
      return `switch-${Math.random().toString(36).substr(2, 9)}`;
    },
  },
};
</script>

<style scoped lang="scss">
input {
  display: none;
}
.switch-field {
  display: flex;
  background: $white;
  border: 1px solid $default-badge-border;
  border-radius: 8px;
  overflow: hidden;
  height: 32px;
  width: fit-content;
  padding: 2px;
  input {
    &:checked + label {
      background: $default-border;
      color: $section-title;
      border-radius: 6px;
    }
  }

  .switch-item {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  label {
    display: block;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 2.2;
    text-align: center;
    letter-spacing: 0.014em;
    align-items: center;
    color: $secondary;
    height: 100%;
    width: 100%;
    padding: 0 10px;

    background: $white;

    &:first-of-type {
      border-radius: 8px 0 0 8px;
    }

    &:last-of-type {
      border-radius: 0 8px 8px 0;
    }

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
