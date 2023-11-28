<template>
  <button
    v-if="social && !socialInput && connectable"
    class="w-fit mr-2 h-8 px-2 py-[4px] rounded-lg flex border border-violet-100 justify-start items-center gap-[4px] mb-2 connect"
    @click="connectSocial(social)"
  >
    <Icon v-if="social.name !== 'Website'" :name="`${social.name}-Default`" :size="24" />
    <Icon v-else name="Web" :size="24" />
    Connect {{ social.name }}
  </button>
  <div
    v-if="socialInput && !connectionNetworks.includes(social.name)"
    class="relative items-center flex h-8 mr-2"
  >
    <div class="absolute left-3">
      <Icon v-if="social.name !== 'Website'" :name="`${social.name}-Default`" :size="24" />
      <Icon v-else name="Web" :size="24" />
    </div>
    <input
      ref="socialInputRef"
      type="text"
      class="px-10 h-8 rounded-md py-[3px] ml-1 flex items-center border outline-none bg-white"
      placeholder="https://"
      v-model="updatedValue"
      @change="updateData"
      tabindex="0"
      @focusout="
        socialInput = false;
        updatedValue = null;
      "
    />

    <Icon v-if="!validateInput()" class="absolute right-3 cursor-pointer" name="Tik" size="15" />
    <Icon v-else class="absolute right-3 cursor-pointer" name="Tick" size="15" />
  </div>
</template>

<script setup>
import { nextTick } from 'vue';
import { isValidHttpUrl } from '~/util/helpers';
import Icon from '~/components/Icon.vue';

const props = defineProps(['social', 'project', 'isUrl', 'connectable', 'isPM']);
const emits = defineEmits(['update', 'connect']);
const connectionNetworks = [];
const socialInput = ref(false);
const socialInputRef = ref(null);
const updatedValue = ref(null);
const nuxtApp = useNuxtApp();
const updateData = () => {
  if (validateInput()) {
    socialInput.value = false;
    emits('update', updatedValue);
  }
};
const connectSocial = (social) => {
  if (!connectionNetworks.includes(social.name) && !props.isPM) {
    socialInput.value = true;
    nextTick(() => socialInputRef.value.focus());
  } else {
    emits('connect');
  }
};

const validateFocusout = () => {
  if (validateInput()) {
    socialInput.value = false;
  }
};

const validateInput = () => {
  if (!updatedValue.value || !updatedValue.value.trim()) return false;
  if (props.isUrl && !isValidHttpUrl(updatedValue.value)) return false;
  if (updatedValue.value.length >= 100) return false;
  if (props.social.name.toLowerCase() === 'linkedin') {
    const companyRegex = /\/company\/([^/]+)\//;
    const companyMatch = updatedValue.value.match(companyRegex);
    return !!companyMatch;
  } else if (props.social.name.toLowerCase() === 'reddit') {
    const subredditPattern = /\/r\/([A-Za-z0-9_]+)/;
    const matchResult = updatedValue.value.match(subredditPattern);
    return !!(matchResult && matchResult.length > 1);
  } else if (props.social.name.toLowerCase() === 'website') {
    return new URL(updatedValue.value);
  } else if (props.social.name.toLowerCase() === 'discord') {
    const defaultCodePattern =
      /(https?:\/\/)?(discord(?:(?:app)?\.com\/invite|\.gg)(?:\/invite)?)\/(?<code>[\w-]{2,255})/;
    const matchResult = updatedValue.value.match(defaultCodePattern);
    return !!(matchResult && matchResult.length > 1);
  } else if (props.social.name.toLowerCase() === 'telegram') {
    const telegramPattern = /(https?:\/\/)?(www[.])?(telegram|t)\.me\/([a-zA-Z0-9_+-]*)\/?$/;
    const matchResult = updatedValue.value.match(telegramPattern);
    return !!(matchResult && matchResult.length > 1);
  } else {
    return false;
  }
  return true;
};
</script>

<style scoped lang="scss">
.connect {
  display: flex;
  align-items: center;
  background: $default-bg;
  border: 1px solid $default-badge-border;
  border-radius: 8px;
  cursor: pointer;
  padding: 5px 8px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  font-feature-settings: 'zero' on;
  color: $default;
  width: max-content;
}
</style>
