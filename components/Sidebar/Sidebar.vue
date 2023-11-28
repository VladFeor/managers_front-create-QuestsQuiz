<template>
  <div class="sidebar" :class="{ open: isOpen, mobile: isMobile() }">
    <div :class="{ open: !isOpen, mobile: isMobile(), scrolled: isScrolled }" class="link-list">
      <SidebarLink
        v-for="menuLink in MENU_LINKS[sidebarMenuId]"
        :menuLink="menuLink"
        :key="menuLink.name"
        :sidebarMenuId="sidebarMenuId"
        :isOpen="isOpen"
      />
    </div>

    <div class="beta" :class="{ scrolledBeta: isScrolled }" v-if="isOpen">
      <span class="msg">
        Welcome to our platform! We are currently in the beta testing phase and would greatly
        appreciate it if you could report any issues were found
      </span>
      <div class="report" @click="goToReportForm()">Leave report</div>
    </div>
    <button v-if="!isMobile()" class="sidebar-btn" @click="open">
      <img :class="{ reverse: isOpen }" src="@/assets/icons/Left.svg" alt="" />
    </button>
  </div>
</template>

<script>
import MENU_LINKS from '@/constants/menuLinks';
import windowSizeMixin from '@/mixins/windowSizeMixin';
export default {
  name: 'Sidebar',
  mixins: [windowSizeMixin],
  props: {
    isOpen: { type: Boolean, default: false },
    open: { type: Function },
  },
  inject: ['roles'],
  data() {
    return {
      MENU_LINKS,
      sidebarMenuId: null,
      isClicked: false,
      isScrolled: false,
    };
  },
  mounted() {
    this.buildSidebar();
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 72) {
        this.isScrolled = true;
      } else {
        this.isScrolled = false;
      }
    },
    buildSidebar() {
      const roles = this.roles;
      this.sidebarMenuId = Object.keys(roles).filter((key) => roles[key].value === true);
      if (this.sidebarMenuId.find((i) => i === 'isCatapultManager')) {
        this.sidebarMenuId = 'isCatapultManager';
      } else {
        this.sidebarMenuId.toString();
      }
    },
    goToReportForm() {
      window.open('https://forms.gle/e43LEzLAooX4mwtc8', '_blank');
    },
  },
};
</script>

<style scoped lang="scss">
.sidebar-icon {
  width: 21px;
  height: 21px;
  filter: invert(44%) sepia(17%) saturate(642%) hue-rotate(197deg) brightness(95%) contrast(93%);
}
.active-link {
  color: $section-title;
  background: $default-border;
  border-radius: 8px 0px 0px 8px;
  .sidebar-icon {
    filter: none;
  }
}
.change-color {
  stroke: red;
}
.link-list {
  margin-left: 8px;
  display: flex;
  flex-direction: column;
  color: $secondary;
  // overflow: hidden;
  transition: transform 0.5s ease-in-out;
  &.scrolled {
    transform: translateY(-100px);
  }
  .link-name {
    transition: opacity 0.5s ease-in-out;
    opacity: 1;
    width: 1px;
  }
  &.open {
    .link-name {
      opacity: 0;
      width: 1px;
      cursor: none;
      pointer-events: none;
    }
  }
}
.link-item {
  padding: 12px 14px;
  display: flex;
  width: 100%;
  gap: 10px;
  &:hover:not(.active-link) {
    background-color: $default-badge-border;
    border-radius: 8px 0px 0px 8px;
  }
}

.sidebar {
  position: fixed;
  top: 0;
  padding: 150px 0 75px 0;
  // position: relative;
  width: 100%;
  max-width: 72px;
  background-color: $default-bg;
  height: 100%;
  z-index: 1000;
  transition: max-width 0.5s ease-in-out;
  will-change: max-width;
  border-right: 1px solid $default-border;
  color: black;
  // padding: 75px 0;
  &.mobile {
    position: absolute;
    top: 0;
    left: 0;
    max-width: 0px;
    opacity: 0;
  }
}

.sidebar.open {
  max-width: 200px;
  opacity: 1;
}

.sidebar-btn {
  position: absolute;
  // top: 410px;
  bottom: 100px;
  right: -15px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 32px;
  background-color: $default-bg;
  border: 1px solid $default-border;
  &:hover {
    background-color: #dad9f7;
  }
}
.reverse {
  transform: rotate(180deg);
}

.beta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  transform: translateY(50%);
  width: 200px;
  position: absolute;
  bottom: 10%;
  transition: transform 0.5s ease-in-out;
  .msg {
    color: $secondary;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-family: 'Basis Grotesque Pro';
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0.154px;
  }
  .report {
    width: 100%;
    border-radius: 6px;
    background: linear-gradient(45deg, $not-active-border 0%, rgba(137, 147, 181, 0) 100%),
      rgba(170, 167, 204, 0.45);
    color: $white;
    text-align: center;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-family: 'Basis Grotesque Pro';
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px; /* 145.455% */
    letter-spacing: 0.154px;
    cursor: pointer;
  }
}
.scrolledBeta {
  transform: translateY(0%);
  transition: transform 0.5s ease-in-out;
}
</style>
