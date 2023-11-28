import { WalletMetamask } from './wallet-metamask';
import { WalletAbstract } from './wallet-abstract';
import { WalletConnectorV2 } from './wallet-connect-v2';
import { ConnectionType } from '~/web3/connection';
import { WalletTron } from './wallet-tron';
import { WalletCompass } from './wallet-compass';
import { WalletAptosPetra } from './wallet-aptos-petra';

export class WalletFactory {
  static getWallet(type) {
    if (typeof localStorage !== 'undefined') {
      const walletType = type ?? localStorage.getItem('walletType');

      if (walletType) {
        localStorage.setItem('walletType', walletType);
      }

      if (walletType === ConnectionType.METAMASK) {
        return new WalletMetamask();
      } else if (walletType === ConnectionType.WALLET_CONNECT) {
        return new WalletConnectorV2();
      } else if (walletType === ConnectionType.TRONLINK) {
        return new WalletTron();
      } else if (walletType === ConnectionType.COMPASS) {
        return new WalletCompass();
      } else if (walletType === ConnectionType.APTOS_PETRA) {
        return new WalletAptosPetra();
      } else {
        return new WalletAbstract();
      }
    }
  }
}
