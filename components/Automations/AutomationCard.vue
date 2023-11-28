<template>
  <div class="automation-card">
    <div class="automation-card_title">
      <Icon :name="`${type}-Circle`" :size="26" />
      <span
        >{{ type }}<span v-if="type === 'Discord' && discordName"> ({{ discordName }}) </span>
      </span>
    </div>
    <div
      v-if="(type === 'Telegram' && isConnected) || type === 'Discord'"
      class="automation-card_subtitle"
    >
      Put your project on autopilot with {{ type }} integration.
    </div>
    <div v-if="type === 'Telegram' && !isConnected" class="automation-card_subtitle">
      1. Add bot {{ useRuntimeConfig().public.telegramBot }} to the channel admins and give it the
      rights to manage posts.
    </div>
    <div v-if="type === 'Telegram' && !isConnected" class="automation-card_subtitle">
      2. Enter the short address or channel ID if the the channel is private in the field below.
    </div>
    <div class="w-full" v-if="type === 'Telegram' && !isConnected">
      <span v-if="isInputError" class="error-message">Can't Find Channel</span>
      <Input
        :name="''"
        placeholder="Username or Channel ID*"
        :key="1"
        class="field"
        v-model="chat_id"
      />
      <span class="telegram-example">Example: durov, https://t.me/durov or -10011426151</span>
    </div>
    <div
      v-if="(type === 'Telegram' && isConnected) || type === 'Discord'"
      class="automation-card_item first"
    >
      <div class="automation-card_item-switch">
        <span>Send a message when a new task created</span>
        <Switch
          @checked="setFirstCheckbox"
          :checkedProp="firstCheckbox"
          type="small"
          :isDisabled="!isConnected ? true : false"
        />
      </div>
      <div
        v-if="channels && channels.length && type === 'Discord' && firstCheckbox"
        class="automation-card_item-select"
      >
        <span>Target channel</span>
        <TasksSelect
          :options="channels"
          @input="setFirst($event)"
          :reduceLength="14"
          :default="firstDefalutValue"
          isShort
        />
      </div>
    </div>
    <div v-if="type === 'Discord'" class="automation-card_item second">
      <div class="automation-card_item-switch">
        <span>Send a message when user completes task</span>
        <Switch
          @checked="setSecondCheckbox"
          :checkedProp="secondCheckbox"
          type="small"
          :isDisabled="!isConnected ? true : false"
        />
      </div>
      <div
        v-if="channels && channels.length && type === 'Discord' && secondCheckbox"
        class="automation-card_item-select"
      >
        <span>Target channel</span>
        <TasksSelect
          :options="channels"
          @input="setSecond($event)"
          :reduceLength="14"
          :default="secondDefalutValue"
          isShort
        />
      </div>
    </div>
    <!-- <div
      v-if="(type === 'Telegram' && isConnected) || type === 'Discord'"
      class="automation-card_item"
    >
      <div class="automation-card_item-switch">
        <span>Send a message when a new project added</span>
        <Switch
          @checked="setThirdCheckbox"
          :checkedProp="thirdCheckbox"
          type="small"
          :isDisabled="!isConnected ? true : false"
        />
      </div>
      <div
        v-if="channels && channels.length && type === 'Discord' && thirdCheckbox"
        class="automation-card_item-select"
      >
        <span>Target channel</span>
        <TasksSelect
          :options="channels"
          @input="setThird($event)"
          :reduceLength="14"
          :default="thirdDefalutValue"
          isShort
        />
      </div>
    </div> -->

    <div v-if="isConnected" class="automation-card-btns">
      <div @click="disconnectSocial" class="automation-card-btn">
        <span>Disconnect</span>
      </div>
      <div
        @click="handleSave"
        class="automation-card-btn active"
        :class="{ disabled: isSaveButtonDisabled }"
      >
        <span>Save</span>
      </div>
    </div>
    <div v-else class="automation-card-connect-btn" @click="connectHandler">
      <Icon :name="`${type}-Default`" :size="20" /> <span>Connect {{ type }}</span>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import axiosService from '~/service/axiosService';
import { useUserStore } from '~/store';
import { parseChatId } from '~/util/validations';
import { useRouter, useRoute } from 'vue-router';

const nuxtApp = useNuxtApp();
const route = useRoute();
const router = useRouter();

const userStore = useUserStore();

const projectID = computed(() => userStore.getUserProjectId);

const props = defineProps({
  type: { type: String, default: '' },
});

const firstCheckbox = ref(false);
const secondCheckbox = ref(false);
// const thirdCheckbox = ref(false);
const defaultFirstCheckbox = ref(false);
const defaultSecondCheckbox = ref(false);
// const defaultThirdCheckbox = ref(false);
const isSaveButtonDisabled = ref(true);
const isConnected = ref(false);
const channels = ref(null);
const defaultDiscordValues = ref(null);
const discordValues = ref(null);
const telegramName = ref('');
const telegramProviderName = ref('');
const defaultTelegramValues = ref('');
const telegramValues = ref('');
const isAuth = ref(false);
const loading = ref(false);
const isInputError = ref(false);
const chat_id = ref('');
const firstValueId = ref(null);
const secondValueId = ref(null);
// const thirdValueId = ref(null);
const defaultFirstValueId = ref(null);
const defaultSecondValueId = ref(null);
// const defaultThirdValueId = ref(null);
const firstDefalutValue = ref(null);
const secondDefalutValue = ref(null);
// const thirdDefalutValue = ref(null);
const discordName = ref('');

watch(
  [
    () => firstCheckbox.value,
    () => secondCheckbox.value,
    // () => thirdCheckbox.value,
    () => defaultFirstCheckbox.value,
    () => defaultSecondCheckbox.value,
    // () => defaultThirdCheckbox.value,
    () => firstValueId.value,
    () => secondValueId.value,
    // () => thirdValueId.value,
    () => defaultFirstValueId.value,
    () => defaultSecondValueId.value,
    // () => defaultThirdValueId.value,
  ],
  ([
    firstCheckbox,
    secondCheckbox,
    // thirdCheckbox,
    defaultFirstCheckbox,
    defaultSecondCheckbox,
    // defaultThirdCheckbox,
    firstValueId,
    secondValueId,
    // thirdValueId,
    defaultFirstValueId,
    defaultSecondValueId,
    // defaultThirdValueId,
  ]) => {
    if (
      (firstCheckbox !== defaultFirstCheckbox && props.type === 'Telegram') ||
      (secondCheckbox !== defaultSecondCheckbox && props.type === 'Telegram')
      // (thirdCheckbox !== defaultThirdCheckbox && props.type === 'Telegram')
    ) {
      isSaveButtonDisabled.value = false;
    } else if (
      (firstCheckbox !== defaultFirstCheckbox && props.type === 'Discord') ||
      (secondCheckbox !== defaultSecondCheckbox && props.type === 'Discord') ||
      // (thirdCheckbox !== defaultThirdCheckbox && props.type === 'Discord') ||
      (firstValueId !== defaultFirstValueId && props.type === 'Discord') ||
      (secondValueId !== defaultSecondValueId && props.type === 'Discord')
      // (thirdValueId !== defaultThirdValueId && props.type === 'Discord')
    ) {
      isSaveButtonDisabled.value = false;
    } else {
      isSaveButtonDisabled.value = true;
    }
  },
  { deep: true, instant: true },
);

const setFirst = (event) => {
  firstValueId.value = event.id;
};
const setSecond = (event) => {
  secondValueId.value = event.id;
};
// const setThird = (event) => {
//   thirdValueId.value = event.id;
// };

const setFirstCheckbox = (value) => {
  firstCheckbox.value = value;
};
const setSecondCheckbox = (value) => {
  secondCheckbox.value = value;
};
// const setThirdCheckbox = (value) => {
//   thirdCheckbox.value = value;
// };

onMounted(async () => {
  await checkProvider();
  console.log('route.query', route.query);
  if (props.type === 'Discord' && !isConnected.value && route.query && route.query.code) {
    axiosService
      .get(
        useRuntimeConfig().public.apiBase + `projects/auth/discord_bot/callback/`,
        new URLSearchParams(route.query),
      )
      .then(() => {
        router.replace('/automations');
        checkProvider();
        getDiscordGuild();
        nuxtApp.$alert.show(`User authorized using ${props.type}`, {
          type: 'success',
          timeout: 5000,
        });
      })
      .catch((e) => {
        if (e.response.status == 400) {
          nuxtApp.$alert.show(`User already connected using this discord account`, {
            type: 'error',
            timeout: 5000,
          });
        }
        console.log(e);
      });
  }
  if (props.type === 'Discord') {
    getDiscordGuild();
  } else {
    getTelegramGuild();
  }
});

function getDiscordGuild(isSetDefault = true) {
  axiosService
    .get(useRuntimeConfig().public.apiBase + `projects/${projectID.value}/discord/guild`)
    .then((response) => {
      discordName.value = response.data.name;
      channels.value = response.data.channels;

      defaultFirstCheckbox.value = response.data.newTask ? response.data.newTask.active : false;
      firstCheckbox.value = response.data.newTask ? response.data.newTask.active : false;

      defaultSecondCheckbox.value = response.data.completedTask
        ? response.data.completedTask.active
        : false;
      secondCheckbox.value = response.data.completedTask
        ? response.data.completedTask.active
        : false;

      // defaultThirdCheckbox.value = response.data.newProject
      //   ? response.data.newProject.active
      //   : false;
      // thirdCheckbox.value = response.data.newProject ? response.data.newProject.active : false;

      firstValueId.value = response.data.newTask ? response.data.newTask.channelId : '';
      if (
        firstValueId.value &&
        channels.value &&
        channels.value.length &&
        isSetDefault &&
        response.data.newTask
      ) {
        firstDefalutValue.value = channels.value.find(
          (item) => item.id === response.data.newTask.channelId,
        );
      }
      secondValueId.value = response.data.completedTask
        ? response.data.completedTask.channelId
        : '';
      if (
        secondValueId.value &&
        channels.value &&
        channels.value.length &&
        isSetDefault &&
        response.data.completedTask
      ) {
        secondDefalutValue.value = channels.value.find(
          (item) => item.id === response.data.completedTask.channelId,
        );
      }
      // thirdValueId.value = response.data.newProject ? response.data.newProject.channelId : '';
      // if (
      //   thirdValueId.value &&
      //   channels.value &&
      //   channels.value.length &&
      //   isSetDefault &&
      //   response.data.newProject
      // ) {
      //   thirdDefalutValue.value = channels.value.find(
      //     (item) => item.id === response.data.newProject.channelId,
      //   );
      // }

      defaultFirstValueId.value = response.data.newTask ? response.data.newTask.channelId : '';
      defaultSecondValueId.value = response.data.completedTask
        ? response.data.completedTask.channelId
        : '';
      // defaultThirdValueId.value = response.data.newProject
      //   ? response.data.newProject.channelId
      //   : '';
    })
    .catch((e) => {
      console.log('GUILD ERROR', e);
    });
}

function getTelegramGuild() {
  axiosService
    .get(useRuntimeConfig().public.apiBase + `projects/${projectID.value}/telegram/group`)
    .then((response) => {
      // console.log('getTelegramGuild response', response.data);
      telegramName.value = response.data.title;
      telegramProviderName.value = response.data.username;

      defaultFirstCheckbox.value = response.data.newTask ? response.data.newTask.active : false;
      firstCheckbox.value = response.data.newTask ? response.data.newTask.active : false;

      // defaultThirdCheckbox.value = response.data.newProject
      //   ? response.data.newProject.active
      //   : false;
      // thirdCheckbox.value = response.data.newProject ? response.data.newProject.active : false;
    })
    .catch((e) => {
      console.log('GUILD TELEGRAM ERROR', e);
    });
}

async function checkProvider() {
  if (!projectID.value || !props.type) return;
  try {
    const { data } = await axiosService.get(
      useRuntimeConfig().public.apiBase + 'projects/' + projectID.value + '/social-providers',
    );
    const net = props.type.toLowerCase() + '_bot';
    if (net === 'telegram_bot') {
      isAuth.value = !!data.find((i) => i.provider_name === net);
      if (isAuth.value) {
        isConnected.value = true;
      }
      loading.value = false;
      return;
    }
    isConnected.value = !!data.find((i) => i.provider_name === net);
    loading.value = false;
  } catch (error) {
    loading.value = false;

    console.log(error);
  }
}

function connectDiscord() {
  const net = props.type !== 'discord' ? props.type : 'discord_bot';
  axiosService
    .get(
      useRuntimeConfig().public.apiBase +
        `projects/auth/${net.toLowerCase()}_bot/redirect?project_id=${
          projectID.value
        }&uri=/automations`,
    )
    .then((response) => {
      // localStorage.social = props.type;
      // localStorage.socialType = 'projects';
      window.location.href = response.data.redirect_url;
    })
    .catch((e) => {
      console.log(e);
    });
}

function connectHandler() {
  if (!isConnected.value) {
    if (props.type === 'Discord') {
      connectDiscord();
    } else {
      connectTelegram();
    }
  } else {
    disconnectSocial();
  }
}

function disconnectSocial() {
  const net = props.type.toLowerCase() + '_bot';

  axiosService
    .delete(
      useRuntimeConfig().public.apiBase + `projects/${projectID.value}/auth/${net.toLowerCase()}`,
    )
    .then(() => {
      checkProvider();
      isConnected.value = false;
      defaultFirstCheckbox.value = false;
      firstCheckbox.value = false;
      defaultSecondCheckbox.value = false;
      secondCheckbox.value = false;
      // defaultThirdCheckbox.value = false;
      // thirdCheckbox.value = false;
      firstValueId.value = null;
      firstDefalutValue.value = null;
      secondValueId.value = null;
      secondDefalutValue.value = null;
      // thirdValueId.value = null;
      // thirdDefalutValue.value = null;
      defaultFirstValueId.value = null;
      defaultSecondValueId.value = null;
      // defaultThirdValueId.value = null;
      nuxtApp.$alert.show(`User unauthorized from ${props.type}`, {
        type: 'success',
        timeout: 5000,
      });
    })
    .catch((e) => {
      console.log(e);
    });
}
function connectTelegram() {
  isInputError.value = false;

  const { chatId, isValid } = parseChatId(chat_id.value);
  if (!isValid) {
    isInputError.value = true;
    return;
  }

  console.log('projectID.value', projectID.value);

  axiosService
    .post(useRuntimeConfig().public.apiBase + 'automations/connect-telegram', {
      chat_id: chatId,
      project_id: projectID.value,
    })
    .then((response) => {
      checkProvider();
      getTelegramGuild();
    })
    .catch((e) => {
      console.log(e);
      if (e.response.data.errors) {
        const parseErrors = Object.values(e.response.data.errors);
        parseErrors.forEach((errorItem) => {
          nuxtApp.$alert.show(errorItem.join('\n'), {
            type: 'error',
            timeout: 5000,
          });
        });
      } else {
        nuxtApp.$alert.show(e.response.data.message, {
          type: 'error',
          timeout: 5000,
        });
      }
      isInputError.value = true;
    });
}

function updateTelegramGuild() {
  console.log('firstCheckbox.value', firstCheckbox.value);
  axiosService
    .put(useRuntimeConfig().public.apiBase + `projects/${projectID.value}/telegram/group`, {
      newTask: {
        active: firstCheckbox.value,
      },
      // newProject: {
      //   active: thirdCheckbox.value,
      // },
    })
    .then((response) => {
      getTelegramGuild();
      nuxtApp.$alert.show('Telegram data updated', {
        type: 'success',
        timeout: 5000,
      });
    })
    .catch((e) => {
      console.log('GUILD ERROR', e);
    });
}

function updateDiscordGuild() {
  axiosService
    .put(useRuntimeConfig().public.apiBase + `projects/${projectID.value}/discord/guild`, {
      newTask: {
        active: firstCheckbox.value,
        channelId: firstValueId.value ? firstValueId.value : '',
      },
      completedTask: {
        active: secondCheckbox.value,
        channelId: secondValueId.value ? secondValueId.value : '',
      },
      // newProject: {
      //   active: thirdCheckbox.value,
      //   channelId: thirdValueId.value ? thirdValueId.value : '',
      // },
    })
    .then((response) => {
      console.log('updateDiscordGuild response', response);
      getDiscordGuild(false);
      nuxtApp.$alert.show('Discord data updated', {
        type: 'success',
        timeout: 5000,
      });
    })
    .catch((e) => {
      console.log('GUILD ERROR', e);
    });
}

const handleSave = () => {
  if (props.type === 'Telegram') {
    updateTelegramGuild();
  } else {
    updateDiscordGuild();
  }
};
</script>

<style lang="scss" scoped>
.error-message {
  color: $error-text;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  margin-top: 8px;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
}
.telegram-example {
  color: $secondary;
  font-family: Basis Grotesque Pro;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
}
.automation-card {
  width: 560px;
  height: fit-content;
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  flex: 1 0 0;

  border-radius: 16px;
  border: 1px solid $default-border;
  background: $white;
  &-connect-btn {
    width: 161px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;

    border-radius: 8px;
    background: $default-border;

    color: $default;
    font-family: Basis Grotesque Pro;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    &:hover {
      cursor: pointer;
    }
  }
  &-btns {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &-btn {
    width: 112px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: 8px;
    background: $default-border;

    color: $default;
    font-family: Basis Grotesque Pro;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    &:hover {
      cursor: pointer;
    }
    &.active {
      background: #fc660c;
      color: $white;
    }
    &.disabled {
      background: #f5f5fd;
      color: #aaa7cc;
    }
  }
  &_item {
    width: 100%;
    // min-height: 64px;
    height: fit-content;

    border-radius: 8px;
    border: 1px solid $default-badge-border;
    background: $default-bg;
    padding: 16px;
    &.first {
      position: relative;
      z-index: 15;
    }
    &.second {
      position: relative;
      z-index: 14;
    }
    &-select {
      span {
        display: block;
        color: $secondary;
        font-family: Basis Grotesque Pro;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 20px;
        margin: 5px 0;
      }
    }
    &-switch {
      width: 100%;
      //   min-height: 64px;
      height: fit-content;
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        color: $section-title;
        /* Text | Link | Button */
        font-family: Basis Grotesque Pro;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px;
      }
    }
  }
  &_title {
    display: flex;
    align-items: center;
    gap: 10px;
    span {
      color: $default;
      font-family: Basis Grotesque Pro;
      font-size: 18px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px;
    }
  }
  &_subtitle {
    color: $section-title;
    font-family: Basis Grotesque Pro;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
  }
}
</style>
