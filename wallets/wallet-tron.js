import { WalletAbstract } from './wallet-abstract';
import { WalletFactory } from './wallet-factory';
import { getMetamaskProvider } from '~/util/web3';
import { SupportedChainId } from '~/web3/constants';
import { ConnectionType, TYPE_OF_CHAIN } from '~/web3/connection';
import { useWalletStore } from '~/store/wallet';

export class WalletTron extends WalletAbstract {
  constructor() {
    super();
    this.type = ConnectionType.TRONLINK;
  }

  checkConnection = async () => {
    await this.connectWallet();
    return this;
  };

  connect = async () => {
    await this.connectWallet();
    return this;
  };

  connectWallet = async () => {
    const nuxtApp = useNuxtApp();
    if (typeof window !== 'undefined' && window.tronWeb) {
      if (window.tronLink.ready) {
        try {
          const address = window.tronWeb.defaultAddress.base58;

          if (address) {
            this.address = address;

            let tronNetwork = '';

            switch (window.tronWeb.solidityNode.host) {
              case 'https://api.trongrid.io':
                tronNetwork = 'TRON_GRID_MAINNET';
                break;
              case 'https://api.nileex.io':
                tronNetwork = 'TRON_NILE_TESTNET';
                break;

              default:
                tronNetwork = '';
                break;
            }

            const walletStore = useWalletStore();

            window.addEventListener('message', function (e) {
              if (e.data.message && e.data.message.action == 'tabReply') {
                console.log('tabReply event', e.data.message);
                if (
                  e.data.message.data.data.node.chain &&
                  e.data.message.data.data.node.chain == '_'
                ) {
                  console.log('tronLink currently selects the main chain');
                } else {
                  console.log('tronLink currently selects the side chain');
                }
              }

              if (e.data.message && e.data.message.action == 'setAccount') {
                console.log('setAccount e.data.message', e.data.message);

                console.log('UPDATE WALLET ADDRESS', e.data.message.data.address);

                walletStore.updateWalletState({
                  walletAddress: e.data.message.data.address,
                  walletType: this.type,
                  typeOfChain: TYPE_OF_CHAIN.TRON,
                });
              }
              if (e.data.message && e.data.message.action == 'setNode') {
                switch (e.data.message.data.node.fullNode) {
                  case 'https://api.trongrid.io':
                    walletStore.updateWalletState({
                      walletType: this.type,
                      typeOfChain: TYPE_OF_CHAIN.TRON,
                      chainId: 'TRON_GRID_MAINNET',
                    });
                    break;
                  case 'https://api.nileex.io':
                    walletStore.updateWalletState({
                      walletType: this.type,
                      typeOfChain: TYPE_OF_CHAIN.TRON,
                      chainId: 'TRON_NILE_TESTNET',
                    });
                    break;

                  default:
                    break;
                }
                console.log('setNode event', e.data.message);
                if (e.data.message.data.node.chain == '_') {
                  console.log('tronLink currently selects the main chain');
                } else {
                  console.log('tronLink currently selects the side chain');
                }

                // Tronlink chrome v3.22.1 & Tronlink APP v4.3.4 started to support
                if (e.data.message && e.data.message.action == 'connect') {
                  console.log('connect event', e.data.message.isTronLink);
                }

                // Tronlink chrome v3.22.1 & Tronlink APP v4.3.4 started to support
                if (e.data.message && e.data.message.action == 'disconnect') {
                  console.log('disconnect event', e.data.message.isTronLink);
                }

                // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support
                if (e.data.message && e.data.message.action == 'accountsChanged') {
                  console.log('accountsChanged event', e.data.message);
                  console.log('current address:', e.data.message.data.address);
                }

                // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support
                if (e.data.message && e.data.message.action == 'connectWeb') {
                  console.log('connectWeb event', e.data.message);
                  console.log('current address:', e.data.message.data.address);
                }

                // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support
                if (e.data.message && e.data.message.action == 'accountsChanged') {
                  console.log('accountsChanged event', e.data.message);
                }

                // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support
                if (e.data.message && e.data.message.action == 'acceptWeb') {
                  console.log('acceptWeb event', e.data.message);
                }
                // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support
                if (e.data.message && e.data.message.action == 'disconnectWeb') {
                  console.log('disconnectWeb event', e.data.message);
                }

                // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support
                if (e.data.message && e.data.message.action == 'rejectWeb') {
                  console.log('rejectWeb event', e.data.message);
                }
              }
            });

            if (!walletStore.getWalletInfo.walletAddress) {
              walletStore.updateWalletState({
                walletAddress: this.address,
                walletType: this.type,
                typeOfChain: TYPE_OF_CHAIN.TRON,
                chainId: tronNetwork,
                provider: window.tronLink.tronWeb,
              });
            } else {
              walletStore.updateWalletState({
                walletType: this.type,
                typeOfChain: TYPE_OF_CHAIN.TRON,
                chainId: tronNetwork,
                provider: window.tronLink.tronWeb,
              });
            }
          } else {
            throw new Error('No Tron address found');
          }
        } catch (err) {
          this.error = err.message;
          this.resetWallet();
        }
      } else {
        nuxtApp.$alert.show(`Connect Tronlink wallet`, {
          type: 'error',
          timeout: 5000,
        });
        try {
          const res = await window.tronLink.request({ method: 'tron_requestAccounts' });
          if (res.code === 200) {
            await this.connectWallet();
          }
        } catch (error) {
          console.log('error TRONLINK', error);
        }
      }
    } else {
      this.error = 'Please install TronLink';
      window.open(
        'https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec',
        '_blank',
      );
    }
  };

  getChainId = async () => {
    let tronNetwrork = '';

    switch (window.tronWeb.solidityNode.host) {
      case 'https://api.trongrid.io':
        tronNetwrork = 'TRON_GRID_MAINNET';
        break;
      case 'https://api.nileex.io':
        tronNetwrork = 'TRON_NILE_TESTNET';
        break;

      default:
        tronNetwrork = '';
        break;
    }

    return tronNetwrork;
  };

  getBalance = async () => {
    return await window.tronWeb.trx.getBalance(this.address);
  };

  getNetwork = (chainId) => {
    window.tronWeb.trx
      .getNetwork()
      .then((network) => {
        if (network === 'nile') {
          console.log('Tron Nile network');
        } else if (network === 'grid') {
          console.log('Tron Grid network');
        } else {
          console.log('Unknown network');
        }
      })
      .catch((error) => {
        console.error('Failed to get Tron network:', error);
      });
  };

  getProvider = () => {
    if (typeof window !== 'undefined' && window.tronLink) {
      return window.tronLink.tronWeb;
    } else {
      throw new Error('TronLink not available');
    }
  };

  switchNetwork = async (chainId) => {
    const nuxtApp = useNuxtApp();

    if (chainId === 'APTOS_MAINNET') {
      if (window.aptos) {
        this.resetWallet();
        WalletFactory.getWallet(ConnectionType.APTOS_PETRA);
      } else {
        window.open(
          'https://chrome.google.com/webstore/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci',
          '_blank',
        );
      }
      return;
    }
    if (chainId === 'SEI_MAINNET') {
      if (window.compass) {
        this.resetWallet();
        WalletFactory.getWallet(ConnectionType.COMPASS);
      } else {
        window.open(
          'https://chrome.google.com/webstore/detail/compass-wallet-for-sei/anokgmphncpekkhclmingpimjmcooifb',
          '_blank',
        );
      }
      return;
    }
    if (chainId !== SupportedChainId.TRON_GRID_MAINNET) {
      if (getMetamaskProvider()) {
        this.resetWallet();
        const wallet = WalletFactory.getWallet(ConnectionType.METAMASK);
        if (wallet && typeof chainId === 'number') {
          wallet.switchNetwork(chainId);
        }
      } else {
        window.open('https://metamask.io/', '_blank');
      }
      return;
    }
    nuxtApp.$alert.show(`Network switching is not supported for Tron`, {
      type: 'error',
      timeout: 5000,
    });
    throw new Error('Network switching is not supported for Tron');
  };
}
