import { computed } from 'vue';
import { useWalletStore } from '~/store/wallet';
import { WalletFactory } from '~/wallets/wallet-factory';
import { Provider as AptopProvider, Network } from 'aptos';
import { APTOS_NATIVE_TOKEN } from '~/web3/constants';
import { ConnectionType } from '~/web3/connection';

export default function useWeb3EventsListener() {
  const walletStore = useWalletStore();

  const chainId = computed(() => walletStore.getChainId);
  const address = computed(() => walletStore.getAddress);
  const walletType = computed(() => walletStore.getWalletType);

  watch([() => chainId.value, () => address.value], () => {
    checkConnection();
  });

  const checkConnection = async () => {
    const savedWalletType = localStorage.getItem('walletType');
    if (savedWalletType) {
      const currentWallet = WalletFactory.getWallet(savedWalletType);

      if (currentWallet) {
        currentWallet.checkConnection().then(async (res) => {
          let currentBalance;
          if (res.type === ConnectionType.APTOS_PETRA) {
            const provider = new AptopProvider(Network.MAINNET);

            const accountResources = await provider.getAccountCoinsData(address.value);

            if (
              accountResources.current_fungible_asset_balances &&
              accountResources.current_fungible_asset_balances.length &&
              accountResources.current_fungible_asset_balances.some(
                (item) => item.asset_type === APTOS_NATIVE_TOKEN,
              )
            ) {
              const nativeToken = accountResources.current_fungible_asset_balances.find(
                (item) => item.asset_type === APTOS_NATIVE_TOKEN,
              );

              if (nativeToken && nativeToken.amount) {
                currentBalance = nativeToken.amount;
              } else {
                currentBalance = 0;
              }
            } else {
              currentBalance = 0;
            }
          } else {
            currentBalance = (await res.getBalance()).toString();
          }

          console.log('checkConnection balance', currentBalance);
          const chainId = await res.getChainId();
          console.log('checkConnection chainId', chainId);
          console.log('checkConnection res', res);
          walletStore.updateWalletState({
            wallet: res,
            balance: currentBalance,
            chainId,
          });
        });
      }
    }
  };

  onMounted(() => {
    const savedWalletType = localStorage.getItem('walletType');

    console.log('savedWalletType', savedWalletType);

    if (savedWalletType && savedWalletType.length) {
      checkConnection();
    }
  });
}
