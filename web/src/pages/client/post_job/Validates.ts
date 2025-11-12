
import xss from "xss";

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
 * Validates that a date is the current date or a future date.
 * @param date The date to validate.
 * @returns {true | string} True if valid, otherwise an error message.
 */
export const validateCurrentOrFutureDate = (date: Date | null): true | string => {
  if (!date) {
    return "Date must be selected";
  }

  if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
    return "Date cannot be in the past";
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

  if (startDate < new Date(new Date().setHours(0, 0, 0, 0))) {
    return "Start date cannot be in the past";
  }

  if (endDate && startDate > endDate) {
    return "Start date must be before the end date";
  }

  return true;
};

export const validateProjectDeadline = (
  startDate: Date | null,  
) => {
 if (!startDate) {
    return "Start date is required";
  }

  if (startDate < new Date(new Date().setHours(0, 0, 0, 0))) {
    return "Start date cannot be in the past";
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

export const validateJobTitile = (value: string) => {
  if (!value) return "Job title is required.";

  // Disallow leading or trailing spaces
  if (/^\s|\s$/.test(value))
    return "Job title must not start or end with a space";

  const v = value.trim();
  if (v.length < 2) return "Job title must be at least 2 characters";
  if (v.length > 100) return "Job title must not exceed 100 characters";
  // Allow letters, spaces, and / , . - #
  if (!/^[A-Za-z\s/,.\-]+$/.test(v)) {
    return "Job title may contain only letters, spaces, and / , . -";
  }
  return true;
};

export const validateJobTimePeriod = (value: string) => {
  const v = value || "";
  
  if (!v) return "Time period is required";
  
  // Disallow any whitespace (including leading/trailing)
  if (/\s/.test(v)) return "Time period must not contain spaces";
  
  // Must be exactly 1 character
  if (v.length !== 1) return "Time period must be exactly 1 character";
  
  // Must be a digit
  if (!/^\d$/.test(v)) return "Time period must be a single digit (1–8)";
  
  const num = parseInt(v, 10);
  if (num < 1) return "Time period must be at least 1 hour";
  if (num > 8) return "Time period must not exceed 8 hours";
  
  return true;
};

export interface TextValidationOptions {
  minLength?: number;
  maxLength?: number;
  maxSpaces?: number; // total spaces allowed (default: 10)
  regex?: RegExp;     // optional custom base regex
  required?: boolean; // default: true
}

export const validateAlphabeticText = (
  value: string,
  options: TextValidationOptions = {}
): string | true => {
  const {
    minLength = 1,
    maxLength = Infinity,
    maxSpaces = 10,
    regex,
    required = true,
  } = options;

  const v = value || "";

  // Required check
  if (required && !v) {
    return "This field is required";
  }

  if (!required && !v) {
    return true;
  }

  // ❌ No leading or trailing spaces
  if (v.startsWith(" ") || v.endsWith(" ")) {
    return "Leading or trailing spaces are not allowed";
  }

  // ❌ No consecutive spaces (e.g., "a  b")
  if (/ {2,}/.test(v)) {
    return "Consecutive spaces are not allowed";
  }

  // Count total spaces
  const spaceCount = (v.match(/ /g) || []).length;
  if (spaceCount > maxSpaces) {
    return `Maximum ${maxSpaces} spaces allowed`;
  }

  // Allowed characters: letters, commas, and single spaces only
  const defaultPattern = /^[a-zA-Z,+# ]+$/;
  const pattern = regex ?? defaultPattern;

  if (!pattern.test(v)) {
    return "Only alphabets, commas, hashes, plus signs, and spaces are allowed";
  }

  // Length validation
  if (v.length < minLength) {
    return `Minimum length is ${minLength} characters`;
  }
  if (v.length > maxLength) {
    return `Maximum length is ${maxLength} characters`;
  }

  return true;
};

export const validateCurrencyText = (
  value: string,
  {
    minLength = 1,
    maxLength = Infinity,
    maxSpaces = 10,
    required = true,
  }: {
    minLength?: number;
    maxLength?: number;
    maxSpaces?: number;
    required?: boolean;
  } = {}
): string | true => {
  const v = value || "";

  if (required && !v) return "This field is required";
  if (!required && !v) return true;

  // No leading/trailing spaces
  if (v.startsWith(" ") || v.endsWith(" ")) {
    return "Leading or trailing spaces are not allowed";
  }

  // No consecutive spaces
  if (/ {2,}/.test(v)) {
    return "Consecutive spaces are not allowed";
  }

  // Count spaces
  const spaceCount = (v.match(/ /g) || []).length;
  if (spaceCount > maxSpaces) {
    return `Maximum ${maxSpaces} spaces allowed`;
  }

  // Allowed characters: letters + common currency symbols + space
  const allowedPattern = /^[0-9 $€£¥₹¢₩₽₴₵₦₱₺]+$/;
  if (!allowedPattern.test(v)) {
    return "Only numbers and currency symbols are allowed";
  }

  // Length checks
  if (v.length < minLength) return `Minimum length is ${minLength} characters`;
  if (v.length > maxLength) return `Maximum length is ${maxLength} characters`;

  return true;
};

export const validatePaymentMethods = (value: string | null | undefined) => {
  if (!value) return "Please select a payment method";
  return true;
};

export const validateConsent = (value: boolean) => {
  console.log("Consent value:", value); 
  if (!value) return "You must agree to the terms and conditions";
  return true;
};


export const validateAlphabeticTextArea = (
  value: string,
  options: TextValidationOptions = {}
): string | true => {
  const {
    minLength = 1,
    maxLength = Infinity,
    required = true,
  } = options;

  const v = value || "";

  // Required check
  if (required && !v) {
    return "This field is required";
  }

  if (!required && !v) {
    return true;
  }

  // ❌ No leading or trailing spaces
  if (v.startsWith(" ") || v.endsWith(" ")) {
    return "Leading or trailing spaces are not allowed";
  }

  // ❌ No consecutive spaces (e.g., "a  b")
  if (/ {2,}/.test(v)) {
    return "Consecutive spaces are not allowed";
  }  

   // Allowed characters: letters, spaces, numbers and special characters such as /( ) , .
  const defaultPattern = /^[a-zA-Z0-9 /().,]+$/;
  const pattern = defaultPattern;

  if (!pattern.test(v)) {
    return "Only letters, spaces, numbers, and special characters such as / ( ) , . are allowed";
  }


  // Cross-Site Scripting (XSS) check
  if (v !== xss(v)) {
    return "Potentially malicious content is not allowed";
  }

  // Length validation
  if (v.length < minLength) {
    return `Minimum length is ${minLength} characters`;
  }
  if (v.length > maxLength) {
    return `Maximum length is ${maxLength} characters`;
  }

  return true;
};