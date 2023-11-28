import { blockchains } from '~/util/onchain';

export const GATE_CONDITIONS = {
  ANY_NFT_FROM_COLLECTION: 'any_nft_from_a_collection',
  SPECIFIC_NFT_FROM_COLLECTION: 'specific_nft_from_a_collection',
  MINIMUN_AMOUNT_OF_TOKEN: 'minimum_amount_of_token',
  WHITELIST_OF_WALLET_ADRESSESS: 'whitelist_of_wallet_addresses',
};

export const GATE_CONDITION_DATA = {
  [GATE_CONDITIONS.ANY_NFT_FROM_COLLECTION]: { icon: 'NFT', label: 'Any NFT From a Collection' },
  [GATE_CONDITIONS.SPECIFIC_NFT_FROM_COLLECTION]: {
    icon: 'NFT',
    label: 'Specific NFT From a Collection',
  },
  [GATE_CONDITIONS.MINIMUN_AMOUNT_OF_TOKEN]: { icon: 'Wallet', label: 'Minimum Amount of Token' },
  [GATE_CONDITIONS.WHITELIST_OF_WALLET_ADRESSESS]: {
    icon: 'File',
    label: 'Whitelist of Wallet Addresses',
  },
};

export const GATE_CONDITION_PARTS = {
  QUESTIONS: 'questions',
  BLOCKCHAIN_SELECT: 'blockchain_select',
  NFT_NAME_OR_CONTRACT_ADDRESS: 'nft_contract_address',
  ATTRIBUTES: 'attributes',
  TOKEN_ID_SELECT: 'token_id_select',
  TOKEN_AMOUNT: 'token_and_quantity',
  WALLET_ADRESSESS: 'wallet_adressess',
  DISCORD_ROLE: 'discord_role',
  COUNTRY_SELECT: 'country_select',
  AGE_RANGE: 'age_range',
  LINK_TO_COMPLETION: 'completion_link',
};

export const GATE_CONDITION_PREVIEWS = {
  TOKEN_PREVIEW: 'token_preview',
  NFT_PREVIEW: 'nft_preview',
};

export const GATE_CONDITION_PARTS_MAP = {
  [GATE_CONDITIONS.ANY_NFT_FROM_COLLECTION]: [
    GATE_CONDITION_PARTS.BLOCKCHAIN_SELECT,
    GATE_CONDITION_PARTS.NFT_NAME_OR_CONTRACT_ADDRESS,
    GATE_CONDITION_PREVIEWS.NFT_PREVIEW,
    GATE_CONDITION_PARTS.LINK_TO_COMPLETION,
  ],
  [GATE_CONDITIONS.SPECIFIC_NFT_FROM_COLLECTION]: [
    GATE_CONDITION_PARTS.BLOCKCHAIN_SELECT,
    GATE_CONDITION_PARTS.NFT_NAME_OR_CONTRACT_ADDRESS,
    GATE_CONDITION_PARTS.TOKEN_ID_SELECT,
    GATE_CONDITION_PREVIEWS.NFT_PREVIEW,
    GATE_CONDITION_PARTS.LINK_TO_COMPLETION,
  ],
  [GATE_CONDITIONS.MINIMUN_AMOUNT_OF_TOKEN]: [
    GATE_CONDITION_PARTS.BLOCKCHAIN_SELECT,
    GATE_CONDITION_PARTS.TOKEN_AMOUNT,
    GATE_CONDITION_PREVIEWS.TOKEN_PREVIEW,
    GATE_CONDITION_PARTS.LINK_TO_COMPLETION,
  ],
  [GATE_CONDITIONS.WHITELIST_OF_WALLET_ADRESSESS]: [
    GATE_CONDITION_PARTS.WALLET_ADRESSESS,
    GATE_CONDITION_PARTS.LINK_TO_COMPLETION,
  ],
};

export const CONDITION_PART_VALUES = {
  [GATE_CONDITION_PARTS.BLOCKCHAIN_SELECT]: ['blockchain'],
  [GATE_CONDITION_PARTS.NFT_NAME_OR_CONTRACT_ADDRESS]: ['contractAddress'],
  [GATE_CONDITION_PARTS.TOKEN_ID_SELECT]: ['tokenId'],
  [GATE_CONDITION_PARTS.TOKEN_AMOUNT]: ['contractAddress', 'quantity'],
  [GATE_CONDITION_PARTS.WALLET_ADRESSESS]: ['adressess'],
  [GATE_CONDITION_PARTS.LINK_TO_COMPLETION]: ['actionButtonLink', 'actionButtonTitle'],
  [GATE_CONDITION_PREVIEWS.TOKEN_PREVIEW]: ['tokenName'],
  [GATE_CONDITION_PREVIEWS.NFT_PREVIEW]: ['nftName', 'imgUrl'],
};

export const getConditionDefaultValues = (type) => {
  const defaultBlockchain = blockchains[0].name;
  switch (type) {
    case GATE_CONDITIONS.ANY_NFT_FROM_COLLECTION: {
      return {
        blockchain: defaultBlockchain,
        contractAddress: '',
        actionButtonLink: '',
        actionButtonTitle: '',
        nftName: '',
        imageUrl: '',
      };
    }
    case GATE_CONDITIONS.SPECIFIC_NFT_FROM_COLLECTION: {
      return {
        blockchain: defaultBlockchain,
        contractAddress: '',
        tokenId: '',
        actionButtonLink: '',
        actionButtonTitle: '',
        nftName: '',
        imageUrl: '',
      };
    }
    case GATE_CONDITIONS.MINIMUN_AMOUNT_OF_TOKEN: {
      return {
        blockchain: defaultBlockchain,
        contractAddress: '',
        quantity: '',
        actionButtonLink: '',
        actionButtonTitle: '',
        tokenName: '',
      };
    }
    case GATE_CONDITIONS.WHITELIST_OF_WALLET_ADRESSESS: {
      return {
        adressess: '',
        actionButtonLink: '',
        actionButtonTitle: '',
      };
    }
    default:
      return { blockchain: 'Ethereum' };
  }
};
