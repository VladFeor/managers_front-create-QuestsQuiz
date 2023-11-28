<template>
  <div class="main-wrapper" v-if="!loading && isDesktop">
    <Header :open="toggleSidebar" />

    <div class="main-content" :class="{ open: sidebarOpen, mobile: isMobile() }">
      <Sidebar :open="toggleSidebar" :isOpen="sidebarOpen" />
      <div class="children-content" :class="{ open: sidebarOpen }">
        <slot />
      </div>
    </div>

    <div class="footer_wrapper">
      <Footer />
    </div>
  </div>
  <ScreenStub v-if="!loading && !isDesktop"></ScreenStub>
</template>

<script>
import windowSizeMixin from '@/mixins/windowSizeMixin';
import { useAuthStore, useUserStore, useNotificationsStore } from '~/store';
import { useTokenLifetime } from '~/hooks/token';
import { useDashboardStore } from '~/store/dashboard';

export default {
  mixins: [windowSizeMixin],
  data() {
    return {
      sidebarOpen: true,
      loading: true,
    };
  },
  head() {
    return {
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=2' }],
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
      useDashboardStore().setIsSidebarOpen(this.sidebarOpen);
    },
  },
  created() {
    useTokenLifetime();
    useUserStore()
      .userInfo(useAuthStore().token)
      .then(() => {
        useNotificationsStore().getNotificationsAction();
        this.loading = false;
      });
  },
};
</script>
<script setup>
import { useRoleGuard } from '~/hooks/roles';
import { provide, watch, onMounted } from 'vue';
import useRoles from '~/composables/useRoles';
import { useTokenLifetime } from '~/hooks/token';
import useWeb3EventsListener from '~/hooks/useWeb3EventsListener';
import { WalletFactory } from '~/wallets/wallet-factory';
import { useWalletStore } from '~/store/wallet';
import { getMetamaskProvider } from '@/util/web3';
import { ConnectionType } from '~/web3/connection';

document.title = 'Talentum Talents';
useTokenLifetime();
useRoleGuard();
const roles = useRoles();
provide('roles', roles);
const walletStore = useWalletStore();

useWeb3EventsListener();

const isDesktop = computed(
  () => window.innerWidth > 1330 || (localStorage.scale != 'false' && localStorage.scale),
);
useHead(() => ({
  meta: [
    {
      name: 'viewport',
      content:
        isDesktop.value && window.innerWidth > 1330
          ? 'initial-scale=1, maximum-scale=1'
          : `initial-scale=${localStorage.scale || 1}, initial-scale=1, maximum-scale=${
              localStorage.scale || 1
            }`,
    },
  ],
}));
</script>

<style scope lang="scss">
.footer_wrapper {
  margin-top: auto;
  position: relative;
  // z-index: 205;
}
.main-wrapper {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 30;
  // z-index: 300;
  height: 100%;
  background-color: $default-bg;
  min-height: 100vh;
  overflow: hidden;
}

.content-wrapper {
  display: flex;
}

.children-content {
  padding: 40px 40px 0px 120px;
  min-height: calc(100vh - 144px);
  transition: padding-left 0.5s ease-in-out;
  &.open {
    padding-left: 240px;
  }
}

.main-content {
  width: 100%;
  height: 100%;
  position: relative;
  // z-index: 1;
  transition: grid-template-columns 0.5s ease-in-out;
}

.main-content.open {
  grid-template-columns: 200px 1fr;
}

.main-content.mobile {
  grid-template-columns: 1fr;
}
</style>
