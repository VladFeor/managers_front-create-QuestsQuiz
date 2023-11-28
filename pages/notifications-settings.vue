<template>
  <div class="w-auto">
    <section class="section title">
      <div class="main-title">Notification Settings</div>
    </section>
    <section class="section">
      <NotificationsSettingsSkeleton v-if="notificationsSettingsLoading" />
      <div v-else class="notifications-body">
        <div class="notifications-body_head">
          <span class="notifications-body_head-title long">Notification</span>
          <span class="notifications-body_head-title">Email</span>
          <span class="notifications-body_head-title">Push</span>
        </div>
        <div v-for="settingItem in settings" :key="settingItem.id" class="notifications-body_item">
          <div class="notifications-body_item-title">{{ settingItem.title }}</div>
          <CustomColoredCherckbox
            @checked="debouncedSetIsChecked($event, settingItem.id, 'email')"
            :checkedProp="!!settingItem.email"
            :isDisabled="loading"
          >
          </CustomColoredCherckbox>
          <CustomColoredCherckbox
            @checked="debouncedSetIsChecked($event, settingItem.id, 'push')"
            :checkedProp="!!settingItem.push"
            :isDisabled="loading"
          ></CustomColoredCherckbox>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useNotificationsStore } from '~/store';
import { useDebounce } from '@/hooks/useDebounce';

const notificationsStore = useNotificationsStore();

const settings = ref(null);
const loading = ref(false);
const lastData = ref({
  value: null,
  id: null,
  prop: null,
});

const nuxtApp = useNuxtApp();

onMounted(() => {
  notificationsStore.getNotificationsSettingsAction();
});

const notificationsSettings = computed(() => {
  const originalArray = notificationsStore.getNotificationsSettings;
  return originalArray.map((item) => ({
    title: item.title,
    id: item.id,
    email: item.user_notification_setting?.via_email ?? false,
    push: item.user_notification_setting?.via_push ?? true,
    // email:
    //   item.user_notification_setting && item.user_notification_setting.via_email
    //     ? item.user_notification_setting.via_email
    //     : false,
    // push:
    //   item.user_notification_setting && item.user_notification_setting.via_push
    //     ? item.user_notification_setting.via_push
    //     : false,
  }));
});

const notificationsSettingsLoading = computed(
  () => notificationsStore.getNotificationsSettingsLoading,
);

watch(
  notificationsSettings,
  (value) => {
    if (value) {
      settings.value = value;
    }
  },
  { deep: true, instant: true },
);

const setIsChecked = async (value, id, prop) => {
  if (lastData.value.id === id && lastData.value.value === value && lastData.value.prop === prop)
    return;
  lastData.value = {
    value,
    id,
    prop,
  };
  try {
    loading.value = true;
    settings.value.map((item) => {
      if (item.id === id && prop === 'email') {
        item.email = value;
      }
      if (item.id === id && prop === 'push') {
        item.push = value;
      }
      return item;
    });

    const currentNotification = settings.value.find((item) => item.id === id);
    const data = {
      id: currentNotification.id,
      user_notification_setting: {
        via_email: currentNotification.email,
        via_push: currentNotification.push,
      },
    };

    await notificationsStore.setNotificationsSettingsAction(data);
    nuxtApp.$alert.show('Notifications settings updated', {
      type: 'success',
      timeout: 5000,
    });
    loading.value = false;
  } catch (error) {
    console.log('setIsChecked error', error);
    loading.value = false;
    nuxtApp.$alert.show(error, {
      type: 'error',
      timeout: 5000,
    });
  }
};

const debouncedSetIsChecked = useDebounce(setIsChecked, 0);

const checkedProp = ref(false);
const isDisabled = ref(false);
</script>
<style scoped lang="scss">
.notifications-body {
  display: flex;
  width: 760px;
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;

  border-radius: 16px;
  border: 1px solid $default-border;
  background: $white;
  &_item {
    width: 100%;
    height: auto;

    display: flex;
    padding: 16px;
    align-items: center;
    gap: 50px;
    align-self: stretch;

    border-radius: 8px;
    background: transparent;
    border: 1px solid transparent;
    &:hover {
      border-radius: 8px;
      border: 1px solid $default-badge-border;
      background: $default-bg;
      cursor: pointer;
    }
    &-title {
      width: 496px;
      color: #1a1d29;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      font-family: Basis Grotesque Pro;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px; /* 150% */
    }
  }
  &_head {
    width: 100%;
    height: auto;

    display: flex;
    padding: 16px;
    align-items: center;
    gap: 48px;
    align-self: stretch;

    border-radius: 8px;
    background: #eaeafb;
    &-title {
      color: #1a1d29;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      font-family: Basis Grotesque Pro;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: 16px; /* 133.333% */
      letter-spacing: 0.168px;
      &.long {
        width: 496px;
      }
    }
  }
}
.main-title {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 300;
  font-size: 56px;
  line-height: 72px;
  color: $section-title;
  margin-bottom: 40px;
}
.section-inner {
  width: 100%;
  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.section {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1160px;
  margin: 0 auto;
  margin-bottom: 48px;
  &.title {
    margin-bottom: 8px;
  }
  &.gap {
    gap: 40px;
  }
  &.one {
    flex-direction: column;
  }
  &.non-active {
    display: none;
  }
  @media (max-width: '1300px') {
    flex-direction: column;
    gap: 30px;
  }
}
</style>
