<template>
  <button @click.stop="show = true">
    Security
    <Icon icon="Security" :size="24"></Icon>
  </button>
  <Modal v-if="show" @close="show = false">
    <span class="title">Security</span>
    <div class="tabs">
      <div
        class="tab"
        v-for="(tab, index) in tabs"
        :key="index"
        @click="activeTab = index"
        :class="{ active: activeTab === index }"
      >
        {{ tab.name }}
      </div>
    </div>
    <component :is="tabs[activeTab].component" @close="show = false"></component>
  </Modal>
</template>

<script>
import PasswordValidation from '../AuthComponents/PasswordValidation';
import ResetPassword from './ResetPassword';
import TwoStepAuth from './TwoStepAuth';
import { onMounted, onUnmounted, ref } from 'vue';
export default {
  name: 'SecurityButton',
  components: { PasswordValidation, ResetPassword, TwoStepAuth },
  setup() {
    const tabs = ref([
      { name: 'Password Change', component: ResetPassword },
      { name: '2-Step Authentication', component: TwoStepAuth },
    ]);
    const show = ref(false);
    const activeTab = ref(0);

    return {
      tabs,
      show,
      activeTab,
    };
  },
};
</script>

<style scoped lang="scss">
button {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $default;
  background: $default-border;
  border: 1px solid $default-border;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.tabs {
  display: flex;
  justify-content: space-around;
  width: 392px;
  height: 32px;
  padding: 2px;
  gap: 2px;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 8px;
}

.tab {
  cursor: pointer;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  font-feature-settings: 'zero' on;
  color: $default;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
}
.title {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 40px;
  color: $section-title;
  text-align: center;
}
.tab.active {
  background: $default;
  border-radius: 6px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  font-feature-settings: 'zero' on;
  color: $white;
  display: flex;
  align-items: center;
}
</style>
