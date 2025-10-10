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
  if (value.length < 10) {
    return "Password must be at least 10 characters long";
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
  if (!/[@$!%*?&]/.test(value)) {
    return "Password must include at least one special character (@$!%*?&)";
  }
  return true;
};

/**
 * Map of phone validation rules by country code.
 * Add new country rules here to extend supported phone types.
 */
export const phoneValidations: Record<
  string,
  { regex: RegExp; message: string }
> = {
  "+91": {
    // Allows optional +91 or 0 prefix, followed by 10 digits starting with 6–9
    regex: /^(?:\+91|0)?[6-9]\d{9}$/,
    message: "Enter a valid Indian mobile number (10 digits starting with 6–9)",
  },
  "+44": {
    // UK mobile numbers typically start with 7 and are 10 digits long after the country code
    regex: /^(?:\+44|0)?7\d{9}$/,
    message: "Enter a valid UK mobile number (starts with 7 and has 10 digits)",
  },
};


/**
 * validatePhone - reusable validator for react-hook-form.
 * Accepts the stored combined value (e.g. "+91 9876543210") and
 * returns true when valid or a string error message when invalid.
 */
export const validatePhone = (value: string) => {
  const [code, ...rest] = (value || "").split(" ");
  const number = rest.join("").replace(/\D/g, "");

  const rule = phoneValidations[code];
  if (rule) {
    return rule.regex.test(number) ? true : rule.message;
  }

  // Fallback message when country code is not recognized
  return "Enter a valid phone number";
};
