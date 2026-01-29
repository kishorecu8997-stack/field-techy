/**
 * @file A collection of validation functions for the user profile setup form.
 *
 * This module provides a set of reusable validators designed to be used with
 * `react-hook-form`. Each function targets a specific field (e.g., name, address,
 * portfolio link) and returns `true` for valid input or a string with an
 * error message for invalid input.
 */

/**
 * Validates a name field (first or last).
 * - Must not contain any spaces.
 * - Must contain only alphabetic characters.
 * - Must be between 2 and 50 characters long.
 * @param {string} value - The name string to validate.
 * @param {string} [fieldLabel="Name"] - The label for the field, used in error messages.
 * @returns {true | string} True if valid, otherwise an error message.
 */
export const validateName = (value: string, fieldLabel = "Name") => {
  // length requirement: 2 to 50 characters
  const raw = value || "";
  // Reject leading/trailing spaces
  if (/^\s|\s$/.test(value))
    return `${fieldLabel} must not start or end with a space`;

  // Reject multiple consecutive spaces while allowing single spaces between words
  if (/\s{2,}/.test(value))
    return `${fieldLabel} must not contain multiple consecutive spaces`;

  // Only letters allowed (A-Z) with single spaces allowed between multiple words
  if (!/^[A-Za-z]+( [A-Za-z]+)*$/.test(value || ""))
    return `${fieldLabel} must contain only alphabetic characters (no numbers or special characters)`;

  // length requirement: 2 to 50 characters
  if (raw.length < 2) return `${fieldLabel} must be at least 2 characters`;
  if (raw.length > 50) return `${fieldLabel} must not exceed 50 characters`;

  return true;
};

/**
 * Validates a postal code based on the selected country.
 * - For India ('in'): Must be exactly 6 digits.
 * - For the UK ('uk'): Must be 6-8 alphanumeric characters with at most one internal space.
 * @param {string} value - The postal code to validate.
 * @param {string} [country] - The country code ('in' or 'uk') to apply specific rules.
 * @returns {true | string} True if valid, otherwise an error message.
 */
export const validateZipcode = (value: string, country?: string) => {
  const v = value || "";

  if (country === "in") {
    // Reject leading/trailing spaces
    if (v !== v.trim()) {
      return "PIN code must not start or end with a space";
    }

    // Must be exactly 6 digits
    if (!/^\d{6}$/.test(v.trim())) {
      return "Enter a valid 6-digit postal code for India";
    }

    return true;
  }

  if (country === "uk") {
    // Reject leading/trailing spaces
    if (v !== v.trim()) {
      return "UK postal code must not start or end with a space";
    }

    // Reject more than one internal space
    const spaceCount = (v.match(/ /g) || []).length;
    if (spaceCount > 1) {
      return "UK postal code can contain at most one internal space";
    }

    // Must be 6–8 characters total (including space if present)
    if (v.length < 6 || v.length > 8) {
      return "UK postal code must be 6–8 characters long";
    }

    // Must be alphanumeric with optional single space
    const ukRegex = /^([A-Za-z0-9]{1,4} [A-Za-z0-9]{1,4}|[A-Za-z0-9]{6,8})$/;
    if (!ukRegex.test(v)) {
      return "Enter a valid UK postal code (alphanumeric, optional single space)";
    }

    return true;
  }

  // Default: accept anything
  return true;
};

/**
 * Validates a street address.
 * - Must not start or end with a space.
 * - Must be between 6 and 50 characters long.
 * - Allows letters, numbers, spaces, and the characters /, . - #
 * @param {string} value - The address string to validate.
 * @returns {true | string} True if valid, otherwise an error message.
 */
export const validateAddress = (value: string) => {
  if (!value) return "Address must be at least 6 characters";

  // Disallow leading or trailing spaces
  if (/^\s|\s$/.test(value))
    return "Address must not start or end with a space";

  const v = value.trim();
  if (v.length < 6) return "Address must be at least 6 characters";
  if (v.length > 100) return "Address must not exceed 100 characters";
  if (!/[A-Za-z]/.test(v)) {
    return "Address must contain at least one letter";
  }
  // Allow letters, numbers, spaces, and / , . - #
  if (!/^[A-Za-z0-9\s/,.\-#]+$/.test(v)) {
    return "Address may contain only letters, numbers, spaces, and / , . - #";
  }

  return true;
};

/**
 * Validates a monetary amount.
 * - The field is required.
 * - Must be a valid number, allowing up to two decimal places.
 * - The value must be between 1 and 99999.
 * @param {string} value - The amount string to validate.
 * @returns {true | string} True if valid, otherwise an error message.
 */
const MAX_BUDGET = 10000000;
const MIN_AMOUNT = 1;
export const validateAmount = (value: string) => {
  if (!value) return "Amount is required";
  if (/\s/.test(value)) return "Spaces are not allowed";
  // Remove leading/trailing spaces just in case
  const v = value.trim();

  // Allow digits only OR digits.digits (max 2 decimals), allow typing single dot
  if (!/^\d*\.?\d{0,2}$/.test(v)) {
    return "Amount must be a valid number with up to 2 decimal places (e.g., 50 or 50.99)";
  }

  const num = parseFloat(v);
  if (!isNaN(num)) {
    if (num < MIN_AMOUNT) return "Amount must be at least 1";
    if (num > MAX_BUDGET)
      return `Budget cannot exceed ${MAX_BUDGET.toLocaleString()}`;
  }

  return true;
};

/**
 * Validates a job designation.
 * - Must be between 2 and 50 characters.
 * - Must not start or end with a space.
 * - Allows only letters and single spaces between words.
 * @param {string} value - The designation string to validate.
 * @returns {true | string} True if valid, otherwise an error message.
 */
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

/**
 * Validates a company name.
 * - Must be between 4 and 50 characters.
 * - Must not start or end with a space.
 * - Allows letters, numbers, single spaces, and the characters / & - .
 * @param {string} value - The company name to validate.
 * @returns {true | string} True if valid, otherwise an error message.
 */
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
 * Validates years of experience.
 * - The field is required.
 * - Must be a whole number between 1 and 99.
 * @param {string} value - The experience value to validate.
 * @returns {true | string} True if valid, otherwise an error message.
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

export default {
  validateName,
  validateZipcode,
  validateAddress,
  validateAmount,
  validateExperience,
  validateDesignation,
  validateCompany,
  validateIsVerified,
  validateIsPhoneVerified,
};
