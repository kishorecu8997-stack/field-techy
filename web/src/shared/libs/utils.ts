import { bankList } from "@/dummy_data/bankDetails";
import xss from "xss";

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"




/**
 * Utility function to join multiple class names into a single string,
 * ignoring any falsy values. Useful for conditional class application,
 * especially with utility-first CSS frameworks like Tailwind.
 *
 * @param classes - One or more class name strings or falsy values
 * @returns A space-separated string of valid class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validate password strength and requirements.
 * Returns true when valid or a string message describing the validation error.
 */
export const validatePassword = (value: string, oldPassword?: string) => {
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
  if (typeof oldPassword === 'string' && oldPassword) {
    if (oldPassword === value) {
      return "Password cannot be the same as the old password";
    }
  }
  return true;
};

export const validatePortfolioLink = (value: string) => {
  if (!value) return "Portfolio link is required";

  const original = value.trim();

  // No leading/trailing whitespace
  if (value !== original) {
    return "Portfolio link must not start or end with whitespace";
  }

  // No internal whitespace
  if (/\s/.test(original)) {
    return "Portfolio link must not contain spaces";
  }

  // Basic character safety (RFC 3986 + no control chars)
  if (!/^[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]+$/.test(original)) {
    return "Portfolio link contains invalid characters";
  }

  // XSS check
  if (original !== xss(original)) {
    return "Potentially malicious content is not allowed";
  }

  // Reject anything with:
  // - query (?...)
  // - fragment (#...)
  // - userinfo (user:pass@...)
  // - non-standard ports (:8080)
  // - encoded sequences like %2F
  if (/%[0-9a-fA-F]{2}|[?#]|:.+@|:\d{2,5}(?![/])/.test(original)) {
    return "URL must not contain query parameters, fragments, encoded characters, ports, or credentials";
  }

  // // Reject any URL with path traversal, extra dots, or abnormal patterns
  // if (/\/\.\.?\/|\/{2,}/.test(original)) {
  //   return "URL must not contain redundant slashes, dots, or path traversal sequences";
  // }

  try {
    const url = new URL(original);

    if (!["http:", "https:"].includes(url.protocol)) {
      return "Portfolio link must use http:// or https://";
    }

    // Enforce clean hostname
    const hostname = url.hostname.toLowerCase();
    if (!/^[a-z0-9.-]+$/.test(hostname)) {
      return "Invalid domain format";
    }

    // Block dangerous or irrelevant domains
    const blockedPatterns = /\.(zip|exe|bat|msi|sh|js|vbs|scr)$/i;
    const suspiciousKeywords =
      /malware|phishing|adult|torrent|hack|crack|free.*coin/i;
    if (blockedPatterns.test(hostname) || suspiciousKeywords.test(hostname)) {
      return "Domain is not allowed";
    }

    // Normalize path: must be clean and minimal
    const path = url.pathname;

    // Remove trailing slash for comparison, but original must not have excess
    // const cleanPath = path === "/" ? "" : path;

    // Define allowed profiles
    const isGitHub =
      hostname === "github.com" &&
      /^\/[a-zA-Z0-9._-]+$/.test(path) &&
      !path.includes("..");

    // Allow /in/username with an optional trailing slash
    const isLinkedIn =
      hostname === "www.linkedin.com" &&
      /^\/in\/[a-zA-Z0-9._-]+\/?$/.test(path);

    const isExample = hostname === "example.com" && path === "/";

    const isPersonalSite =
      !["github.com", "www.linkedin.com", "example.com"].includes(hostname) &&
      path === "/"; // Only root allowed

    if (isGitHub || isLinkedIn || isExample || isPersonalSite) {
      return true;
    }

    return "Only GitHub profiles, LinkedIn profiles (e.g., https://www.linkedin.com/in/username), or personal homepages are allowed";
  } catch {
    return "Portfolio link must be a valid URL";
  }
};

// IBAN validation rules(IBAN : INTERNATIONAL BANK ACCOUNT NUMBER)
export interface IBANRule {
  readonly len: number;
  readonly bban: RegExp;
}
// Define the rules object with country names
export const IBAN_RULES = {
  AD: { len: 24, bban: /^[0-9]{8}[A-Z0-9]{12}$/ }, // Andorra
  AE: { len: 23, bban: /^[0-9]{19}$/ }, // United Arab Emirates
  AL: { len: 28, bban: /^[0-9]{8}[A-Z0-9]{16}$/ }, // Albania
  AT: { len: 20, bban: /^[0-9]{16}$/ }, // Austria
  AZ: { len: 28, bban: /^[A-Z]{4}[A-Z0-9]{20}$/ }, // Azerbaijan
  BA: { len: 20, bban: /^[0-9]{16}$/ }, // Bosnia and Herzegovina
  BE: { len: 16, bban: /^[0-9]{12}$/ }, // Belgium
  BG: { len: 22, bban: /^[A-Z]{4}[0-9]{6}[A-Z0-9]{8}$/ }, // Bulgaria
  BH: { len: 22, bban: /^[A-Z]{4}[A-Z0-9]{14}$/ }, // Bahrain
  BR: { len: 29, bban: /^[0-9]{23}[A-Z0-9]{2}$/ }, // Brazil
  CH: { len: 21, bban: /^[0-9]{5}[A-Z0-9]{12}$/ }, // Switzerland
  CR: { len: 22, bban: /^[0-9]{18}$/ }, // Costa Rica
  CY: { len: 28, bban: /^[0-9]{8}[A-Z0-9]{16}$/ }, // Cyprus
  CZ: { len: 24, bban: /^[0-9]{20}$/ }, // Czech Republic
  DE: { len: 22, bban: /^[0-9]{18}$/ }, // Germany
  DK: { len: 18, bban: /^[0-9]{14}$/ }, // Denmark
  DO: { len: 28, bban: /^[A-Z0-9]{4}[0-9]{20}$/ }, // Dominican Republic
  EE: { len: 20, bban: /^[0-9]{16}$/ }, // Estonia
  ES: { len: 24, bban: /^[0-9]{20}$/ }, // Spain
  FI: { len: 18, bban: /^[0-9]{14}$/ }, // Finland
  FO: { len: 18, bban: /^[0-9]{14}$/ }, // Faroe Islands
  FR: { len: 27, bban: /^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$/ }, // France
  GB: { len: 22, bban: /^[A-Z]{4}[0-9]{14}$/ }, // United Kingdom
  GE: { len: 22, bban: /^[A-Z]{2}[0-9]{16}$/ }, // Georgia
  GI: { len: 23, bban: /^[A-Z]{4}[A-Z0-9]{15}$/ }, // Gibraltar
  GL: { len: 18, bban: /^[0-9]{14}$/ }, // Greenland
  GR: { len: 27, bban: /^[0-9]{7}[A-Z0-9]{16}$/ }, // Greece
  HR: { len: 21, bban: /^[0-9]{17}$/ }, // Croatia
  HU: { len: 28, bban: /^[0-9]{24}$/ }, // Hungary
  IE: { len: 22, bban: /^[A-Z]{4}[0-9]{14}$/ }, // Ireland
  IL: { len: 23, bban: /^[0-9]{19}$/ }, // Israel
  IS: { len: 26, bban: /^[0-9]{22}$/ }, // Iceland
  IT: { len: 27, bban: /^[A-Z]{1}[0-9]{10}[A-Z0-9]{12}$/ }, // Italy
  JO: { len: 30, bban: /^[A-Z]{4}[0-9]{4}[A-Z0-9]{18}$/ }, // Jordan
  KW: { len: 30, bban: /^[A-Z]{4}[A-Z0-9]{22}$/ }, // Kuwait
  KZ: { len: 20, bban: /^[0-9]{3}[A-Z0-9]{13}$/ }, // Kazakhstan
  LB: { len: 28, bban: /^[0-9]{4}[A-Z0-9]{20}$/ }, // Lebanon
  LI: { len: 21, bban: /^[0-9]{5}[A-Z0-9]{12}$/ }, // Liechtenstein
  LT: { len: 20, bban: /^[0-9]{16}$/ }, // Lithuania
  LU: { len: 20, bban: /^[0-9]{3}[A-Z0-9]{13}$/ }, // Luxembourg
  LV: { len: 21, bban: /^[A-Z]{4}[A-Z0-9]{13}$/ }, // Latvia
  MC: { len: 27, bban: /^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$/ }, // Monaco
  MD: { len: 24, bban: /^[A-Z0-9]{2}[A-Z0-9]{18}$/ }, // Moldova
  ME: { len: 22, bban: /^[0-9]{18}$/ }, // Montenegro
  MK: { len: 19, bban: /^[0-9]{3}[A-Z0-9]{10}[0-9]{2}$/ }, // North Macedonia
  MR: { len: 27, bban: /^[0-9]{23}$/ }, // Mauritania
  MT: { len: 31, bban: /^[A-Z]{4}[0-9]{5}[A-Z0-9]{18}$/ }, // Malta
  MU: { len: 30, bban: /^[A-Z]{4}[0-9]{19}[A-Z]{3}$/ }, // Mauritius
  NL: { len: 18, bban: /^[A-Z]{4}[0-9]{10}$/ }, // Netherlands
  NO: { len: 15, bban: /^[0-9]{11}$/ }, // Norway
  PK: { len: 24, bban: /^[A-Z]{4}[A-Z0-9]{16}$/ }, // Pakistan
  PL: { len: 28, bban: /^[0-9]{24}$/ }, // Poland
  PS: { len: 29, bban: /^[A-Z0-9]{4}[A-Z0-9]{21}$/ }, // Palestine
  PT: { len: 25, bban: /^[0-9]{21}$/ }, // Portugal
  QA: { len: 29, bban: /^[A-Z]{4}[A-Z0-9]{21}$/ }, // Qatar
  RO: { len: 24, bban: /^[A-Z]{4}[A-Z0-9]{16}$/ }, // Romania
  RS: { len: 22, bban: /^[0-9]{18}$/ }, // Serbia
  SA: { len: 24, bban: /^[0-9]{22}$/ }, // Saudi Arabia
  SE: { len: 24, bban: /^[0-9]{20}$/ }, // Sweden
  SI: { len: 19, bban: /^[0-9]{15}$/ }, // Slovenia
  SK: { len: 24, bban: /^[0-9]{20}$/ }, // Slovakia
  SM: { len: 27, bban: /^[A-Z]{1}[0-9]{10}[A-Z0-9]{12}$/ }, // San Marino
  TN: { len: 24, bban: /^[0-9]{20}$/ }, // Tunisia
  TR: { len: 26, bban: /^[0-9]{5}[A-Z0-9]{17}$/ }, // Turkey
} as const;

export const ACCOUNT_RULES: Record<
  string,
  { minLength: number; maxLength: number; pattern: RegExp }
> = {
  "state-bank-of-india": { minLength: 11, maxLength: 17, pattern: /^[0-9]+$/ },
  "hdfc-bank": { minLength: 12, maxLength: 14, pattern: /^[0-9]+$/ },
  "icici-bank": { minLength: 12, maxLength: 12, pattern: /^[0-9]+$/ },
  "axis-bank": { minLength: 15, maxLength: 15, pattern: /^[0-9]+$/ },
  "bank-of-america": { minLength: 1, maxLength: 17, pattern: /^[0-9]+$/ },
  citi: { minLength: 1, maxLength: 10, pattern: /^[0-9]+$/ },
  hsbc: { minLength: 6, maxLength: 8, pattern: /^[0-9]+$/ },
};

export const getBankName = (bankValue: string): string => {
  const bank = bankList.find((b) => b.value === bankValue);
  return bank ? bank.label : bankValue; // fallback to raw value if unknown
};

export const validateName = (value: string) => {
  const raw = value || "";

  // Reject leading or trailing spaces
  if (raw !== raw.trim())
    return "Input must not have leading or trailing spaces";

  // Reject consecutive spaces
  if (/ {2,}/.test(raw)) {
    return "Input must not contain consecutive spaces";
  }

  // Reject if contains anything other than letters and single spaces
  if (!/^[A-Za-z ]+$/.test(raw))
    return `${value} must contain only alphabetic characters and single spaces`;

  // Reject if more than 10 spaces
  const spaceCount = (raw.match(/ /g) || []).length;
  if (spaceCount > 10) return `${value} must not contain more than 10 spaces`;

  // Length requirement: 2 to 50 characters
  if (raw.length < 2) return `${value} must be at least 2 characters`;
  if (raw.length > 50) return `${value} must not exceed 50 characters`;

  return true;
};

export const cardNumberValidation = (value: string) => {
  const raw = value || "";
  const cleanedValue = raw.replace(/\s/g, "");
  if (!cleanedValue) return "Card number is required.";
  if (!/^\d{13,19}$/.test(cleanedValue)) {
    return "Card number must be 13 to 19 digits.";
  }
  return true;
};

export const expiryDateValidation = (value: string) => {
  const raw = value || "";
  if (!raw) return "Expiry date is required.";
  if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(raw)) {
    return "Invalid date format. Use MM/YY.";
  }
  const match = raw.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/);
  if (!match) return true; // Let pattern handle format errors
  const [, month, year] = match;
  const expiryDate = new Date(Number(`20${year}`), Number(month) - 1); // Month is 0-indexed
  const now = new Date();
  // Set current date to first of the month for fair comparison
  now.setDate(1);
  return expiryDate >= now || "Card has expired.";
};

export const cvvValidation = (value: string) => {
  const raw = value || "";
  if (!raw) return "CVV is required.";
  if (!/^\d{3,4}$/.test(raw)) {
    return "CVV must be 3 or 4 digits.";
  }
  return true;
};

/**
 * Generates an array of page numbers with optional ellipsis ("...") for large ranges.
 * Example: [1, '...', 4, 5, 6, '...', 10] when currentPage = 5, totalPages = 10
 */
export const generatePageRange = (
  currentPage: number,
  totalPages: number,
  delta: number = 2
): (number | "...")[] => {
  if (totalPages <= 1) return [1];

  const range: (number | "...")[] = [];

  // Always include first page
  range.push(1);

  const left = currentPage - delta;
  const right = currentPage + delta;

  // Ellipsis after first if needed
  if (left > 2) {
    range.push("...");
  }

  // Add pages around current
  for (let i = Math.max(2, left); i <= Math.min(totalPages - 1, right); i++) {
    range.push(i);
  }

  // Ellipsis before last if needed
  if (right < totalPages - 1) {
    range.push("...");
  }

  // Always include last page (if more than 1)
  if (totalPages > 1) {
    range.push(totalPages);
  }

  // Remove duplicates (e.g., when totalPages=2)
  return Array.from(new Set(range));
};

// Format currency
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Helper to format date as "DD MMM, YYYY | HH:MM AM/PM"
export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
