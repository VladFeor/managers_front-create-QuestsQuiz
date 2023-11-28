<template>
  <div
    class="main"
    :class="[{ no: value == 0 }, { active: isActive }, { activeTime: isTimeActive }]"
  >
    <Icon class="icon" :icon="getIconByName(title)" size="21" />
    <div class="info" :class="{ 'mtop-title': title === 'deadlines in 3 days' }">
      <div class="value w-full">{{ value == 0 ? 'No' : formatNumber(value) }}</div>
      <div class="title">{{ title }}</div>
    </div>
  </div>
</template>

<script>
import { getIconByName, formatNumber } from '@/util/helpers';

export default {
  name: 'StatCard',
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
  },
  computed: {},
};
</script>

<style scoped lang="scss">
.main {
  width: 172px;
  height: 160px;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 16px;
  padding: 16px;
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
    background-image: url('@/assets/images/active-card.svg') !important;
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
    background-image: url('@/assets/images/active-card-no-clocks.svg') !important;
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
    margin-top: 8px;
    &.mtop-title {
      margin-top: 30px;
    }
  }
  &:hover {
    background: $default-border;
  }
}
</style>
