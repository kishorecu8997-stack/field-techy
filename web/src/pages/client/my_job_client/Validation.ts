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
