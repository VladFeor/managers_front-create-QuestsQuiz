<template>
  <div class="main">
    <span class="title">Reset Password!</span>
    <div class="form-block">
      <form @submit.prevent="updatePassword" class="h-full">
        <PasswordInput
          class="mt-30"
          v-model="password"
          placeholder="Enter your password"
          name="Password"
        />
        <PasswordValidation @validation="pswdValid = $event" :password="password" />
        <PasswordInput
          v-model="confirmation"
          name=""
          placeholder="Password Confirmation"
        ></PasswordInput>
        <AuthButton class="mt-30" text="Update Password" type="submit" />
      </form>
      <span class="create-account-text mt-30">
        By proceeding, you agree to
        <nuxt-link to="sign-up" class="link">Terms of Service</nuxt-link> &
        <nuxt-link to="sign-up" class="link">Privacy Policy</nuxt-link>.
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/store/auth';
import { useRouter } from 'vue-router';
import AxiosService from '@/service/axiosService';
const password = ref('');
const confirmation = ref('');
const pswdValid = ref(false);
const authStore = useAuthStore();
const router = useRouter();
const nuxtApp = useNuxtApp();
definePageMeta({ layout: 'auth' });
const route = useRoute();

async function updatePassword() {
  if (!pswdValid.value || confirmation.value !== password.value) {
    nuxtApp.$alert.show('Some fields are entered incorrectly.', {
      type: 'error',
      timeout: 5000,
    });
    return;
  }
  AxiosService.post(
    useRuntimeConfig().public.apiBase + `auth/reset-password/${route.query.token}`,
    {
      email: route.query.email,
      password: password.value,
      password_confirmation: confirmation.value,
    },
  )
    .then(() => {
      router.push({ path: '/login' });
    })
    .catch((e) => {
      const parseErrors = Object.values(e.response.data.errors);
      parseErrors.forEach((errorItem) => {
        nuxtApp.$alert.show(errorItem.join('\n'), {
          type: 'error',
          timeout: 5000,
        });
      });
    });
}
</script>

<style scoped lang="scss">
.mt-30 {
  margin-top: 30px;
}
.main {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 32px;
    line-height: 40px;
    text-align: center;
    font-feature-settings: 'zero' on;
    color: $section-title;
    margin-bottom: 8px;
  }
  .create-account-text {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $section-title;
    align-items: center;
    .link {
      color: $orange;
      &:hover {
        color: $orange-active;
      }
    }
  }
  .form-block {
    display: flex;
    flex-direction: column;
    .social {
      padding: 24px 0;
      display: flex;
      flex-direction: column;
      .or {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
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
      .socials-btn {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 18px;
      }
    }
  }
}
</style>
