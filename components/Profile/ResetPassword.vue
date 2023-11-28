<template>
  <PasswordInput
    v-model="oldPassword"
    :rule="error"
    placeholder="Enter your password"
    name="Current Password"
  ></PasswordInput>
  <div class="flex flex-col">
    <PasswordInput
      v-model="newPassword"
      placeholder="Create a new password"
      name="New Password"
      :rule="error"
    ></PasswordInput>
    <PasswordValidation @validation="valid = $event" :password="newPassword"></PasswordValidation>
  </div>
  <PasswordInput
    placeholder="Repeat a password"
    :rule="confirmation !== newPassword || error"
    name=""
    v-model="confirmation"
  ></PasswordInput>
  <div class="controllers">
    <div class="cancel" @click="$emit('close')">Cancel</div>
    <div class="confirm" @click="reset()">Confirm</div>
  </div>
</template>

<script setup>
import AxiosService from '~/service/axiosService';

const nuxtApp = useNuxtApp();
const emit = defineEmits(['close']);

const oldPassword = ref('');
const newPassword = ref('');
const confirmation = ref('');
const valid = ref(false);
const error = ref(false);
const reset = () => {
  const inputs = document.querySelectorAll('input');
  inputs.forEach((input, index) => {
    input.focus();
    input.blur();
  });
  if (
    !oldPassword.value ||
    !newPassword.value ||
    !confirmation.value ||
    !valid.value ||
    oldPassword.value === newPassword.value
  ) {
    error.value = true;
    return;
  }
  AxiosService.post(useRuntimeConfig().public.apiBaseV2 + `profile/change-password `, {
    current_password: oldPassword.value,
    password: newPassword.value,
    password_confirmation: confirmation.value,
  })
    .then(() => {
      nuxtApp.$alert.show('Success', {
        type: 'success',
        timeout: 5000,
      });
      emit('close');
    })
    .catch(() => {
      error.value = true;
    });
};
</script>

<style scoped lang="scss">
.controllers {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 24px;
  .cancel {
    width: 192px;
    height: 40px;
    padding: 8px 12px;
    background: $default-border;
    border-radius: 8px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $default;
    text-align: center;
    &:hover {
      cursor: pointer;
    }
  }
  .confirm {
    width: 192px;
    height: 40px;
    padding: 8px 12px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    background: $orange;
    text-align: center;
    color: $white;
    border-radius: 8px;
    &:hover {
      cursor: pointer;
      background: $orange-active;
    }
  }
}
</style>
