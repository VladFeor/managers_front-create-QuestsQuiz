<template>
  <div class="inner-wallet_wrapper">
    <BackBtn v-if="project" :text="project.name" :img="project.logo" to="/" />
    <div class="inner-wallet_name">Inner Wallet</div>
    <div class="inner-wallet_cards">
      <ConnectWalletCard />
      <WalletInfoCard
        v-if="currentBlockchainName && address"
        title="Blockchain"
        text="Change the blockchain in your wallet if necessary."
        :symbol="currentBlockchainName"
        :iconName="getBlockchainIcon(currentBlockchainName)"
      />
      <WalletInfoCard
        v-if="address"
        title="Balance"
        text="The amount of tokens in the network."
        :amount="currentBalance"
        :symbol="getChainName(chainId)"
        :iconName="getNativeCurrencyIcon(getChainName(chainId).toLowerCase())"
      />
      <WalletInfoCard
        title="Total Payout"
        text="The amount of money needed for all talent payments."
        :amount="
          innerWalletOverview.total_payout ? Number(innerWalletOverview.total_payout).toFixed(4) : 0
        "
        symbol="USDT"
        iconName="USDT-Circle"
      />
      <WalletInfoCard
        noTooltip
        title="Pending Withdrawals"
        :items="[
          {
            title: 'requests',
            amount: innerWalletOverview.requests ? innerWalletOverview.requests : 0,
          },
          {
            title: 'blockchains',
            amount: innerWalletOverview.blockchains ? innerWalletOverview.blockchains : 0,
          },
        ]"
      />
    </div>
    <div class="inner-wallet_table">
      <div class="filters">
        <FilterToggle
          :buttons="[
            {
              title: `Current Amount`,
              id: 0,
              name: `Current Amount`,
            },
            {
              title: `Withdrawal History`,
              id: 1,
              name: 'Withdrawal History',
            },
            {
              title: `Withdrawal Requests`,
              id: 2,
              name: 'Withdrawal Requests',
            },
          ]"
          :id="id"
          @select="setIsShowEvents($event)"
          review
        />
        <ExportSelect
          title="Export"
          :options="exportOptions"
          :handleOpenSubMenu="handleOpenSubMenu"
          :id="route.params.id"
          :exportFunction="exportWalletAction"
        />
      </div>
      <!-- <TableSkeleton v-if="reviewsLoading || !isReviewsLoaded" /> -->
      <CollapseTable
        v-if="id === 0"
        :columns="requestsColumns"
        :rows="requestsRows"
        pointer
        title="You have no wallet requests"
        icon="icons8-futurama-bender"
      />
      <CheckTable
        v-else-if="id === 2"
        :columns="requestsColumns"
        :rows="requestsRows"
        @checkActive="handleCheck($event)"
        pointer
        title="You have no wallet requests"
        icon="icons8-futurama-bender"
        :checkedRows="checkedRowsIds"
        :updateCheckedRows="updateCheckedRows"
      />
      <BaseTable
        v-else
        :columns="requestsColumns"
        :rows="requestsRows"
        pointer
        title="You have no wallet requests"
        icon="icons8-futurama-bender"
      />
      <Pagination
        v-if="totalPages && currentPage"
        @pageChanged="nextPage($event)"
        :currentPage="currentPage"
        :totalPages="totalPages"
      />
    </div>
    <div
      v-if="isTableCheckActive"
      class="requests_wrapper"
      :class="{ open: isSidebarOpen, isScrolled: isAtBottom }"
    >
      <div class="requests">
        <div class="requests_left">
          <div class="selects">
            <WalletCurrencySelect
              :options="blockChainOptions"
              class="filter-select"
              type="project"
              :reduceLength="14"
              :reduceLengthName="14"
              vertical
              :default="defaultBlockchain"
              @input="handleChangeNetwork"
              :isDisabled="address ? false : true"
              :chainId="chainId"
            />
            <WalletCurrencySelect
              :options="tokens"
              class="filter-select"
              type="project"
              :reduceLength="14"
              :reduceLengthName="10"
              vertical
              :default="defaultToken"
              @input="handleChangeToken"
              isToken
              :isDisabled="address ? false : true"
            />
          </div>
          <div v-if="wallets && wallets.length" class="font-normal">
            {{ wallets.length }} requests are selected
          </div>
          <div
            v-if="checkedRows.length !== requestsRows.length"
            class="font-highlighted btn"
            @click="selectAllRows"
          >
            Select All
          </div>
          <div v-if="checkedRowsIds.length" class="font-normal btn" @click="clearRows">Clear</div>
        </div>

        <div class="requests_right">
          <Amount
            v-if="wallets && wallets.length"
            :amount="totalAmount"
            :currency="wallets[0].currency"
          />
          <div class="requests_btns">
            <BaseButton
              type="secondary"
              text="Disapprove"
              v-if="address && wallets && wallets.length"
              @click="handleRemove"
            />
            <BaseButton
              v-if="address && tokenAddress !== 'native' && !isAllowed"
              type="normal"
              text="Approve"
              @click="handleApprove"
              :disabled="isRowsSelected"
            />
            <BaseButton
              v-else-if="address && tokenAddress !== 'native' && isAllowed"
              type="normal"
              text="Send"
              @click="handleOpenTransferModal"
              :disabled="isRowsSelected"
            />
            <BaseButton
              v-else-if="address && tokenAddress === 'native'"
              type="normal"
              text="Send"
              @click="handleOpenTransferModal"
              :disabled="isRowsSelected"
            />
            <BaseButton
              v-else
              type="normal"
              text="Connect Wallet"
              @click="isConnectWalletModal = true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <BaseModal :width="480" @close="handleCloseConfirm($event)" :visible="isConfirmModalOpen">
    <TransferConfirmationModal
      :wallets="wallets && wallets.length ? wallets : walletData"
      @close="isConfirmModalOpen = false"
      :tokenAddress="tokenAddress"
      :chainId="chainId"
      :cointype_id="defaultToken ? defaultToken.id : null"
      :blockchain_id="defaultBlockchain ? defaultBlockchain.id : null"
      :page="currentPage"
      :isFilter="isFilter"
    />
  </BaseModal>
  <BaseModal
    :width="480"
    @close="handleCloseConnectWalletModal($event)"
    :visible="isConnectWalletModal"
  >
    <ConnectWalletModal @close="isConnectWalletModal = false" />
  </BaseModal>
  <!-- <Loader v-if="isLoading" /> -->
  <BaseModal :width="480" @close="handleCloseLoading($event)" :visible="isLoading">
    <LoadingModal :type="activeType" title=" Transaction is Loading..." subtitle="Please wait" />
  </BaseModal>
</template>

<script setup>
import { nextTick, ref } from 'vue';
import defaultBg from '@/assets/images/default-avatar.png';
import downloadIcon from '@/assets/icons/Download.svg';
import Badge from '@/components/Badge.vue';
import Talent from '@/components/Talent.vue';
import Amount from '@/components/Amount.vue';
import Address from '@/components/InnerWallet/Address.vue';
import Hash from '@/components/InnerWallet/Hash.vue';
import MultiBadge from '@/components/InnerWallet/MultiBadge.vue';
import MultiAmount from '@/components/InnerWallet/MultiAmount.vue';
import TransactionBtn from '@/components/InnerWallet/TransactionBtn.vue';
import WalletStatus from '@/components/InnerWallet/WalletStatus.vue';
import {
  formatFutureDate,
  formatPastDate,
  formatDate,
  getBadgeTypeByName,
  formatNumber,
  formatNumberMore10K,
  formatNumberAddComma,
  getTaskStatus,
  getBlockchainIcon,
} from '@/util/helpers';
import { getChainName, getMetamaskProvider, getNativeCurrencyIcon } from '@/util/web3';
import { useCoinsStore } from '~/store/coins';
import { useInnerWalletStore } from '~/store/innerWallet';
import { useWeb3Store } from '~/store/web3store';
import { useBlockchainsStore } from '~/store/blockchains';
import { calculateCommissionFee, getNonHumanValue, switchNetwork } from '@/web3/web3.js';
import { MULTI_SEND_ADDRESSES, TOKENS } from '~/web3/constants';
import { getHumanValue } from '~/web3/web3';
import { ethers } from 'ethers';
import ERC20_ABI from '@/web3/abi/ERC20.json';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '~/store/user';
import { useProjectsStore } from '~/store/projects';
import { useDashboardStore } from '~/store/dashboard';
import useWeb3 from '~/hooks/useWeb3';
import { TYPE_OF_CHAIN } from '~/web3/connection';
import * as sapphire from '@oasisprotocol/sapphire-paratime';
import { useWalletStore } from '~/store/wallet';

const roles = inject('roles');

const {
  isProjectOwner,
  isSuperAdmin,
  isProjectAdministrator,
  isAdminSupport,
  isProjectManager,
  isCatapultManager,
} = roles;

const nuxtApp = useNuxtApp();
const route = useRoute();
const router = useRouter();

const projectsStore = useProjectsStore();
const userStore = useUserStore();
const web3Store = useWeb3Store();
const coinsStore = useCoinsStore();
const innerWalletStore = useInnerWalletStore();
const dashboardStore = useDashboardStore();
const walletStore = useWalletStore();

const chainId = computed(() => walletStore.getWalletInfo.chainId);

const isAtBottom = ref(false);

const handleScroll = () => {
  isAtBottom.value = isScrolledToBottom() ? true : false;
};

const isScrolledToBottom = () => {
  const threshold = 72;
  const windowHeight = window.innerHeight;
  const scrollY = window.scrollY;
  const documentHeight = document.documentElement.scrollHeight;
  return windowHeight + scrollY + threshold >= documentHeight;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

const {
  account: address,
  connector,
  walletType,
  getCurrentWallet,
  provider,
  wallet,
  balance,
  typeOfChain,
} = useWeb3();

const currentPage = ref(route.query ? route.query.page : 1);
const totalPages = ref(0);
const id = ref(0);
const isTableCheckActive = ref(false);
const rowsIds = ref([]);
const checkedRows = ref([]);
const isConfirmModalOpen = ref(false);
const isConnectWalletModal = ref(false);
const checkedRowsIds = ref([]);
const tokenAddress = ref('native');
const isAllowed = ref(false);
const isLoading = ref(false);
const isFilter = ref(false);
const walletData = ref([]);
const tokenDecimals = ref('18');
const isApproveOnce = ref(false);

const exportOptions = reactive([
  {
    name: 'Export as XLSX',
    list: [
      {
        title: 'Export All',
        table: '',
        type: 'csv',
        redirect_url: `profile`,
      },
      {
        title: 'Current Amount',
        table: 'current_amount',
        type: 'csv',
        redirect_url: `profile`,
      },
      {
        title: 'Withdrawal History',
        table: 'withdrawal_history',
        type: 'csv',
        redirect_url: `profile`,
      },
      {
        title: 'Withdrawal Requests',
        table: 'withdrawal_requests',
        type: 'csv',
        redirect_url: `profile`,
      },
    ],
    isSubMenuVisible: false,
  },
  {
    name: 'Export as PDF',
    list: [
      {
        title: 'Export All',
        table: '',
        type: 'pdf',
        redirect_url: `profile`,
      },
      {
        title: 'Current Amount',
        table: 'current_amount',
        type: 'pdf',
        redirect_url: `profile`,
      },
      {
        title: 'Withdrawal History',
        table: 'withdrawal_history',
        type: 'pdf',
        redirect_url: `profile`,
      },
      {
        title: 'Withdrawal Requests',
        table: 'withdrawal_requests',
        type: 'pdf',
        redirect_url: `profile`,
      },
    ],
    isSubMenuVisible: false,
  },
  {
    name: 'Export to Google Sheet',
    list: [
      {
        title: 'All',
        table: '',
        type: 'google_sheet',
        redirect_url: `profile`,
      },
      {
        title: 'Current Amount',
        table: 'current_amount',
        type: 'google_sheet',
        redirect_url: `profile`,
      },
      {
        title: 'Withdrawal History',
        table: 'withdrawal_history',
        type: 'google_sheet',
        redirect_url: `profile`,
      },
      {
        title: 'Withdrawal Requests',
        table: 'withdrawal_requests',
        type: 'google_sheet',
        redirect_url: `profile`,
      },
    ],
    isSubMenuVisible: false,
  },
]);

const exportWalletAction = async (id, type, table) => {
  if (type !== 'google_sheet') {
    return await innerWalletStore.getWalletExportDataAction(id, type, table);
  }

  await innerWalletStore.getWalletGoogleExportDataAction(id, table);
};

const handleOpenSubMenu = (option) => {
  exportOptions.map((item) => {
    if (item.name === option.name) {
      item.isSubMenuVisible = !item.isSubMenuVisible;
    } else {
      item.isSubMenuVisible = false;
    }
    return item;
  });
};

const currentBalance = computed(() => {
  let decimals = 18;
  if (typeOfChain === TYPE_OF_CHAIN.SEI || typeOfChain === TYPE_OF_CHAIN.TRON) {
    decimals = 6;
  } else if (typeOfChain === TYPE_OF_CHAIN.APTOS) {
    decimals = 8;
  }
  return getHumanValue(balance.value, decimals).toString().includes('.')
    ? getHumanValue(balance.value, decimals).toFixed(4)
    : getHumanValue(balance.value, decimals).toString();
});

const isSidebarOpen = computed(() => dashboardStore.getIsSidebarOpen);
const project = computed(() => projectsStore.getProject);
const userProjectId = computed(() => userStore.getUserProjectId);
const innerWalletOverview = computed(() => innerWalletStore.getInnerWalletOverview);
const innerWalletCurrentAmount = computed(() => innerWalletStore.getInnerWalletCurrentAmount);
const innerWalletWithdrawalHistory = computed(
  () => innerWalletStore.getInnerWalletWithdrawalHistory,
);
const innerWalletWithdrawalRequests = computed(
  () => innerWalletStore.getInnerWalletWithdrawalRequests,
);
const totalAmount = computed(() => {
  return wallets.value.reduce((acc, item) => {
    return (acc += +item.amount);
  }, 0);
});
const blockchainsStore = useBlockchainsStore();
const blockChainOptions = computed(() => [
  // { id: 0, name: 'All Blockchains' },
  ...blockchainsStore.getBlockchains,
]);

const currentBlockchainName = computed(
  () => {
    const currentBlockchain = blockChainOptions.value.find(
      (item) => item.chain_id === String(chainId.value),
    );
    if (currentBlockchain) {
      return currentBlockchain.name;
    } else return 'Unsupported';
  },
  { deep: true, instant: true, dependsOn: [chainId, blockChainOptions] },
);

watch(
  [() => id.value, () => innerWalletWithdrawalRequests.value],
  ([id, innerWalletWithdrawalRequests]) => {
    if (
      id === 0 &&
      innerWalletCurrentAmount.value.pagination &&
      innerWalletCurrentAmount.value.pagination.total_pages
    ) {
      currentPage.value = 1;
      totalPages.value = innerWalletCurrentAmount.value.pagination.total_pages;
    }
    if (
      id === 1 &&
      innerWalletWithdrawalHistory.value.pagination &&
      innerWalletWithdrawalHistory.value.pagination.total_pages
    ) {
      currentPage.value = 1;
      totalPages.value = innerWalletWithdrawalHistory.value.pagination.total_pages;
    }
    if (
      id === 2 &&
      innerWalletWithdrawalRequests.pagination &&
      innerWalletWithdrawalRequests.pagination.total_pages
    ) {
      // currentPage.value = 1;
      totalPages.value = innerWalletWithdrawalRequests.pagination.total_pages;
    }
  },
  { deep: true, instant: true },
);

// console.log('blockChainOptions', blockChainOptions);

onMounted(() => {
  if (
    innerWalletOverview.value &&
    innerWalletOverview.value.pagination &&
    innerWalletOverview.value.pagination.total_pages
  ) {
    totalPages.value = innerWalletOverview.value.pagination.total_pages;
  }
  if (isProjectOwner.value) {
    if (+userProjectId.value !== +route.params.id) {
      router.push('/');
    }
  }

  if (route.query && route.query.tab) {
    setIsShowEvents({ id: +route.query.tab });
  }
  if (route.query && route.query.page) {
    nextPage(+route.query.page);
  }
  blockchainsStore.getBlockchainsAction();
  if (route.params.id) {
    projectsStore.getProjectAction(route.params.id);
    innerWalletStore.getInnerWalletOverviewAction(route.params.id);
    innerWalletStore.getInnerWalletCurrentAmountAction({ id: route.params.id });
    innerWalletStore.getInnerWalletWithdrawalHistoryAction({ id: route.params.id });
    innerWalletStore.getInnerWalletWithdrawalRequestsAction({ id: route.params.id });
  }

  if (route.query && route.query.status) {
    id.value = Number(route.query.status);
  }
});

const currentTokens = computed(
  () => {
    if (chainId.value) {
      return TOKENS[chainId.value];
    } else {
      return TOKENS[1];
    }
  },
  { dependsOn: [chainId] },
);

const tokens = computed(() => coinsStore.getCoins);

const defaultToken = computed(
  () => {
    const currentToken = tokens.value.find((item) => item.address === tokenAddress.value);
    if (!currentToken) {
      return tokens.value[0];
    }
    return currentToken;
  },
  { deep: true, dependsOn: [tokenAddress, tokens, chainId], instant: true },
);

const defaultBlockchain = computed(
  () => {
    const currentBlockchain = blockchainsStore.getBlockchains.find(
      (item) => item.chain_id === String(chainId.value),
    );
    return currentBlockchain;
  },
  { deep: true, dependsOn: [chainId], instant: true },
);

const isRowsSelected = computed(
  () => {
    if (checkedRows.value.length && address.value) return false;
    else return true;
  },
  { dependsOn: [checkedRows, address] },
);

const coins = computed(() => {
  const originalArray = coinsStore.getCoins;
  if (originalArray && originalArray.length) {
    return originalArray.map((item) => ({
      name: item.name,
      id: item.id,
      symbol: item.code || item.symbol,
      amount: Math.floor(Math.random()),
    }));
  }
});

const wallets = computed(() => {
  if (checkedRows.value.length) {
    return checkedRows.value.map((item) => ({
      wallet: item.wallet.props.address,
      amount: item.singleAmount.props.amount,
      currency: item.singleAmount.props.currency,
      name: item.talent.props.text,
      img: item.talent.props.img,
      id: item.id,
    }));
  } else {
    return [];
  }
});

const handleCloseLoading = (event) => {
  isLoading.value = event;
};

const checkIsAllowed = async (tokenAddr) => {
  if (typeOfChain === TYPE_OF_CHAIN.EVM) {
    const currentProvider = new ethers.providers.Web3Provider(getMetamaskProvider());

    const erc20Contract = new ethers.Contract(tokenAddr, ERC20_ABI, currentProvider);
    let signer;
    if (chainId.value === 23294) {
      signer = sapphire.wrap(currentProvider.getSigner());
    } else {
      signer = currentProvider.getSigner();
    }
    // const signer = provider.getSigner();
    const instanceERC20 = erc20Contract.connect(signer);
    const tokenBalance = (await instanceERC20.balanceOf(address.value)).toString();
    const decimals = (await instanceERC20.decimals()).toString();
    tokenDecimals.value = decimals;
    const tokenAllowance = (
      await instanceERC20.allowance(address.value, MULTI_SEND_ADDRESSES[chainId.value])
    ).toString();
    const currentTokenBalance = !isApproveOnce.value
      ? +getNonHumanValue(totalAmount.value, tokenDecimals.value).toString()
      : +tokenBalance;
    if (+tokenAllowance > 0 && +tokenAllowance > currentTokenBalance) {
      isAllowed.value = true;
    } else {
      isAllowed.value = false;
    }
  } else if (typeOfChain === TYPE_OF_CHAIN.APTOS) {
    isAllowed.value = true;
  }
};

watch(
  [() => defaultToken.value, () => isTableCheckActive.value, () => address.value],
  ([defaultToken, isTableCheckActive, address]) => {
    if (defaultToken) {
      if (isTableCheckActive && address) {
        innerWalletStore.getInnerWalletWithdrawalRequestsAction({
          id: route.params.id,
          cointype_id: defaultToken.id,
          blockchain_id: defaultBlockchain.value.id,
          page: currentPage.value,
        });
        isFilter.value = true;
      } else {
        innerWalletStore.getInnerWalletWithdrawalRequestsAction({
          id: route.params.id,
          page: currentPage.value,
        });
        checkedRowsIds.value = [];
        isFilter.value = false;
      }
    }
  },
  { deep: true, instant: true },
);

watch(
  [() => chainId.value, () => blockChainOptions.value],
  ([chainIdItem, blockChainOptionsValue]) => {
    if (chainIdItem) {
      const currentBlockchain = blockChainOptionsValue.find(
        (item) => item.chain_id === String(chainIdItem),
      );
      if (currentBlockchain) {
        coinsStore.getCoinsAction(currentBlockchain.id);
      }
    }
  },
  { deep: true, instant: true },
);

watch(
  tokenAddress,
  async (value) => {
    if (value && value !== 'native' && address.value) {
      await checkIsAllowed(value);
    } else {
      isAllowed.value = true;
    }
  },
  { deep: true, instant: true },
);

watch(
  () => address.value,
  async (value) => {
    if (value && tokenAddress.value) {
      await checkIsAllowed(tokenAddress.value);
    }
  },
  { deep: true, instant: true },
);

watch(
  checkedRowsIds,
  (value) => {
    if (value && value.length) {
      checkedRows.value = requestsRows.value.filter((item) =>
        checkedRowsIds.value.some((rowId) => rowId === item.itemId),
      );
    } else {
      checkedRows.value = [];
    }
  },
  { deep: true, immediate: true },
);

const handleApprove = async () => {
  if (isRowsSelected.value) return;
  try {
    const currentProvider = new ethers.providers.Web3Provider(getMetamaskProvider());
    isLoading.value = true;
    const erc20Contract = new ethers.Contract(tokenAddress.value, ERC20_ABI, currentProvider);
    let signer;
    if (chainId.value === 23294) {
      signer = sapphire.wrap(currentProvider.getSigner());
    } else {
      signer = currentProvider.getSigner();
    }
    // const signer = provider.getSigner();
    const instanceERC20 = erc20Contract.connect(signer);
    const tx = await instanceERC20.approve(
      MULTI_SEND_ADDRESSES[chainId.value],
      isApproveOnce.value
        ? ethers.constants.MaxUint256
        : calculateCommissionFee(
            getNonHumanValue(totalAmount.value, tokenDecimals.value),
          ).toString(),
    );
    if (tx.wait) {
      await tx.wait();
    }
    await checkIsAllowed(tokenAddress.value);
    isLoading.value = false;
  } catch (error) {
    console.log('approve', error);
    isLoading.value = false;
  }
};

const handleRemove = async () => {
  try {
    const data = {
      withdrawal_ids: wallets.value.map((item) => item.id),
    };
    await innerWalletStore.deleteWithdrawRequestAction(route.params.id, data);
    await innerWalletStore.getInnerWalletWithdrawalRequestsAction({
      id: route.params.id,
      cointype_id: defaultToken.value.id,
      blockchain_id: defaultBlockchain.value.id,
      page: currentPage.value,
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

const handleChangeNetwork = async (blockchain) => {
  await getCurrentWallet().switchNetwork(blockchain.chain_id);
  // await wallet.switchNetwork(blockchain.chain_id);
  updateCheckedRows([]);
  // chainId.value = blockchain.chain_id;
};

const handleChangeToken = (blockchain) => {
  tokenAddress.value = blockchain.address;
  updateCheckedRows([]);
};

const selectAllRows = () => {
  if (!address.value) return;
  const allRowsIds = requestsRows.value.map((item) => item.itemId);
  allRowsIds.push(0);
  checkedRowsIds.value = allRowsIds;
};

const clearRows = () => {
  checkedRowsIds.value = [];
};

const updateCheckedRows = (updatedRows) => {
  checkedRowsIds.value = updatedRows;
};

const handleCloseConnectWalletModal = (event) => {
  isConnectWalletModal.value = event;
};

const handleOpenTransferModal = () => {
  if (isRowsSelected.value) return;
  isConfirmModalOpen.value = true;
};

const handleCheck = (event) => {
  isTableCheckActive.value = event;
};

const handleCloseConfirm = (event) => {
  isConfirmModalOpen.value = event;
};

async function setIsShowEvents(event) {
  id.value = +event.id;
  currentPage.value = 1;
  if (event.id !== 2) {
    isTableCheckActive.value = false;
  }
  await nextTick();
  await router.push({ query: Object.assign({}, route.query, { tab: id.value }) });
}

function nextPage(page) {
  currentPage.value = page;
  if (id.value === 0) {
    innerWalletStore.getInnerWalletCurrentAmountAction({ id: route.params.id, page });
  }
  if (id.value === 1) {
    innerWalletStore.getInnerWalletWithdrawalHistoryAction({ id: route.params.id, page });
  }
  if (id.value === 2) {
    if (isTableCheckActive.value) {
      innerWalletStore.getInnerWalletWithdrawalRequestsAction({
        id: route.params.id,
        cointype_id: defaultToken.value?.id,
        blockchain_id: defaultBlockchain.value?.id,
        page,
      });
    } else {
      innerWalletStore.getInnerWalletWithdrawalRequestsAction({
        id: route.params.id,
        page,
      });
    }
  }
}

const blockchainsArray = [
  {
    component: Badge,
    props: {
      text: 'Binance',
      value: '',
      type: 'claim',
      big: false,
    },
    id: 1,
  },
  {
    component: Badge,
    props: {
      text: 'Binance',
      value: '',
      type: 'claim',
      big: false,
    },
    id: 2,
  },
  {
    component: Badge,
    props: {
      text: 'Binance',
      value: '',
      type: 'claim',
      big: false,
    },
    id: 3,
  },
  {
    component: Badge,
    props: {
      text: 'Binance',
      value: '',
      type: 'claim',
      big: false,
    },
    id: 4,
  },
  {
    component: Badge,
    props: {
      text: 'Binance',
      value: '',
      type: 'claim',
      big: false,
    },
    id: 5,
  },
];

const allAmounts = [
  {
    component: Amount,
    props: {
      amount: 0.00001,
      currency: 'bnb',
    },
    id: 1,
  },
  {
    component: Amount,
    props: {
      amount: 0.00001,
      currency: 'bnb',
    },
    id: 2,
  },
  {
    component: Amount,
    props: {
      amount: 0.00001,
      currency: 'bnb',
    },
    id: 3,
  },
  {
    component: Amount,
    props: {
      amount: 0.00001,
      currency: 'bnb',
    },
    id: 4,
  },
  {
    component: Amount,
    props: {
      amount: 0.00001,
      currency: 'bnb',
    },
    id: 5,
  },
];

const requestsColumns = computed(() => {
  const currentId = id.value;

  if (currentId === 0) {
    return [
      { prop: 'talent', label: 'Talent', width: '100%' },
      { prop: 'wallet', label: 'Wallet', width: '100%' },
      { prop: 'blockchain', label: 'Blockchain', width: '80%' },
      {
        prop: 'amount',
        label: 'Amount',
        width: '100%',
      },
      { prop: 'value', label: 'Value, USDT', width: '100%' },
    ];
  } else if (currentId === 1) {
    return [
      { prop: 'date', label: 'Date', width: '50%' },
      { prop: 'talent', label: 'Talent', width: '100%' },
      { prop: 'txhash', label: 'Txhash', width: '150%' },
      {
        prop: 'singleBlockchain',
        label: 'Blockchain',
        width: '70%',
      },
      { prop: 'singleAmount', label: 'Amount', width: '100%' },
      { prop: 'status', label: 'Status', width: '50%' },
    ];
  } else if (currentId === 2) {
    return [
      { prop: 'talent', label: 'Talent', width: '150%' },
      { prop: 'date', label: 'Date', width: '100%' },
      { prop: 'wallet', label: 'Wallet', width: '100%' },
      {
        prop: 'singleBlockchain',
        label: 'Blockchain',
        width: '50%',
      },
      { prop: 'singleAmount', label: 'Amount', width: '100%' },
      { prop: 'btns', label: '', width: '10%' },
    ];
  }
});

const requestsRows = computed(
  () => {
    if (id.value === 0) {
      const originalArray = innerWalletStore.getInnerWalletCurrentAmount;
      if (originalArray.data && originalArray.data.length) {
        return originalArray.data.map((item, index) => {
          const blockchains = item.wallets.map((walletItem) => ({
            component: Badge,
            props: {
              text: walletItem.coin_type.blockchain.name,
              value: '',
              type: 'claim',
              big: false,
            },
            id: 2,
          }));
          const amounts = item.wallets.map((walletItem, i) => {
            return {
              component: Amount,
              props: {
                amount: walletItem.balance,
                currency: walletItem.coin_type.symbol.toLowerCase(),
              },
              id: i,
            };
          });
          const summInUsdt = item.wallets.reduce(
            (acc, currentItem) => (acc += +currentItem.balance_in_usd),
            0,
          );
          const valuesInUsdt = item.wallets.map((wallet) =>
            Number(wallet.balance_in_usd).toFixed(2),
          );
          return {
            itemId: index + 1,
            talent: {
              component: Talent,
              props: {
                text: item.user.name,
                img: item.user.avatar ? item.user.avatar : defaultBg,
              },
            },
            wallet: {
              component: Address,
              props: {
                address: item.user.wallet ? item.user.wallet : '',
              },
            },
            blockchain: {
              singleComponent: {
                component: MultiBadge,
                props: {
                  badges: blockchains,
                  type: 'claim',
                  big: false,
                },
              },
              components: blockchains,
            },
            amount: {
              singleComponent: {
                component: MultiAmount,
                props: {
                  amounts: amounts,
                  amount: 0.00004,
                  currency: 'bnb',
                },
              },
              components: amounts,
            },
            value: {
              singleContent: summInUsdt.toFixed(2),
              contents: valuesInUsdt,
            },
          };
        });
      } else return [];
    } else if (id.value === 2) {
      const originalArray = innerWalletStore.innerWalletWithdrawalRequests;
      if (originalArray.data && originalArray.data.length) {
        return originalArray.data.map((item, index) => {
          return {
            id: item.id,
            itemId: index + 1,
            talent: {
              component: Talent,
              props: {
                text:
                  item.ambassador && item.ambassador.name ? item.ambassador.name : 'Morte Negro',
                img: item.ambassador && item.ambassador.avatar ? item.ambassador.avatar : defaultBg,
              },
            },
            date: {
              component: Badge,
              props: {
                text: formatDate(item.created_at),
                value: '',
                type: 'transparent',
                big: false,
              },
            },
            wallet: {
              component: Address,
              props: {
                address: item.address,
              },
            },
            singleBlockchain: {
              component: Badge,
              props: {
                text: item.coin_type.blockchain.name ? item.coin_type.blockchain.name : 'Ethereum',
                value: '',
                type: 'transparent',
                big: false,
              },
            },
            singleAmount: {
              component: Amount,
              props: {
                amount: item.value,
                currency: item.coin_type.symbol.toLowerCase(),
              },
            },
            btns: {
              isInvisible: true,
              component: TransactionBtn,
              props: {
                page: currentPage.value,
                itemId: item.id,
                itemChainId: item.coin_type.blockchain.chain_id,
                index: index + 1,
                tokenAddress: item.coin_type.address,
                amount: item.value,
                openModal: () => {
                  isConfirmModalOpen.value = true;
                },
                action: () => {
                  tokenAddress.value = item.coin_type.address;
                  walletData.value = [
                    {
                      wallet: item.address,
                      amount: item.value,
                      currency: item.coin_type.symbol.toLowerCase(),
                      name:
                        item.ambassador && item.ambassador.name
                          ? item.ambassador.name
                          : 'Morte Negro',
                      img:
                        item.ambassador && item.ambassador.avatar
                          ? item.ambassador.avatar
                          : defaultBg,
                      id: item.id,
                    },
                  ];
                },
              },
            },
          };
        });
      } else return [];
    } else if (id.value === 1) {
      const originalArray = innerWalletStore.innerWalletWithdrawalHistory;
      if (originalArray.data && originalArray.data.length) {
        return originalArray.data.map((item) => ({
          date: {
            component: Badge,
            props: {
              text: formatDate(item.updated_at),
              value: '',
              type: 'transparent',
              big: false,
            },
          },
          talent: {
            component: Talent,
            props: {
              text: item.ambassador && item.ambassador.name ? item.ambassador.name : 'Morte Negro',
              img: item.ambassador && item.ambassador.avatar ? item.ambassador.avatar : defaultBg,
            },
          },
          txhash: {
            component: Hash,
            props: {
              hash: item.tx_hash ? item.tx_hash : '',
              chainId: item.coin_type.blockchain.chain_id ? item.coin_type.blockchain.chain_id : 56,
            },
          },
          singleBlockchain: {
            component: Badge,
            props: {
              text: item.coin_type.blockchain.name ? item.coin_type.blockchain.name : 'Ethereum',
              value: '',
              type: 'transparent',
              big: false,
            },
          },
          singleAmount: {
            component: Amount,
            props: {
              amount: item.value,
              currency: item.coin_type.symbol.toLowerCase(),
            },
          },
          status: {
            component: WalletStatus,
            props: {
              text: item.status,
              type: item.status.toLowerCase(),
            },
          },
        }));
      } else return [];
    }
  },
  { dependsOn: [id, isAllowed, tokenAddress, currentPage], deep: true },
);
</script>

<style lang="scss" scoped>
.requests_wrapper {
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 0;
  left: 52.4%;
  transform: translateX(-50%);
  height: 72px;
  width: calc(120vw);
  // width: calc(100vw - 70px);
  border: 1px solid $default-border;
  border-bottom: 0;
  background-color: white;
  // margin-top: 100px;
  z-index: 100;
  transition: margin-left 0.3s ease-in, bottom 0.2s;
  &.open {
    margin-left: 58px;
    @media screen and (max-width: 1500px) {
      margin-left: 70px;
    }
  }

  &.isScrolled {
    bottom: 72px;
    transition-duration: 0.2s;
  }
}
.requests {
  width: 1160px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;

  &_left {
    display: flex;
    gap: 16px;
  }

  &_right {
    display: flex;
    gap: 16px;
  }

  &_btns {
    display: flex;
    width: 256px;
    gap: 16px;
  }

  .font-highlighted {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 2.5;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $orange;
    &.btn {
      cursor: pointer;
    }
  }

  .font-normal {
    font-family: 'Basis Grotesque Pro';
    font-weight: normal;
    font-size: 16px;
    color: $section-title;
    line-height: 2.5;
    font-variant-numeric: slashed-zero;
    &.btn {
      cursor: pointer;
    }
  }

  .selects {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
  }

  .ml-4 {
    margin-left: 4px;
  }
}

.inner-wallet_wrapper {
  // position: relative;
  width: 1160px;
  height: fit-content;
  // height: calc(110vh - 174px);
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin: 0 auto;
  // margin-bottom: 200px;
  padding-bottom: 100px;
}
.inner-wallet_name {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 350;
  font-size: 56px;
  line-height: 72px;
  font-feature-settings: 'zero' on;
  color: $section-title;
}
.inner-wallet_cards {
  display: flex;
  gap: 16px;
}
.filters {
  width: 100%;
  display: flex;
  margin-top: 10px;
  margin-bottom: 28px;
  gap: 8px;
  justify-content: space-between;
}
</style>
