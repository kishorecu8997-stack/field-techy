export const validateEmailRules = {
  required: "Email ID is required",
  maxLength: {
    value: 100,
    message: "Email must not exceed 100 characters",
  },
  validate: (value: string) => {
    if (/^\s|\s$/.test(value)) return "Email must not start or end with a space";
    if (/\s{2,}/.test(value)) return "Email must not contain multiple consecutive spaces";

    const trimmed = value.trim();
    const emailRegex = /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) return "Please enter a valid email.";

    return true;
  },
};
