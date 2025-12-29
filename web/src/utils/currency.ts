// Currency mapping based on phone number prefixes
const CURRENCY_MAP: Record<string, CurrencySymbol> = {
  '+91': '₹', // India
  '+44': '£', // UK
};

// Default currency symbol
const DEFAULT_CURRENCY: CurrencySymbol = '$';

/**
 * Detects the currency symbol based on the phone number prefix.
 * @param phoneNumber - The full phone number string (e.g., "+91 1234567890" or "+1 1234567890")
 * @returns The currency symbol for the detected country or default "$"
 */
export function detectCurrencyFromPhone(phoneNumber: string | null | undefined): CurrencySymbol {
  console.log("detectCurrencyFromPhone called with:", phoneNumber);

  // Explicit input validation
  if (phoneNumber === null || phoneNumber === undefined || phoneNumber.trim() === '') {
    console.log("Invalid or empty phone number, returning default:", DEFAULT_CURRENCY);
    return DEFAULT_CURRENCY;
  }

  // Extract the country code (handles both "+91 123..." and "+1123..." formats)
  const countryCodeMatch = phoneNumber.match(/^(\+\d+)\s/);
  if (countryCodeMatch) {
    const countryCode = countryCodeMatch[1];
    const currency = CURRENCY_MAP[countryCode] || DEFAULT_CURRENCY;
    console.log("Space-separated format detected. Country code:", countryCode, "Currency:", currency);
    return currency;
  }

  // Fallback for direct format like "+911234567890"
  const directMatch = phoneNumber.match(/^\+(\d+)/);
  if (directMatch) {
    const countryCode = `+${directMatch[1]}`;
    const currency = CURRENCY_MAP[countryCode] || DEFAULT_CURRENCY;
    console.log("Direct format detected. Country code:", countryCode, "Currency:", currency);
    return currency;
  }

  console.log("No country code match found, returning default:", DEFAULT_CURRENCY);
  return DEFAULT_CURRENCY;
}

/**
 * Stores the currency symbol in localStorage.
 * @param currency - The currency symbol to store
 */
export function setCurrencyInStorage(currency: CurrencySymbol): void {
  localStorage.setItem('userCurrency', currency);
}

/**
 * Retrieves the currency symbol from localStorage.
 * @returns The stored currency symbol or default "$" if not found
 */
export function getCurrencyFromStorage(): CurrencySymbol {
  return (localStorage.getItem('userCurrency') as CurrencySymbol) || DEFAULT_CURRENCY;
}

/**
 * Initializes currency to default if not set (for new users who bypass signup/login)
 */
export function initializeDefaultCurrency(): void {
  if (!localStorage.getItem('userCurrency')) {
    setCurrencyInStorage(DEFAULT_CURRENCY);
  }
}

/**
 * Combined function to detect and store currency from phone number.
 * @param phoneNumber - The phone number to detect currency from
 */
export function detectAndStoreCurrency(phoneNumber: string | null | undefined): void {
  const currency = detectCurrencyFromPhone(phoneNumber);
  setCurrencyInStorage(currency);
}

// Type for currency symbol
export type CurrencySymbol = '$' | '₹' | '£';

// Debug function to test currency detection
export function testCurrencyDetection(phoneNumber: string | null | undefined): void {
  console.log("Testing currency detection for:", phoneNumber);
  const result = detectCurrencyFromPhone(phoneNumber);
  console.log("Result:", result);
}
