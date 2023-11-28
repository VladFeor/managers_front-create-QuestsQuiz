<template>
  <form class="switch-field">
    <div v-for="(button, idx) in buttons" :key="idx">
      <input
        type="radio"
        :id="`${uniqueId}-${button.title}`"
        :name="uniqueId"
        :value="button.id"
        :checked="+id === idx"
        :class="button.type"
      />
      <label
        @click="onSelectRadio(button)"
        :class="[button.type, { big: big }]"
        v-on="{
          mouseenter: () => (this.hoveredButtonId = button.id),
          mouseleave: () => (this.hoveredButtonId = null),
        }"
        :for="`${uniqueId}-${button.title}`"
        >{{ button.title }}
        <span v-if="button.value !== undefined" class="value">{{ button.value }}</span></label
      >
    </div>
  </form>
</template>

<script>
export default {
  name: 'BadgeCheckbox',
  props: {
    buttons: {
      type: Array,
      default: () => [],
    },
    id: { type: Number, default: 0 },
    type: {
      type: String,
      default: 'transparent',
    },
    big: {
      type: Boolean,
      default: false,
    },
    resetButtonsFlag: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    resetButtonsFlag() {
      this.resetButtons();
    },
  },
  data() {
    return {
      uniqueId: this.generateUniqueId(),
      hoveredButtonId: null,
    };
  },
  methods: {
    onSelectRadio(event) {
      this.$emit('selected-ids', { id: event.id });
    },
    resetButtons() {
      this.buttons.forEach((button, index) => {
        button.checked = index === 0;
      });
    },
    generateUniqueId() {
      return `switch-${Math.random().toString(36).substr(2, 9)}`;
    },
    hoverColor(button) {
      if (button.colors?.light && button.id === this.hoveredButtonId) {
        return {
          color: `${button.backColor}`,
          border: `1px solid ${button.backColor}`,
        };
      } else {
        return {};
      }
    },
    activeColor(button) {
      if (button.checked && button.colors?.main) {
        return {
          background: `${button.colors.main} !important`,
          color: '$white !important',
          border: `1px solid ${button.colors.main}`,
        };
      }
      return {};
    },
    activeHoverColor(button) {
      if (button.checked && button.colors?.main && button.id === this.hoveredButtonId) {
        return {
          background: `${button.colors.dark} !important`,
          color: '$white !important',
          border: `1px solid ${button.colors.dark}`,
        };
      }
      return {};
    },
    onCheckedChanged(button) {
      button.checked = !button.checked;
      const allInactive = this.buttons.every((btn) => !btn.checked);

      if (allInactive) {
        this.buttons[0].checked = true;
      }

      this.emitSelectedIds();
    },
    emitSelectedIds() {
      const selectedIds = this.buttons
        .filter((button) => button.checked)
        .map((button) => button.id);
      this.$emit('selected-ids', selectedIds);
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
  flex-wrap: wrap;
  gap: 8px;
  .switch-item {
    display: flex;
    align-items: center;
    width: max-content;
    height: 100%;
  }

  label {
    // border: 1px solid $not-active-border;
    // color: $not-active-text;
    display: flex;
    padding: 4px 8px;
    border-radius: 8px;
    height: 24px;
    width: fit-content;
    align-items: center;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;

    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    /* identical to box height, or 133% */

    text-align: center;
    letter-spacing: 0.014em;
    span {
      margin-left: 5px;
    }
    &:hover {
      cursor: pointer;
    }
  }

  .image {
    padding-left: 2px;
    border: 1px solid $default-border;
    background: transparent;
    span {
      color: $default;
    }
  }

  .big {
    height: 32px !important;
    width: max-content;
    max-width: fit-content;
    display: flex;
    align-content: center;
    span {
      font-size: 14px;
      line-height: 20px;
    }
    .value {
      font-size: 12px;
    }
  }
}
.success {
  border: 1px solid $success-hover-border;
  color: $success-hover-text;
  background-color: $white;

  &:hover {
    border: 1px solid $success-hover-bg;
    background: $success-hover-bg;
    color: $white;
  }

  input:checked + & {
    border: 1px solid $success-active-hover-bg;
    background: $success-active-hover-bg !important;
    color: $white !important;
  }

  input:checked + & {
    &:hover {
      border: 1px solid $success-active-hover-bg;
      background: $success-active-hover-bg !important;
      color: $white !important;
    }
  }
}

.warning {
  border: 1px solid $warning-hover-border;
  color: $warning-hover-text;
  background-color: $white;

  &:hover {
    border: 1px solid $warning-hover-bg;
    background: $warning-hover-bg;
    color: $white;
  }

  input:checked + & {
    border: 1px solid $warning-active-hover-bg;
    background: $warning-active-hover-bg !important;
    color: $white !important;
  }

  input:checked + & {
    &:hover {
      border: 1px solid $warning-active-hover-bg;
      background: $warning-active-hover-bg !important;
      color: $white !important;
    }
  }
}

.danger {
  border: 1px solid $danger-hover-border;
  color: $danger-hover-text;
  background-color: $white;

  &:hover {
    border: 1px solid $danger-hover-bg;
    background: $danger-hover-bg;
    color: $white;
  }

  input:checked + & {
    border: 1px solid $danger-active-hover-bg;
    background: $danger-active-hover-bg !important;
    color: $white !important;
  }

  input:checked + & {
    &:hover {
      border: 1px solid $danger-active-hover-bg;
      background: $danger-active-hover-bg !important;
      color: $white !important;
    }
  }
}

.primary {
  border: 1px solid $primary-hover-border;
  color: $primary-hover-text;
  background-color: $white;

  &:hover {
    border: 1px solid $primary-hover-bg;
    background: $primary-hover-bg;
    color: $white;
  }

  input:checked + & {
    border: 1px solid $primary-active-hover-bg;
    background: $primary-active-hover-bg !important;
    color: $white !important;
  }

  input:checked + & {
    &:hover {
      border: 1px solid $primary-active-hover-bg;
      background: $primary-active-hover-bg !important;
      color: $white !important;
    }
  }
}

.info {
  border: 1px solid $info-hover-border;
  color: $info-hover-text;
  background-color: $white;

  &:hover {
    border: 1px solid $info-hover-bg;
    background: $info-hover-bg;
    color: $white;
  }

  input:checked + & {
    border: 1px solid $info-active-hover-bg;
    background: $info-active-hover-bg !important;
    color: $white !important;
  }

  input:checked + & {
    &:hover {
      border: 1px solid $info-active-hover-bg;
      background: $info-active-hover-bg !important;
      color: $white !important;
    }
  }
}

.mint {
  border: 1px solid $mint-hover-border;
  color: $mint-hover-text;
  background-color: $white;

  &:hover {
    border: 1px solid $mint-hover-bg;
    background: $mint-hover-bg;
    color: $white;
  }

  input:checked + & {
    border: 1px solid $mint-active-hover-bg;
    background: $mint-active-hover-bg !important;
    color: $white !important;
  }

  input:checked + & {
    &:hover {
      border: 1px solid $mint-active-hover-bg;
      background: $mint-active-hover-bg !important;
      color: $white !important;
    }
  }
}

.transparent {
  background-color: $white;
  border: 1px solid $transparent-hover-border;
  color: $transparent-hover-border;
  &:hover {
    border: 1px solid $mint-active-bg;
    background: $mint-active-bg;
    color: $transparent-active-text;
  }

  input:checked + & {
    border: 1px solid $transparent-active-hover-bg;
    background: $transparent-active-hover-bg !important;
    color: $white !important;
  }

  input:checked + & {
    &:hover {
      border: 1px solid $transparent-active-hover-bg;
      background: $transparent-active-hover-bg !important;
      color: $white !important;
    }
  }
}

.rounded {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 24px;
  border: none;
  background: $rounded-bg;
  span {
    color: $orange;
  }
}
</style>
