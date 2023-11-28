<template>
  <form class="switch-field">
    <div v-for="(button, idx) in buttons" :key="idx">
      <input
        type="checkbox"
        :id="`${uniqueId}-${button.title}`"
        :name="uniqueId"
        :value="button.id"
        :checked="button.checked"
        :class="button.type"
        @change="onCheckedChanged(button)"
        :alt="button.checked"
      />
      <label
        :class="[button.type, { big: big }]"
        v-on="{
          mouseenter: () => (this.hoveredButtonId = button.id),
          mouseleave: () => (this.hoveredButtonId = null),
        }"
        :style="{
          ...activeColor(button),
          ...hoverColor(button),
          ...activeHoverColor(button),
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
    hiddenSelected: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    resetButtonsFlag() {
      this.resetButtons();
    },
    hiddenSelected() {
      if (!this.hiddenSelected) {
        this.resetButtons();
        //this.emitSelectedIds();
      }
    },
  },
  data() {
    return {
      uniqueId: this.generateUniqueId(),
      hoveredButtonId: null,
    };
  },
  methods: {
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
      if (button.checked && button.title === 'All') {
        return {
          border: '1px solid #DCF5F3',
          background: '#DCF5F3',
          color: '#38405B',
        };
      }
      if (button.checked && button.colors?.main) {
        return {
          background: `${button.colors.main} !important`,
          color: '#fff !important',
          border: `1px solid ${button.colors.main}`,
        };
      }
      return {};
    },
    activeHoverColor(button) {
      if (button.checked && button.colors?.main && button.id === this.hoveredButtonId) {
        return {
          background: `${button.colors.dark} !important`,
          color: '#fff !important',
          border: `1px solid ${button.colors.dark}`,
        };
      }
      return {};
    },
    onCheckedChanged(button) {
      button.checked = !button.checked;
      const allInactive = this.buttons.every((btn) => !btn.checked);
      if (allInactive && !this.hiddenSelected) {
        this.resetButtons();
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
  gap: 12px;
  .switch-item {
    display: flex;
    align-items: center;
    width: max-content;
    height: 100%;
  }

  label {
    border: 1px solid $not-active-border;
    color: $not-active-text;
    display: flex;
    padding: 4px 8px;
    border-radius: 6px;
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
  border: 1px solid $not-active-border;
  color: $not-active-text;
  &:hover {
    border: 1px solid $success-hover-border !important;
    color: $success-hover-text;
  }

  input:checked + & {
    border: none;
    background: $success-active-bg;
    color: $success-active-text;
  }

  input:checked + & {
    &:hover {
      border: none;
      background: $success-active-hover-bg !important;
      color: $white !important;
    }
  }
}

.warning {
  border: 1px solid $not-active-border;
  color: $not-active-text;
  &:hover {
    border: 1px solid $warning-hover-border !important;
    color: $warning-hover-text;
  }

  input:checked + & {
    border: none;
    background: $warning-active-bg;
    color: $warning-active-text;
  }

  input:checked + & {
    &:hover {
      border: none;
      background: $warning-active-hover-bg !important;
      color: $white !important;
    }
  }
}

.danger {
  border: 1px solid $not-active-border;
  color: $not-active-text;
  &:hover {
    border: 1px solid $danger-hover-border !important;
    color: $danger-hover-text;
  }

  input:checked + & {
    border: none;
    background: $danger-active-bg;
    color: $danger-active-text;
  }

  input:checked + & {
    &:hover {
      border: none;
      background: $danger-active-hover-bg !important;
      color: $white !important;
    }
  }
}

.primary {
  border: 1px solid $not-active-border;
  color: $not-active-text;
  &:hover {
    border: 1px solid $primary-hover-border !important;
    color: $primary-hover-text;
  }

  input:checked + & {
    border: none;
    background: $primary-active-bg;
    color: $primary-active-text;
  }

  input:checked + & {
    &:hover {
      border: none;
      background: $primary-active-hover-bg !important;
      color: $white !important;
    }
  }
}

.info {
  border: 1px solid $not-active-border;
  color: $not-active-text;
  &:hover {
    border: 1px solid $info-hover-border !important;
    color: $info-hover-text;
  }

  input:checked + & {
    border: none;
    background: $info-active-bg;
    color: $info-active-text;
  }

  input:checked + & {
    &:hover {
      border: none;
      background: $info-active-hover-bg !important;
      color: $white !important;
    }
  }
}

.mint {
  border: 1px solid $not-active-border;
  color: $not-active-text;
  &:hover {
    border: 1px solid $mint-hover-border !important;
    color: $mint-hover-text;
  }

  input:checked + & {
    border: none;
    background: $mint-active-bg;
    color: $mint-active-text;
  }

  input:checked + & {
    &:hover {
      border: none;
      background: $mint-active-hover-bg !important;
      color: $white !important;
    }
  }
}

.transparent {
  border: 1px solid $not-active-border;
  color: $not-active-text;
  &:hover {
    border: 1px solid $transparent-hover-border !important;
    color: $transparent-hover-text;
  }

  input:checked + & {
    border: 1px solid $mint-active-bg;
    background: $mint-active-bg;
    color: $transparent-active-text;
  }

  input:checked + & {
    &:hover {
      border: none;
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
