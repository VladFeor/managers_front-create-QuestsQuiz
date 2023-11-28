<template>
  <div v-if="!address" @click="isConnectWalletModal = true" class="pending-claim-btn">
    Connect Wallet
  </div>
  <div
    v-else-if="tokenAddress !== 'native' && !isAllowed"
    @click="handleApprove"
    class="pending-claim-btn"
  >
    Approve
  </div>
  <div
    v-else-if="tokenAddress !== 'native' && isAllowed"
    @click="handleSend"
    class="pending-claim-btn"
  >
    Send
  </div>
  <div
    v-else-if="address && tokenAddress === 'native'"
    @click="handleSend"
    class="pending-claim-btn"
  >
    Send
  </div>
  <Loader v-if="isLoading" />
  <BaseModal
    :width="480"
    @close="handleCloseConnectWalletModal($event)"
    :visible="isConnectWalletModal"
  >
    <ConnectWalletModal @close="isConnectWalletModal = false" />
  </BaseModal>
  <BaseModal :width="480" @close="handleCloseConfirm($event)" :visible="isConfirmModalOpen">
    <TransferConfirmationModal
      :wallets="walletData"
      @close="isConfirmModalOpen = false"
      :tokenAddress="tokenAddress"
      :chainId="+chainId"
      :cointype_id="defaultToken ? defaultToken.id : null"
      :blockchain_id="defaultBlockchain ? defaultBlockchain.id : null"
      :page="currentPage"
      isPending
    />
  </BaseModal>
</template>

<script setup>
import { switchNetwork } from '@/web3/web3.js';
import { MULTI_SEND_ADDRESSES, TOKENS } from '~/web3/constants';
import { ethers } from 'ethers';
import ERC20_ABI from '@/web3/abi/ERC20.json';
import { useInnerWalletStore } from '~/store/innerWallet';
import { useRouter, useRoute } from 'vue-router';
import useWeb3 from '~/hooks/useWeb3';
import { useWalletStore } from '~/store/wallet';
import { TYPE_OF_CHAIN } from '~/web3/connection';
import * as sapphire from '@oasisprotocol/sapphire-paratime';

const nuxtApp = useNuxtApp();
const route = useRoute();
const walletStore = useWalletStore();

const innerWalletStore = useInnerWalletStore();
const { account, connector, chainId, walletType, getCurrentWallet, provider, wallet, typeOfChain } =
  useWeb3();

const address = computed(() => walletStore.getAddress);

const props = defineProps({
  tokenAddress: { type: String, default: '' },
  index: { type: Number, default: 0 },
  itemChainId: { type: Number, default: 0 },
  itemId: { type: Number, default: 0 },
  page: { type: Number, default: 0 },
  walletData: { type: Array, default: [] },
});

const isTooltipActive = ref(false);
const isAllowed = ref(false);
const isLoading = ref(false);
const isConnectWalletModal = ref(false);
const isConfirmModalOpen = ref(false);

const handleCloseConfirm = (event) => {
  isConfirmModalOpen.value = event;
};

const handleSend = async () => {
  if (props.itemChainId !== +chainId.value) {
    await wallet.switchNetwork(props.itemChainId);
    if (props.itemChainId !== +chainId.value) return;
  }
  isConfirmModalOpen.value = true;
};

const handleCloseConnectWalletModal = (event) => {
  isConnectWalletModal.value = event;
};

const handleTooltip = () => {
  isTooltipActive.value = !isTooltipActive.value;
};

const handleRemove = async () => {
  try {
    const data = {
      withdrawal_ids: [props.itemId],
    };
    await innerWalletStore.deleteWithdrawRequestAction(route.params.id, data);
    await innerWalletStore.getInnerWalletWithdrawalRequestsAction({
      id: route.params.id,
      page: props.page,
    });
    nuxtApp.$alert.show('Request removed', {
      type: 'success',
      timeout: 5000,
    });
  } catch (error) {
    nuxtApp.$alert.show(error, {
      type: 'error',
      timeout: 5000,
    });
  }
};

const checkIsAllowed = async (tokenAddr) => {
  console.log('chainId.value', chainId.value);
  if (typeOfChain === TYPE_OF_CHAIN.EVM) {
    const erc20Contract = new ethers.Contract(tokenAddr, ERC20_ABI, provider);
    let signer;
    if (chainId.value === 23294) {
      signer = sapphire.wrap(provider.getSigner());
    } else {
      signer = provider.getSigner();
    }
    const instanceERC20 = erc20Contract.connect(signer);
    const tokenBalance = (await instanceERC20.balanceOf(address.value)).toString();
    const tokenAllowance = (
      await instanceERC20.allowance(address.value, MULTI_SEND_ADDRESSES[chainId.value])
    ).toString();
    if (+tokenAllowance > 0 && +tokenAllowance > +tokenBalance) {
      isAllowed.value = true;
    } else {
      isAllowed.value = false;
    }
  } else if (typeOfChain === TYPE_OF_CHAIN.TRON) {
    const erc20Contract = await provider.Contract(ERC20_ABI, tokenAddr);

    const tokenBalance = (await erc20Contract.balanceOf(address.value)).toString();
    const tokenAllowance = (
      await erc20Contract.allowance(address.value, MULTI_SEND_ADDRESSES[chainId.value])
    ).toString();
    if (+tokenAllowance > 0 && +tokenAllowance > +tokenBalance) {
      isAllowed.value = true;
    } else {
      isAllowed.value = false;
    }
  }
};

const handleApprove = async () => {
  try {
    if (typeOfChain === TYPE_OF_CHAIN.EVM) {
      if (props.itemChainId !== String(chainId.value)) {
        await getCurrentWallet().switchNetwork(props.itemChainId);
        if (props.itemChainId !== String(chainId.value)) return;
      }
      isLoading.value = true;
      const erc20Contract = new ethers.Contract(props.tokenAddress, ERC20_ABI, provider);
      let signer;
      if (chainId.value === 23294) {
        signer = sapphire.wrap(provider.getSigner());
      } else {
        signer = provider.getSigner();
      }
      const instanceERC20 = erc20Contract.connect(signer);
      await instanceERC20.approve(MULTI_SEND_ADDRESSES[chainId.value], ethers.constants.MaxUint256);
      await checkIsAllowed(props.tokenAddress);
      isLoading.value = false;
    } else if (typeOfChain === TYPE_OF_CHAIN.TRON) {
      if (props.itemChainId !== String(chainId.value)) {
        await getCurrentWallet().switchNetwork(props.itemChainId);
        if (props.itemChainId !== String(chainId.value)) return;
      }
      isLoading.value = true;
      const erc20Contract = await provider.Contract(ERC20_ABI, props.tokenAddress);

      await erc20Contract.approve(MULTI_SEND_ADDRESSES[chainId.value], ethers.constants.MaxUint256);
      await checkIsAllowed(props.tokenAddress);
      isLoading.value = false;
    }
  } catch (error) {
    console.log('approve', error);
    isLoading.value = false;
  }
};

const tokenAddressPropRef = toRef(props, 'tokenAddress');

watch(
  [() => tokenAddressPropRef.value, () => chainId.value, () => address.value],
  async ([value, chainId, address]) => {
    if (value && value !== 'native' && address && chainId) {
      await checkIsAllowed(value);
    } else {
      isAllowed.value = true;
    }
  },
  { deep: true, instant: true, dependsOn: [chainId, address, tokenAddressPropRef] },
);

onMounted(() => {
  if (props.tokenAddress && props.tokenAddress !== 'native' && address.value) {
    checkIsAllowed(props.tokenAddress);
  } else {
    isAllowed.value = true;
  }
  document.addEventListener('click', closeDropdown);
});

function closeDropdown(event) {
  if (+event.target.getAttribute('data-index') !== props.index) {
    //   if (!event.target.closest('.transaction-btn')||+event.target.getAttribute('data-index') !== props.index) {
    isTooltipActive.value = false;
  }
}
</script>

<style lang="scss" scoped>
.pending-claim-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  gap: 4px;
  width: fit-content;
  min-width: 80px;
  height: 32px;
  background: $default-border;
  border-radius: 8px;
  &.disabled {
    background-color: $secondary;
    cursor: inherit;
  }

  &:hover {
    cursor: pointer;
    background: $default;
    span {
      color: $white;
    }
  }

  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: $default;
  }
}
.transaction-btn-line {
  width: 100%;
  height: 1px;
  background: rgba(218, 217, 247, 1);
}
.transaction-btn {
  display: flex;
  width: 32px;
  height: 32px;
  padding: 4px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  background: #f5f5fd;
  &:hover {
    background: #eaeafb;
  }
}
#tooltip-transaction-btn {
  position: absolute;
  height: fit-content;
  margin-top: 6%;
  background: $white;
  top: 55px;
  margin-left: -77px;
  padding: 8px;
  box-shadow: 0px 4px 16px rgba(56, 64, 91, 0.24);
  border-radius: 8px;
  width: 120px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  z-index: 99;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  .tooltip-arrow {
    position: absolute;
    top: -6px;
    left: 80%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid $white;
  }
  .menu {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    gap: 8px;
    .red {
      color: $red !important;
    }
    .link {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      font-feature-settings: 'zero' on;
      color: $section-title;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 3px 8px;
      width: 100%;
      height: 24px;
      background: $white;
      border-radius: 6px;
      &:hover {
        background: $default-bg;
        cursor: pointer;
      }
    }
  }
}
</style>
