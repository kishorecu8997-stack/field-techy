import {
  ACCOUNT_RULES,
  getBankName,
  IBAN_RULES
} from "@/shared/libs/utils";


/**
 * Validates an IBAN for a given country code.
 * Returns `true` if valid, or a descriptive error message if invalid.
 */
export function validateIBANForCountry(
  iban: string,
  countryCode: string
): true | string {
  if (!iban) {
    return "IBAN is required";
  }

  const normalizedIBAN = iban.replace(/\s+/g, "").toUpperCase();
  const upperCountryCode = countryCode.toUpperCase();

  // ✅ Runtime check + type guard
  if (!(upperCountryCode in IBAN_RULES)) {
    return `IBAN validation is not supported for country code: ${upperCountryCode}`;
  }

  // ✅ Safe type assertion after check
const rule = IBAN_RULES[upperCountryCode as keyof typeof IBAN_RULES];

  // 1. Must start with country code
  if (!normalizedIBAN.startsWith(upperCountryCode)) {
    return `IBAN must start with the country code "${upperCountryCode}"`;
  }

  // 2. Basic IBAN structure
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]*$/.test(normalizedIBAN)) {
    return "IBAN has an invalid format (must start with 2 letters, 2 digits, then alphanumeric characters)";
  }

  // 3. Length check
  if (normalizedIBAN.length !== rule.len) {
    return `IBAN for ${upperCountryCode} must be exactly ${rule.len} characters long`;
  }

  // 4. BBAN format
  const bban = normalizedIBAN.slice(4);
  if (!rule.bban.test(bban)) {
    return `IBAN for ${upperCountryCode} has an invalid bank/account number format`;
  }

  // 5. Modulo-97 checksum
  const rearranged = normalizedIBAN.slice(4) + normalizedIBAN.slice(0, 4);
  let numeric = "";
  for (const char of rearranged) {
    if (char >= "A" && char <= "Z") {
      numeric += (char.charCodeAt(0) - 55).toString();
    } else if (char >= "0" && char <= "9") {
      numeric += char;
    } else {
      return "IBAN contains invalid characters";
    }
  }

  let remainder = 0;
  for (let i = 0; i < numeric.length; i++) {
    remainder = (remainder * 10 + parseInt(numeric[i], 10)) % 97;
  }

  if (remainder !== 1) {
    return "IBAN checksum is invalid – please verify the number";
  }

  return true;
}


export function validateIBANForCountrywise(iban: string): true | string {
  if (!iban) {
    return "IBAN is required";
  }

  // 1. Reject leading, trailing, or internal spaces
  if (/^\s|\s$/.test(iban)) {
    return "IBAN must not start or end with a space";
  }
  if (/\s/.test(iban)) {
    return "IBAN must not contain spaces";
  }

  // 2. Normalize: convert to uppercase
  const normalizedIBAN = iban.toUpperCase();

  // 3. Strict alphanumeric check — no special characters allowed
  if (!/^[A-Z0-9]+$/.test(normalizedIBAN)) {
    return "IBAN must contain only letters and digits (no commas or special characters)";
  }

  // 4. Length check
  if (normalizedIBAN.length < 8) {
    return "IBAN must be at least 8 characters long";
  }

  if (normalizedIBAN.length > 34) {
    return "IBAN must not exceed 34 characters";
  }

  // ✅ Valid
  return true;
}




// Your password validation function
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

// Your SWIFT prefixes (8-digit)
const BANK_SWIFT_PREFIXES: Record<string, string> = {
  "state-bank-of-india": "SBININBB",
  "hdfc-bank": "HDFCINBB",
  "icici-bank": "ICICINBB",
  "axis-bank": "AXISINBB",
  "bank-of-america": "BOFAUS3N",
  citi: "CITIUS33",
  hsbc: "HSBC", // We'll handle prefix matching differently (see below)
};

/**
 * Validates SWIFT/BIC code and returns true or an error message.
 */
export function validateSWIFTForBank(
  swift: string,
  bankValue: string
): true | string {
  // 1. Required check
  if (!swift) {
    return "SWIFT/BIC code is required";
  }

  // 2. Normalize
  const normalized = swift.replace(/\s+/g, "").toUpperCase();

  // 3. Global SWIFT format check (8 or 11 chars)
  if (normalized.length !== 8 && normalized.length !== 11) {
    return "SWIFT/BIC must be 8 or 11 characters long";
  }

  if (!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(normalized)) {
    return "SWIFT/BIC contains invalid characters";
  }

  // 4. Bank-specific validation
  const bankName = getBankName(bankValue);
  const expectedPrefix = BANK_SWIFT_PREFIXES[bankValue];

  if (!expectedPrefix) {
    // Unknown bank → accept any valid SWIFT
    return true;
  }

  // Special handling for HSBC (since it uses country-specific codes)
  if (bankValue === "hsbc") {
    if (!normalized.startsWith("HSBC")) {
      return `SWIFT/BIC for ${bankName} must start with 'HSBC'`;
    }
    return true;
  }

  // For other banks: strict 8-char match
  const actualPrefix = normalized.substring(0, 8);
  if (actualPrefix !== expectedPrefix) {
    return `SWIFT/BIC does not match ${bankName}. Expected prefix: ${expectedPrefix}`;
  }

  return true;
}


export function validateSWIFTBank(swift: string): true | string {
  // 1. Required check
  if (!swift) {
    return "SWIFT code is required";
  }

  // 2. Reject leading/trailing/internal spaces
  if (/^\s|\s$/.test(swift)) {
    return "SWIFT code must not start or end with a space";
  }
  if (/\s/.test(swift)) {
    return "SWIFT code must not contain spaces";
  }

  // 3. Normalize
  const normalized = swift.toUpperCase();

  // 4. Length check: must be between 8 and 11 characters
  if (normalized.length < 8) {
    return "SWIFT code must be at least 8 characters long";
  }
  if (normalized.length > 11) {
    return "SWIFT code must not exceed 11 characters";
  }

  // 5. Alphanumeric check
  if (!/^[A-Z0-9]+$/.test(normalized)) {
    return "SWIFT code must contain only letters and digits";
  }

  // ✅ Valid
  return true;
}



// ✅ Your requested function signature
export function validateAccountNumber(
  value: string,
  bankValue: string
): true | string {
  // 1. Required check
  if (!value) {
    return "Account number is required";
  }

  // 2. No spaces allowed
  if (/\s/.test(value)) {
    return "Account number must not contain spaces";
  }

  // 3. Normalize (remove hyphens, spaces — though spaces already blocked)
  const normalized = value.replace(/[\s-]/g, "");

  // 4. Get bank name for error message
  const bankName = getBankName(bankValue);

  // 5. Get rule — fallback to generic if unknown bank
  const rule = ACCOUNT_RULES[bankValue];
  if (!rule) {
    // Generic fallback: 1–30 alphanumeric
    if (
      normalized.length < 1 ||
      normalized.length > 30 ||
      !/^[A-Z0-9]+$/i.test(normalized)
    ) {
      return `Account number for ${bankName} must be 1–30 alphanumeric characters`;
    }
    return true;
  }

  // 6. Length validation
  if (normalized.length < rule.minLength) {
    return `Account number for ${bankName} must be at least ${rule.minLength} digits`;
  }
  if (normalized.length > rule.maxLength) {
    return `Account number for ${bankName} must not exceed ${rule.maxLength} digits`;
  }

  // 7. Character validation
  if (!rule.pattern.test(normalized)) {
    return `Account number for ${bankName} must contain only digits`;
  }

  // 8. All good!
  return true;
}


export function validateAccNumber(value: string): true | string {
  // 1. Required check
  if (!value) {
    return "Account number is required";
  }

  // 2. No spaces allowed
  if (/\s/.test(value)) {
    return "Account number must not contain spaces";
  }

  // 3. Digit-only check (no letters or symbols)
  if (!/^\d+$/.test(value)) {
    return "Account number must contain only digits (0–9)";
  }

  // 4. Minimum length check
  if (value.length < 9) {
    return "Account number must be at least 9 digits";
  }

  // 5. Maximum length check
  if (value.length > 18) {
    return "Account number must not exceed 18 digits";
  }

  // 6. All good!
  return true;
}



export const validateAddress = (value: string) => {
  if (!value) return 'Address must be at least 6 characters';

  // Disallow leading or trailing spaces
  if (/^\s|\s$/.test(value)) return 'Address must not start or end with a space';

  const v = value.trim();
  if (v.length < 6) return 'Address must be at least 6 characters';
  if (v.length > 50) return 'Address must not exceed 50 characters';
  // Allow letters, numbers, spaces, and / , . - #
  if (!/^[A-Za-z0-9\s/,.\-#]+$/.test(v)) {
    return 'Address may contain only letters, numbers, spaces, and / , . - #';
  }

  return true;
};

export const validateName = (value: string, fieldLabel = 'Name') => {
  // length requirement: 2 to 50 characters
  const raw = value || "";

    // Reject any whitespace (leading/trailing/internal)
    if (/\s/.test(raw)) return `${fieldLabel} must not contain spaces`;

    // Only letters allowed (A-Z)
    if (!/^[A-Za-z]+$/.test(raw))
      return `${fieldLabel} must contain only alphabetic characters (no numbers or special characters)`;

    // length requirement: 2 to 50 characters
    if (raw.length < 2) return `${fieldLabel} must be at least 2 characters`;
    if (raw.length > 50) return `${fieldLabel} must not exceed 50 characters`;


  return true;
};
