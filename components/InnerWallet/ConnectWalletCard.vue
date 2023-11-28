<template>
  <div class="connect-wallet-card">
    <div v-if="address" class="connect-wallet-card_connected">
      <div class="connect-wallet-card_connected-connection">
        <Icon class="connect-wallet-card_icon" name="Wallet-Default" :size="24" /> Connected Wallet
      </div>
      <div class="connect-wallet-card_connected-wallet">
        <div @click="copy" class="connect-wallet-card_connected-wallet_address">
          <div class="wallet-img">
            <img :src="getCurrentWalletIcon(walletType)" alt="" />
          </div>
          {{ address ? makeShortenWalletAddress(address) : address }}
          <Icon class="connect-wallet-card_icon" name="Copy" :size="24" />
        </div>
        <div class="connect-wallet-card_connected-wallet_btn" @click="disconnectHandler">
          <span>Disconnect</span>
        </div>
      </div>
    </div>
    <div v-else class="connect-wallet-card_not-connected" @click="isShowConnectModal = true">
      <Icon class="connect-wallet-card_icon" name="Wallet-Default" :size="24" /> Connect Project
      Wallet
    </div>
    <div class="tooltip_wrapper">
      <TooltipIcon
        isWhite
        tooltipText="You can attach only one address. We do not store project addresses, when closing the page, the wallet will be disconnected"
      />
    </div>
  </div>
  <BaseModal :width="480" @close="handleCloseTransferModal($event)" :visible="isShowConnectModal">
    <ConnectWalletModal @close="isShowConnectModal = false" />
  </BaseModal>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { shortenAddress, makeShortenWalletAddress } from '@/util/web3';
import bgImage from '@/assets/images/connect-wallet-bg.svg';
import { useWalletStore } from '~/store/wallet';
import { WalletFactory } from '~/wallets/wallet-factory';
import useWeb3 from '~/hooks/useWeb3';
import { ConnectionType } from '~/web3/connection';
import { getCurrentWalletIcon } from '~/util/web3';

const walletStore = useWalletStore();

const nuxtApp = useNuxtApp();

const isConnected = ref(true);
const isShowConnectModal = ref(false);
const currentAccount = ref('');

const walletType = computed(() => walletStore.getWalletInfo.walletType);
const address = computed(() => walletStore.getWalletInfo.walletAddress);

const { connector, getCurrentWallet } = useWeb3();

const disconnectHandler = async () => {
  console.log('disconnectHandler connector', connector);

  getCurrentWallet().resetWallet();

  if (walletType === ConnectionType.WALLET_CONNECT) {
    connector.disconnect();
  }
  currentAccount.value = '';
};

watch(
  address,
  (value) => {
    console.log('WATCH address', value);
    currentAccount.value = value;
  },
  { deep: true, instant: true },
);

const handleCloseTransferModal = (event) => {
  isShowConnectModal.value = event;
};

const copy = async (link) => {
  if (window.isSecureContext && navigator.clipboard) {
    navigator.clipboard.writeText(address.value);
    nuxtApp.$alert.show('Address copied to clipboard', {
      type: 'success',
      timeout: 5000,
    });
  } else {
    unsecuredCopyToClipboard(address.value);
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
.wallet-img {
  width: 30px;
  height: 30px;
  background-color: $white;
  border-radius: 50%;
  padding: 3px;
  img {
    width: 100%;
    height: 100%;
  }
}
.connect-wallet-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-image: url('@/assets/images/wallet/wallet-bg.svg') !important;
  background-repeat: no-repeat;
  background-size: cover;
  width: 376px;
  height: 120px;
  border-radius: 8px;
  padding: 16px;
  position: relative;
  &_connected-connection {
    color: $white;
  }
  &_connected-wallet_address {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  &_icon {
    filter: invert(99%) sepia(4%) saturate(152%) hue-rotate(264deg) brightness(371%) contrast(100%);
    // filter: invert(99%) sepia(4%) saturate(152%) hue-rotate(264deg) brightness(121%) contrast(100%);
  }
  &_connected {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &-connection {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    &-wallet {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &_address {
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        text-align: right;
        font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
        color: $white;
        cursor: pointer;
      }
      &_btn {
        width: 89px;
        height: 32px;
        border: 1px solid $white;
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        font-feature-settings: 'zero' on;
        color: $white;
      }
    }
  }
  &_not-connected {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    position: relative;
    width: 100%;
    height: 100%;
    color: $white;
  }
}
.tooltip_wrapper {
  position: absolute;
  top: 14px;
  right: 14px;
}
</style>
