export function applyPhoneMask(value: string): string {
  const numbers = value.replace(/\D/g, '');
  
  const limitedNumbers = numbers.slice(0, 11);
  
  if (limitedNumbers.length <= 2) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 7) {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
  } else if (limitedNumbers.length <= 10) {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 6)}-${limitedNumbers.slice(6)}`;
  } else {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7)}`;
  }
}


export function removePhoneMask(value: string): string {
  return value.replace(/\D/g, '');
}


export function formatPhoneForDisplay(phone: string): string {
  if (!phone) return '';

  if (phone.includes('(') && phone.includes(')')) {
    return phone;
  }
  return applyPhoneMask(phone);
}

