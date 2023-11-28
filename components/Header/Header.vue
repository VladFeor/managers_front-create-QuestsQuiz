<template>
  <header class="header">
    <div class="title">
      <MenuBtn v-if="isMobile()" :open="open" />
      <img src="@/assets/icons/logo.svg" @click="goHome" alt="" class="cursor-pointer" />
      <div class="beta">BETA</div>
    </div>
    <div class="info relative" ref="notificationContainer">
      <div class="notification" @click="toggleNotification">
        <div class="relative">
          <Icon name="Notification" class="icon" :size="24" color="#38405B" />
          <div class="dot" v-if="notifications.unread_count"></div>
        </div>
      </div>
      <Notifications
        v-if="showNotification"
        :data="notifications"
        @hide="showNotification = false"
      ></Notifications>
      <Wallet />
      <div class="avatar" @click="showTooltips = !showTooltips" ref="menu">
        <div
          :style="{ background: `url(${avatar})` }"
          style="background-size: cover; background-position: center"
          v-if="avatar"
          class="avatar-img"
        />
        <img v-else src="@/assets/images/default-avatar.png" alt="" class="cursor-pointer" />
        <div v-if="showTooltips" id="tooltip-confirmation">
          <div class="tooltip-arrow"></div>
          <div class="menu">
            <nuxt-link to="/profile" class="link">Profile</nuxt-link>
            <nuxt-link v-if="isProjectOwner" :to="`/inner-wallet/${userProjectId}`" class="link"
              >Inner Wallet</nuxt-link
            >
            <hr />
            <nuxt-link class="logout" @click="logout"
              >Logout <Icon icon="Kick-out" :size="24"></Icon
            ></nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import windowSizeMixin from '@/mixins/windowSizeMixin';
import defaultAvatar from '@/assets/images/User.png';
import { useUserStore } from '~/store/user';
import { useAuthStore } from '~/store/auth';
import { useNotificationsStore } from '~/store/notifications';
import { onMounted, ref, inject } from 'vue';
import defaultBg from '@/assets/images/talentumAvatar.svg';

export default {
  name: 'Header',
  data() {
    return {
      defaultAvatar,
      defaultBg,
    };
  },
  setup() {
    const roles = inject('roles');
    const notificationContainer = ref(null);

    const {
      isProjectOwner,
      isSuperAdmin,
      isProjectAdministrator,
      isAdminSupport,
      isProjectManager,
      isCatapultManager,
    } = roles;

    const notifications = computed(() => useNotificationsStore().getNotifications);

    const userStore = useUserStore();
    const authStore = useAuthStore();

    const avatar = computed(() => {
      if (userStore.getUser && userStore.getUser.avatar) {
        return userStore.getUser.avatar;
      }
    });
    const showTooltips = ref(false);

    const router = useRouter();

    const menu = ref(null);
    const goHome = () => {
      router.push('/');
    };

    const userProjectId = computed(() => userStore.getUserProjectId);

    const handleClickOutside = (event) => {
      if (menu.value && !menu.value.contains(event.target)) {
        showTooltips.value = false;
      }
    };
    const showNotification = ref(false);

    const toggleNotification = () => {
      showNotification.value = !showNotification.value;
    };
    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('click', handleClickOutsideNotification);
      requestPermission();
    });
    function requestPermission() {
      return new Promise(function (resolve, reject) {
        const permissionResult = Notification.requestPermission(function (result) {
          resolve(result);
        });

        if (permissionResult) {
          permissionResult.then(resolve, reject);
        }
      }).then(function (permissionResult) {
        if (permissionResult !== 'granted') {
          throw new Error('Permission not granted.');
        }
      });
    }
    function showPushNotification(notification) {
      const n = new Notification(notification.message.replace(/<b>|<\/b>/g, ''), {
        icon: defaultBg,
        body: 'Talentum',
      });
      setTimeout(n.close.bind(n), 4000);
    }
    const handleClickOutsideNotification = (event) => {
      if (notificationContainer.value && !notificationContainer.value.contains(event.target)) {
        showNotification.value = false;
      }
    };
    const logout = () => {
      authStore.logout();
    };

    const userToken = authStore.getToken();
    if (userToken) {
      Pusher.logToConsole = true;
      const echo = new Echo({
        broadcaster: 'pusher',
        key: useRuntimeConfig().public.pusherKey,
        auth: {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
        cluster: useRuntimeConfig().public.pusherCluster,
        forceTLS: false,
        encrypted: true,
        enableStats: false,
        authEndpoint: useRuntimeConfig().public.base + 'broadcasting/auth',
        withCredentials: true,
      });

      echo.private(`manager.${userStore.getUser.id}`).notification((notification) => {
        notifications.value.data = [
          {
            created_at: new Date().toISOString(),
            ...notification,
            data: notification,
            read: false,
            invitation_token: null,
          },
          ...notifications.value.data,
        ];
        console.log(1);
        showPushNotification(notification);
        notifications.value.unread_count += 1;
      });
    }

    return {
      avatar,
      menu,
      showTooltips,
      goHome,
      logout,
      notifications,
      isProjectOwner,
      toggleNotification,
      userProjectId,
      showNotification,
      notificationContainer,
    };
  },
  mixins: [windowSizeMixin],
  props: {
    open: { type: Function },
  },
};
</script>

<style scoped lang="scss">
.title {
  display: flex;
  align-items: center;
  gap: 8px;
}
.info {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 32px;
  img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }
}
.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  background: $default-bg;
  height: 72px;
  max-height: 72px;
  border-bottom: 1px solid $default-border;
  position: relative;
  z-index: 100003;
  padding: 0 32px 0 24px;
}

#tooltip-confirmation {
  position: absolute;
  z-index: 9999999;
  right: 0;
  width: 112px;
  height: fit-content;
  margin-top: 15px;
  background: $white;
  padding: 13px 16px;
  box-shadow: 0px 4px 16px rgba(56, 64, 91, 0.24);
  border-radius: 8px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  .tooltip-arrow {
    position: absolute;
    top: -6px;
    left: 78%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid $white;
  }
  .menu {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    gap: 8px;
    .link {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      font-feature-settings: 'zero' on;
      color: $default;
    }
    .logout {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      font-feature-settings: 'zero' on;
      color: $secondary;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    hr {
      color: $default-border;
    }
  }
}

.avatar {
  position: relative;
  .avatar-img {
    height: 48px;
    width: 48px;
    border-radius: 50px;
    cursor: pointer;
  }
}
.notification {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  &:hover {
    background: $transparent-active-text;
    .icon {
      filter: invert(100%) sepia(7%) saturate(2%) hue-rotate(111deg) brightness(115%) contrast(100%);
    }
  }
}

.dot {
  position: absolute;
  background: $orange;
  width: 8px;
  height: 8px;
  border-radius: 100px;
  left: 18px;
  bottom: 15px;
}

.beta {
  display: flex;
  padding: 4px 8px;
  align-items: center;
  gap: 8px;
  color: #fc660c;
  font-variant-numeric: lining-nums tabular-nums slashed-zero;
  font-family: 'Basis Grotesque Pro';
  font-size: 8px;
  font-style: normal;
  font-weight: 500;
  letter-spacing: 0.098px;
  border-radius: 6px;
  background: #ffe6d8;
  margin-top: 8px;
}
</style>
