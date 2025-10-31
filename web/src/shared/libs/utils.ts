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
    regex: /^[6-9]\d{9}$/,
    message: "Enter a valid 10-digit Indian mobile number",
  },
  "+44": {
    regex: /^\d{10}$/,
    message: "Enter a valid 10-digit UK mobile number",
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

export const cardNumberValidation = (value: string) => {
  const raw = value || "";
  const cleanedValue = raw.replace(/\s/g, "");
  if (!cleanedValue) return "Card number is required.";
  if (!/^\d{13,19}$/.test(cleanedValue)) {
    return "Card number must be 13 to 19 digits.";
  }
  return true;
};

export const expiryDateValidation = (value: string) => {
  const raw = value || "";
  if (!raw) return "Expiry date is required.";
  if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(raw)) {
    return "Invalid date format. Use MM/YY.";
  }
  const match = raw.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/);
  if (!match) return true; // Let pattern handle format errors
  const [, month, year] = match;
  const expiryDate = new Date(Number(`20${year}`), Number(month) - 1); // Month is 0-indexed
  const now = new Date();
  // Set current date to first of the month for fair comparison
  now.setDate(1);
  return expiryDate >= now || "Card has expired.";
};

export const cvvValidation = (value: string) => {
  const raw = value || "";
  if (!raw) return "CVV is required.";
  if (!/^\d{3,4}$/.test(raw)) {
    return "CVV must be 3 or 4 digits.";
  }
  return true;
};

