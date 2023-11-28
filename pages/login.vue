<template>
  <div class="main">
    <span class="title">GM, Manager!</span>

    <div class="form-block">
      <form @submit.prevent="login">
        <EmailInput
          class="mt-30"
          v-model="email"
          placeholder="Enter your email address"
          @error="error = $event"
        />
        <PasswordInput
          class="mt-40"
          v-model="password"
          placeholder="Enter your password"
          name="Password"
          forgot
        />
        <AuthButton class="mt-30" text="Sign In" type="submit" />
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/store/auth';
import { useRouter } from 'vue-router';
const email = ref('');
const password = ref('');
const error = ref(true);
const authStore = useAuthStore();
const router = useRouter();
const nuxtApp = useNuxtApp();
definePageMeta({ layout: 'auth' });
localStorage.clear();

async function login() {
  if (!password.value || error.value) {
    nuxtApp.$alert.show('Some fields are entered incorrectly.', {
      type: 'error',
      timeout: 5000,
    });
    return;
  }
  try {
    const data = {
      email: email.value,
      password: password.value,
    };
    await authStore.login(data);
    await router.push({ path: '/' });
  } catch (e) {
    if (e.errors) {
      const parseErrors = Object.values(e.errors);
      parseErrors.forEach((errorItem) => {
        nuxtApp.$alert.show(errorItem.join('\n'), {
          type: 'error',
          timeout: 5000,
        });
      });
    } else {
      nuxtApp.$alert.show(e.error, {
        type: 'error',
        timeout: 5000,
      });
    }
  }
}
</script>

<style scoped lang="scss">
.mt-30 {
  margin-top: 30px;
}
.mt-40 {
  margin-top: 40px;
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
