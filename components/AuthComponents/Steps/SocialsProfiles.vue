<template>
  <form class="form" @submit.prevent="send">
    <InputWithIcon
      :icon="medias[0].icon"
      :placeholder="medias[0].placeHolder"
      :regex="medias[0].regex"
      class="field"
      v-model="medias[0].value"
      :error="medias[0].error"
      :required="medias[0].required"
    />
    <div class="or">
      <div />
      <span class="w-1/2">Optional fields below</span>
      <div />
    </div>
    <InputWithIcon
      v-for="input in medias.slice(1)"
      :key="input.id"
      :icon="input.icon"
      :placeholder="input.placeHolder"
      class="field"
      v-model="input.value"
      :regex="input.regex"
      :error="input.error"
    />
    <div class="controller">
      <BackButton @click="back"></BackButton>
      <AuthButton text="Join Talentum" type="submit"></AuthButton>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
const nuxtApp = useNuxtApp();
import {
  usernameTelegram,
  usernameTwitter,
  usernameDiscord,
  usernameLinkedIn,
} from '@/util/validations';
definePageMeta({ layout: 'auth' });
let medias = ref([
  {
    icon: 'Telegram-Default',
    id: 4,
    value: '',
    regex: usernameTelegram(),
    placeHolder: 'Enter your Telegram username',
    error: 'Need to specify your telegram account.',
    required: true,
  },
  {
    icon: 'Twitter-Default',
    id: 8,
    value: '',
    regex: usernameTwitter(),
    placeHolder: 'Enter your Twitter username',
    error: 'Need to specify your Twitter account.',
    required: false,
  },
  {
    icon: 'Discord-Default',
    id: 2,
    value: '',
    regex: usernameDiscord(),
    placeHolder: 'Enter your Discord username',
    error: 'Need to specify your Discord account.',
    required: false,
  },
  {
    icon: 'LinkedIn-Default',
    id: 6,
    value: '',
    regex: usernameLinkedIn(),
    placeHolder: 'Enter your LinkedIn link',
    error: 'Need to specify your LinkedIn link.',
    required: false,
  },
]);
const emit = defineEmits(['next', 'back']);
function showValidationError() {
  nuxtApp.$alert.show('Some fields are entered incorrectly.', {
    type: 'error',
    timeout: 5000,
  });
}

function send() {
  const isValid = medias.value.every((input) => (input.required ? input.value : true));
  if (isValid) {
    emit('send', {
      social_links: medias.value
        .map((item) => {
          return {
            id: item.id,
            content: item.value,
          };
        })
        .filter((item) => item.content),
    });
  } else {
    showValidationError();
  }
}

function back() {
  emit('back', 'LanguagesAndCountry');
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  .controller {
    margin-top: 100px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }
  .or {
    margin-top: 35px;
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    div {
      width: 50%;
      border: 0.5px solid $colabs-bg;
    }
    span {
      width: 100%;
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.014em;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: $secondary;
    }
  }
  .field {
    margin-top: 16px;
  }
}
</style>
