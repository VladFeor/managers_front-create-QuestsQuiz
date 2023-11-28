<template>
  <div
    class="main cursor-pointer"
    :class="[{ wide }, { active: isActive }, { activeTime: isTimeActive }, { no: value == 0 }]"
    :style="{ ...style }"
  >
    <div class="icons-wrapper">
      <Icon
        v-if="!wide"
        class="icon"
        :size="24"
        :name="getIconByName(title)"
        :icon="getIconByName(title)"
      />
      <OverdueWarning v-if="(!wide && title === 'overdue tasks') || title === 'overdue'" />
    </div>
    <div class="info" :class="[{ wide }]">
      <div class="value w-full">
        {{ value == 0 ? 'No' : formatNumber(value) }}
      </div>
      <div class="title flex justify-between">
        <div>{{ title }}</div>
        <Icon
          v-if="wide"
          class="icon"
          :size="24"
          :name="getIconByName(title)"
          :icon="icon ? icon : getIconByName(title)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getIconByName, formatNumber } from '@/util/helpers';

export default {
  name: 'StatCardBig',
  data() {
    return {
      getIconByName,
      formatNumber,
    };
  },
  props: {
    icon: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '25',
    },
    title: {
      type: String,
      default: 'text',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isTimeActive: {
      type: Boolean,
      default: false,
    },
    wide: {
      type: Boolean,
      default: false,
    },
    style: {
      type: Object,
      default: null,
    },
  },
};
</script>

<style scoped lang="scss">
.icons-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.main {
  width: 178px;
  height: 204px;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;

  &.wide {
    width: 180px;
    height: 120px;
    padding-top: 10px;
  }
  &.no {
    &.active {
      .value {
        color: $white;
      }
      .title {
        color: $white;
      }
      .icon {
        filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(320deg) brightness(101%)
          contrast(102%);
      }
    }
    .value {
      color: $colabs-bg;
    }
    .title {
      color: $colabs-bg;
    }
    .icon {
      filter: invert(73%) sepia(16%) saturate(458%) hue-rotate(205deg) brightness(92%) contrast(50%);
    }
  }
  &.activeTime {
    background-image: url('@/assets/images/active-card-big.svg') !important;
    .value,
    .title {
      color: $white;
    }

    * {
      color: $white;
    }
    .icon {
      filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(320deg) brightness(101%)
        contrast(102%);
    }
    &:hover {
      background-image: url('@/assets/images/active-card-big-hover.svg') !important;
    }
  }
  &.active {
    background-image: url('@/assets/images/active-card-big-no-clocks.svg') !important;
    .value,
    .title {
      color: $white;
    }

    * {
      color: $white;
    }
    .icon {
      filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(320deg) brightness(101%)
        contrast(102%);
    }
    &:hover {
      background-image: url('@/assets/images/active-card-big-no-clocks-hover.svg') !important;
    }
  }

  .value {
    color: $default;
    font-weight: 350;
    font-size: 56px;
    line-height: 72px;
    font-feature-settings: 'zero' on;
  }
  .title {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: $default;
    white-space: nowrap;
  }
  .info {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    margin-top: 56px;

    &.wide {
      margin-top: 0 !important;
    }

    &.mtop-title {
      margin-top: 30px;
    }
  }
  &:hover {
    background: $default-border;
  }
}
</style>
