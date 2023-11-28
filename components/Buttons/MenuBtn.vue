<template>
  <button class="hamburger" :class="{ active: menuOpen }" @click="toggleMenu">
    <span class="hamburger__line"></span>
    <span class="hamburger__line"></span>
    <span class="hamburger__line"></span>
  </button>
</template>

<script>
export default {
  name: 'MenuBtn',
  props: {
    open: { type: Function },
  },
  data() {
    return {
      menuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.open();
      this.menuOpen = !this.menuOpen;
    },
  },
};
</script>

<style scoped>
.hamburger {
  position: relative;
  width: 20px;
  height: 20px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  margin-right: 5px;
}

.hamburger.active .hamburger__line:nth-child(1) {
  transform: translate(0, 8px) rotate(45deg);
}

.hamburger.active .hamburger__line:nth-child(2) {
  opacity: 0;
}

.hamburger.active .hamburger__line:nth-child(3) {
  transform: translate(0, -10px) rotate(-45deg);
}

.hamburger__line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #000;
  transition: all 0.3s ease;
}

.hamburger__line:nth-child(1) {
  top: 0;
}

.hamburger__line:nth-child(2) {
  top: 50%;
  transform: translateY(-50%);
}

.hamburger__line:nth-child(3) {
  bottom: 0;
}
</style>
