/**
 * Profile validators for the Profile Setup form.
 */

/**
 * Validate name (first/last) - only letters allowed (no spaces), length 8-35
 */
export const validateName = (value: string) => {
  // length requirement: 2 to 50 characters
  const raw = value || "";

  // Reject any whitespace (leading/trailing/internal)
  if (/\s/.test(raw)) return `${value} must not contain spaces`;

  // Only letters allowed (A-Z)
  if (!/^[A-Za-z]+$/.test(raw))
    return `${value} must contain only alphabetic characters (no numbers or special characters)`;

  // length requirement: 2 to 50 characters
  if (raw.length < 2) return `${value} must be at least 2 characters`;
  if (raw.length > 50) return `${value} must not exceed 50 characters`;

  return true;
};

/**
 * Validate email address - based on a more secure regex pattern.
 */
export const validateEmail = (value: string) => {
  const email = (value || "").trim();
  if (!email) return "Email is required";

  // A more comprehensive regex for email validation
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }

  return true;
};

/**
 * Validate postcode/ZIP based on country rules.
 * - India (in): exactly 6 digits
 * - United Kingdom (uk): 6 to 8 alphanumeric chars, maximum one internal space,
 *   no leading/trailing space
 */
export const validateZipcode = (value: string, country?: string) => {
  const v = (value || "").trim();

  if (country === "in") {
    return /^\d{6}$/.test(v)
      ? true
      : "Enter a valid 6-digit PIN code for India";
  }

  if (country === "uk") {
    // 6 to 8 alphanumeric chars, maximum one internal space, no leading/trailing space
    const ukRegex = /^(?! )(?!.* $)(?!(?:.* ){2,})[A-Za-z0-9 ]{6,8}$/;
    return ukRegex.test(v)
      ? true
      : "Enter a valid UK postcode (6-8 alphanumeric chars, max one internal space)";
  }

  // default: accept
  return true;
};

/**
 * Validate address - allow letters, numbers and spaces only; length 20-50
 */
export const validateAddress = (value: string) => {
  if (!value) return "Address must be at least 20 characters";

  // Disallow leading or trailing spaces
  if (/^\s|\s$/.test(value))
    return "Address must not start or end with a space";

  const v = value.trim();
  if (v.length < 20) return "Address must be at least 20 characters";
  if (v.length > 50) return "Address must not exceed 50 characters";
  // Allow letters, numbers, spaces, and / , . - #
  if (!/^[A-Za-z0-9\s/,.\-#]+$/.test(v)) {
    return "Address may contain only letters, numbers, spaces, and / , . - #";
  }
  return true;
};

/**
 * Validate a portfolio/URL field:
 * - optional (if empty, valid)
 * - length 10-100
 * - no whitespace
 * - must be a valid URL (adds https:// if scheme missing)
 * - attempts a HEAD request to check reachability but gracefully
 *   degrades when CORS or network restrictions prevent verification.
 */
export const validatePortfolio = async (value: string) => {
  const v = (value || "").trim();
  if (!v) return true; // optional

  if (v.length < 10) return "Portfolio link must be at least 10 characters";
  if (v.length > 100) return "Portfolio link must not exceed 100 characters";
  if (/\s/.test(v)) return "Portfolio link must not contain spaces";

  // Ensure scheme — allow users to type example.com
  let urlStr = v;
  try {
    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(urlStr)) {
      urlStr = `https://${urlStr}`;
    }
    const parsed = new URL(urlStr);
    if (!parsed.hostname || !/\.[a-zA-Z]{2,}$/.test(parsed.hostname)) {
      return "Enter a valid URL";
    }
  } catch {
    return "Enter a valid URL";
  }

  // Try a lightweight reachability check. In browsers this can be blocked by CORS
  // so we catch failures and accept the URL syntactically.
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(urlStr, {
      method: "HEAD",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (res && "ok" in res) {
      if (res.ok) return true;
      return "The provided link is not accessible (non-2xx response)";
    }
    // If we get here the response is opaque or cannot be inspected — accept.
    return true;
  } catch {
    // Network error, timeout or CORS - unable to verify reachability client-side.
    return true;
  }
};

/**
 * Validate amount field:
 * - required to be digits only
 * - length between 2 and 5 characters
 * - no letters or special characters allowed
 */
export const validateAmount = (value: string) => {
  const v = (value || "").trim();
  if (!v) return "Amount is required";
  if (/\s/.test(v)) return "Amount must not contain spaces";
  if (!/^\d+$/.test(v))
    return "Amount must contain digits only (no letters or special characters)";
  if (v.length < 2) return "Amount must be at least 2 digits";
  if (v.length > 5) return "Amount must not exceed 5 digits";
  return true;
};

export const validateDesignation = (value: string) => {
  if (!value) return "Current Designation must be at least 2 characters";

  // Disallow leading or trailing spaces
  if (/^\s|\s$/.test(value))
    return "Current Designation must not start or end with a space";

  const v = value.trim();
  if (v.length < 2) return "Current Designation must be at least 2 characters";
  if (v.length > 50) return "Current Designation must not exceed 50 characters";

  // Only letters and single spaces between words allowed
  if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(v)) {
    return "Current Designation may contain only letters and single spaces between words";
  }

  return true;
};

export const validateCompany = (value: string) => {
  if (!value) return "Company/Employer must be at least 4 characters";

  // Disallow leading or trailing spaces
  if (/^\s|\s$/.test(value))
    return "Company/Employer must not start or end with a space";

  const v = value.trim();
  if (v.length < 4) return "Company/Employer must be at least 4 characters";
  if (v.length > 50) return "Company/Employer must not exceed 50 characters";

  // Only letters, numbers, and / & - . with single spaces between
  if (!/^[A-Za-z0-9/&.-]+(?: [A-Za-z0-9/&.-]+)*$/.test(v)) {
    return "Company/Employer may contain only letters, numbers, single spaces, and / & - .";
  }

  return true;
};

/**
 * Validate experience field:
 * - required
 * - digits only
 * - length between 1 and 3 characters
 */
export const validateExperience = (value: string) => {
  if (!value) return "Experience is required";

  // Disallow leading or trailing spaces
  if (/^\s|\s$/.test(value))
    return "Experience must not start or end with a space";

  const v = value.trim();
  if (/\s/.test(v)) return "Experience must not contain internal spaces";
  if (!/^(?:[1-9]|[1-9][0-9])$/.test(v))
    return "Experience must be a number between 1 and 99 without leading zeros";

  const num = parseInt(v, 10);
  if (num < 1 || num > 99) return "Experience must be between 1 and 99 years";

  return true;
};

/**
 * Validate passing year.
 * - must be a 4-digit number
 * - must be between 1970 and the current year
 */
export const validatePassingYear = (value: string) => {
  const yearStr = (value || "").trim();
  if (!yearStr) return "Passing Year is required";

  if (!/^\d{4}$/.test(yearStr)) {
    return "Please enter a valid 4-digit year";
  }

  const year = parseInt(yearStr, 10);
  const currentYear = new Date().getFullYear();

  if (year < 1970) {
    return "Passing year must be 1970 or later";
  }

  if (year > currentYear) {
    return `Passing year cannot be in the future`;
  }

  return true;
};

/**
 * Validate a date range.
 * - Start date must not be in the future.
 * - Start date must be before the end date.
 * @param startDate The start date.
 * @param endDate The end date.
 */
export const validateDateRange = (
  startDate: Date | null,
  endDate: Date | null
) => {
  if (!startDate) {
    return "Start date is required";
  }

  if (startDate > new Date()) {
    return "Start date cannot be in the future";
  }

  if (endDate && startDate > endDate) {
    return "Start date must be before the end date";
  }

  return true;
};

export default {
  validateName,
  validateEmail,
  validateZipcode,
  validateAddress,
  validatePortfolio,
  validateAmount,
  validateExperience,
  validateDesignation,
  validateCompany,
  validatePassingYear,
  validateDateRange,
};
