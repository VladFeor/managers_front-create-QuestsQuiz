import { blockchains } from '~/util/onchain';
import { CHAIN_INFO } from '~/web3/constants';

export const ON_CHAIN_TASK = 'on-chain';

export const ON_CHAIN_CONDITIONS = {
  USER_HOLDS_TOKEN: 'user_holds_token',
  USER_HOLDS_NFT: 'user_holds_nft',
  USER_HOLDS_POAP: 'user_holds_poap',
  TOKEN_NFT_POAP_NATIVE_TRANSFERS: 'token_nft_poap_native_transfers',
  TX_NOT_DONE: 'tx_not_done',
  NATIVE_TOKEN_TRANSFERS: 'native_token_transfers',
  ANY_CHAIN_ACTION: 'any_chain_action',
  USER_HAS_ENS_DOMAIN: 'user_has_ens_domain',
  USER_HAS_ERC_20_TOKENS: 'user_has_erc_20_tokens',
  USER_HAS_NATIVE_TOKEN_BALANCE: 'user_has_native_token_balance',
  USER_HAS_ERC_721_AND_ERC_1155_TOKENS: 'user_has_erc_721_and_erc_1155_tokens',
  INTERACTED_WITH_BLOCKCHAIN: 'interacted_with_blockchain',
};

export const ON_CHAIN_CONDITION_PARTS = {
  CONTRACT_ADDRESS: 'contract_address',
  BLOCKCHAIN: 'blockchain',
  SENDER_ADDRESS: 'sender_address',
  RECEIVER_ADDRESS: 'receiver_address',
  AMOUNT: 'amount',
  CURRENCY_ADDRESS: 'currency_address',
  TOKEN_ID: 'token_id',
  EVENT_URL: 'event_url',
  LINK_TO_COMPLETION: 'completion_link',
  TOKEN_NAME: 'tokenName',
  IS_NATIVE_TOKEN: 'isNativeToken',
  ACTION_BUTTON_LINK: 'actionButtonLink',
  ACTION_BUTTON_TITLE: 'actionButtonTitle',
  NFT_PREVIEW: 'nft_preview',
  NFT_NAME: 'nftName',
  NFT_IMAGE: 'imgUrl',
};

export const ON_CHAIN_CONDITION_ADDRESSES_NAME = {
  [ON_CHAIN_CONDITION_PARTS.CONTRACT_ADDRESS]: 'Contract',
  [ON_CHAIN_CONDITION_PARTS.SENDER_ADDRESS]: 'Sender',
  [ON_CHAIN_CONDITION_PARTS.RECEIVER_ADDRESS]: 'Receiver',
  [ON_CHAIN_CONDITION_PARTS.CURRENCY_ADDRESS]: 'ERC20/NFT/POAP',
};

export const conditions = [
  {
    name: 'Talent Holds Token',
    value: ON_CHAIN_CONDITIONS.USER_HOLDS_TOKEN,
    subtitle: 'Verify if a talent owns the minimum quantity of tokens',
  },
  {
    name: 'Talent Holds NFT',
    value: ON_CHAIN_CONDITIONS.USER_HOLDS_NFT,
    subtitle: 'Verify if a talent owns a specific NFT or NFT from a collection',
  },
  {
    name: 'Talent Holds POAP',
    subtitle: 'Verify if a talent owns a specific POAP or POAP from a collection ',
    value: ON_CHAIN_CONDITIONS.USER_HOLDS_POAP,
  },
  // {
  //   name: 'Token/NFT/POAP Transfer',
  //   subtitle: 'Verify if a talent has made a Token/NFT/POAP Transfer',
  //   value: ON_CHAIN_CONDITIONS.TOKEN_NFT_POAP_NATIVE_TRANSFERS,
  // },
  {
    name: 'Talent Interacted With Contract',
    subtitle: 'Verify if a talent has interacted with a specific contract',
    value: ON_CHAIN_CONDITIONS.TX_NOT_DONE,
  },
  // {
  //   name: 'Native Token Transfers',
  //   subtitle: 'Verify if a talent has made a Native currency transfer',
  //   value: ON_CHAIN_CONDITIONS.NATIVE_TOKEN_TRANSFERS,
  // },
  // {
  //   name: 'Any On-Chain Action',
  //   subtitle:
  //     'Verify if a talent interacted with a specific address and transferred specific ERC20/NFT/POAP ',
  //   value: ON_CHAIN_CONDITIONS.ANY_CHAIN_ACTION,
  // },
  {
    name: 'Talent Has ENS Domain',
    subtitle: 'Verify if a talent has a specific ENS Domain',
    value: ON_CHAIN_CONDITIONS.USER_HAS_ENS_DOMAIN,
  },
  // {
  //   name: 'Talent has ERC-20 tokens',
  //   subtitle: 'Verify if a talent has an ERC-20 token balance',
  //   value: ON_CHAIN_CONDITIONS.USER_HAS_ERC_20_TOKENS,
  // },
  // {
  //   name: 'Talent has Native Token Balance',
  //   subtitle: 'Verify if a talent has a native token balance',
  //   value: ON_CHAIN_CONDITIONS.USER_HAS_NATIVE_TOKEN_BALANCE,
  // },
  // {
  //   name: 'Talent has ERC-721 and ERC-1155 tokens',
  //   subtitle: 'Verify if a talent has an ERC-721 and ERC-1155 token balance',
  //   value: ON_CHAIN_CONDITIONS.USER_HAS_ERC_721_AND_ERC_1155_TOKENS,
  // },
  {
    name: 'Talent Interacted With Blockchain',
    subtitle: 'Verify if a talent has any transactions on a specific blockchain',
    value: ON_CHAIN_CONDITIONS.INTERACTED_WITH_BLOCKCHAIN,
  },
];

export const ON_CHAIN_CONDITION_PARTS_MAP = {
  [ON_CHAIN_CONDITIONS.USER_HOLDS_TOKEN]: [
    ON_CHAIN_CONDITION_PARTS.CONTRACT_ADDRESS,
    ON_CHAIN_CONDITION_PARTS.BLOCKCHAIN,
    ON_CHAIN_CONDITION_PARTS.AMOUNT,
    ON_CHAIN_CONDITION_PARTS.LINK_TO_COMPLETION,
    ON_CHAIN_CONDITION_PARTS.TOKEN_NAME,
    ON_CHAIN_CONDITION_PARTS.IS_NATIVE_TOKEN,
  ],
  [ON_CHAIN_CONDITIONS.USER_HOLDS_NFT]: [
    ON_CHAIN_CONDITION_PARTS.BLOCKCHAIN,
    ON_CHAIN_CONDITION_PARTS.CONTRACT_ADDRESS,
    ON_CHAIN_CONDITION_PARTS.TOKEN_ID,
    ON_CHAIN_CONDITION_PARTS.NFT_PREVIEW,
    ON_CHAIN_CONDITION_PARTS.LINK_TO_COMPLETION,
  ],
  [ON_CHAIN_CONDITIONS.USER_HOLDS_POAP]: [
    ON_CHAIN_CONDITION_PARTS.BLOCKCHAIN,
    ON_CHAIN_CONDITION_PARTS.CONTRACT_ADDRESS,
    ON_CHAIN_CONDITION_PARTS.TOKEN_ID,
    ON_CHAIN_CONDITION_PARTS.EVENT_URL,
    ON_CHAIN_CONDITION_PARTS.NFT_PREVIEW,
    ON_CHAIN_CONDITION_PARTS.LINK_TO_COMPLETION,
  ],
  [ON_CHAIN_CONDITIONS.TOKEN_NFT_POAP_NATIVE_TRANSFERS]: [
    ON_CHAIN_CONDITION_PARTS.BLOCKCHAIN,
    ON_CHAIN_CONDITION_PARTS.CONTRACT_ADDRESS,
    ON_CHAIN_CONDITION_PARTS.SENDER_ADDRESS,
    ON_CHAIN_CONDITION_PARTS.RECEIVER_ADDRESS,
    ON_CHAIN_CONDITION_PARTS.AMOUNT,
    ON_CHAIN_CONDITION_PARTS.LINK_TO_COMPLETION,
  ],
  [ON_CHAIN_CONDITIONS.TX_NOT_DONE]: [
    ON_CHAIN_CONDITION_PARTS.BLOCKCHAIN,
    ON_CHAIN_CONDITION_PARTS.CONTRACT_ADDRESS,
    ON_CHAIN_CONDITION_PARTS.LINK_TO_COMPLETION,
  ],
  [ON_CHAIN_CONDITIONS.NATIVE_TOKEN_TRANSFERS]: [
    ON_CHAIN_CONDITION_PARTS.BLOCKCHAIN,
    ON_CHAIN_CONDITION_PARTS.SENDER_ADDRESS,
    ON_CHAIN_CONDITION_PARTS.RECEIVER_ADDRESS,
    ON_CHAIN_CONDITION_PARTS.AMOUNT,
    ON_CHAIN_CONDITION_PARTS.LINK_TO_COMPLETION,
  ],
  [ON_CHAIN_CONDITIONS.ANY_CHAIN_ACTION]: [
    ON_CHAIN_CONDITION_PARTS.BLOCKCHAIN,
    ON_CHAIN_CONDITION_PARTS.CONTRACT_ADDRESS,
    ON_CHAIN_CONDITION_PARTS.CURRENCY_ADDRESS,
    ON_CHAIN_CONDITION_PARTS.AMOUNT,
    ON_CHAIN_CONDITION_PARTS.LINK_TO_COMPLETION,
  ],
  [ON_CHAIN_CONDITIONS.USER_HAS_ENS_DOMAIN]: [
    ON_CHAIN_CONDITION_PARTS.BLOCKCHAIN,
    ON_CHAIN_CONDITION_PARTS.LINK_TO_COMPLETION,
  ],
  [ON_CHAIN_CONDITIONS.USER_HAS_ERC_20_TOKENS]: [
    ON_CHAIN_CONDITION_PARTS.BLOCKCHAIN,
    ON_CHAIN_CONDITION_PARTS.LINK_TO_COMPLETION,
  ],
  [ON_CHAIN_CONDITIONS.USER_HAS_NATIVE_TOKEN_BALANCE]: [
    ON_CHAIN_CONDITION_PARTS.BLOCKCHAIN,
    ON_CHAIN_CONDITION_PARTS.LINK_TO_COMPLETION,
  ],
  [ON_CHAIN_CONDITIONS.USER_HAS_ERC_721_AND_ERC_1155_TOKENS]: [
    ON_CHAIN_CONDITION_PARTS.BLOCKCHAIN,
    ON_CHAIN_CONDITION_PARTS.LINK_TO_COMPLETION,
  ],
  [ON_CHAIN_CONDITIONS.INTERACTED_WITH_BLOCKCHAIN]: [
    ON_CHAIN_CONDITION_PARTS.BLOCKCHAIN,
    ON_CHAIN_CONDITION_PARTS.LINK_TO_COMPLETION,
  ],
};

export const fieldInTheFormScope = (value, selectedCondition) =>
  ON_CHAIN_CONDITION_PARTS_MAP[selectedCondition.value].find((field) => field === value);

export const getConditionDescription = (condition) => {
  const values = getConditionValues(condition);

  switch (condition.name) {
    case ON_CHAIN_CONDITIONS.USER_HOLDS_TOKEN: {
      const { amount = 0, blockchain, tokenName, isNativeToken } = values;
      const token = isNativeToken === 'true' ? getNativeToken(blockchain)?.symbol : tokenName;
      return `You must hold at least <span style="font-weight: 500">${amount} ${
        token ? token : 'token'
      } 
        </span> on <span style="font-weight: 500">${blockchain}</span>.`;
    }
    case ON_CHAIN_CONDITIONS.USER_HOLDS_NFT: {
      const { blockchain, token_id, contract_address, nftName } = values;
      return `You must hold <span style="font-weight: 500">${token_id ? `#${token_id}` : 'any'} ${
        nftName ? nftName : `${contract_address} NFT`
      }</span> on <span style="font-weight: 500">${blockchain}</span>.`;
    }
    case ON_CHAIN_CONDITIONS.USER_HOLDS_POAP: {
      const { blockchain, token_id, nftName } = values;
      return `You must hold <span style="font-weight: 500">${token_id ? `#${token_id}` : 'any'} ${
        nftName || 'POAP'
      }</span> on <span style="font-weight: 500">${blockchain}</span>.`;
    }
    case ON_CHAIN_CONDITIONS.TX_NOT_DONE: {
      const { blockchain, contract_address } = values;
      return `You must interact with <span style="font-weight: 500">${contract_address}</span> on <span style="font-weight: 500">${blockchain}</span> at least once.`;
    }
    case ON_CHAIN_CONDITIONS.USER_HAS_ENS_DOMAIN: {
      const { blockchain } = values;
      return `You must have ENS Domain on <span style="font-weight: 500">${blockchain}</span>.`;
    }
    case ON_CHAIN_CONDITIONS.INTERACTED_WITH_BLOCKCHAIN: {
      const { blockchain } = values;
      return `You must have at least 1 transaction on ${blockchain}.`;
    }
    default: {
      return condition.name;
    }
  }
};

export const getConditionValues = (condition) => {
  return condition.chain_condition_fields.reduce(
    (res, field) => ({
      ...res,
      [field.name]:
        field.name === 'blockchain'
          ? blockchains.find((b) => b.value === field.value)?.name || field.value
          : field.value,
    }),
    {},
  );
};

export const getConditionName = (condition) => {
  switch (condition.name) {
    case ON_CHAIN_CONDITIONS.USER_HOLDS_TOKEN:
      return 'Hold Token';
    case ON_CHAIN_CONDITIONS.USER_HOLDS_NFT:
      return 'Hold NFT';
    case ON_CHAIN_CONDITIONS.USER_HOLDS_POAP:
      return 'Hold POAP';
    case ON_CHAIN_CONDITIONS.TX_NOT_DONE:
      return 'Interact with contract';
    case ON_CHAIN_CONDITIONS.USER_HAS_ENS_DOMAIN:
      return 'Have ENS domain';
    case ON_CHAIN_CONDITIONS.INTERACTED_WITH_BLOCKCHAIN:
      return 'Interact with blockchain';
    default:
      return condition.name;
  }
};

export const getConditionButtonLabel = (condition) => {
  const values = getConditionValues(condition);

  if (values.actionButtonTitle) return values.actionButtonTitle;

  switch (condition.name) {
    case ON_CHAIN_CONDITIONS.USER_HOLDS_TOKEN: {
      const { amount, blockchain, tokenName, isNativeToken } = values;
      const token = isNativeToken === 'true' ? getNativeToken(blockchain)?.symbol : tokenName;

      return `You must hold at least ${amount || 0} ${token || 'tokens'} on ${blockchain}`;
    }
    case ON_CHAIN_CONDITIONS.USER_HOLDS_NFT: {
      const { blockchain } = values;
      return `Buy NFT on ${blockchain}`;
    }
    case ON_CHAIN_CONDITIONS.USER_HOLDS_POAP: {
      const { blockchain, token_id } = values;
      return `Buy POAP on ${blockchain}`;
    }
    case ON_CHAIN_CONDITIONS.TX_NOT_DONE: {
      const { blockchain } = values;
      return `Interact with contract on ${blockchain}.`;
    }
    case ON_CHAIN_CONDITIONS.USER_HAS_ENS_DOMAIN: {
      const { blockchain } = values;
      return `Register ENS Domain on ${blockchain}`;
    }
    case ON_CHAIN_CONDITIONS.INTERACTED_WITH_BLOCKCHAIN: {
      const { blockchain } = values;
      return `Make a transaction on ${blockchain}`;
    }
    default: {
      return condition.name;
    }
  }
};

export const getConditionButtonLink = (condition) => {
  const values = getConditionValues(condition);
  return values?.actionButtonLink;
};

export const conditionStatuses = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
};

export const getNativeToken = (blockchain) => {
  if (blockchain === 'BNB Chain') {
    blockchain = 'Binance';
  }
  return Object.values(CHAIN_INFO).find((i) => i.label === blockchain)?.nativeCurrency;
};

export const getChainIcon = (blockchain) => {
  if (blockchain === 'BNB Chain') {
    blockchain = 'BSC Test';
  }
  return blockchain;
};

export const appendCreateOnchainTaskCondition = (formData, onChainValues) => {
  const getValuesOnChain = {
    [ON_CHAIN_CONDITION_PARTS.CONTRACT_ADDRESS]: onChainValues.value?.contractAddress,
    [ON_CHAIN_CONDITION_PARTS.BLOCKCHAIN]: onChainValues.value?.selectedBlockchain?.value,
    [ON_CHAIN_CONDITION_PARTS.SENDER_ADDRESS]: onChainValues.value?.senderAddress,
    [ON_CHAIN_CONDITION_PARTS.RECEIVER_ADDRESS]: onChainValues.value?.receiverAddress,
    [ON_CHAIN_CONDITION_PARTS.AMOUNT]: onChainValues.value?.amountCondition,
    [ON_CHAIN_CONDITION_PARTS.CURRENCY_ADDRESS]: onChainValues.value?.currencyAddress,
    [ON_CHAIN_CONDITION_PARTS.TOKEN_ID]: onChainValues.value?.tokenId,
    [ON_CHAIN_CONDITION_PARTS.TOKEN_NAME]: onChainValues.value?.conditionTokenName,
    [ON_CHAIN_CONDITION_PARTS.LINK_TO_COMPLETION]: {
      actionButtonLink: onChainValues.value?.actionButtonLink,
      actionButtonTitle: onChainValues.value?.actionButtonTitle,
    },
    [ON_CHAIN_CONDITION_PARTS.IS_NATIVE_TOKEN]: onChainValues.value?.isNativeToken,
    [ON_CHAIN_CONDITION_PARTS.NFT_PREVIEW]: {
      imgUrl: onChainValues.value?.nftPreview,
      nftName: onChainValues.value?.nftName,
    },
  };

  let conditionIndex = 0;
  ON_CHAIN_CONDITION_PARTS_MAP[onChainValues.value?.selectedCondition.value].forEach((key) => {
    const value = getValuesOnChain[key];
    if (value) {
      if (typeof value !== 'object') {
        formData.append(`chain_condition[fields][${conditionIndex}][name]`, key);
        formData.append(`chain_condition[fields][${conditionIndex}][value]`, value);
      } else {
        Object.keys(value).forEach((k) => {
          if (value[k]) {
            formData.append(`chain_condition[fields][${conditionIndex}][name]`, k.toString());
            formData.append(
              `chain_condition[fields][${conditionIndex}][value]`,
              value[k].toString(),
            );
            conditionIndex++;
          }
        });
      }
      conditionIndex++;
    }
  });

  formData.append('chain_condition[name]', onChainValues.value?.selectedCondition.value);
  formData.append('chain_condition[type]', 'main');
  formData.append('type_task', 'on-chain');
};

export const appendCreateOnchainTaskGate = (formData, gateConditions) => {
  gateConditions.value.forEach((c, index) => {
    formData.append(`gate_conditions[${index}][name]`, c.id);
    formData.append(`gate_conditions[${index}][type]`, 'gate');
    Object.keys(c.values).forEach((key, vindex) => {
      if (c.values[key]) {
        formData.append(`gate_conditions[${index}][fields][${vindex}][name]`, key);
        formData.append(
          `gate_conditions[${index}][fields][${vindex}][value]`,
          c.values[key].toString(),
        );
      }
    });
  });
};
