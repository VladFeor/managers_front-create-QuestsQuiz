<template>
  <span
    v-if="menuLink"
    class="sidebar-link"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <nuxt-link
      exact-active-class="active-link"
      class="link-item"
      :class="{ open: !isOpen }"
      :to="menuLink.to"
    >
      <Icon :name="menuLink.img" :size="24" class="sidebar-icon" />
      <span class="link-name">{{ menuLink.name }}</span>
    </nuxt-link>
    <div v-if="isHovered" :class="{ open: isOpen }" class="sidebar-link-tooltip">
      {{ menuLink.name }}
    </div>
  </span>
</template>

<script setup>
import MENU_LINKS from '@/constants/menuLinks';
import { ref } from 'vue';

const isHovered = ref(false);

const props = defineProps({
  sidebarMenuId: { type: String, default: '' },
  isOpen: { type: Boolean, default: false },
  menuLink: { type: Object, default: null },
});
</script>

<style lang="scss" scoped>
.sidebar-link {
  position: relative;
}
.sidebar-link-tooltip {
  position: absolute;
  top: 10px;
  left: 70px;
  background: rgba(56, 64, 91, 1);
  box-shadow: 0px 2px 8px rgba(26, 29, 41, 0.24);
  padding: 8px;
  border-radius: 8px;
  z-index: 999999999999;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $white;
  &::after {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    background: rgba(56, 64, 91, 1);
    transform: rotate(45deg) translateX(-50%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: -1;
    top: 13px;
    left: 3px;
    border-radius: 3px;
  }
  &.open {
    display: none;
    left: 200px;
  }
}
.active-link {
  color: $section-title;
  background: $default-border;
  border-radius: 8px 0px 0px 8px;
  .sidebar-icon {
    filter: none;
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
  &.open {
    .link-name {
      opacity: 0;
      width: 1px;
      cursor: none;
      pointer-events: none;
    }
  }
}
.link-name {
  transition: opacity 0.5s ease-in-out;
  opacity: 1;
  max-width: auto;
  width: 1px;
}
</style>
