<template>
  <form class="levels-field" :class="{ review, btnLight }">
    <div class="levels-item" v-for="(button, idx) in buttons" :key="idx">
      <input
        type="checkbox"
        :id="`${uniqueId}-${button.title}`"
        :name="uniqueId"
        :value="button.id"
        :checked="selectedLevels.includes(String(button.id))"
        ref="checkboxes"
        @change="onSelect(button.id)"
      />
      <label :class="{ review, btnLight }" :for="`${uniqueId}-${button.title}`">{{
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
    id: { type: Number, default: null },
    review: { type: Boolean, default: false },
    btnLight: { type: Boolean, default: false },
    selectedLevels: { type: Array, default: [] },
  },
  data() {
    return {
      uniqueId: this.generateUniqueId(),
    };
  },
  methods: {
    onSelect(id) {
      this.$nextTick(() => {
        let checkedButtons = Array.from(this.$refs.checkboxes)
          .filter((checkbox) => checkbox.checked)
          .map((checkbox) => checkbox.value);
        this.$emit('select', { id, checkedButtons });
      });
    },
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
.levels-field {
  display: flex;
  align-items: center;
  border-radius: 8px;
  overflow: hidden;
  min-width: 368px;
  width: auto;
  height: 32px;
  padding: 2px;
  gap: 8px;
  &.review {
    width: 490px;
  }
  &.btnLight {
    input {
      &:checked + label {
        background: $default-border;
        color: $section-title;
        line-height: 2.3;
      }
    }
  }
  input {
    &:checked + label {
      background: $default;
      border-radius: 6px;
      border-radius: 6px;
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 2.5;
      text-align: center;
      font-feature-settings: 'zero' on;
      color: $white;
    }
  }

  .levels-item {
    display: flex;
    align-items: center;
    width: 32px;
    height: 32px;
    white-space: nowrap;
  }

  label {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 2.5;
    text-align: center;
    font-feature-settings: 'zero' on;
    color: $default;
    height: 100%;
    width: 100%;
    padding: 0 10px;
    border: 1px solid $default-border;
    background: $white;
    border-radius: 8px;
    &.btnLight {
      line-height: 2.3;
      border: 1px solid $default-border;
    }

    &:hover {
      cursor: pointer;
      background: $default-border;
    }
  }
}
</style>
