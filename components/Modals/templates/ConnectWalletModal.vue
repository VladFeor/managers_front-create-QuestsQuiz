<template>
  <div class="connect-wallet-modal">
    <div class="connect-wallet-modal_title">Connect your wallet</div>
    <div class="connect-wallet-modal_subtitle">To continue, you need to connect your wallet</div>
    <div class="connect-wallet-modal_items">
      <div
        v-for="(connector, i) in connectors"
        :key="i"
        @click="handleWalletConnect(connector.type)"
        class="connect-wallet-modal_item"
      >
        <div class="connect-wallet-modal_item_wrapper">
          <Icon :icon="connector.icon" :size="24"></Icon>
          <p>{{ connector.title }}</p>
        </div>
        <Icon class="arrow-color" icon="Right-Arrow" :size="24"></Icon>
      </div>
    </div>
  </div>
  <BaseModal :width="480" @close="handleCloseLoading($event)" :visible="isLoadingModalOpen">
    <LoadingModal :type="activeType" />
  </BaseModal>
</template>

<script setup>
import { WalletFactory } from '~/wallets/wallet-factory';
import { ConnectionType } from '~/web3/connection';
import loadingIcon from '@/assets/icons/loading-ellipse.svg';

const isLoadingModalOpen = ref(false);
const activeType = ref(null);

const emit = defineEmits(['close']);

const connectors = [
  {
    type: ConnectionType.METAMASK,
    icon: 'MetaMask',
    title: 'Metamask',
  },
  {
    type: ConnectionType.WALLET_CONNECT,
    icon: 'WalletConnect',
    title: 'Walletconnect',
  },
  {
    type: ConnectionType.TRONLINK,
    icon: 'Tron-Default',
    title: 'TronLink',
  },
  {
    type: ConnectionType.COMPASS,
    icon: 'Compass-Circle',
    title: 'Compass',
  },
  {
    type: ConnectionType.APTOS_PETRA,
    icon: 'Aptos',
    title: 'Petra',
  },
];

const handleCloseLoading = (event) => {
  handleCloseLoading.value = event;
};

const handleWalletConnect = async (type) => {
  console.log('handleWalletConnect type', type);
  isLoadingModalOpen.value = true;
  activeType.value = type;
  const wallet = WalletFactory.getWallet(type);

  console.log('handleWalletConnect wallet', wallet);

  if (!wallet) return;

  try {
    await wallet.connect();

    isLoadingModalOpen.value = false;
    emit('close');
  } catch (error) {
    wallet.resetWallet();
    isLoadingModalOpen.value = false;
    emit('close');
  }
};
</script>

<style lang="scss" scoped>
.arrow-color {
  filter: invert(77%) sepia(28%) saturate(391%) hue-rotate(204deg) brightness(86%) contrast(83%);
}
.connect-wallet-modal {
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 24px;
  &_items {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  &_item {
    background-color: $white;
    border: 1px solid $default-border;
    border-radius: 8px;
    cursor: pointer;

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    gap: 10px;

    color: $default;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-family: Basis Grotesque Pro;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;

    &_wrapper {
      display: flex;
      justify-content: flex-start;
      width: 140px;
      gap: 20px;
    }

    p {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 24px;
      display: flex;
      align-items: center;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: $default;
    }
  }
  &_title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $default;
    text-align: center;
  }
  &_subtitle {
    color: $section-title;
    text-align: center;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-family: 'Basis Grotesque Pro';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
  }
}
// .connect-wallet-modal {
//   display: flex;
//   flex-direction: column;
//   padding: 32px;
//   gap: 24px;
//   &_items {
//     display: flex;
//     flex-direction: column;
//     gap: 10px;
//   }
//   &_item {
//     background-color: $white;
//     border: 1px solid $default-border;
//     border-radius: 8px;
//     cursor: pointer;

//     display: flex;
//     justify-content: center;
//     align-items: center;
//     padding: 5px 10px;
//     gap: 10px;

//     &_wrapper {
//       display: flex;
//       justify-content: flex-start;
//       width: 140px;
//       gap: 20px;
//     }

//     p {
//       font-family: 'Basis Grotesque Pro';
//       font-style: normal;
//       font-weight: 500;
//       font-size: 14px;
//       line-height: 24px;
//       display: flex;
//       align-items: center;
//       font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
//       color: $default;
//     }
//   }
//   &_title {
//     font-family: 'Basis Grotesque Pro';
//     font-style: normal;
//     font-weight: 500;
//     font-size: 16px;
//     line-height: 24px;
//     display: flex;
//     align-items: center;
//     font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
//     color: $default;
//   }
// }
</style>
