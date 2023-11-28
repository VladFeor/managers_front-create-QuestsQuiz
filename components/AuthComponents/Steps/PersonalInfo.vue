<template>
  <form @submit.prevent="nextPage" class="form">
    <Input
      name="Name"
      v-model="name"
      :rule="name.length >= 3 && !invalidName"
      placeholder="Enter your name"
      class="name"
    />
    <PasswordInput v-model="password" placeholder="Create a password"></PasswordInput>
    <PasswordValidation @validation="valid = $event" :password="password"></PasswordValidation>
    <PasswordInput
      :rule="confirmation !== password"
      v-model="confirmation"
      name=""
      error="Passwords don’t match. Try again"
      placeholder="Repeat a password"
    ></PasswordInput>

    <AuthButton text="Continue" class="mt-8" type="submit"></AuthButton>
  </form>
</template>

<script setup>
import { computed, ref } from 'vue';
import AxiosService from '@/service/axiosService';
const nuxtApp = useNuxtApp();

definePageMeta({ layout: 'auth' });

let password = ref(localStorage.password || '');
let confirmation = ref(localStorage.password_confirmation || '');
let name = ref(localStorage.name || '');
let valid = ref(localStorage.valid || false);
let submitted = ref(false);

const confirmed = computed(() => password.value === confirmation.value);
const emit = defineEmits(['next']);

function validateFields() {
  return valid.value && confirmed.value && name.value;
}

function showValidationError(msg) {
  nuxtApp.$alert.show(msg || 'Some fields are entered incorrectly.', {
    type: 'error',
    timeout: 5000,
  });
}
let invalidName = ref(false);
function nextPage() {
  invalidName.value = false;
  submitted.value = true;
  if (validateFields()) {
    AxiosService.post(useRuntimeConfig().public.apiBase + 'auth/validate-name', {
      name: name.value,
    })
      .then(() => {
        localStorage.name = name.value;
        localStorage.password = password.value;
        localStorage.password_confirmation = confirmation.value;
        localStorage.valid = true;
        emit('next', {
          name: name.value,
          password: password.value,
          password_confirmation: confirmation.value,
          nextPage: 'LanguagesAndCountry',
        });
        invalidName.value = false;
      })
      .catch((e) => {
        invalidName.value = true;
        const parseErrors = Object.values(e.response.data.errors);
        parseErrors.forEach((errorItem) => {
          nuxtApp.$alert.show(errorItem.join('\n'), {
            type: 'error',
            timeout: 5000,
          });
        });
      });
  } else {
    showValidationError();
  }
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  .name {
    margin-bottom: 20px;
  }
}
</style>
