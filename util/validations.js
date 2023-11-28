export const oneUpperCase = () => {
  return /(?=.*?[A-Z])/;
};
export const oneLowerCase = () => {
  return /(?=.*?[a-z])/;
};
export const oneDigit = () => {
  return /(?=.*?[0-9])/;
};
export const minimumLength = () => {
  return /.{10,}/;
};
export const usernameMedium = () => {
  return /^[/:.\w\d@]+$/;
};

export const usernameTelegram = () => {
  return /^@[a-zA-Z0-9_]+$/;
};
export const usernameTwitter = () => {
  return /(^|[^@\w])@(\w{1,15})\b/i;
};
export const usernameDiscord = () => {
  return /^[\w\d]{2,32}#\d{4}$/;
};
export const usernameLinkedIn = () => {
  return /^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w\-_]+\/?$/;
};
export default {
  minimumLength,
  oneUpperCase,
  oneLowerCase,
  oneDigit,
  usernameTelegram,
  usernameTwitter,
  usernameDiscord,
  usernameLinkedIn,
};

export const telegramChatId = () => {
  return /(-100[0-9]+)|(@[a-zA-Z0-9_-]*)/i;
};

export const parseChatId = (chatId) => {
  let fmtChatId = chatId;
  if (fmtChatId.includes('https://t.me/') && !fmtChatId.includes('https://t.me/c/')) {
    fmtChatId = fmtChatId.replace('https://t.me/', '');
  }

  // if (chatId.includes('https://t.me/c/')) {
  //   chatId = chatId.replace('https://t.me/c/', '');
  //   const index = chatId.indexOf('/');
  //   if (index) {
  //     chatId = chatId.slice(0, index);
  //   }
  // }

  if (fmtChatId.includes('t.me/') && !fmtChatId.includes('https://')) {
    fmtChatId = fmtChatId.replace('t.me/', '');
  }

  const testOnlyNumber = /^-\d*\.?\d+$/.test(fmtChatId);
  if (!fmtChatId.includes('@') && !testOnlyNumber) {
    fmtChatId = '@' + fmtChatId;
  }

  return {
    chatId: fmtChatId,
    isValid: telegramChatId().test(fmtChatId),
  };
};

export const getChainAddressValidationRegexp = (blockchain) => {
  switch (blockchain) {
    case 'Solana':
      return new RegExp(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/); //Solana
    default:
      return new RegExp(/^0x[a-fA-F0-9]{40}$/); //EVM
  }
};