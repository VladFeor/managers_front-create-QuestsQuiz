<template>
  <div class="main">
    <span class="title">Welcome to Talentum!</span>
    <Stepper class="mt-30 pl-4 pr-4" :steps="steps" :current-step="currentStep.step"></Stepper>
    <component
      class="mt-30"
      :is="currentStep.component"
      @next="nextStep"
      @send="register"
      @back="previousStep"
    ></component>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '~/store/auth';
const nuxtApp = useNuxtApp();
definePageMeta({ layout: 'auth' });

import { useAssetsStore } from '~/store/assets';
import { useRouter } from 'vue-router';
import AxiosService from '~/service/axiosService';
const authStore = useAuthStore();
const assetsStore = useAssetsStore();
const email = localStorage.email;
const in_code = localStorage.in_code;
localStorage.clear();
localStorage.email = email;
localStorage.in_code = in_code;
onMounted(() => {
  assetsStore.getLanguagesAction();
  assetsStore.getCountriesAction();
});

const steps = ref([
  {
    title: 'Name & Email',
    component: 'PersonalInfo',
    step: 0,
  },
  {
    title: 'Country & Languages',
    component: 'LanguagesAndCountry',
    step: 1,
  },
]);

const currentStep = ref({
  step: 0,
  component: 'PersonalInfo',
});

const data = ref([]);
const router = useRouter();

function incrementStep() {
  currentStep.value.step += 1;
  currentStep.value.component = steps.value[currentStep.value.step].component;
}

function decrementStep() {
  currentStep.value.step -= 1;
  currentStep.value.component = steps.value[currentStep.value.step].component;
}

function nextStep(form) {
  data.value.push(form);
  incrementStep();
}

function previousStep() {
  data.value.pop();
  decrementStep();
}
async function register(form) {
  data.value.push(form);
  try {
    const finalData = await data.value.reduce((accumulator, current) => {
      return { ...accumulator, ...current };
    }, {});
    await authStore.register({ ...finalData, email: email });
    AxiosService.get(useRuntimeConfig().public.apiBase + `invitations/accept/${in_code}`).then(
      async () => {
        // await authStore.login({ email: email, password: finalData.password });
        await router.push({ path: '/login' });
      },
    );
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
}
</style>
