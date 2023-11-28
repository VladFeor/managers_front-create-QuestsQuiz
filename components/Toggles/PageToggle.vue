<template>
  <form class="page-field">
    <div class="page-item" v-for="(button, idx) in buttons" :key="idx">
      <input
        type="radio"
        :id="`${uniqueId}-${button.title}`"
        :name="uniqueId"
        :value="button.id"
        :checked="id === idx"
      />
      <label @click="$emit('select', button.id)" :for="`${uniqueId}-${button.title}`">{{
        button.title
      }}</label>
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
.page-field {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  width: fit-content;
  padding: 2px;
  color: $secondary;
  gap: 40px;

  input {
    &:checked + label {
      color: $section-title;
      border-radius: 6px;
      border: none;
    }
  }

  .page-item {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  label {
    display: block;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 350;
    font-size: 56px;
    line-height: 72px;
    font-feature-settings: 'zero' on;
    align-items: center;
    color: $colabs-bg;
    height: 100%;
    width: 100%;
    white-space: nowrap;
    transition: color 0.3s ease-in;
    &:hover {
      color: $secondary;
    }

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
