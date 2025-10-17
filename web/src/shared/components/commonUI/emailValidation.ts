// emailValidation.ts
export const validateEmail = (value: string): true | string => {
  if (!value) return "Email ID is required";

  // Disallow leading or trailing spaces
  if (value !== value.trim()) return "Email must not start or end with a space";

  const trimmed = value.trim();

  // Enforce length
  if (trimmed.length < 10) return "Email must be at least 10 characters";
  if (trimmed.length > 100) return "Email must not exceed 100 characters";

  const emailRegex = /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) return "Please enter a valid email.";

  return true;
};

export const validateEmailRules = {
  required: "Email ID is required",
  maxLength: {
    value: 100,
    message: "Email id must not exceed 100 characters",
  },
  validate: validateEmail, // reuse the same function
};