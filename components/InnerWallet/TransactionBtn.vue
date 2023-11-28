<template>
  <div class="transaction-btn" @click="handleTooltip" :data-index="index">
    <Icon icon="More" :size="24" :data-index="index"></Icon>
  </div>
  <div v-if="isTooltipActive" id="tooltip-transaction-btn">
    <div class="tooltip-arrow"></div>
    <div class="menu">
      <div v-if="!address" class="link" @click="isConnectWalletModal = true">Connect Wallet</div>
      <div v-else-if="tokenAddress !== 'native' && !isAllowed" @click="handleApprove" class="link">
        Approve
      </div>
      <div v-else-if="tokenAddress !== 'native' && isAllowed" @click="handleSend" class="link">
        Send
      </div>
      <div v-else-if="address && tokenAddress === 'native'" @click="handleSend" class="link">
        Send
      </div>
      <div class="transaction-btn-line"></div>
      <div class="link red" @click="handleRemove">Disapprove</div>
    </div>
  </div>
  <BaseModal :width="480" @close="handleCloseLoading($event)" :visible="isLoading">
    <LoadingModal :type="activeType" title=" Transaction is Loading..." subtitle="Please wait" />
  </BaseModal>
  <BaseModal
    :width="480"
    @close="handleCloseConnectWalletModal($event)"
    :visible="isConnectWalletModal"
  >
    <ConnectWalletModal @close="isConnectWalletModal = false" />
  </BaseModal>
  <BaseModal :width="480" @close="handleSwitchWalletModal($event)" :visible="isSwitchWalletModal">
    <SwitchModal :action="customSwitchChain" @close="isSwitchWalletModal = false" />
  </BaseModal>
</template>

<script setup>
import { MULTI_SEND_ADDRESSES, TOKENS } from '~/web3/constants';
import { ethers } from 'ethers';
import ERC20_ABI from '@/web3/abi/ERC20.json';
import { useInnerWalletStore } from '~/store/innerWallet';
import { useRouter, useRoute } from 'vue-router';
import useWeb3 from '~/hooks/useWeb3';
import { TYPE_OF_CHAIN } from '~/web3/connection';
import * as sapphire from '@oasisprotocol/sapphire-paratime';
import { useWalletStore } from '~/store/wallet';
import { calculateCommissionFee, getHumanValue, getNonHumanValue } from '~/web3/web3';
import { getMetamaskProvider } from '~/util/web3';

const nuxtApp = useNuxtApp();
const route = useRoute();

const walletStore = useWalletStore();

const chainId = computed(() => walletStore.getWalletInfo.chainId);
const address = computed(() => walletStore.getWalletInfo.walletAddress);
// const provider = computed(() => walletStore.getWalletInfo.provider);

const { connector, walletType, getCurrentWallet, provider, wallet, typeOfChain } = useWeb3();
const innerWalletStore = useInnerWalletStore();

const props = defineProps({
  tokenAddress: { type: String, default: '' },
  amount: { type: String, default: '' },
  openModal: { type: Function, default: null },
  action: { type: Function, default: null },
  index: { type: Number, default: 0 },
  itemChainId: { type: Number, default: 0 },
  itemId: { type: Number, default: 0 },
  page: { type: Number, default: 0 },
});

const isTooltipActive = ref(false);
const isAllowed = ref(false);
const isLoading = ref(false);
const isConnectWalletModal = ref(false);
const isSwitchWalletModal = ref(false);
const tokenDecimals = ref('18');
const isApproveOnce = ref(false);

const handleSend = async () => {
  if (props.itemChainId !== String(chainId.value)) {
    // await getCurrentWallet().switchNetwork(props.itemChainId);
    isSwitchWalletModal.value = true;

    if (props.itemChainId !== String(chainId.value)) return;
  }
  props.action();
  props.openModal();
};

const handleCloseConnectWalletModal = (event) => {
  isConnectWalletModal.value = event;
};
const handleSwitchWalletModal = (event) => {
  isSwitchWalletModal.value = event;
};
const handleCloseLoading = (event) => {
  isLoading.value = event;
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
  if (typeOfChain === TYPE_OF_CHAIN.EVM) {
    const currentProvider = new ethers.providers.Web3Provider(getMetamaskProvider());
    const isExist = String(chainId.value) === props.itemChainId;
    if (!isExist) return;

    const erc20Contract = new ethers.Contract(tokenAddr.value, ERC20_ABI, currentProvider);
    let signer;
    if (chainId.value === 23294) {
      signer = sapphire.wrap(currentProvider.getSigner());
    } else {
      signer = currentProvider.getSigner();
    }
    const instanceERC20 = erc20Contract.connect(signer);
    const tokenBalance = (await instanceERC20.balanceOf(address.value)).toString();
    const decimals = (await instanceERC20.decimals()).toString();
    tokenDecimals.value = decimals;
    const tokenAllowance = (
      await instanceERC20.allowance(address.value, MULTI_SEND_ADDRESSES[props.itemChainId])
    ).toString();
    const currentTokenBalance = !isApproveOnce.value
      ? +getNonHumanValue(props.amount, tokenDecimals.value).toString()
      : +tokenBalance;
    if (+tokenAllowance > 0 && +tokenAllowance > currentTokenBalance) {
      isAllowed.value = true;
    } else {
      isAllowed.value = false;
    }
  } else if (typeOfChain === TYPE_OF_CHAIN.TRON) {
    const erc20Contract = await provider.Contract(ERC20_ABI, tokenAddr.value);

    const tokenBalance = (await erc20Contract.balanceOf(address.value)).toString();
    const tokenAllowance = (
      await erc20Contract.allowance(address.value, MULTI_SEND_ADDRESSES[props.itemChainId])
    ).toString();
    if (
      +tokenAllowance > 0 && +tokenAllowance > !isApproveOnce.value
        ? +getNonHumanValue(props.amount, tokenDecimals.value).toString()
        : +tokenBalance
    ) {
      isAllowed.value = true;
    } else {
      isAllowed.value = false;
    }
  } else if (typeOfChain === TYPE_OF_CHAIN.APTOS) {
    isAllowed.value = true;
  }
};

const customSwitchChain = async () => {
  await getCurrentWallet().switchNetwork(props.itemChainId);
  isSwitchWalletModal.value = false;
};

const handleApprove = async () => {
  try {
    console.log('handleApprove provider', provider);
    console.log('handleApprove chainId.value)', chainId.value);

    if (typeOfChain === TYPE_OF_CHAIN.EVM) {
      const currentProvider = new ethers.providers.Web3Provider(getMetamaskProvider());
      if (props.itemChainId !== String(chainId.value)) {
        // await getCurrentWallet().switchNetwork(props.itemChainId);
        isSwitchWalletModal.value = true;

        return;
      }
      isLoading.value = true;
      const erc20Contract = new ethers.Contract(props.tokenAddress, ERC20_ABI, currentProvider);
      let signer;
      if (chainId.value === 23294) {
        signer = sapphire.wrap(currentProvider.getSigner());
      } else {
        signer = currentProvider.getSigner();
      }
      const instanceERC20 = erc20Contract.connect(signer);

      const tx = await instanceERC20.approve(
        MULTI_SEND_ADDRESSES[chainId.value],
        isApproveOnce.value
          ? ethers.constants.MaxUint256
          : calculateCommissionFee(getNonHumanValue(props.amount, tokenDecimals.value)).toString(),
      );
      if (tx.wait) {
        await tx.wait();
      }
      await checkIsAllowed({ value: props.tokenAddress });
      isLoading.value = false;
    } else if (typeOfChain === TYPE_OF_CHAIN.TRON) {
      if (props.itemChainId !== String(chainId.value)) {
        // await getCurrentWallet().switchNetwork(props.itemChainId);
        isSwitchWalletModal.value = true;

        if (props.itemChainId !== String(chainId.value)) return;
      }
      isLoading.value = true;
      const erc20Contract = await provider.Contract(ERC20_ABI, props.tokenAddress);

      const tx = await erc20Contract.approve(
        MULTI_SEND_ADDRESSES[chainId.value],
        isApproveOnce.value
          ? ethers.constants.MaxUint256
          : calculateCommissionFee(getNonHumanValue(props.amount, tokenDecimals.value)).toString(),
      );
      if (tx.wait) {
        await tx.wait();
      }
      await checkIsAllowed({ value: props.tokenAddress });
      isLoading.value = false;
    }
  } catch (error) {
    console.log('approve error', error);
    isLoading.value = false;
  }
};

const tokenAddressPropRef = toRef(props, 'tokenAddress');

watch(
  [() => tokenAddressPropRef, () => chainId.value, () => address.value],
  async ([value, currentChainId, userAddress]) => {
    console.log('WATCH tokenAddressPropRef', tokenAddressPropRef);
    console.log('currentChainId', currentChainId);
    console.log('userAddress', userAddress);
    if (value && value !== 'native' && currentChainId && userAddress) {
      await checkIsAllowed(value);
    } else {
      isAllowed.value = true;
    }
  },
  { deep: true, instant: true },
);

// watch(
//   tokenAddressPropRef,
//   async (value) => {
//     if (value && value !== 'native' && address.value) {
//       await checkIsAllowed(value);
//     } else {
//       isAllowed.value = true;
//     }
//   },
//   { deep: true, instant: true },
// );

onMounted(() => {
  if (props.tokenAddress && props.tokenAddress !== 'native' && address.value) {
    checkIsAllowed({ value: props.tokenAddress });
  } else {
    isAllowed.value = true;
  }
  document.addEventListener('click', closeDropdown);
});

function closeDropdown(event) {
  if (+event.target.getAttribute('data-index') !== props.index) {
    isTooltipActive.value = false;
  }
}
</script>

<style lang="scss" scoped>
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
