<template>
  <div v-if="props.address" class="address_wrapper" @click="copy">
    <span> {{ makeShortenWalletAddress(props.address, 2) }} </span> <Icon name="Copy" :size="20" />
  </div>
</template>

<script setup>
import { shortenAddress, makeShortenWalletAddress } from '@/util/web3';

const nuxtApp = useNuxtApp();

const props = defineProps({
  address: { type: String, default: '' },
});

const copy = async (link) => {
  if (window.isSecureContext && navigator.clipboard) {
    navigator.clipboard.writeText(props.address);
    nuxtApp.$alert.show('Address copied to clipboard', {
      type: 'success',
      timeout: 5000,
    });
  } else {
    unsecuredCopyToClipboard(props.address);
  }
};

const unsecuredCopyToClipboard = (link) => {
  const textArea = document.createElement('textarea');
  textArea.value = link;
  document.body.appendChild(textArea);
  textArea.classList.add('copy-container');
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    nuxtApp.$alert.show('Address copied to clipboard', {
      type: 'success',
      timeout: 5000,
    });
  } catch (err) {
    console.error('Unable to copy to clipboard', err);
  }
  document.body.removeChild(textArea);
};
</script>

<style lang="scss" scoped>
.address_wrapper {
  position: relative;
  z-index: 500;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 3px 8px;
  gap: 8px;
  cursor: pointer;

  width: 117px;
  height: 24px;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 6px;

  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $default;
  }
}
</style>
