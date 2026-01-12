export const validateDescription = (
  minLength: number,
  maxLength: number,
  label: string,
) => ({
  required: `${label} is required`,
  maxLength: {
    value: maxLength,
    message: `Maximum length is ${maxLength} characters`,
  },
  minLength: {
    value: minLength,
    message: `Minimum length is ${minLength} characters`,
  },

  pattern: {
    value: /^[A-Za-z0-9\s\/(),.\-#]*$/,
    message:
      "Only letters, numbers, spaces, and special characters / ( ) , . - # are allowed.",
  },
});

/**
 * validateNumericInput
 * Validates a numeric field:
 * - Must not be empty
 * - Must contain only digits
 * - Must not exceed a specified maximum amount
 */
export const validateNumericInput = (maxAmount: number, label: string) => ({
  required: `${label} is required`,
  pattern: {
    value: /^[0-9]+$/,
    message: `${label} must contain only digits.`,
  },
  validate: (value: string) => {
    const numericValue = Number(value);
    if (isNaN(numericValue)) {
      return `${label} must be a valid number.`;
    }
    if (numericValue > maxAmount) {
      return `${label} cannot be more than the amount offered in the posted job (${maxAmount}).`;
    }
    return true;
  },
});
