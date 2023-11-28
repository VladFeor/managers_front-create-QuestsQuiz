import { isValidHttpUrl } from '~/util/helpers';
import { getChainAddressValidationRegexp } from '~/util/validations';

export const validateByKey = (key, value, options) => {
  switch (key) {
    case 'contractAddress': {
      if (!value?.length) {
        return 'This field can not be blank';
      }
      const regexp = getChainAddressValidationRegexp(options?.blockchain);
      if (!regexp.test(value)) {
        return 'Please enter a valid Token Contract Address';
      }
      break;
    }
    case 'tokenId': {
      if (!value?.length) {
        return 'Token ID cannot be empty';
      }
      if (Number(value) <= 0) {
        return 'Please enter a valid Token ID';
      }
      break;
    }
    case 'quantity': {
      const updValue = new Intl.NumberFormat().format(value)
      if(!updValue || !value) return 'Quantity cannot be empty'
      if (Number(value) <= 0) {
        return 'Quantity cannot less than 0 ';
      }
      if(Number(value).toString().match(/\.(\d+)/)?.[1].length > 5){
        return 'Please enter a valid Quantity ';
      }
      break;
    }
    case 'adressess': {
      if (!value?.length) {
        return 'This field can not be blank';
      }
      const adressess = value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
      if (!adressess.length) {
        return 'At least 1 adress should be present';
      }

      if (
        !adressess.every((v) => {
          const solanaRegexp = getChainAddressValidationRegexp('Solana');
          const evmRegexp = getChainAddressValidationRegexp();
          return solanaRegexp.test(v) || evmRegexp.test(v);
        })
      ) {
        return 'Please enter a valid Token Contract Address';
      }
      break;
    }
    case 'actionButtonLink': {
      if (value) {
        if (
          !value.startsWith('https://') ||
          !isValidHttpUrl(value) // freezes app if string lenght >= 28
        ) {
          return 'Please enter a valid URL';
        }
      }
      break;
    }
    case 'actionButtonTitle':{
      if(value) {
        if(value.length > 40) {
          return 'Maximal length is 40 characters'
        }
      }
    }
    default: {
      return true;
    }
  }
  return true;
};
