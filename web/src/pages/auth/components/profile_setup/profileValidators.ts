/**
 * Profile validators for the Profile Setup form.
 */

/**
 * Validate name (first/last) - only letters allowed (no spaces), length 8-35
 */
export const validateName = (value: string, fieldLabel = 'Name') => {
  // length requirement: 2 to 50 characters
  const raw = value || "";

    // Reject any whitespace (leading/trailing/internal)
    if (/\s/.test(raw)) return `${fieldLabel} must not contain spaces`;

    // Only letters allowed (A-Z)
    if (!/^[A-Za-z]+$/.test(raw))
      return `${fieldLabel} must contain only alphabetic characters (no numbers or special characters)`;

    // length requirement: 2 to 50 characters
    if (raw.length < 2) return `${fieldLabel} must be at least 2 characters`;
    if (raw.length > 50) return `${fieldLabel} must not exceed 50 characters`;


  return true;
};

/**
 * Validate postcode/ZIP based on country rules.
 * - India (in): exactly 6 digits
 * - United Kingdom (uk): 6 to 8 alphanumeric chars, maximum one internal space,
 *   no leading/trailing space
 */
export const validateZipcode = (value: string, country?: string) => {
  const v = (value || '');

  if (country === 'in') {
    // Reject leading/trailing spaces
    if (v !== v.trim()) {
      return 'PIN code must not start or end with a space';
    }

    // Must be exactly 6 digits
    if (!/^\d{6}$/.test(v.trim())) {
      return 'Enter a valid 6-digit PIN code for India';
    }

    return true;
  }

  if (country === 'uk') {
    // Reject leading/trailing spaces
    if (v !== v.trim()) {
      return 'UK postcode must not start or end with a space';
    }

    // Reject more than one internal space
    const spaceCount = (v.match(/ /g) || []).length;
    if (spaceCount > 1) {
      return 'UK postcode can contain at most one internal space';
    }

    // Must be 6–8 characters total (including space if present)
    if (v.length < 6 || v.length > 8) {
      return 'UK postcode must be 6–8 characters long';
    }

    // Must be alphanumeric with optional single space
    const ukRegex = /^([A-Za-z0-9]{1,4} [A-Za-z0-9]{1,4}|[A-Za-z0-9]{6,8})$/;
    if (!ukRegex.test(v)) {
      return 'Enter a valid UK postcode (alphanumeric, optional single space)';
    }

    return true;
  }

  // Default: accept anything
  return true;
};


/**
 * Validate address - allow letters, numbers and spaces only; length 20-50
 */
export const validateAddress = (value: string) => {
  if (!value) return 'Address must be at least 6 characters';

  // Disallow leading or trailing spaces
  if (/^\s|\s$/.test(value)) return 'Address must not start or end with a space';

  const v = value.trim();
  if (v.length < 6) return 'Address must be at least 6 characters';
  if (v.length > 50) return 'Address must not exceed 50 characters';
  // Allow letters, numbers, spaces, and / , . - #
  if (!/^[A-Za-z0-9\s/,.\-#]+$/.test(v)) {
    return 'Address may contain only letters, numbers, spaces, and / , . - #';
  }

  return true;
};


/**
 * Validate a portfolio/URL field:
 * - optional (if empty, valid)
 * - length 10-100
 * - no whitespace
 * - must be a valid URL (adds https:// if scheme missing)
 * - attempts a HEAD request to check reachability but gracefully
 *   degrades when CORS or network restrictions prevent verification.
 */
/**
 * Validate a portfolio/URL field:
 * - optional (if empty, valid)
 * - length 10–100
 * - no whitespace
 * - must be a valid URL
 * - **only allows www.linkedin.com or www.github.com**
 * - skips reachability check (due to CORS), but validates domain strictly
 */
export const validatePortfolio = (value: string, country?: string) => {
  const v = (value || "").trim();
  if (!v) return true;

  if (v.length < 10) return "Portfolio link must be at least 10 characters";
  if (v.length > 100) return "Portfolio link must not exceed 100 characters";
  if (/\s/.test(v)) return "Portfolio link must not contain spaces";

  let urlStr = v;
  try {
    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(urlStr)) {
      urlStr = `https://${urlStr}`;
    }

    const parsed = new URL(urlStr);

    // ✅ Only allow GitHub and LinkedIn
    const allowedDomains = [
      "www.linkedin.com",
      "linkedin.com",
      "www.github.com",
      "github.com"
    ];

    if (!allowedDomains.includes(parsed.hostname)) {
      return "Only LinkedIn and GitHub links are allowed";
    }

    // ✅ Region-specific LinkedIn rules
    if (country === "in" && parsed.hostname.includes("linkedin.com")) {
      if (!parsed.pathname.startsWith("/in/")) {
        return "Indian LinkedIn profiles should start with /in/";
      }
    }

    if (country === "uk" && parsed.hostname.includes("linkedin.com")) {
      if (!parsed.pathname.includes("-uk")) {
        return "UK LinkedIn profiles should include '-uk' in the URL";
      }
    }

  } catch {
    return "Enter a valid URL";
  }

  return true;
};


/**
 * Validate amount field:
 * - required to be digits only
 * - length between 2 and 5 characters
 * - no letters or special characters allowed
 */
export const validateAmount = (value: string) => {
  const v = (value || '').trim();
  if (!v) return 'Amount is required';
  if (/\s/.test(v)) return 'Amount must not contain spaces';

  // Allow: digits only OR digits.digits (1-2 decimal places)
  if (!/^\d+(\.\d{1,2})?$/.test(v)) {
    return 'Amount must be a valid number with up to 2 decimal places (e.g., 50 or 50.99)';
  }

  const num = parseFloat(v);
  if (isNaN(num)) return 'Amount must be a valid number';

  if (num < 1) return 'Amount must be at least 1';
  if (num > 99999) return 'Amount must not exceed 99999';

  return true;
};



export const validateDesignation = (value: string) => {
  if (!value) return 'Current Designation must be at least 2 characters';

  // Disallow leading or trailing spaces
  if (/^\s|\s$/.test(value)) return 'Current Designation must not start or end with a space';

  const v = value.trim();
  if (v.length < 2) return 'Current Designation must be at least 2 characters';
  if (v.length > 50) return 'Current Designation must not exceed 50 characters';

  // Only letters and single spaces between words allowed
  if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(v)) {
    return 'Current Designation may contain only letters and single spaces between words';
  }

  return true;
};


export const validateCompany = (value: string) => {
  if (!value) return 'Company/Employer must be at least 4 characters';

  // Disallow leading or trailing spaces
  if (/^\s|\s$/.test(value)) return 'Company/Employer must not start or end with a space';

  const v = value.trim();
  if (v.length < 4) return 'Company/Employer must be at least 4 characters';
  if (v.length > 50) return 'Company/Employer must not exceed 50 characters';

  // Only letters, numbers, and / & - . with single spaces between
  if (!/^[A-Za-z0-9/&.-]+(?: [A-Za-z0-9/&.-]+)*$/.test(v)) {
    return 'Company/Employer may contain only letters, numbers, single spaces, and / & - .';
  }

  return true;
};

/**
 * Validate experience field:
 * - required
 * - digits only
 * - length between 1 and 3 characters
 */
export const validateExperience = (value: string) => {
  if (!value) return 'Experience is required';

  // Disallow leading or trailing spaces
  if (/^\s|\s$/.test(value)) return 'Experience must not start or end with a space';

  const v = value.trim();
  if (/\s/.test(v)) return 'Experience must not contain internal spaces';
  if (!/^(?:[1-9]|[1-9][0-9])$/.test(v)) return 'Experience must be a number between 1 and 99 without leading zeros';

  const num = parseInt(v, 10);
  if (num < 1 || num > 99) return 'Experience must be between 1 and 99 years';

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

export const validatePortfolioLink = (value: string) => {
  if (/^\s|\s$/.test(value || ""))
    return "PortfolioLink must not start or end with a space";
  const v = (value || "").trim();

  if (!v) return "Portfolio link is required";
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
      !hostname.includes("linkedin.com") && !hostname.includes("github.com") && !hostname.endsWith(".zip") &&
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

export default {
  validateName,
  validateZipcode,
  validateAddress,
  validatePortfolio,
  validateAmount,
  validateExperience,
  validateDesignation,
  validateCompany,
  validateIsVerified,
  validateIsPhoneVerified,
  validatePortfolioLink
};


