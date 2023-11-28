<template>
  <div class="form">
    <BaseSelect
      name="Country of Residence"
      @input="handleCountryInput"
      :options="countries"
      :rule="country && submitted"
      placeholder="Select your country"
      error-msg="Make sure to select your country"
      :initialSelected="country"
    />
    <MultiSelectWithTags
      class="mt-10"
      :options="languages"
      @selected-items="handleSelectedItems"
      placeholder="Select languages"
      name="Languages"
      error-msg="Specify the languages you speak"
      :limit="3"
      :rule="langs.length > 0"
      :initialSelectedItems="langs"
    />
    <div class="controller">
      <BackButton @click="back"></BackButton>
      <AuthButton text="Join Talentum" @click="nextPage"></AuthButton>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useAssetsStore } from '~/store/assets';

const nuxtApp = useNuxtApp();
const assetsStore = useAssetsStore();

definePageMeta({ layout: 'auth' });

const countries = computed(() => assetsStore.getCountries);
const languages = computed(() => assetsStore.getLanguages);

let langs = ref(localStorage.langs ? JSON.parse(localStorage.langs) : []);
let country = ref(localStorage.country ? JSON.parse(localStorage.country) : '');
let submitted = ref(false);

const emit = defineEmits(['next', 'back']);

function handleCountryInput(event) {
  country.value = event;
}

function handleSelectedItems(items) {
  langs.value = items;
}

function showValidationError() {
  nuxtApp.$alert.show('Some fields are entered incorrectly.', {
    type: 'error',
    timeout: 5000,
  });
}

function nextPage() {
  submitted.value = true;
  if (country.value && langs.value.length > 0) {
    localStorage.country = JSON.stringify(country.value);
    localStorage.langs = JSON.stringify(langs.value);
    emit('send', {
      languages: langs.value.map((lang) => lang.id),
      country_id: country.value.id,
    });
  } else {
    showValidationError();
  }
}

function back() {
  emit('back', 'PersonalInfo');
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
}
</style>
