<template>
  <div class="tabs-container" :class="customClass" ref="tabContainer">
    <div class="tab-headers">
      <ul>
        <li
          v-for="(tab, index) in tabs"
          :key="index"
          :class="activeTabIndex == index ? 'active' : ''"
          @click="changeTab(index)"
          ref="tabHeaders"
        >
          <span>{{ tab.title }}</span>
        </li>
      </ul>
    </div>
    <div class="active-tab">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const props = defineProps(['customClass']);

const changeTab = (index) => {
  activeTabIndex = index;
  for (let x of [...tabs.value, ...tabHeaders.value]) {
    x.classList.remove('active');
  }
  tabs.value[activeTabIndex].classList.add('active');
  tabHeaders.value[activeTabIndex].classList.add('active');
};

let tabContainer = ref(null);
let tabHeaders = ref(null);
let tabs = ref(null);
let activeTabIndex = ref(0);

onMounted(() => {
  tabs.value = [...tabContainer.value.querySelectorAll('.tab')];
  tabs.value[0].classList.add('active');

  for (let x of tabs.value) {
    if (x.classList.contains('active')) {
      activeTabIndex = tabs.value.indexOf(x);
    }
  }
});
</script>

<style lang="scss">
.tabs-container {
  width: 100%;
  max-width: 360px;
  //   min-height: 400px;
  background-color: $white;
  border-radius: 16px;
  padding: 20px 10px 0 20px;
}
.tab-headers {
  ul {
    width: 100%;
    max-width: fit-content;
    height: 32px;
    display: flex;
    justify-content: space-between;
    background: transparent;
    border: 1px solid $default-badge-border;
    border-radius: 8px;
    padding: 2px;
    li {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      list-style: none;
      position: relative;
      cursor: pointer;
      color: $secondary;
      font-size: 12px;
      padding: 2px 10px;

      &.active {
        color: $section-title;
        background: $default-border;
        border-radius: 6px;
      }
    }
  }
}
</style>
