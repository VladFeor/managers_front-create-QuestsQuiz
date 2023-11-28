export const clearBaseTableSortCache = () => {
  localStorage.sortDirection = '';
  localStorage.sortColumn = null;
};

export const getProperty = (obj, prop) => {
  const props = prop.split('.');
  const regex = /\[(\d+)\]/;

  return props.reduce((prev, curr) => {
    const matches = regex.exec(curr);
    if (matches) {
      const index = parseInt(matches[1]);
      const arrProp = curr.slice(0, matches.index);
      return prev[arrProp][index];
    } else {
      return prev && prev[curr];
    }
  }, obj);
};

export const getTaskStatus = (status) => {
  console.log('getTaskStatus', status);
  switch (status) {
    case 'available':
      return 'Available';
    case 'upcoming':
      return 'Upcomig';
    case 'overdue':
    case 'overdue_by_manager':
      return 'Overdue';
    case 'finished':
    case 'done':
      return 'Done';
    case 'rejected':
      return 'Rejected';
    case 'waiting_for_review':
      return 'Pending';
    case 'on_revision':
      return 'On Revision';
    case 'in_progress':
      return 'In Progress';
    case 'returned':
      return 'Returned';

    default:
      return '';
  }
};

export function isValidHttpUrl(str) {
  let regex = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', // fragment locator
    'i',
  );

  if (str == null) {
    return false;
  } else if (str.includes('http://')) {
    str = str.slice(7);
  } else if (str.includes('https://')) {
    str = str.slice(8);
  }

  return regex.test(str) === true;
}

// export const getTaskStatus = (status) => {
//   switch (status) {
//     case 'available':
//       return 'Available';
//     case 'upcoming':
//       return 'Upcomig';
//     case 'overdue':
//     case 'overdue_by_manager':
//       return 'Overdue';
//     case 'finished':
//     case 'done':
//       return 'Done';
//     case 'waiting_for_review':
//       return 'Pending';
//     case 'on_revision':
//       return 'On Revision';

//     default:
//       return '';
//   }
// };

export function sanitizeHtml(html) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;

  const styleTags = wrapper.querySelectorAll('style');
  styleTags.forEach((tag) => tag.remove());

  const elementsWithClass = wrapper.querySelectorAll('[class]');
  elementsWithClass.forEach((element) => {
    element.removeAttribute('class');
  });

  return wrapper.innerHTML;
}

export function replaceWordsWithEmptyString(str, words) {
  const regex = new RegExp(words.join('|'), 'gi');
  return str.replace(regex, '');
}

export function removeTagsStylesClasses(html) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;

  const removeAttributesRecursively = (element) => {
    const attributes = element.attributes;
    for (let i = attributes.length - 1; i >= 0; i--) {
      const attributeName = attributes[i].name;
      if (attributeName !== 'role') {
        element.removeAttribute(attributeName);
      }
    }

    const childNodes = element.childNodes;
    for (let i = childNodes.length - 1; i >= 0; i--) {
      const childNode = childNodes[i];
      if (childNode.nodeType === Node.ELEMENT_NODE) {
        removeAttributesRecursively(childNode);
      }
    }
  };

  const elementsWithStyle = wrapper.querySelectorAll('[style]');
  elementsWithStyle.forEach((element) => {
    element.removeAttribute('style');
  });

  const elementsWithClass = wrapper.querySelectorAll('[class]');
  elementsWithClass.forEach((element) => {
    element.removeAttribute('class');
  });

  removeAttributesRecursively(wrapper);

  return wrapper.innerHTML;
}

export function getTooltipTime(dateStr) {
  const date = new Date(dateStr);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function dateToTimestamp(dateString) {
  const date = new Date(dateString);
  return date.getTime() / 1000;
}

export function timestampToString(timestamp) {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);

  const formattedString =
    year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
  return formattedString;
}

export function isMoreThan3Days(now) {
  const nowDate = new Date(now);

  const currentDate = new Date();

  const diffMs = currentDate.getTime() - nowDate.getTime();

  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays.toFixed(0) >= 3;
}

export function isLessThan3DaysLeft(targetDate) {
  const now = new Date();
  const target = new Date(targetDate);

  const diffMs = target.getTime() - now.getTime();

  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays.toFixed(0) <= 3;
}

export function isLessThan3HoursLeft(targetDate) {
  const now = new Date();
  const target = new Date(targetDate);

  const diffMs = target.getTime() - now.getTime();

  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours.toFixed(0) <= 3;
}

export function formatDateMonthNameAndDay(value, year = false) {
  const date = new Date(value);
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  if (year) {
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  return `${monthNames[date.getMonth()]} ${date.getDate()}`;
}

export function formatPastDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();

  const timeDiff = now.getTime() - date.getTime();

  if (timeDiff < 60 * 60 * 1000) {
    const minutesDiff = Math.round(timeDiff / (60 * 1000));
    return minutesDiff + ' m';
  }

  if (timeDiff < 24 * 60 * 60 * 1000) {
    const hoursDiff = Math.round(timeDiff / (60 * 60 * 1000));
    return hoursDiff + ' h';
  }

  if (timeDiff < 365 * 24 * 60 * 60 * 1000) {
    const daysDiff = Math.round(timeDiff / (24 * 60 * 60 * 1000));
    return daysDiff + ' d';
  }

  const yearsDiff = Math.floor(timeDiff / (365 * 24 * 60 * 60 * 1000));
  const remainingDays = Math.floor(
    (timeDiff % (365 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000),
  );

  if (yearsDiff > 0) {
    return yearsDiff + ' y';
  }

  return remainingDays + ' d';
}

export function formatFutureDate(dateStr) {
  const isValidDate = (date) => !isNaN(date.getTime());

  const date = new Date(dateStr);
  if (!isValidDate(date)) {
    return 'Invalid Date';
  }

  const now = new Date();

  if (date.getTime() < now.getTime()) {
    return '0 h';
  }

  const timeDiff = date.getTime() - now.getTime();

  if (timeDiff < 24 * 60 * 60 * 1000) {
    const hoursDiff = Math.round(timeDiff / (60 * 60 * 1000));
    return hoursDiff + ' h';
  }

  if (timeDiff < 30 * 24 * 60 * 60 * 1000) {
    const daysDiff = Math.round(timeDiff / (24 * 60 * 60 * 1000));
    return daysDiff + ' d';
  }

  if (timeDiff < 365 * 24 * 60 * 60 * 1000) {
    const monthsDiff = Math.round(timeDiff / (30 * 24 * 60 * 60 * 1000));
    return monthsDiff + ' m';
  }

  if (timeDiff >= 365 * 24 * 60 * 60 * 1000) {
    const yearsDiff = Math.floor(timeDiff / (365 * 24 * 60 * 60 * 1000));
    return yearsDiff + ' y';
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const formattedDate = formatter.format(date);

  return formattedDate;
}

// export function formatFutureDate(dateStr) {
//   const date = new Date(dateStr);
//   const now = new Date();

//   if (date.getTime() < now.getTime()) {
//     return 0 + ' h';
//   }

//   const timeDiff = date.getTime() - now.getTime();

//   if (timeDiff < 24 * 60 * 60 * 1000) {
//     const hoursDiff = Math.round(timeDiff / (60 * 60 * 1000));
//     return hoursDiff + ' h';
//   }

//   if (timeDiff < 30 * 24 * 60 * 60 * 1000) {
//     const daysDiff = Math.round(timeDiff / (24 * 60 * 60 * 1000));
//     return daysDiff + ' d';
//   }

//   if (timeDiff < 365 * 24 * 60 * 60 * 1000) {
//     const monthsDiff = Math.round(timeDiff / (30 * 24 * 60 * 60 * 1000));
//     return monthsDiff + ' m';
//   }

//   if (timeDiff >= 365 * 24 * 60 * 60 * 1000) {
//     const yearsDiff = Math.floor(timeDiff / (365 * 24 * 60 * 60 * 1000));
//     return yearsDiff + ' y';
//   }

//   const formatter = new Intl.DateTimeFormat('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//   });

//   const formattedDate = formatter.format(date);

//   return formattedDate;
// }

export function formatDateCurrent(date) {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  const formattedDate = new Date(date).toLocaleDateString('en-US', options);
  return formattedDate;
}

export function formatDate(date) {
  const options = { month: 'short', day: 'numeric' };
  const formattedDate = new Date(date).toLocaleDateString('en-US', options);

  // Check if the date is from the current year
  const currentYear = new Date().getFullYear();
  const isCurrentYear = new Date(date).getFullYear() === currentYear;

  if (isCurrentYear) {
    // Return the formatted date without the year
    return formattedDate;
  } else {
    // Return the formatted date with the year
    return new Date(date).toLocaleDateString('en-US', { ...options, year: 'numeric' });
  }
}

export function formatNumber(num, decimals) {
  if (!num) return;
  if (num >= 10000) {
    const formattedNum = (num / 1000).toFixed(0);
    return formattedNum.replace(/\.0$/, '') + 'K';
  } else if (num >= 1000) {
    if (decimals) {
      return (
        num.toString().substr(0, 1) + ',' + Number(num.toString().substr(1)).toFixed(+decimals)
      );
    } else {
      return num.toString().substr(0, 1) + ',' + num.toString().substr(1);
    }
  } else if (decimals && num.toString().length > decimals) {
    return parseFloat(num.toString().substring(0, decimals));
  } else if (num < 1000 && String(num).includes('.')) {
    return String(Number(num).toFixed(1));
  } else if (Math.abs(num) < 0.01 && !decimals) {
    return 0;
  } else {
    return num.toString();
  }
}

export function formatNumberAddComma(num) {
  if (num >= 100000) {
    return num.toString().substr(0, 3) + ',' + num.toString().substr(3);
  } else if (num >= 10000) {
    return num.toString().substr(0, 2) + ',' + num.toString().substr(2);
  } else if (num >= 1000) {
    return num.toString().substr(0, 1) + ',' + num.toString().substr(1);
  } else {
    return num.toString();
  }
}

export function formatNumberMore10K(num) {
  if (num >= 10000) {
    const formattedNum = (num / 1000).toFixed(0);
    return formattedNum.replace(/\.0$/, '') + 'K';
  } else {
    return num.toString();
  }
}

export function reduceStringLength(str = '', maxLength) {
  if (!str) return '';
  if (str.toString().length <= maxLength) {
    return str;
  } else {
    return str.slice(0, maxLength) + '...';
  }
}

export const getBadgeTypeByName = (name) => {
  switch (name) {
    case 'Social influence':
      return 'success';
    case 'Content making':
      return 'mint';
    case 'Design':
      return 'primary';
    case 'Copywriting':
      return 'info';
    case 'Testing':
      return 'warning';
    case 'Development':
      return 'danger';
    case 'All':
      return 'all';
    case 'All Directions':
    case 'All directions':
      return 'default';
    default:
      return 'default';
  }
};

export const getBadgeTypeDirectionsByName = (name) => {
  switch (name) {
    case 'Social influence':
      return 'success';
    case 'Content making':
      return 'mint';
    case 'Design':
      return 'primary';
    case 'Copywriting':
      return 'info';
    case 'Testing':
      return 'warning';
    case 'Development':
      return 'danger';
    case 'All':
      return 'default';
    case 'All Directions':
    case 'All directions':
      return 'default';
    default:
      return 'default';
  }
};

export const getLinkPathByName = (name) => {
  switch (name) {
    case 'projects':
      return '/projects';
    case 'talents':
      return '/leaderboard';
    case 'active talents':
      return '/leaderboard';
    case 'managers':
      return '/managers';

    case 'pending directions':
      return '/requests';
    case 'reviewed tasks':
      return '/tasks';
    case 'created tasks':
      return '/tasks';
    case 'overdue tasks':
      return '/tasks';
    case 'overdue':
      return '/tasks';
    case 'on revision':
      return '/tasks';
    default:
      return '/';
  }
};
export const getIconByName = (name) => {
  switch (name) {
    case 'projects':
      return 'Project';
    case 'talents':
      return 'Talents';
    case 'joining talents':
      return 'Talents';
    case 'pending directions':
      return 'Direction';
    case 'pending claims':
      return 'Wallet';
    case 'managers':
      return 'Managers';
    case 'reviewed tasks':
      return 'Tik-Tik';
    case 'USDT paid':
      return 'Usdt';
    case 'overdue':
    case 'overdue tasks':
      return 'Mark-Warn';
    case 'active talents':
      return 'Star-01';
    case 'created tasks':
      return 'Tasks';
    case 'joined projects':
      return 'Star-01';
    case 'on revision':
      return 'View';
    default:
      return '';
  }
};

export const getColorByClassName = (name) => {
  switch (name) {
    case 'success':
      return '#3ea33b';
    case 'mint':
      return '#25b8ae';
    case 'primary':
      return '#a94dd6';
    case 'warning':
      return '#a37800';
    case 'danger':
      return '#d64d69';
    case 'all':
      return '#AAA7CC';
    case 'info':
      return '#4979CC';
    default:
      return '#3ea33b';
  }
};

export function keyRandom() {
  return Math.floor(Math.random() * 10000) + Date.now();
}

export function checkIsPropertyExist(obj, prop) {
  if (obj) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  } else return false;
}

export function modifyStringSpaces(inputStr) {
  let outputStr = inputStr.toLowerCase();
  outputStr = outputStr.replace(/\s+/g, '_');
  return outputStr;
}

export function transformDate(dateString) {
  const inputFormat =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$|^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/;

  if (!inputFormat.test(dateString)) {
    return dateString; // Return original string if it doesn't match the expected format
  }

  const today = new Date();

  const eventDate = new Date(dateString);
  const isToday = eventDate.getTime() === today.getTime();

  if (isToday) {
    return formatTransformDate(today);
  } else {
    return formatTransformDate(eventDate);
  }
}

function formatTransformDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const convertToCSVObject = (objArray) => {
  const headers = Object.keys(objArray[0]);
  const csvContent =
    headers.join(',') +
    '\n' +
    objArray.map((obj) => headers.map((key) => obj[key]).join(',')).join('\n');
  return csvContent;
};

export const convertToCSV = (dataArray) => {
  const csvContent = dataArray.map((item) => item).join('\n');
  return csvContent;
};

export const getBlockchainIcon = (name) => {
  switch (name) {
    case 'BSC':
      return 'Binance-USD-Default';
    case 'Ethereum':
      return 'Ethereum-Default';
    case 'Optimism':
      return 'Optimism-Default';
    default:
      return `${name}-Default`;
  }
};

export function addDaysToDate(dateString, days) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);

  return date.toISOString();
}

export function areArraysDifferent(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return true;
  }

  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();

  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return true;
    }
  }

  return false;
}

export function getCuttencyIcon(currency) {
  switch (currency) {
    case 'eth':
      return 'Ethereum-Circle';
    case 'bnb':
      return 'BNB-Circle';
    case 'btc':
      return 'Bitcoin-SV-Circle';
    case 'cplt':
      return 'USDT-Circle';
    case 'aave':
      return 'Aave-Circle';
    case 'discord':
      return 'Discord-Circle';
    default:
      return 'USDD-Default';
  }
}

export const isTaskHasList = (text) => {
  if (!text) return false;
  if (text.includes('<ul>') || text.includes('<ol>')) return true;
  else return false;
};

export const isTaskHasLongWord = (text) => {
  if (!text) return false;
  const words = text.split(' ');
  let isActive = false;
  for (const word of words) {
    if (word.length > 75) {
      isActive = true;
    }
  }
  return isActive;
};

// export function addLinksToText(text) {
//   const linkRegex = /(https?:\/\/[^\s]+)/g;

//   text = text.replace(linkRegex, (match) => {
//     const checkedLink = match.replace(/<\/?p(?:\s+.*?)?>/g, '');
//     return `<a href="${checkedLink}" class="task-link-wrapper" target="_blank">${checkedLink}</a>`;
//   });

//   return text;
// }

export function addLinksToText(text, list = true) {
  const linkRegex = /(<a[^>]*>.*?<\/a>|https?:\/\/[^\s<]+)/g;

  text = text.replace(linkRegex, (match) => {
    if (match.startsWith('<a')) {
      return match;
    }
    const checkedLink = match.replace(/<\/?p(?:\s+.*?)?>/g, '');
    return `<a href="${checkedLink}" class="task-link-wrapper" target="_blank">${checkedLink}</a>`;
  });

  if (list) {
    text = text.replace(
      /<(ol|ul)([^>]*)>((?:.|\n)*?)<\/\1>/g,
      (match, tag, attributes, listContent) => {
        const updatedListContent = listContent.replace(/<li>(.*?)<\/li>/g, (liMatch, liContent) => {
          const checkedLink = liContent.replace(/<\/?p(?:\s+.*?)?>/g, '');
          if (checkedLink.match(linkRegex)) {
            return `<li>${addLinksToText(checkedLink)}</li>`;
          }
          return `<li>${checkedLink}</li>`;
        });
        return `<${tag} class="list-padding"${attributes}>${updatedListContent}</${tag}>`;
      },
    );
  }

  return text;
}
