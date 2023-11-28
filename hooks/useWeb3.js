import { computed, toRaw } from 'vue';
import { useWalletStore } from '~/store/wallet';
import { WalletFactory } from '~/wallets/wallet-factory';

export default function useWeb3() {
  const walletStore = useWalletStore();

  const account = computed(() => walletStore.getWalletInfo.walletAddress);
  const connector = computed(() => walletStore.getWalletInfo.connector);
  const walletType = computed(() => walletStore.getWalletInfo.walletType);
  const provider = computed(() => walletStore.getWalletInfo.provider);
  const chainId = computed(() => walletStore.getWalletInfo.chainId);
  const wallet = computed(() => walletStore.getWalletInfo.wallet);
  const balance = computed(() => walletStore.getWalletInfo.balance);
  const typeOfChain = computed(() => walletStore.getTypeOfChain);
  const getCurrentWallet = () => {
    const savedWalletType = localStorage.getItem('walletType');
    const currentWallet = WalletFactory.getWallet(savedWalletType);
    return currentWallet;
  };

  return {
    account,
    chainId,
    connector: toRaw(connector.value),
    walletType: walletType.value,
    provider: toRaw(provider.value),
    getCurrentWallet,
    wallet: toRaw(wallet.value),
    balance,
    typeOfChain: toRaw(typeOfChain.value),
  };
}
