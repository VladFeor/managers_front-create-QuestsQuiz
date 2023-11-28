<template>
  <div
    class="main cursor-pointer"
    :class="[{ no: value == 0 }, { active: isActive }, { activeTime: isTimeActive }]"
  >
    <div class="value w-full" :class="{ overdue: title === 'overdue tasks' }">
      {{ value == 0 ? 'No' : formatNumber(value) }}
      <OverdueWarning profile v-if="title === 'overdue tasks' && profile" />
      <OverdueWarning v-else-if="title === 'overdue tasks'" />
    </div>
    <div class="info">
      <div class="title">{{ title }}</div>
      <Icon
        :class="{ icon: title !== 'overdue tasks' }"
        :size="24"
        :icon="getIconByName(title) || icon"
        v-if="title !== 'pending directions'"
      />
    </div>
  </div>
</template>

<script>
import { getIconByName, formatNumber } from '@/util/helpers';
export default {
  name: 'StatCardSmall',
  props: {
    icon: {
      type: String,
      default: '',
    },
    value: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: 'text',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    profile: {
      type: Boolean,
      default: false,
    },
    isTimeActive: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      getIconByName,
      formatNumber,
    };
  },
};
</script>

<style scoped lang="scss">
.overdueIcon {
  filter: invert(30%) sepia(30%) saturate(5317%) hue-rotate(349deg) brightness(79%) contrast(103%);
}
.main {
  width: 178px;
  height: 120px;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 16px;
  padding: 16px;
  font-family: 'Basis Grotesque Pro';
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
    background-image: url('@/assets/images/active-card-small.svg') !important;
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
      background-image: url('@/assets/images/active-card-small-hover.svg') !important;
    }
  }
  &.active {
    background-image: url('@/assets/images/active-card-small-no-clocks.svg') !important;
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
      background-image: url('@/assets/images/active-card-small-no-clocks-hover.svg') !important;
    }
  }

  .value {
    color: $default;
    font-weight: 350;
    font-size: 56px;
    line-height: 56px;
    font-feature-settings: 'zero' on;
    &.overdue {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      max-width: 144px;
    }
  }
  .title {
    font-weight: 500;
    font-size: 16px;
    line-height: 16px;
    color: $default;
    white-space: nowrap;
  }
  .info {
    font-style: normal;
    margin-top: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 24px;
  }
  &:hover {
    background: $default-border;
  }
}
</style>
