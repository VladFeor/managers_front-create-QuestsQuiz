<template>
  <div class="transfer-confirmation">
    <div class="transfer-confirmation_title">Transfer confirmation</div>
    <div class="transfer-confirmation_info">
      <span class="transfer-confirmation_info-amount"> You’re going to transfer</span>
      <span><Amount :amount="totalAmount" :currency="wallets[0].currency" /> </span>
      <span>to {{ wallets.length }} talents.</span>
    </div>
    <div v-if="props.wallets" class="transfer-confirmation_cards">
      <div
        v-for="wallet in props.wallets.slice(0, 6)"
        :key="wallet.address"
        class="transfer-confirmation_card"
      >
        <Talent :text="wallet.name" :img="wallet.img" reduceLength="10" />
        <Address :address="wallet.wallet" />
        <Amount :amount="wallet.amount" :currency="wallet.currency" isNotShowImg />
      </div>
    </div>
    <a
      v-if="csvData"
      class="transfer-confirmation_download-btn"
      :href="`data:text/csv;charset=utf-8,${encodeURIComponent(csvData)}`"
      download="userWithdrawData.csv"
    >
      <span>Download Full Report</span> <Icon name="Download" :size="24" />
    </a>
    <div class="transfer-confirmation_btns-wrapper">
      <BaseButton text="Cancel" type="secondary" @click="emit('close')" />
      <BaseButton text="Confirm" type="normal" @click="sendEth" />
    </div>
  </div>
  <!-- <Loader v-if="isLoading" /> -->
  <BaseModal :width="480" @close="handleCloseLoading($event)" :visible="isLoading">
    <LoadingModal :type="walletType" title=" Transaction is Loading..." subtitle="Please wait" />
  </BaseModal>
  <BaseModal :width="480" @close="handleCloseError($event)" :visible="isTransferError">
    <ErrorModal :message="transferErrorMessage" />
  </BaseModal>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { convertToCSVObject } from '@/util/helpers';
import {
  calculateCommissionFee,
  getNonHumanValueSumm,
  getNonHumanValue,
  isSupportedChain,
  calculateDecimalsPlaces,
  Uint128,
} from '@/web3/web3.js';
import { ethers } from 'ethers';
import { APTOS_NATIVE_TOKEN, MULTI_SEND_ADDRESSES, TOKENS } from '~~/web3/constants';
import MULTI_SEND_ABI from '@/web3/abi/MultiSend.json';
import ERC20_ABI from '@/web3/abi/ERC20.json';
import { useInnerWalletStore } from '~/store/innerWallet';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore, usePendingClaimsStore } from '~/store';
import useWeb3 from '~/hooks/useWeb3';
import { ConnectionType, TYPE_OF_CHAIN } from '~/web3/connection';
import { calculateFee } from '@cosmjs/stargate';
import { getCosmWasmClient } from '@sei-js/core';
import * as sapphire from '@oasisprotocol/sapphire-paratime';
import { getAprosPetraProvider } from '~/util/web3';
import { Provider as AptopProvider, Network } from 'aptos';

import { useWalletStore } from '~/store/wallet';
const walletStore = useWalletStore();

const userStore = useUserStore();
const pendingClaimsStore = usePendingClaimsStore();

const projectID = computed(() => userStore.getUserProjectId);

const nuxtApp = useNuxtApp();

const route = useRoute();

const {
  account: address,
  connector,
  chainId,
  getCurrentWallet,
  provider,
  typeOfChain,
  balance: walletBalance,
} = useWeb3();
const innerWalletStore = useInnerWalletStore();

const props = defineProps({
  wallets: { type: Array, default: null },
  chainId: { type: Number, default: null },
  tokenAddress: { type: String, default: null },
  cointype_id: { type: Number, default: null },
  blockchain_id: { type: Number, default: null },
  page: { type: Number, default: null },
  isFilter: { type: Boolean, default: false },
  isPending: { type: Boolean, default: false },
});

const emit = defineEmits(['close']);

const csvData = ref(null);
const isLoading = ref(false);
const notRegistredWallets = ref(null);
const isTransferError = ref(null);
const transferErrorMessage = ref(
  'You may not have enough funds in your account. Try another wallet.',
);

const walletType = computed(() => walletStore.getWalletInfo.walletType);

const totalAmount = computed(() => {
  return props.wallets.reduce((acc, item) => {
    return (acc += +item.amount);
  }, 0);
});

onMounted(() => {
  if (props.wallets && props.wallets.length) {
    const newData = JSON.parse(
      JSON.stringify(
        props.wallets.map((i) => {
          return {
            name: i.name,
            wallet: i.wallet,
            amount: i.amount,
            currency: i.currency,
          };
        }),
      ),
    );
    csvData.value = convertToCSVObject(newData);
  }
});

const handleCloseLoading = (event) => {
  isLoading.value = event;
};

const handleCloseError = (event) => {
  isTransferError.value = event;
};

const sendTransactionToBE = async (transHash) => {
  const walletData = {
    tx_hash: transHash,
    status: 'executed',
    withdrawal_request_ids: props.wallets.map((item) => item.id),
  };
  await innerWalletStore.setInnerWalletWithdrawalHistoryAction(
    props.isPending ? projectID.value : route.params.id,
    walletData,
  );
  if (!props.isPending) {
    innerWalletStore.getInnerWalletWithdrawalHistoryAction({
      id: route.params.id,
      page: 1,
    });
  }
  if (props.isFilter) {
    innerWalletStore.getInnerWalletWithdrawalRequestsAction({
      id: route.params.id,
      cointype_id: props.cointype_id,
      blockchain_id: props.blockchain_id,
      page: props.page,
    });
  } else if (props.isPending) {
    pendingClaimsStore.getPendingClaimsAction(projectID.value || null);
  } else {
    innerWalletStore.getInnerWalletWithdrawalRequestsAction({
      id: route.params.id,
      page: props.page,
    });
  }

  nuxtApp.$alert.show('Transfer sent', {
    type: 'success',
    timeout: 5000,
  });

  window.dataLayer.push({
    event: 'project_reward_distribution',
  });

  isLoading.value = false;
  emit('close');
};

async function sendEth() {
  try {
    if (isSupportedChain(props.chainId) && address.value) {
      isLoading.value = true;

      if (props.tokenAddress == 'native') {
        if (typeOfChain === TYPE_OF_CHAIN.EVM) {
          const signer = provider.getSigner();

          const instance = new ethers.Contract(
            MULTI_SEND_ADDRESSES[props.chainId],
            MULTI_SEND_ABI,
            signer,
          );

          const amounts = props.wallets.map((item) => getNonHumanValue(item.amount, 18).toString());

          const wallets = props.wallets.map((item) => item.wallet);

          const value = calculateCommissionFee(getNonHumanValueSumm(amounts)).toString();

          if (provider) {
            const balance = (await provider.getBalance(address.value)).toString();

            if (+value > +balance) {
              isLoading.value = false;
              handleCloseError(true);
              // nuxtApp.$alert.show('Insufficient funds', {
              //   type: 'error',
              //   timeout: 5000,
              // });

              return;
            }
          }

          const tx = await instance.multiSendDiffEth(wallets, amounts, {
            value,
          });

          const receipt = await tx.wait();

          if (receipt) {
            sendTransactionToBE(receipt.transactionHash);
          }
        } else if (typeOfChain === TYPE_OF_CHAIN.TRON) {
          try {
            const contract = await provider.contract(
              MULTI_SEND_ABI,
              MULTI_SEND_ADDRESSES[props.chainId],
            );

            const amounts = props.wallets.map((item) => provider.toSun(item.amount));

            const wallets = props.wallets.map((item) => item.wallet);

            const value = calculateCommissionFee(getNonHumanValueSumm(amounts)).toString();

            if (provider) {
              const balance = await window.tronWeb.trx.getBalance(address.value);

              if (balance == '0' || +value > +balance) {
                isLoading.value = false;
                handleCloseError(true);
                // nuxtApp.$alert.show('Insufficient funds', {
                //   type: 'error',
                //   timeout: 5000,
                // });

                return;
              }
            }

            let transactionHashTron = null;

            window.addEventListener('message', function (e) {
              if (e.data.message && e.data.message.action == 'tabReply') {
                if (e.data.message.data.success) {
                  transactionHashTron = e.data.message.data.data.txID;
                }
              }
            });

            let tx = await contract.multiSendDiffEth(wallets, amounts).send({
              callValue: value,
              shouldPollResponse: true,
            });

            if (tx && transactionHashTron) {
              sendTransactionToBE(transactionHashTron);
            }
          } catch (error) {
            console.log('send eth tron error: ', error);
            isLoading.value = false;
          }
        } else if (typeOfChain === TYPE_OF_CHAIN.SEI) {
          try {
            const amounts = props.wallets.map((item) =>
              getNonHumanValue(item.amount, 6).toString(),
            );

            const value = calculateCommissionFee(getNonHumanValueSumm(amounts), 100).toString();

            const fee = calculateFee(200000, '0.1usei');

            const queryResponse = await connector.queryClient.wasm.getContractInfo(
              'sei10rdc0yqvlr57mjlxex8uez6xkpzh6f9s93tecsq6u0a9mv3k5pcss68hhr',
            );

            // console.log('queryResponse', queryResponse);

            if (walletBalance.value == '0' || +value > +walletBalance.value) {
              isLoading.value = false;
              handleCloseError(true);
              // nuxtApp.$alert.show('Insufficient funds', {
              //   type: 'error',
              //   timeout: 5000,
              // });

              return;
            }

            const msg = {
              token_sender: {
                recipient_amounts: props.wallets.map(({ wallet, amount }) => [
                  wallet,
                  getNonHumanValue(amount, 6).toString(),
                ]),
                fee: '10',
              },
            };

            const receipt = await connector.execute(
              address.value,
              'sei10rdc0yqvlr57mjlxex8uez6xkpzh6f9s93tecsq6u0a9mv3k5pcss68hhr',
              msg,
              fee,
              '',
              [{ denom: 'usei', amount: value }],
            );
            if (receipt) {
              sendTransactionToBE(receipt.transactionHash);
            }
          } catch (error) {
            isLoading.value = false;
            console.log('SEI TRANSFER ERROR: ', error);
          }
        } else if (typeOfChain === TYPE_OF_CHAIN.APTOS) {
          try {
            const provider = new AptopProvider(Network.MAINNET);

            const wallet = getAprosPetraProvider();

            let isCoinRegistred = true;

            let unRegWallets = [];

            for (const userWallet of props.wallets) {
              const userAccountResources = await provider.getAccountCoinsData(userWallet.wallet);

              if (
                userAccountResources &&
                userAccountResources?.current_fungible_asset_balances &&
                userAccountResources?.current_fungible_asset_balances.length
              ) {
                const isExistCoin = userAccountResources?.current_fungible_asset_balances.find(
                  (item) => item.asset_type === APTOS_NATIVE_TOKEN,
                );
                if (!isExistCoin) {
                  isCoinRegistred = false;
                  unRegWallets.push(userWallet.wallet);
                }
              } else {
                unRegWallets.push(userWallet.wallet);
                isCoinRegistred = false;
              }
            }

            if (unRegWallets.length) {
              notRegistredWallets.value = unRegWallets;
            }

            if (!isCoinRegistred) {
              isLoading.value = false;
              nuxtApp.$alert.show('Coin not registered in at least one wallet.', {
                type: 'error',
                timeout: 5000,
              });

              return;
            }

            const employeesParsedAmounts = props.wallets.map(({ wallet, amount }) =>
              getNonHumanValue(amount, 8).toString(),
            );

            const wallets = props.wallets.map((item) => item.wallet);

            const transaction = {
              arguments: [wallets, employeesParsedAmounts],
              function: MULTI_SEND_ADDRESSES[chainId.value],
              type: 'entry_function_payload',
              type_arguments: [APTOS_NATIVE_TOKEN],
            };

            const pendingTransaction = await wallet.signAndSubmitTransaction(transaction);

            const tx = await provider.waitForTransactionWithResult(pendingTransaction.hash);
            if (tx && tx.version) {
              sendTransactionToBE(tx.version);
            }
          } catch (error) {
            isLoading.value = false;
            console.log('APTOS TRANSFER ERROR: ', error);
          }
        }
      } else {
        if (typeOfChain === TYPE_OF_CHAIN.EVM) {
          const erc20Contract = new ethers.Contract(props.tokenAddress, ERC20_ABI, provider);
          let signer;
          if (chainId.value === 23294) {
            signer = sapphire.wrap(provider.getSigner());
          } else {
            signer = provider.getSigner();
          }
          const instanceERC20 = erc20Contract.connect(signer);

          const decimals = (await instanceERC20.decimals()).toString();
          const tokenBalance = (await instanceERC20.balanceOf(address.value)).toString();
          const unsupportedAmounts = [];

          const instance = new ethers.Contract(
            MULTI_SEND_ADDRESSES[props.chainId],
            MULTI_SEND_ABI,
            signer,
          );

          // for (let i = 0; i < transactionData.amount.length; i++) {
          //   const amount = transactionData.amount[i];
          //   const wallet = transactionData.wallets[i];
          //   const isUnsupported = calculateDecimalsPlaces(String(amount), decimals);
          //   if (isUnsupported) {
          //     unsupportedAmounts.push({ wallet });
          //   }
          // }

          // if (unsupportedAmounts.length) {
          //   isLoading.value = false;

          //   return;
          // }

          const amounts = props.wallets.map((item) =>
            getNonHumanValue(item.amount, decimals).toString(),
          );

          const wallets = props.wallets.map((item) => item.wallet);

          const amountsSumm = getNonHumanValueSumm(amounts).toString();

          if (+tokenBalance === 0 || +amountsSumm > +tokenBalance) {
            isLoading.value = false;
            handleCloseError(true);
            // nuxtApp.$alert.show('Insufficient funds', {
            //   type: 'error',
            //   timeout: 5000,
            // });
            return;
          }

          let tx = await instance.multiSendDiffToken(wallets, amounts, props.tokenAddress);

          const receipt = await tx.wait();

          if (receipt) {
            sendTransactionToBE(receipt.transactionHash);
          }
        } else if (typeOfChain === TYPE_OF_CHAIN.TRON) {
          const contract = await provider.contract(
            MULTI_SEND_ADDRESSES[props.chainId],
            MULTI_SEND_ABI,
          );

          const instanceERC20 = await provider.Contract(ERC20_ABI, props.tokenAddress);

          const decimals = (await instanceERC20.decimals()).toString();
          const tokenBalance = (await instanceERC20.balanceOf(address.value)).toString();

          const unsupportedAmounts = [];

          // for (let i = 0; i < transactionData.amount.length; i++) {
          //   const amount = transactionData.amount[i];
          //   const wallet = transactionData.wallets[i];
          //   const isUnsupported = calculateDecimalsPlaces(String(amount), decimals);
          //   if (isUnsupported) {
          //     unsupportedAmounts.push({ wallet });
          //   }
          // }

          // if (unsupportedAmounts.length) {
          //   isLoading.value = false;

          //   return;
          // }

          const amounts = props.wallets.map((item) =>
            getNonHumanValue(item.amount, decimals).toString(),
          );

          const wallets = props.wallets.map((item) => item.wallet);

          const amountsSumm = getNonHumanValueSumm(amounts).toString();

          if (+tokenBalance === 0 || +amountsSumm > +tokenBalance) {
            isLoading.value = false;
            handleCloseError(true);
            // nuxtApp.$alert.show('Insufficient funds', {
            //   type: 'error',
            //   timeout: 5000,
            // });
            return;
          }

          let transactionHashTron = null;

          window.addEventListener('message', function (e) {
            if (e.data.message && e.data.message.action == 'tabReply') {
              if (e.data.message.data.success) {
                transactionHashTron = e.data.message.data.data.txID;
              }
            }
          });

          let tx = await contract.multiSendDiffToken(wallets, amounts, props.tokenAddress);

          if (tx && transactionHashTron) {
            sendTransactionToBE(transactionHashTron);
          }
        } else if (typeOfChain === TYPE_OF_CHAIN.APTOS) {
          try {
            const provider = new AptopProvider(Network.MAINNET);

            const wallet = getAprosPetraProvider();

            const accountResources = await provider.getAccountCoinsData(address.value);

            let coinDecimals = 8;

            if (
              accountResources?.current_fungible_asset_balances &&
              accountResources?.current_fungible_asset_balances.length
            ) {
              const currentDecimals = accountResources?.current_fungible_asset_balances.find(
                (item) => item.asset_type === props.tokenAddress,
              );

              if (currentDecimals && currentDecimals.metadata) {
                coinDecimals = currentDecimals.metadata.decimals;
              }
            }

            let isCoinRegistred = true;

            let unRegWallets = [];

            for (const userWallet of props.wallets) {
              const userAccountResources = await provider.getAccountCoinsData(userWallet.wallet);

              if (
                userAccountResources &&
                userAccountResources?.current_fungible_asset_balances &&
                userAccountResources?.current_fungible_asset_balances.length
              ) {
                const isExistCoin = userAccountResources?.current_fungible_asset_balances.find(
                  (item) => item.asset_type === props.tokenAddress,
                );
                if (!isExistCoin) {
                  isCoinRegistred = false;
                  unRegWallets.push(userWallet.wallet);
                }
              } else {
                unRegWallets.push(userWallet.wallet);
                isCoinRegistred = false;
              }
            }

            if (unRegWallets.length) {
              notRegistredWallets.value = unRegWallets;
            }

            if (!isCoinRegistred) {
              isLoading.value = false;
              nuxtApp.$alert.show('Coin not registered in at least one wallet.', {
                type: 'error',
                timeout: 5000,
              });

              return;
            }

            const currentTokenDecimals = TOKENS[chainId.value].find(
              (item) => item.address.toLowerCase() === props.tokenAddress.toLowerCase(),
            ).decimals;

            const employeesParsedAmounts = props.wallets.map(({ wallet, amount }) =>
              getNonHumanValue(amount, currentTokenDecimals).toString(),
            );

            const wallets = props.wallets.map((item) => item.wallet);

            const transaction = {
              arguments: [wallets, employeesParsedAmounts],
              function: MULTI_SEND_ADDRESSES[chainId.value],
              type: 'entry_function_payload',
              type_arguments: [props.tokenAddress],
            };

            const pendingTransaction = await wallet.signAndSubmitTransaction(transaction);

            const tx = await provider.waitForTransactionWithResult(pendingTransaction.hash);
            if (tx && tx.version) {
              sendTransactionToBE(tx.version);
            }
          } catch (error) {
            isLoading.value = false;
            console.log('APTOS TRANSFER ERROR: ', error);
          }
        }
      }
    } else {
      nuxtApp.$alert.show('Chain not supported', {
        type: 'error',
        timeout: 5000,
      });
      isLoading.value = false;
      emit('close');
    }
  } catch (error) {
    isLoading.value = false;
    emit('close');
    console.log('send eth error', error);
  }
}
</script>

<style lang="scss" scoped>
.transfer-confirmation {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  gap: 24px;
  &_download-btn {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 4px 8px;
    gap: 8px;
    width: 200px;
    height: 32px;
    cursor: pointer;

    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $secondary;
  }
  &_btns-wrapper {
    width: 100%;
    display: flex;
    gap: 24px;
  }
  &_title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 40px;
    color: $section-title;
  }
  &_info {
    display: flex;
    flex-direction: column;
    justify-content: center;

    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
    text-align: center;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $section-title;
    &-amount {
      display: flex;
    }
  }
  &_cards {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  &_card {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    gap: 16px;
    width: 100%;
    height: 40px;
    background: #ffffff;
    border: 1px solid #dad9f7;
    border-radius: 8px;
  }
}
</style>
