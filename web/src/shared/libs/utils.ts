/**
 * Utility function to join multiple class names into a single string,
 * ignoring any falsy values. Useful for conditional class application,
 * especially with utility-first CSS frameworks like Tailwind.
 *
 * @param classes - One or more class name strings or falsy values
 * @returns A space-separated string of valid class names
 */
export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Validate password strength and requirements.
 * Returns true when valid or a string message describing the validation error.
 */
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
  if (!/[@$!%*?&]/.test(value)) {
    return "Password must include at least one special character (@$!%*?&)";
  }
  return true;
};

/**
 * Map of phone validation rules by country code.
 * Add new country rules here to extend supported phone types.
 */
export const phoneValidations: Record<
  string,
  { regex: RegExp; message: string }
> = {
  "+91": {
    regex: /^[6-9]\d{9}$/,
    message: "Enter a valid 10-digit Indian mobile number",
  },
  "+44": {
    regex: /^\d{10}$/,
    message: "Enter a valid 10-digit UK mobile number",
  },
};

/**
 * validatePhone - reusable validator for react-hook-form.
 * Accepts the stored combined value (e.g. "+91 9876543210") and
 * returns true when valid or a string error message when invalid.
 */
export const validatePhone = (value: string) => {
  const [code, ...rest] = (value || "").split(" ");
  const number = rest.join("").replace(/\D/g, "");

  const rule = phoneValidations[code];
  if (rule) {
    return rule.regex.test(number) ? true : rule.message;
  }

  // Fallback message when country code is not recognized
  return "Enter a valid phone number";
};

// IBAN validation rules(IBAN : INTERNATIONAL BANK ACCOUNT NUMBER)
export interface IBANRule {
  readonly len: number;
  readonly bban: RegExp;
}

// Define the rules object
export const IBAN_RULES_RAW = {
  AD: { len: 24, bban: /^[0-9]{8}[A-Z0-9]{12}$/ },
  AE: { len: 23, bban: /^[0-9]{19}$/ },
  AL: { len: 28, bban: /^[0-9]{8}[A-Z0-9]{16}$/ },
  AT: { len: 20, bban: /^[0-9]{16}$/ },
  AZ: { len: 28, bban: /^[A-Z]{4}[A-Z0-9]{20}$/ },
  BA: { len: 20, bban: /^[0-9]{16}$/ },
  BE: { len: 16, bban: /^[0-9]{12}$/ },
  BG: { len: 22, bban: /^[A-Z]{4}[0-9]{6}[A-Z0-9]{8}$/ },
  BH: { len: 22, bban: /^[A-Z]{4}[A-Z0-9]{14}$/ },
  BR: { len: 29, bban: /^[0-9]{23}[A-Z0-9]{2}$/ },
  CH: { len: 21, bban: /^[0-9]{5}[A-Z0-9]{12}$/ },
  CR: { len: 22, bban: /^[0-9]{18}$/ },
  CY: { len: 28, bban: /^[0-9]{8}[A-Z0-9]{16}$/ },
  CZ: { len: 24, bban: /^[0-9]{20}$/ },
  DE: { len: 22, bban: /^[0-9]{18}$/ },
  DK: { len: 18, bban: /^[0-9]{14}$/ },
  DO: { len: 28, bban: /^[A-Z0-9]{4}[0-9]{20}$/ },
  EE: { len: 20, bban: /^[0-9]{16}$/ },
  ES: { len: 24, bban: /^[0-9]{20}$/ },
  FI: { len: 18, bban: /^[0-9]{14}$/ },
  FO: { len: 18, bban: /^[0-9]{14}$/ },
  FR: { len: 27, bban: /^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$/ },
  GB: { len: 22, bban: /^[A-Z]{4}[0-9]{14}$/ },
  GE: { len: 22, bban: /^[A-Z]{2}[0-9]{16}$/ },
  GI: { len: 23, bban: /^[A-Z]{4}[A-Z0-9]{15}$/ },
  GL: { len: 18, bban: /^[0-9]{14}$/ },
  GR: { len: 27, bban: /^[0-9]{7}[A-Z0-9]{16}$/ },
  HR: { len: 21, bban: /^[0-9]{17}$/ },
  HU: { len: 28, bban: /^[0-9]{24}$/ },
  IE: { len: 22, bban: /^[A-Z]{4}[0-9]{14}$/ },
  IL: { len: 23, bban: /^[0-9]{19}$/ },
  IS: { len: 26, bban: /^[0-9]{22}$/ },
  IT: { len: 27, bban: /^[A-Z]{1}[0-9]{10}[A-Z0-9]{12}$/ },
  JO: { len: 30, bban: /^[A-Z]{4}[0-9]{4}[A-Z0-9]{18}$/ },
  KW: { len: 30, bban: /^[A-Z]{4}[A-Z0-9]{22}$/ },
  KZ: { len: 20, bban: /^[0-9]{3}[A-Z0-9]{13}$/ },
  LB: { len: 28, bban: /^[0-9]{4}[A-Z0-9]{20}$/ },
  LI: { len: 21, bban: /^[0-9]{5}[A-Z0-9]{12}$/ },
  LT: { len: 20, bban: /^[0-9]{16}$/ },
  LU: { len: 20, bban: /^[0-9]{3}[A-Z0-9]{13}$/ },
  LV: { len: 21, bban: /^[A-Z]{4}[A-Z0-9]{13}$/ },
  MC: { len: 27, bban: /^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$/ },
  MD: { len: 24, bban: /^[A-Z0-9]{2}[A-Z0-9]{18}$/ },
  ME: { len: 22, bban: /^[0-9]{18}$/ },
  MK: { len: 19, bban: /^[0-9]{3}[A-Z0-9]{10}[0-9]{2}$/ },
  MR: { len: 27, bban: /^[0-9]{23}$/ },
  MT: { len: 31, bban: /^[A-Z]{4}[0-9]{5}[A-Z0-9]{18}$/ },
  MU: { len: 30, bban: /^[A-Z]{4}[0-9]{19}[A-Z]{3}$/ },
  NL: { len: 18, bban: /^[A-Z]{4}[0-9]{10}$/ },
  NO: { len: 15, bban: /^[0-9]{11}$/ },
  PK: { len: 24, bban: /^[A-Z]{4}[A-Z0-9]{16}$/ },
  PL: { len: 28, bban: /^[0-9]{24}$/ },
  PS: { len: 29, bban: /^[A-Z0-9]{4}[A-Z0-9]{21}$/ },
  PT: { len: 25, bban: /^[0-9]{21}$/ },
  QA: { len: 29, bban: /^[A-Z]{4}[A-Z0-9]{21}$/ },
  RO: { len: 24, bban: /^[A-Z]{4}[A-Z0-9]{16}$/ },
  RS: { len: 22, bban: /^[0-9]{18}$/ },
  SA: { len: 24, bban: /^[0-9]{22}$/ },
  SE: { len: 24, bban: /^[0-9]{20}$/ },
  SI: { len: 19, bban: /^[0-9]{15}$/ },
  SK: { len: 24, bban: /^[0-9]{20}$/ },
  SM: { len: 27, bban: /^[A-Z]{1}[0-9]{10}[A-Z0-9]{12}$/ },
  TN: { len: 24, bban: /^[0-9]{20}$/ },
  TR: { len: 26, bban: /^[0-9]{5}[A-Z0-9]{17}$/ }
} as const;