// emailValidation.ts
/**
 * Performs a comprehensive validation of an email address string.
 *
 * This function checks for common email format errors, including presence,
 * length, character validity, and structure of both the local and domain parts.
 * It also validates the Top-Level Domain (TLD) against a predefined list of
 * allowed TLDs, including multi-part TLDs like 'co.in'.
 *
 * @param {string} value - The email string to be validated.
 * @returns {true | string} Returns `true` if the email is valid, otherwise a
 *   string containing a specific error message indicating the reason for failure.
 *
 * @example
 * validateEmail("test@example.com"); // returns true
 * validateEmail("test@.com"); // returns "Domain contains empty label"
 */
export const validateEmail = (value: string): true | string => {
  if (!value) return "Email ID is required";

  if (value !== value.trim()) return "Email must not start or end with a space";

  const trimmed = value.trim();

  if (trimmed.length < 10) return "Email must be at least 10 characters";
  if (trimmed.length > 100) return "Email must not exceed 100 characters";

  const parts = trimmed.split("@");
  if (parts.length !== 2) return "Please enter a valid email with a single @";

  const [localPart, domainPart] = parts;

  // Validate local part
  if (!localPart || localPart.length === 0)
    return "Email local part cannot be empty";
  if (localPart.startsWith(".") || localPart.endsWith("."))
    return "Email local part cannot start or end with a dot";
  if (localPart.includes(".."))
    return "Email local part cannot contain consecutive dots";
  if (!/^[a-zA-Z0-9._+-]+$/.test(localPart))
    return "Email local part contains invalid characters";

  // Validate domain
  if (!domainPart || domainPart.length === 0)
    return "Email domain cannot be empty";
  if (domainPart.startsWith("-") || domainPart.endsWith("-"))
    return "Domain labels cannot start or end with a hyphen";
  if (domainPart.includes(".."))
    return "Domain cannot contain consecutive dots";

  const domainLabels = domainPart.split(".");
  if (domainLabels.length < 2) return "Domain must contain at least one dot";

  // Only allow 2 or 3 label domains (e.g., example.com or example.co.in)
  if (domainLabels.length > 3) {
    return "Email domain must be in format: example.com or example.co.in";
  }

  const validTLDs = [
    "com",
    "org",
    "net",
    "in",
    "edu",
    "gov",
    "info",
    "co.in",
    "co.uk",
  ];

  let tldMatched = false;

  // Try 2-part TLD (only possible if domain has 3 labels)
  if (domainLabels.length === 3) {
    const lastTwo = domainLabels.slice(-2).join(".");
    if (validTLDs.includes(lastTwo)) {
      tldMatched = true;
    }
  }

  // Try 1-part TLD (for 2 or 3 label domains)
  if (!tldMatched && domainLabels.length >= 2) {
    const lastOne = domainLabels[domainLabels.length - 1];
    if (validTLDs.includes(lastOne)) {
      tldMatched = true;
    }
  }

  if (!tldMatched) {
    return "Please enter a valid email with a supported top-level domain (e.g., .com, .org, .co.in)";
  }

  // Additional: if 3 labels and matched 1-part TLD, reject (e.g., a.b.com → but b is not co)
  // Example: user@host.com.in → 3 labels, ends with .in → but .com.in is not in list → should reject
  if (domainLabels.length === 3) {
    const lastOne = domainLabels[2];
    const lastTwo = domainLabels.slice(1).join(".");
    // If only 1-part TLD matched, but 2-part version is NOT in list → likely invalid
    if (validTLDs.includes(lastOne) && !validTLDs.includes(lastTwo)) {
      return "Email domain format is not supported. Use example.com or example.co.in";
    }
  }

  // Validate each label
  for (const label of domainLabels) {
    if (label.length === 0) return "Domain contains empty label";
    if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(label)) {
      return "Domain contains invalid characters";
    }
  }

  return true;
};

/**
 * A pre-configured rules object for `react-hook-form` that uses `validateEmail`.
 * This can be passed directly to the `rules` prop of a `Controller` or `register` call.
 */
export const validateEmailRules = {
  required: "Email ID is required",
  maxLength: {
    value: 100,
    message: "Email id must not exceed 100 characters",
  },
  validate: validateEmail, // reuse the same function
};
