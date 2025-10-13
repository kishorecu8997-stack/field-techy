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
  const v = (value || '').trim();

  if (country === 'in') {
    return /^\d{6}$/.test(v) ? true : 'Enter a valid 6-digit PIN code for India';
  }

  if (country === 'uk') {
    // 6 to 8 alphanumeric chars, maximum one internal space, no leading/trailing space
    const ukRegex = /^(?! )(?!.* $)(?!(?:.* ){2,})[A-Za-z0-9 ]{6,8}$/;
    return ukRegex.test(v)
      ? true
      : 'Enter a valid UK postcode (6-8 alphanumeric chars, max one internal space)';
  }

  // default: accept
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
export const validatePortfolio = async (value: string) => {
  const v = (value || '').trim();
  if (!v) return true; // optional

  if (v.length < 10) return 'Portfolio link must be at least 10 characters';
  if (v.length > 100) return 'Portfolio link must not exceed 100 characters';
  if (/\s/.test(v)) return 'Portfolio link must not contain spaces';

  let urlStr = v;
  try {
    // Add https:// if no scheme
    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(urlStr)) {
      urlStr = `https://${urlStr}`;
    }

    const parsed = new URL(urlStr);

    // ✅ Only allow these two domains (exact match)
    if (parsed.hostname !== 'www.linkedin.com' && parsed.hostname !== 'www.github.com') {
      return 'Only LinkedIn (www.linkedin.com) and GitHub (www.github.com) links are allowed';
    }

    // Optional: ensure path is valid (e.g., not malformed), but we don't restrict it
  } catch {
    return 'Enter a valid URL';
  }

  // ⚠️ Skip fetch/HEAD request — both LinkedIn and GitHub block HEAD requests from browsers due to CORS.
  // Even if we try, it will fail in most cases. So we skip network validation.
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
  if (!/^\d+$/.test(v)) return 'Amount must contain digits only (no letters or special characters)';
  
  const num = parseInt(v, 10);
  if (num < 10) return 'Amount must be at least 10';
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




export default {
  validateName,
  validateZipcode,
  validateAddress,
  validatePortfolio,
  validateAmount,
  validateExperience,
  validateDesignation,
  validateCompany
};


