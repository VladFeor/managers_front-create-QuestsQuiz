<template>
  <div class="main">
    <span class="title">Password Reset</span>
    <div v-if="!sent">
      <div class="create-account-text">
        Remembered the password? <nuxt-link to="login" class="link">Sign in</nuxt-link>
      </div>
      <div class="form-block">
        <form @submit.prevent="reset()">
          <EmailInput
            class="mt-30"
            v-model="email"
            placeholder="Enter your email address"
            @error="error = $event"
            description="A password reset request link will be sent to an email."
          />
          <AuthButton
            class="mt-30"
            type="submit"
            text="Send a link to reset a password"
          ></AuthButton>
        </form>
      </div>
    </div>
    <div v-else class="success-dialog">
      Check your email <span>{{ email }}</span> for a link to reset your password. If it doesn’t
      appear within a few minutes, check your spam folder. Your account might also be associated
      with another email.
    </div>
  </div>
</template>
<script setup>
import { useAuthStore } from '~/store/auth';
import { useRouter } from 'vue-router';
const email = ref('');
const error = ref(true);
const sent = ref(false);
const authStore = useAuthStore();
const router = useRouter();
const nuxtApp = useNuxtApp();
definePageMeta({ layout: 'auth' });

async function reset() {
  if (error.value) {
    nuxtApp.$alert.show('Email is entered incorrectly.', {
      type: 'error',
      timeout: 5000,
    });
    return;
  }
  try {
    const data = {
      email: email.value,
    };
    await authStore.resetPassword(data);
    sent.value = true;
    setTimeout(() => {
      router.push({ path: '/login' });
    }, 5000);
  } catch (e) {
    const parseErrors = Object.values(e.errors);
    parseErrors.forEach((errorItem) => {
      nuxtApp.$alert.show(errorItem.join('\n'), {
        type: 'error',
        timeout: 5000,
      });
    });
  }
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
  .success-dialog {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 32px;
    margin-top: 40px;
    hanging-punctuation: first last;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on, 'ordn' on, 'ss04' on;
    color: $section-title;
    span {
      color: $orange;
      &:hover {
        color: $orange-active;
      }
    }
  }
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
    margin: 0 auto;
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
  }
}
</style>
