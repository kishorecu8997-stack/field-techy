import xss from "xss";
import type { SelectOption } from "@/shared/components/commonUI/inputs/types";
import type {
  PricingField,
  PricingRelations,
} from "@/pages/admin/rate_card/types";

export const validateName = (value: string) => {
  const raw = value || "";

  // Reject leading or trailing spaces
  if (raw !== raw.trim()) return `${value} must not have first or last spaces`;

  // Reject consecutive spaces
  if (/ {2,}/.test(raw)) return `${value} must not contain consecutive spaces`;

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
  if (!value) return "Address must be at least 6 characters";

  // Disallow leading or trailing spaces
  if (/^\s|\s$/.test(value)) {
    return "Address must not start or end with a space";
  }

  // Disallow multiple consecutive spaces
  if (/\s{2,}/.test(value)) {
    return "Address must not contain consecutive spaces";
  }

  const v = value.trim(); // technically redundant now, but safe
  if (v.length < 6) return "Address must be at least 6 characters";
  if (v.length > 50) return "Address must not exceed 50 characters";

  // Allow only letters, numbers, spaces, and / , . - #
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
  if (!value) return "Employer must be at least 4 characters";

  // Disallow leading or trailing spaces
  if (/^\s|\s$/.test(value))
    return "Employer must not start or end with a space";

  const v = value.trim();
  if (v.length < 4) return "Employer must be at least 4 characters";
  if (v.length > 50) return "Employer must not exceed 50 characters";

  // Only letters, numbers, and / & - . with single spaces between
  if (!/^[A-Za-z0-9/&.-]+(?: [A-Za-z0-9/&.-]+)*$/.test(v)) {
    return "Employer may contain only letters, numbers, single spaces, and / & - .";
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
  if (/^\s|\s$/.test(value || ""))
    return "Passing Year must not start or end with a space";

  const yearStr = (value || "").trim();
  if (!yearStr) return "Passing Year is required";

  // Disallow leading or trailing spaces

  if (/\s/.test(yearStr))
    return "Passing Year must not contain internal spaces";
  // Ensure the value contains only digits and is exactly 4 characters long.
  if (!/^\d{4}$/.test(yearStr) || /\D/.test(yearStr)) {
    return "Passing year must be a 4-digit number without symbols or letters";
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

export const validateRate = (value: string) => {
  if (/^\s|\s$/.test(value || ""))
    return "Rate must not start or end with a space";

  const v = (value || "").trim();

  if (!v) return "Rate is required";

  // Block +, -, e, E and other non-numeric characters explicitly
  if (/[+\-eE]/.test(v) || /[^\d.]/.test(v.replace(".", ""))) {
    return "Rate must be a valid number and cannot contain symbols and letters";
  }

  // Only numbers with up to 5 digits before decimal, optional decimal with up to 2 digits
  if (!/^\d{1,5}(\.\d{1,2})?$/.test(v)) {
    return "Rate must be a number with up to 5 digits before the decimal and up to 2 decimal places";
  }

  const num = Number(v);
  if (isNaN(num)) return "Rate must be a valid number";
  if (num < 1) return "Rate must be greater than or equal to 1";

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

/**
 * Validates if a field has been verified.
 * @param verified - The verification status.
 * @param fieldName - The name of the field being validated.
 * @returns {true | string} - True if verified, otherwise an error message.
 */
export const validateIsVerified = (verified: boolean, fieldName: string) => {
  return verified ? true : `${fieldName} must be verified.`;
};

/**
 * Specific validator for phone number verification status.
 * @param {boolean} verified - The verification status of the phone number.
 * @returns {true | string} - True if verified, otherwise an error message.
 */
export const validateIsPhoneVerified = (verified: boolean) => {
  return validateIsVerified(verified, "Phone number");
};

export const cardNumberValidation = (value: string) => {
  const raw = value?.trim() || ""; // Trim whitespace from both ends of the input

  if (/^\s|\s$/.test(raw)) {
    return "Card number must not start or end with a space.";
  }

  const cleanedValue = raw.replace(/\s/g, ""); // Remove all whitespace
  if (!cleanedValue) return "Card number is required.";

  if (!/^\d{12,19}$/.test(cleanedValue)) {
    return "Card number must be 12 to 19 digits.";
  }

  if (/^0+$/.test(cleanedValue)) {
    return "Card number cannot be all zeros.";
  }

  if (!luhnCheck(cleanedValue)) {
    return "Invalid card number.";
  }

  return true; // Validation successful
};

// Luhn Algorithm for checksum validation
const luhnCheck = (cardNumber: string) => {
  let sum = 0;
  let alternate = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let n = parseInt(cardNumber.charAt(i), 10);

    if (alternate) {
      n *= 2;
      if (n > 9) {
        n -= 9;
      }
    }
    sum += n;
    alternate = !alternate; // Toggle alternate flag
  }

  return sum % 10 === 0; // Valid if sum is a multiple of 10
};

export const expiryDateValidation = (value: string) => {
  const raw = value?.trim() || "";

  if (!raw) {
    return "Expiry date is required.";
  }

  if (/^\s|\s$/.test(raw)) {
    return "Expiry date must not start or end with a space.";
  }

  if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(raw)) {
    return "Invalid date format. Use MM/YY.";
  }

  const match = raw.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/);
  if (!match) {
    return "Invalid date format.";
  }

  const [, monthStr, yearStr] = match;
  const expiryMonth = parseInt(monthStr, 10);
  const currentYear = new Date().getFullYear();
  const twoDigitYear = parseInt(yearStr, 10);

  // Determine full year based on the current year
  const expiryYear = currentYear - (currentYear % 100) + twoDigitYear;

  const now = new Date();
  const maxExpiryYear = currentYear + 5; // Maximum expiry year set to 5 years from now

  // Check if the expiry year exceeds the max allowed
  if (expiryYear > maxExpiryYear) {
    return `Expiry date cannot be more than 5 years from the current year (${maxExpiryYear}).`;
  }

  // Set to the first day of the expiry month for comparison
  const expiryDate = new Date(expiryYear, expiryMonth - 1, 1);

  // Check if the expiry date is valid
  if (
    expiryDate > now ||
    (expiryYear === currentYear && expiryMonth >= now.getMonth() + 1)
  ) {
    return true; // Validation successful
  }

  return "Card has expired.";
};

export const cvvValidation = (value: string) => {
  const raw = value || "";
  if (!raw) return "CVV is required.";
  if (!/^\d{3,4}$/.test(raw)) {
    return "CVV must be 3 or 4 digits.";
  }
  return true;
};
export const countryValidation = (value: string) => {
  const raw = value || "";
  if (!raw) return "Country is required.";
  return true;
};

export const addressRequiredValidation = (value: string) => {
  const raw = value || "";
  if (!raw) return "Address is required.";
  return true;
};

export const validateJobDescription = (value: string) => {
  const v = value.trim();
  if (v.length < 20) return "Job description must be at least 20 characters";
  if (v.length > 50) return "Job description must not exceed 50 characters";
  // Allow letters, numbers, spaces, and / , . - #
  if (!/^[A-Za-z0-9\s/,.\-#]+$/.test(v)) {
    return "Job description may contain only letters, numbers, spaces, and / , . - #";
  }
  return true;
};

export const validateCategoryName = (value: string) => {
  const trimmed = value.trim();

  // Reject if original had leading or trailing spaces
  if (trimmed !== value) {
    return "Category name must not have leading or trailing spaces";
  }

  if (trimmed.length < 3) {
    return "Category name must be at least 3 characters";
  }
  if (trimmed.length > 50) {
    return "Category name must not exceed 50 characters";
  }

  // Reject consecutive spaces
  if (/ {2,}/.test(trimmed)) {
    return "Category name must not contain consecutive spaces";
  }

  // Allow only letters, spaces, underscores, and hyphens
  if (!/^[A-Za-z _&-]+$/.test(trimmed)) {
    return "Category name may contain only letters, spaces, underscores (_), and hyphens (-), and ampersand (&)";
  }

  return true;
};
/**
 * Validates that a payment method has been selected.
 * The value is expected to be a `SelectOption` object.
 * @param {SelectOption} value - The selected payment method object.
 * @returns {true | string} - True if valid, otherwise an error message.
 */
export const validatePaymentMethods = (value: SelectOption): true | string => {
  return value && value.value ? true : "Payment method is required";
};

export const CommissionValidation = (value: string): true | string => {
  const raw = (value || "").trim();

  // Required check
  if (!raw) {
    return "Commission is required.";
  }

  // Disallow values that start with a dot (e.g., ".5", ".00")
  // Also disallow empty or malformed patterns
  if (!/^\d+(?:\.\d*)?$/.test(raw)) {
    return "Commission must be a valid number.";
  }

  const num = parseFloat(raw);

  if (isNaN(num)) {
    return "Commission must be a valid number.";
  }

  // Range check: 0 <= commission <= 100
  if (num < 0) {
    return "Commission cannot be less than 0.";
  }
  if (num > 100) {
    return "Commission cannot be more than 100.";
  }

  // Decimal precision: up to 2 decimal places
  const decimalPart = raw.includes(".") ? raw.split(".")[1] : "";
  if (decimalPart.length > 2) {
    return "Commission cannot have more than 2 decimal places.";
  }

  return true; // valid
};

export const validatePricePerHour = (value: string) => {
  const raw = value || "";

  // Reject leading/trailing spaces
  if (raw !== raw.trim()) {
    return "Price must not have leading or trailing spaces";
  }

  // Must not be empty
  if (raw === "") {
    return "Price is required";
  }

  // Must match: one or more digits, optionally followed by . and 1 or 2 digits
  if (!/^\d+(\.\d{1,2})?$/.test(raw)) {
    return "Price must be a positive number with up to 2 decimal";
  }

  // Parse and check it's greater than 0
  const num = parseFloat(raw);
  if (num <= 0) {
    return "Price must be greater than 0";
  }

  return true;
};

export const validatePricingModel = (
  value: string,
  field: PricingField,
  relatedValues?: PricingRelations
): true | string => {
  const v = (value || "").trim();

  // Allow empty (legacy behavior)
  if (!v) return "";

  // Base validations
  if (/\s/.test(v)) return "Value cannot contain spaces";

  const num = Number(v);
  if (Number.isNaN(num)) return "Enter a valid number";
  if (num === 0) return "Value cannot be zero";

  if (!/^\d+(\.\d{1,2})?$/.test(v)) return "Use max 2 decimal places";

  const [integerPart] = v.split(".");
  if (integerPart.length < 1) return "Enter a valid amount";

  if (!relatedValues) return true;

  const { hourly, halfDay, fullDay, weekly } = relatedValues;

  // -----------------------------------
  // RELATIONAL VALIDATION (IMPROVED TEXT)
  // -----------------------------------
  switch (field) {
    // case "hourly":
    //   return "";
    case "hourly": {
      // if (num == null || num === 0) {
      //   return "Hourly rate is required and must be at least 1";
      // }
      return true;
    }
    case "halfDay": {
      if (hourly == null) return "Please enter hourly rate first";
      const min = hourly * 4;
      if (num < min) return `Half-day must be at least ${min}`;
      return true;
    }

    case "fullDay": {
      if (hourly == null || halfDay == null)
        return "Please enter hourly and half-day first";

      const minHourly = hourly * 8;
      if (num < minHourly) return `Full-day must be at least ${minHourly}`;

      const minHalf = halfDay * 2;
      if (num < minHalf) return `Full-day must be at least ${minHalf}`;

      return true;
    }

    case "weekly": {
      if (hourly == null || halfDay == null || fullDay == null)
        return "Please complete previous fields first";

      const minFromHourly = hourly * 40;
      if (num < minFromHourly)
        return `Weekly rate must be at least ${minFromHourly}`;

      const minFromHalfDay = halfDay * 10;
      if (num < minFromHalfDay)
        return `Weekly rate must be at least ${minFromHalfDay}`;

      const minFromFullDay = fullDay * 5;
      if (num < minFromFullDay)
        return `Weekly rate must be at least ${minFromFullDay}`;

      return true;
    }

    case "monthly": {
      if (
        hourly == null ||
        halfDay == null ||
        fullDay == null ||
        weekly == null
      )
        return "Please complete previous fields first";

      const minHourly = hourly * 3;
      if (num <= minHourly) return `Monthly must be greater than ${minHourly}`;

      const minHalf = halfDay * 40;
      if (num < minHalf) return `Monthly must be at least ${minHalf}`;

      const minFull = fullDay * 20;
      if (num < minFull) return `Monthly must be at least ${minFull}`;

      const minWeekly = weekly * 4;
      if (num < minWeekly) return `Monthly must be at least ${minWeekly}`;

      return true;
    }

    default:
      return true;
  }
};

export const validateNotificationMessage = (value: string) => {
  const raw = value || "";

  // Trim check: reject if has leading or trailing spaces
  if (raw !== raw.trim()) {
    return "Message must not have leading or trailing spaces";
  }

  // Reject if contains double (or more) consecutive spaces
  if (/ {2,}/.test(raw)) {
    return "Message must not contain consecutive spaces";
  }

  // Length check
  if (raw.length < 10) {
    return "Message must be at least 10 characters";
  }
  if (raw.length > 500) {
    return "Message must not exceed 500 characters";
  }

  const allowedPattern = /^[A-Za-z0-9 /(),.#-]+$/;

  if (!allowedPattern.test(raw)) {
    return "Only letters, spaces, numbers, and special characters such as / ( ) , . - # are allowed.";
  }

  return true;
};

export const validateLocation = (value: string) => {
  if (!value) return "Location must be at least 3 characters";

  // Disallow leading or trailing spaces
  if (/^\s|\s$/.test(value))
    return "Location must not start or end with a space";

  const v = value.trim();
  if (v.length < 3) return "Location must be at least 3 characters";
  if (v.length > 50) return "Location must not exceed 50 characters";

  // Allow letters, numbers, spaces, and / , . - #
  if (!/^[A-Za-z0-9\s/,.\-#]+$/.test(v)) {
    return "Location may contain only letters, numbers, spaces, and / , . - #";
  }

  return true;
};

export const validateQuestion = (value: string): string | true => {
  if (!value) return "Question is required";

  if (/^\s|\s$/.test(value)) {
    return "Question must not start or end with a space";
  }

  if (/\s{2,}/.test(value)) {
    return "Question must not contain consecutive spaces";
  }

  if (value.length < 5) return "Question must be at least 5 characters";
  if (value.length > 200) return "Question must not exceed 200 characters";

  // Allow: letters, numbers, spaces, and / , . - # ( ) ?
  if (!/^[A-Za-z0-9\s/,.#()?-]+$/.test(value)) {
    return "Only letters, numbers, spaces, and special characters such as / ( ) , . - # ? are allowed.";
  }

  return true;
};
export const validateNotificationTitle = (value: string) => {
  const raw = value || "";

  // Reject if has leading or trailing spaces
  if (raw !== raw.trim()) {
    return "Message must not have leading or trailing spaces";
  }

  // Length checks
  if (raw.length < 5) return "Title must be at least 5 characters";
  if (raw.length > 100) return "Title must not exceed 100 characters";

  // Disallow any digits (0-9)
  if (/\d/.test(raw)) return "Title must not contain numbers";

  // Allow only letters and spaces (no emojis, no symbols, no punctuation)
  if (!/^[A-Za-z ]+$/.test(raw)) {
    return "Title must contain only letters and spaces";
  }
  return true;
};
export interface TextValidationOptions {
  minLength?: number;
  maxLength?: number;
  regex?: RegExp;
  required?: boolean;
}

export const validateAlphabeticTextArea = (
  value: string,
  options: TextValidationOptions = {}
): string | true => {
  const { minLength = 1, maxLength = Infinity, required = true } = options;

  const v = value || "";

  if (required && !v) {
    return "This field is required";
  }

  if (!required && !v) {
    return true;
  }

  if (v.startsWith(" ") || v.endsWith(" ")) {
    return "Leading or trailing spaces are not allowed";
  }

  if (/ {2,}/.test(v)) {
    return "Consecutive spaces are not allowed";
  }

  // Allowed characters: letters, spaces, numbers and special characters such as / ( ) , . ' #
  const defaultPattern = /^[a-zA-Z0-9 /().,'#-]+$/;
  const pattern =
    options?.regex instanceof RegExp ? options.regex : defaultPattern;

  if (!pattern.test(v)) {
    return "Only letters, spaces, numbers, and special characters such as / ( ) , . # are allowed";
  }

  // Cross-Site Scripting (XSS) check
  if (v !== xss(v)) {
    return "Potentially malicious content is not allowed";
  }

  if (v.length < minLength) {
    return `Minimum length is ${minLength} characters`;
  }
  if (v.length > maxLength) {
    return `Maximum length is ${maxLength} characters`;
  }

  return true;
};

export interface CheckboxValidationOptions {
  required?: boolean;
  minSelected?: number;
  maxSelected?: number;
}

export const validateCheckboxGroup = (
  values: (string | number | boolean)[],
  options: CheckboxValidationOptions = {}
): string | true => {
  const { required = true, minSelected = 1, maxSelected = Infinity } = options;

  // Normalize: treat `null`, `undefined`, or non-array as empty
  const selected = Array.isArray(values)
    ? values.filter((v) => v !== false && v != null && v !== "")
    : [];

  if (required && selected.length === 0) {
    return "At least one option must be selected";
  }

  if (!required && selected.length === 0) {
    return true;
  }

  if (selected.length < minSelected) {
    return `At least ${minSelected} option(s) must be selected`;
  }

  if (selected.length > maxSelected) {
    return `You can select up to ${maxSelected} option(s)`;
  }

  return true;
};

export const validateProjectName = (value: string, fieldName: string) => {
  const raw = value || "";

  if (raw !== raw.trim()) {
    return `${fieldName} must not have leading or trailing spaces`;
  }

  if (/ {2,}/.test(raw)) {
    return `${fieldName} must not contain consecutive spaces`;
  }

  if (!/^[A-Za-z0-9#@_. -]+$/i.test(raw)) {
    return `${fieldName} can only contain letters, numbers, and the following symbols: # @ _ - . or space`;
  }

  if (raw.length < 2) {
    return `${fieldName} must be at least 2 characters`;
  }

  if (raw.length > 50) {
    return `${fieldName} must not exceed 50 characters`;
  }

  return true;
};

export const validateDescription = (value: string) => {
  //Reject if has leading or trailing spaces
  if (value !== value.trim()) {
    return "Description must not have leading or trailing spaces";
  }

  const v = value.trim(); // now v === value, but kept for clarity

  //Reject consecutive spaces
  if (/ {2,}/.test(v)) {
    return "Description must not contain consecutive spaces";
  }

  //Length check
  if (v.length < 10) {
    return "Description must be at least 10 characters";
  }
  if (v.length > 500) {
    return "Description must not exceed 500 characters";
  }

  //Character whitelist: alphanumerics, space, and / , . - # ( )
  if (!/^[A-Za-z0-9\s/,.\-#()]+$/u.test(v)) {
    return "Description may only contain letters, numbers, spaces, and / , . - # ( )";
  }

  return true;
};

export const validateBudget = (value: string) => {
  const raw = value || "";

  if (!raw.trim()) return "Budget is required";

  // Only numbers + comma allowed
  if (!/^[0-9,]+$/.test(raw)) {
    return "Budget can contain only numbers and commas";
  }

  // No leading or trailing comma
  if (raw.startsWith(",") || raw.endsWith(",")) {
    return "Budget must not start or end with a comma";
  }

  // No consecutive commas
  if (raw.includes(",,")) {
    return "Budget cannot contain consecutive commas";
  }

  // Remove commas
  const digitsOnly = raw.replace(/,/g, "");

  // Must be only digits
  if (!/^\d+$/.test(digitsOnly)) {
    return "Invalid budget format";
  }

  // Convert to number
  const num = Number(digitsOnly);

  // Must be > 0
  if (num <= 0) {
    return "Budget must be greater than 0";
  }

  return true;
};

export const validatePurchaseOrderNumber = (value: string) => {
  const raw = value || "";

  if (!raw.trim()) return "Purchase Order Number is required";

  // Leading/trailing spaces
  if (raw !== raw.trim()) return "Must not have leading or trailing spaces";

  // Consecutive spaces
  if (raw.includes("  ")) return "Must not contain consecutive spaces";

  // Only letters + numbers
  if (!/^[A-Za-z0-9]+$/.test(raw))
    return "Only letters and numbers are allowed";

  // Length 2–6
  if (raw.length < 2) return "Must be at least 2 characters";
  if (raw.length > 6) return "Must not exceed 6 characters";

  return true;
};

export const validateSiteId = (value: string) => {
  const raw = value || "";

  // Required
  if (!raw.trim()) {
    return "Site ID is required";
  }

  // No spaces allowed (leading, trailing, or internal)
  if (raw !== raw.trim() || raw.includes(" ")) {
    return "Must not contain spaces";
  }

  // Only alphanumeric characters
  if (!/^[A-Za-z0-9]+$/.test(raw)) {
    return "Only letters and numbers are allowed";
  }

  // Length: 2 to 6
  if (raw.length < 2) {
    return "Must be at least 2 characters";
  }
  if (raw.length > 20) {
    return "Must not exceed 20 characters";
  }

  // Must contain at least one digit (letters are optional)
  if (!/[0-9]/.test(raw)) {
    return "Must contain at least one number";
  }

  return true;
};

export const validateSiteName = (value: string) => {
  const raw = value || "";

  // 1. Basic length check (on full string, but we'll validate content more strictly below)
  if (raw.length < 2) {
    return "Site name must be at least 2 characters long";
  }
  if (raw.length > 200) {
    return "Site name must not exceed 200 characters";
  }

  // 2. No leading or trailing spaces
  if (raw !== raw.trim()) {
    return "Must not have leading or trailing spaces";
  }

  // 3. No consecutive spaces
  if (raw.includes("  ")) {
    return "Must not contain consecutive spaces";
  }

  // 4. Only allowed characters: letters, digits, space, and specific symbols
  const allowedPattern = /^[A-Za-z0-9\s\-_,.#@&()/:;–—]+$/;
  if (!allowedPattern.test(raw)) {
    return "Only letters, numbers, single spaces, and these symbols are allowed: - _ , . # @ & ( ) / : ;";
  }

  // 5. Additional safety: ensure after all checks, effective content is still ≥10 chars
  // (e.g., if someone tries "a    b" with many spaces but few real chars)
  const effectiveLength = raw.trim().length;
  if (effectiveLength < 2) {
    return "Site name must contain at least 2 valid characters (excluding extra spaces)";
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
  validateRate,
  validatePortfolioLink,
  validateIsVerified,
  validateIsPhoneVerified,
  cardNumberValidation,
  expiryDateValidation,
  cvvValidation,
  countryValidation,
  addressRequiredValidation,
  CommissionValidation,
  validatePricePerHour,
  validateLocation,
  validateQuestion,
  validateAlphabeticTextArea,
  validateNotificationTitle,
  validateNotificationMessage,
  validateCategoryName,
  validateCheckboxGroup,
  validateProjectName,
  validateDescription,
  validateBudget,
  validatePurchaseOrderNumber,
  validateSiteId,
  validateSiteName,
};
