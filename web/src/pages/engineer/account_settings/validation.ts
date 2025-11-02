import { IBAN_RULES_RAW, type IBANRule } from "@/shared/libs/utils";

// Derive the type and assert the structure
type CountryCode = keyof typeof IBAN_RULES_RAW;
const IBAN_RULES: Record<CountryCode, IBANRule> = IBAN_RULES_RAW;

// Now this is safe ✅
export function validateIBANForCountry(
  iban: string | null | undefined,
  countryCode: string
): boolean {
  if (!iban) return false;

  const normalizedIBAN = iban.replace(/\s+/g, '').toUpperCase();
  const upperCountryCode = countryCode.toUpperCase() as CountryCode;

  if (!(upperCountryCode in IBAN_RULES)) {
    throw new Error(`Unsupported country code: ${countryCode}`);
  }

  const rule = IBAN_RULES[upperCountryCode]; // ✅ No TS error now

  if (
    !normalizedIBAN.startsWith(upperCountryCode) ||
    !/^[A-Z]{2}[0-9]{2}[A-Z0-9]*$/.test(normalizedIBAN)
  ) {
    return false;
  }

  if (normalizedIBAN.length !== rule.len) {
    return false;
  }

  const bban = normalizedIBAN.slice(4);
  if (!rule.bban.test(bban)) {
    return false;
  }

  // Modulo-97 check
  const rearranged = normalizedIBAN.slice(4) + normalizedIBAN.slice(0, 4);
  let numeric = '';
  for (const char of rearranged) {
    numeric += char >= 'A' && char <= 'Z' ? (char.charCodeAt(0) - 55).toString() : char;
  }

  let remainder = 0;
  for (let i = 0; i < numeric.length; i++) {
    remainder = (remainder * 10 + parseInt(numeric[i], 10)) % 97;
  }

  return remainder === 1;
}


export const validatePassword = (value: string) => {
  if (value.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (value.length > 20) {
    return "Password must not exceed 20 characters";
  }
  if (!/[a-z]/.test(value)) {
    return "Password must include at least one lowercase letter";
  }
  if (!/[A-Z]/.test(value)) {
    return "Password must include at least one uppercase letter";
  }
  if (!/\d/.test(value)) {
    return "Password must include at least one number";
  }
  if (!/[^A-Za-z0-9]/.test(value)) {
    return "Password must include at least one special character";
  }
  if (/\s/.test(value)) {
    return "Password must not contain spaces";
  }
  return true;
};