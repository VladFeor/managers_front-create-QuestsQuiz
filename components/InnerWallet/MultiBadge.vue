<template>
  <div class="multi-badge_wrapper" v-if="rowType === 'activity' && badges && badges.length">
    <div
      @mouseover="isHovered = true"
      @mouseout="isHovered = false"
      v-for="badge in badges.slice(0, 2)"
      :key="badge.id"
      :class="[badge?.props?.type, { big: big, isHovered }]"
      class="badge_wrapper"
    >
      <img v-if="badge.props.type === 'image'" :src="badge.props.img || defaultBg" alt="" />
      <Icon v-if="badge.props.icon" :name="icon" :size="24" class="mr-2" />
      <img v-if="isStatusIcon" class="status-icon" :src="getStatusIcon(badge.props.text)" alt="" />
      <span class="text" :class="{ deadline: isDeadline }">{{ badge.props.text }}</span>
      <span v-if="badge.props.value" class="value">{{ badge.props.value }}</span>
      <BadgeTooltip
        :active="isHovered && badge.props.type === 'task'"
        :isManager="badge.props.text === 'm' ? true : false"
      />
    </div>
    <div v-if="badges && badges.length - 2 > 0" class="badges-count">
      <span>+{{ badges.length - 2 }}</span>
    </div>
  </div>
  <div class="multi-badge_wrapper" v-else>
    <div
      @mouseover="isHovered = true"
      @mouseout="isHovered = false"
      :class="[type, { big: big, isHovered }]"
      class="badge_wrapper"
      v-if="badges && badges.length"
    >
      <img v-if="badges[0].props.type === 'image'" :src="badges[0].props.img || defaultBg" alt="" />
      <Icon v-if="badges[0].props.icon" :name="icon" :size="24" class="mr-2" />
      <img
        v-if="isStatusIcon"
        class="status-icon"
        :src="getStatusIcon(badges[0].props.text)"
        alt=""
      />
      <span class="text" :class="{ deadline: isDeadline }">{{ badges[0].props.text }}</span>
      <span v-if="badges[0].props.value" class="value">{{ badges[0].props.value }}</span>
      <BadgeTooltip
        :active="isHovered && badges[0].props.type === 'task'"
        :isManager="badges[0].props.text === 'm' ? true : false"
      />
    </div>
    <div v-if="badges && badges.length - 1 > 0" class="badges-count">
      <span>+{{ badges.length - 1 }}</span>
    </div>
  </div>
</template>

<script>
import defaultBg from '@/assets/images/default-avatar.png';
import availableIcon from '@/assets/icons/tasks/available.svg';
import pendingIcon from '@/assets/icons/tasks/waiting_for_review.svg';
import doneIcon from '@/assets/icons/tasks/finished.svg';
import onRevisionIcon from '@/assets/icons/tasks/on_revision.svg';
import inProgressIcon from '@/assets/icons/tasks/in_progress.svg';
import overdueIcon from '@/assets/icons/tasks/overdue.svg';
import rejectedIcon from '@/assets/icons/tasks/rejected.svg';
import returnedIcon from '@/assets/icons/tasks/returned.svg';
import { isMoreThan3Days, isLessThan3DaysLeft, isLessThan3HoursLeft } from '@/util/helpers';

export default {
  name: 'Badge',
  data() {
    return {
      defaultBg,
      isMoreThan3Days,
      isLessThan3DaysLeft,
      isLessThan3HoursLeft,
      isHovered: false,
    };
  },
  props: {
    badges: { type: Array, default: null },
    text: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    rowType: {
      type: String,
      default: '',
    },
    big: {
      type: Boolean,
      default: false,
    },
    img: String,
    icon: String,
    pastDate: { type: String, default: '' },
    futureDate: { type: String, default: '' },
    futureHours: { type: String, default: '' },
    isStatusIcon: { type: Boolean, default: false },
  },
  computed: {
    isDeadline() {
      if (this.pastDate) {
        return this.isMoreThan3Days(this.pastDate);
      } else if (this.futureDate) {
        return this.isLessThan3DaysLeft(this.futureDate);
      } else if (this.futureHours) {
        return this.isLessThan3HoursLeft(this.futureHours);
      } else return false;
    },
  },
  methods: {
    getStatusIcon(status) {
      switch (status) {
        case 'Available':
          return availableIcon;
        case 'Upcoming':
          return availableIcon;
        case 'Overdue':
          return overdueIcon;
        case 'Done':
          return doneIcon;
        case 'Pending':
          return pendingIcon;
        case 'On Revision':
          return onRevisionIcon;

        default:
          return availableIcon;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.multi-badge_wrapper {
  display: flex;
  gap: 8px;
}
.badges-count {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 24px;
  background: $default-bg;
  border-radius: 6px;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $default;
}
.status-icon {
  width: 8px;
  height: 8px;
}
.badge_wrapper {
  background: $default-bg;
  padding: 4px 8px;
  border-radius: 6px;
  height: 24px;
  width: fit-content;
  display: flex;
  align-items: center;
  border: 1px solid $default-badge-border;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;

  img {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    margin-right: 4px;
  }

  .text {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;

    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    /* identical to box height, or 133% */

    text-align: center;
    letter-spacing: 0.014em;
    &.deadline {
      color: $red;
    }
  }
  .value {
    margin-left: 6px;
    font-size: 10px;
  }
}

.claim {
  border: 1px solid $default-badge-border;
  background: $transparent-active-bg;
  span {
    color: $default;
  }
}

.success {
  border: none;
  background: $success-bg;
  span {
    color: $success-text;
  }
}

.all {
  border: none;
  background: $default-bg;
  span {
    color: $default;
  }
}

.warning {
  border: none;
  background: $warning-bg;
  span {
    color: $warning-text;
  }
}

.danger {
  border: none;
  background: $danger-bg;
  span {
    color: $danger-text;
  }
}

.primary {
  border: none;
  background: $primary-bg;
  span {
    color: $primary-text;
  }
}

.info {
  border: none;
  background: $info-bg;
  span {
    color: $info-text;
  }
}

.mint {
  border: none;
  background: $mint-bg;
  span {
    color: $mint-text;
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

.transparent {
  border: 1px solid $default-border;
  background: transparent;
  span {
    color: $default;
  }
}
.task {
  position: relative;
  border: 1px solid $default-border;
  background: transparent;
  &:hover {
    background: $default-bg;
  }
  span {
    color: $default;
  }
}

.disabled {
  border: 1px solid $colabs-bg;
  background: $colabs-bg;
  span {
    color: $white;
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
  height: 32px;
  width: 100%;
  max-width: fit-content;
  display: flex;
  align-items: center;
  span {
    font-size: 14px;
    line-height: 20px;
  }
  .value {
    font-size: 12px;
  }
}
</style>
