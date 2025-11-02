
import { bankList } from "@/dummy_data/bankDetails";

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
  if (!/[^A-Za-z0-9]/.test(value)) {
    return "Password must include at least one special character";
  }
  if (/\s/.test(value)) {
    return "Password must not contain spaces";
  }
  return true;
};

export const validatePortfolioLink = (value: string) => {
  if (/^\s|\s$/.test(value || ""))
    return "PortfolioLink must not start or end with a space";

  const v = (value || "").trim();

  if (!v) return true; // ✅ Field is optional now

  // ✅ Enforce min 10 and max 200 characters
  if (v.length < 10) return "Portfolio link must be at least 10 characters";
  if (v.length > 200) return "Portfolio link must not exceed 200 characters";

  if (/<\s*script/gi.test(v)) return "Scripting tags are not allowed";

  try {
    const url = new URL(v);

    if (!["http:", "https:"].includes(url.protocol)) {
      return "Portfolio link must start with http:// or https://";
    }

    const hostname = url.hostname.toLowerCase();
    const pathname = url.pathname.replace(/\/+$/, ""); // remove trailing slashes

    const isGitHubProfile =
      hostname.includes("github.com") && /^\/[^/]+$/.test(pathname);

    const isLinkedInProfile =
      hostname.includes("linkedin.com") && /^\/in\/[^/]+$/.test(pathname); // LinkedIn profiles follow /in/username

    const isExampleProfile =
      hostname.includes("example.com") && /^\/[^/]+$/.test(pathname); // Example profiles follow /username

    const isPersonalSite =
      !hostname.includes("linkedin.com") &&
      !hostname.includes("github.com") &&
      !hostname.endsWith(".zip") &&
      !hostname.endsWith(".exe") &&
      !hostname.includes("malware") &&
      !hostname.includes("phishing") &&
      !hostname.includes("adult") &&
      !hostname.includes("torrent") &&
      pathname === ""; // homepage only

    const isAllowed =
      isGitHubProfile ||
      isLinkedInProfile ||
      isExampleProfile ||
      isPersonalSite;

    if (!isAllowed) {
      return "Only GitHub, LinkedIn profile URL, or safe personal homepages are allowed";
    }

    return true;
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
  AE: { len: 23, bban: /^[0-9]{19}$/ },            // United Arab Emirates
  AL: { len: 28, bban: /^[0-9]{8}[A-Z0-9]{16}$/ }, // Albania
  AT: { len: 20, bban: /^[0-9]{16}$/ },            // Austria
  AZ: { len: 28, bban: /^[A-Z]{4}[A-Z0-9]{20}$/ }, // Azerbaijan
  BA: { len: 20, bban: /^[0-9]{16}$/ },            // Bosnia and Herzegovina
  BE: { len: 16, bban: /^[0-9]{12}$/ },            // Belgium
  BG: { len: 22, bban: /^[A-Z]{4}[0-9]{6}[A-Z0-9]{8}$/ }, // Bulgaria
  BH: { len: 22, bban: /^[A-Z]{4}[A-Z0-9]{14}$/ }, // Bahrain
  BR: { len: 29, bban: /^[0-9]{23}[A-Z0-9]{2}$/ }, // Brazil
  CH: { len: 21, bban: /^[0-9]{5}[A-Z0-9]{12}$/ }, // Switzerland
  CR: { len: 22, bban: /^[0-9]{18}$/ },            // Costa Rica
  CY: { len: 28, bban: /^[0-9]{8}[A-Z0-9]{16}$/ }, // Cyprus
  CZ: { len: 24, bban: /^[0-9]{20}$/ },            // Czech Republic
  DE: { len: 22, bban: /^[0-9]{18}$/ },            // Germany
  DK: { len: 18, bban: /^[0-9]{14}$/ },            // Denmark
  DO: { len: 28, bban: /^[A-Z0-9]{4}[0-9]{20}$/ }, // Dominican Republic
  EE: { len: 20, bban: /^[0-9]{16}$/ },            // Estonia
  ES: { len: 24, bban: /^[0-9]{20}$/ },            // Spain
  FI: { len: 18, bban: /^[0-9]{14}$/ },            // Finland
  FO: { len: 18, bban: /^[0-9]{14}$/ },            // Faroe Islands
  FR: { len: 27, bban: /^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$/ }, // France
  GB: { len: 22, bban: /^[A-Z]{4}[0-9]{14}$/ },    // United Kingdom
  GE: { len: 22, bban: /^[A-Z]{2}[0-9]{16}$/ },    // Georgia
  GI: { len: 23, bban: /^[A-Z]{4}[A-Z0-9]{15}$/ }, // Gibraltar
  GL: { len: 18, bban: /^[0-9]{14}$/ },            // Greenland
  GR: { len: 27, bban: /^[0-9]{7}[A-Z0-9]{16}$/ }, // Greece
  HR: { len: 21, bban: /^[0-9]{17}$/ },            // Croatia
  HU: { len: 28, bban: /^[0-9]{24}$/ },            // Hungary
  IE: { len: 22, bban: /^[A-Z]{4}[0-9]{14}$/ },    // Ireland
  IL: { len: 23, bban: /^[0-9]{19}$/ },            // Israel
  IS: { len: 26, bban: /^[0-9]{22}$/ },            // Iceland
  IT: { len: 27, bban: /^[A-Z]{1}[0-9]{10}[A-Z0-9]{12}$/ }, // Italy
  JO: { len: 30, bban: /^[A-Z]{4}[0-9]{4}[A-Z0-9]{18}$/ }, // Jordan
  KW: { len: 30, bban: /^[A-Z]{4}[A-Z0-9]{22}$/ }, // Kuwait
  KZ: { len: 20, bban: /^[0-9]{3}[A-Z0-9]{13}$/ }, // Kazakhstan
  LB: { len: 28, bban: /^[0-9]{4}[A-Z0-9]{20}$/ }, // Lebanon
  LI: { len: 21, bban: /^[0-9]{5}[A-Z0-9]{12}$/ }, // Liechtenstein
  LT: { len: 20, bban: /^[0-9]{16}$/ },            // Lithuania
  LU: { len: 20, bban: /^[0-9]{3}[A-Z0-9]{13}$/ }, // Luxembourg
  LV: { len: 21, bban: /^[A-Z]{4}[A-Z0-9]{13}$/ }, // Latvia
  MC: { len: 27, bban: /^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$/ }, // Monaco
  MD: { len: 24, bban: /^[A-Z0-9]{2}[A-Z0-9]{18}$/ }, // Moldova
  ME: { len: 22, bban: /^[0-9]{18}$/ },            // Montenegro
  MK: { len: 19, bban: /^[0-9]{3}[A-Z0-9]{10}[0-9]{2}$/ }, // North Macedonia
  MR: { len: 27, bban: /^[0-9]{23}$/ },            // Mauritania
  MT: { len: 31, bban: /^[A-Z]{4}[0-9]{5}[A-Z0-9]{18}$/ }, // Malta
  MU: { len: 30, bban: /^[A-Z]{4}[0-9]{19}[A-Z]{3}$/ }, // Mauritius
  NL: { len: 18, bban: /^[A-Z]{4}[0-9]{10}$/ },    // Netherlands
  NO: { len: 15, bban: /^[0-9]{11}$/ },            // Norway
  PK: { len: 24, bban: /^[A-Z]{4}[A-Z0-9]{16}$/ }, // Pakistan
  PL: { len: 28, bban: /^[0-9]{24}$/ },            // Poland
  PS: { len: 29, bban: /^[A-Z0-9]{4}[A-Z0-9]{21}$/ }, // Palestine
  PT: { len: 25, bban: /^[0-9]{21}$/ },            // Portugal
  QA: { len: 29, bban: /^[A-Z]{4}[A-Z0-9]{21}$/ }, // Qatar
  RO: { len: 24, bban: /^[A-Z]{4}[A-Z0-9]{16}$/ }, // Romania
  RS: { len: 22, bban: /^[0-9]{18}$/ },            // Serbia
  SA: { len: 24, bban: /^[0-9]{22}$/ },            // Saudi Arabia
  SE: { len: 24, bban: /^[0-9]{20}$/ },            // Sweden
  SI: { len: 19, bban: /^[0-9]{15}$/ },            // Slovenia
  SK: { len: 24, bban: /^[0-9]{20}$/ },            // Slovakia
  SM: { len: 27, bban: /^[A-Z]{1}[0-9]{10}[A-Z0-9]{12}$/ }, // San Marino
  TN: { len: 24, bban: /^[0-9]{20}$/ },            // Tunisia
  TR: { len: 26, bban: /^[0-9]{5}[A-Z0-9]{17}$/ }  // Turkey
} as const;

export const ACCOUNT_RULES: Record<string, { minLength: number; maxLength: number; pattern: RegExp }> = {
  "state-bank-of-india": { minLength: 11, maxLength: 17, pattern: /^[0-9]+$/ },
  "hdfc-bank": { minLength: 12, maxLength: 14, pattern: /^[0-9]+$/ },
  "icici-bank": { minLength: 12, maxLength: 12, pattern: /^[0-9]+$/ },
  "axis-bank": { minLength: 15, maxLength: 15, pattern: /^[0-9]+$/ },
  "bank-of-america": { minLength: 1, maxLength: 17, pattern: /^[0-9]+$/ },
  "citi": { minLength: 1, maxLength: 10, pattern: /^[0-9]+$/ },
  "hsbc": { minLength: 6, maxLength: 8, pattern: /^[0-9]+$/ },
};

export const getBankName = (bankValue: string): string => {
  const bank = bankList.find(b => b.value === bankValue);
  return bank ? bank.label : bankValue; // fallback to raw value if unknown
};