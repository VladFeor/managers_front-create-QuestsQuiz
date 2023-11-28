import { ON_CHAIN_CONDITION_ADDRESSES_NAME, ON_CHAIN_CONDITION_PARTS } from './utils.js';

// export const solanaRegexp = new RegExp(!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/);
export const evmRegex = new RegExp(/^0x[a-fA-F0-9]{40}$/);

export const validationTokenId = (value) => {
  let data = { isError: false, text: '' };

  if (!!value && (+value < 0 || `${value}`.includes('-'))) {
    data.isError = true;
    data.text = 'Token ID field must be more than 0';
  }
  if (!value || `${value}`.trim() === '') {
    return data;
  }

  return data;
};

export const validationAmount = (value) => {
  let data = { isError: false, text: '' };

  if (!value || +value <= 0 || `${value}`.includes('-')) {
    data.isError = true;
    data.text = 'This field cannot be negative';
  }

  if (!value) {
    data.isError = true;
    data.text = 'This field can not be blank';
    return data;
  }
  return data;
};

export const validationAddress = (address, addressToCheckForIdentity, addressName) => {
  let data = { isError: false, text: '' };

  const trimmedAddress = address.trim();
  const trimmedAddressToCheckForIdentity = addressToCheckForIdentity.trim();

  if (ON_CHAIN_CONDITION_PARTS.CURRENCY_ADDRESS === addressName && !trimmedAddress) {
    return data;
  }

  if (!trimmedAddress) {
    data.isError = true;
    data.text = `This field can not be blank`;
    return data;
  }
  if (!evmRegex.test(address)) {
    data.isError = true;
    data.text = `Please enter a valid ${ON_CHAIN_CONDITION_ADDRESSES_NAME[addressName]} Address`;
    return data;
  }
  if (trimmedAddressToCheckForIdentity && trimmedAddress === trimmedAddressToCheckForIdentity) {
    data.isError = true;
    data.text = `${ON_CHAIN_CONDITION_ADDRESSES_NAME[addressName]} ${textErrorForAddress[addressName]}`;
    return data;
  }

  return data;
};

const textErrorForAddress = {
  [ON_CHAIN_CONDITION_PARTS.CONTRACT_ADDRESS]: 'Address cannot be the same as Currency Address',
  [ON_CHAIN_CONDITION_PARTS.SENDER_ADDRESS]: 'Address cannot be the same as Receiver Address',
  [ON_CHAIN_CONDITION_PARTS.RECEIVER_ADDRESS]: 'Address cannot be the same as Sender Address',
  [ON_CHAIN_CONDITION_PARTS.CURRENCY_ADDRESS]: 'Address cannot be the same as Contract Address',
};
