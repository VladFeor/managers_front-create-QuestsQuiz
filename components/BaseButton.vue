<template>
  <BtnSkeleton v-if="loading" />
  <div v-else :class="[type, { disabled }]" @click="$emit('clickFromComponent', id ?? null)">
    <span>{{ text }}</span>
    <img v-if="type == 'base'" src="@/assets/icons/plus.svg" alt="" />
  </div>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    id: Number,
    text: String,
    type: {
      type: String,
      default: 'base',
    },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
};
</script>

<style scoped lang="scss">
.secondary {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 7px 12px;
  gap: 8px;
  background: $default-border;
  border-radius: 8px;
  cursor: pointer;

  width: 100%;
  height: 40px;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $default;
  &.disabled {
    background: transparent;
    color: $default-border;
    border-radius: 8px;
    border: 1px solid $default-border;
    span {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: $default-border;
    }
    &:hover {
      background: transparent;
      color: $default-border;
      border-radius: 8px;
      border: 1px solid $default-border;
    }
  }
  // &:hover {
  //   background: $default-border;
  // }
}
.normal {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 7px 12px;
  gap: 8px;
  background: #fc660c;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  height: 40px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $white;
  &.disabled {
    background-color: $secondary;
    cursor: inherit;
    &:hover {
      background-color: $secondary;
    }
  }
  &:hover {
    background: $orange-active;
  }
}
.action {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 7px 12px;
  gap: 8px;
  background: #fc660c;
  border-radius: 8px;
  cursor: pointer;

  width: 240px;
  height: 40px;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $white;
  &.disabled {
    background-color: $secondary;
    cursor: inherit;
  }
  &:hover {
    background: $orange-active;
  }
}
.base {
  padding: 8px 12px;
  border-radius: 8px;
  max-width: fit-content;
  height: 40px;
  background: $orange;
  display: flex;
  cursor: pointer;
  align-items: center;
  &.disabled {
    background-color: $secondary;
    cursor: inherit;
  }
  &:hover {
    background: $orange-active;
  }
  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;

    color: $white;
  }
  img {
    margin-left: 8px;
  }
}
.level {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  gap: 4px;
  width: 80px;
  height: 32px;
  background: $default-border;
  border-radius: 8px;
  &.disabled {
    background-color: $secondary;
    cursor: inherit;
  }

  &:hover {
    cursor: pointer;
    background: $default;
    span {
      color: $white;
    }
  }

  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: $default;
  }
}
.twitter {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  gap: 4px;
  width: 80px;
  height: 40px;
  background: $default-border;
  border-radius: 8px;

  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: $default;
    cursor: pointer;
  }

  &.disabled {
    background: transparent;
    color: $default-border;
    border-radius: 8px;
    border: 1px solid $default-border;
    span {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: $default-border;
    }
    &:hover {
      background: transparent;
      color: $default-border;
      border-radius: 8px;
      border: 1px solid $default-border;
    }
  }
}
</style>
