// Currency mapping based on phone number prefixes
const CURRENCY_MAP: Record<string, CurrencySymbol> = {
  "+91": "₹", // India
  "+44": "£", // UK
};

// Default currency symbol
const DEFAULT_CURRENCY: CurrencySymbol = "$";

/**
 * Detects the currency symbol based on the phone number prefix.
 * @param phoneNumber - The full phone number string (e.g., "+91 1234567890" or "+1 1234567890")
 * @returns The currency symbol for the detected country or default "$"
 */
export function detectCurrencyFromPhone(
  phoneNumber: string | null | undefined,
): CurrencySymbol {
  // Explicit input validation
  if (
    phoneNumber === null ||
    phoneNumber === undefined ||
    phoneNumber.trim() === ""
  ) {
    return DEFAULT_CURRENCY;
  }

  // Extract the country code (handles both "+91 123..." and "+1123..." formats)
  const countryCodeMatch = phoneNumber.match(/^(\+\d+)\s/);
  if (countryCodeMatch) {
    const countryCode = countryCodeMatch[1];
    const currency = CURRENCY_MAP[countryCode] || DEFAULT_CURRENCY;
    return currency;
  }

  // Fallback for direct format like "+911234567890"
  const directMatch = phoneNumber.match(/^\+(\d+)/);
  if (directMatch) {
    const countryCode = `+${directMatch[1]}`;
    const currency = CURRENCY_MAP[countryCode] || DEFAULT_CURRENCY;
    return currency;
  }

  return DEFAULT_CURRENCY;
}

/**
 * Stores the currency symbol in localStorage.
 * @param currency - The currency symbol to store
 */
export function setCurrencyInStorage(currency: CurrencySymbol): void {
  localStorage.setItem("userCurrency", currency);
}

/**
 * Retrieves the currency symbol from localStorage.
 * @returns The stored currency symbol or default "$" if not found
 */
export function getCurrencyFromStorage(): CurrencySymbol {
  return (
    (localStorage.getItem("userCurrency") as CurrencySymbol) || DEFAULT_CURRENCY
  );
}

/**
 * Initializes currency to default if not set (for new users who bypass signup/login)
 */
export function initializeDefaultCurrency(): void {
  if (!localStorage.getItem("userCurrency")) {
    setCurrencyInStorage(DEFAULT_CURRENCY);
  }
}

/**
 * Combined function to detect and store currency from phone number.
 * @param phoneNumber - The phone number to detect currency from
 */
export function detectAndStoreCurrency(
  phoneNumber: string | null | undefined,
): void {
  const currency = detectCurrencyFromPhone(phoneNumber);
  setCurrencyInStorage(currency);
}

// Type for currency symbol
export type CurrencySymbol = "$" | "₹" | "£";

// Debug function to test currency detection
export function testCurrencyDetection(
  phoneNumber: string | null | undefined,
): void {
  detectCurrencyFromPhone(phoneNumber);
}

/**
 * Formats a numeric amount with comma separators and 2 decimal places.
 * Optionally prepends a currency symbol.
 *
 * @param value - The raw amount (number or numeric string). Pass "N/A" or null/undefined to get "N/A".
 * @param currencySymbol - Optional symbol to prepend (e.g. "₹", "$", "£").
 * @returns Formatted string like "₹ 218,241,320.00" or "N/A".
 *
 * @example
 * formatAmount("218241320.00", "₹") // → "₹ 218,241,320.00"
 * formatAmount(1500, "$")           // → "$ 1,500.00"
 * formatAmount("N/A")               // → "N/A"
 * formatAmount(null)                // → "N/A"
 */
export function formatAmount(
  value: number | string | null | undefined,
  currencySymbol?: string,
): string {
  if (value == null || value === "" || value === "N/A") return "N/A";
  const num = typeof value === "number" ? value : parseFloat(value as string);
  if (isNaN(num)) return "N/A";
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
  return currencySymbol ? `${currencySymbol} ${formatted}` : formatted;
}
