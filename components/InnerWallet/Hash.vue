<template>
  <div v-if="props.hash" class="hash_wrapper" @click="toLink(chainId)">
    <span> {{ reduceStringLength(props.hash, 32) }} </span> <Icon name="Link" :size="20" />
  </div>
</template>

<script setup>
import { reduceStringLength } from '@/util/helpers';
// import { CHAIN_INFO } from '~/web3/constants';
import { getChainInfo } from '@/web3/constants';

const nuxtApp = useNuxtApp();

const props = defineProps({
  hash: { type: String, default: '' },
  chainId: { type: Number, default: 56 },
});

const toLink = (chainId) => {
  if (chainId === 'TRON_GRID_MAINNET') {
    window.open(`${getChainInfo(chainId).explorer}#/transaction/${props.hash}`, '_blank');
  } else if (chainId === 'SEI_MAINNET') {
    window.open(`${getChainInfo(chainId).explorer}txs/${props.hash}`, '_blank');
  } else if (chainId === 'APTOS_MAINNET') {
    window.open(`${getChainInfo(chainId).explorer}txn/${props.hash}?network=mainnet`, '_blank');
  } else {
    window.open(`${getChainInfo(chainId).explorer}tx/${props.hash}`, '_blank');
  }
};

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
.hash_wrapper {
  position: relative;
  z-index: 970;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding: 3px 8px;
  gap: 8px;

  width: 300px;
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
