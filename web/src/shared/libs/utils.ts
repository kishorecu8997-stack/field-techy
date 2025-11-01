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
  if (!/[^A-Za-z0-9]/.test(value)) {
    return "Password must include at least one special character";
  }
  if (/\s/.test(value)) {
    return "Password must not contain spaces";
  }
  return true;
};

export const validatePortfolioLink = (value: string) => {
  if (/^\s|\s$/.test(value || ""))
    return "PortfolioLink must not start or end with a space";

  const v = (value || "").trim();

  if (!v) return true; // ✅ Field is optional now

  // ✅ Enforce min 10 and max 200 characters
  if (v.length < 10) return "Portfolio link must be at least 10 characters";
  if (v.length > 200) return "Portfolio link must not exceed 200 characters";

  if (/<\s*script/gi.test(v)) return "Scripting tags are not allowed";

  try {
    const url = new URL(v);

    if (!["http:", "https:"].includes(url.protocol)) {
      return "Portfolio link must start with http:// or https://";
    }

    const hostname = url.hostname.toLowerCase();
    const pathname = url.pathname.replace(/\/+$/, ""); // remove trailing slashes

    const isGitHubProfile =
      hostname.includes("github.com") && /^\/[^/]+$/.test(pathname);

    const isLinkedInProfile =
      hostname.includes("linkedin.com") && /^\/in\/[^/]+$/.test(pathname); // LinkedIn profiles follow /in/username

    const isExampleProfile =
      hostname.includes("example.com") && /^\/[^/]+$/.test(pathname); // Example profiles follow /username

    const isPersonalSite =
      !hostname.includes("linkedin.com") &&
      !hostname.includes("github.com") &&
      !hostname.endsWith(".zip") &&
      !hostname.endsWith(".exe") &&
      !hostname.includes("malware") &&
      !hostname.includes("phishing") &&
      !hostname.includes("adult") &&
      !hostname.includes("torrent") &&
      pathname === ""; // homepage only

    const isAllowed =
      isGitHubProfile ||
      isLinkedInProfile ||
      isExampleProfile ||
      isPersonalSite;

    if (!isAllowed) {
      return "Only GitHub, LinkedIn profile URL, or safe personal homepages are allowed";
    }

    return true;
  } catch {
    return "Portfolio link must be a valid URL";
  }
};

export const validateName = (value: string) => {
  const raw = value || "";

  // Reject leading or trailing spaces
  if (raw !== raw.trim())
    return "Input must not have leading or trailing spaces";

  // Reject consecutive spaces
  if (/ {2,}/.test(raw)) {
    return "Input must not contain consecutive spaces";
  }

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
