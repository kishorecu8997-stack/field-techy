export const validateCompany = (value: string) => {
  if (!value) return "Company Name must be at least 4 characters";

  // Disallow leading or trailing spaces
  if (/^\s|\s$/.test(value))
    return "Company Name must not start or end with a space";

  const v = value.trim();
  if (v.length < 4) return "Company Name must be at least 4 characters";
  if (v.length > 50) return "Company Name must not exceed 50 characters";

  // Only letters, numbers, and / & - . with single spaces between
  if (!/^[A-Za-z0-9/&.-]+(?: [A-Za-z0-9/&.-]+)*$/.test(v)) {
    return "Company Name may contain only letters, numbers, single spaces, and / & - .";
  }

  return true;
};

export const validateName = (value: string) => {
  const raw = value || "";

  // Reject leading or trailing spaces
  if (raw !== raw.trim())
    return `This field must not have first or last spaces`;

  // Reject consecutive spaces
  if (/ {2,}/.test(raw))
    return `This field must not contain consecutive spaces`;

  // Reject if contains anything other than letters and single spaces
  if (!/^[A-Za-z ]+$/.test(raw))
    return `This field must contain only alphabetic characters and single spaces`;

  // Reject if more than 10 spaces
  const spaceCount = (raw.match(/ /g) || []).length;
  if (spaceCount > 10) return `This field must not contain more than 10 spaces`;

  // Length requirement: 2 to 50 characters
  if (raw.length < 2) return `This field must be at least 2 characters`;
  if (raw.length > 50) return `This field must not exceed 50 characters`;

  return true;
};

export const validateAddress = (value: string) => {
  if (!value) return "Address must be at least 6 characters";

  // Disallow leading or trailing spaces
  if (/^\s|\s$/.test(value))
    return "Address must not start or end with a space";

  const v = value.trim();
  if (v.length < 6) return "Address must be at least 6 characters";
  if (v.length > 50) return "Address must not exceed 50 characters";
  // Allow letters, numbers, spaces, and / , . - #
  if (!/^[A-Za-z0-9\s/,.\-#]+$/.test(v)) {
    return "Address may contain only letters, numbers, spaces, and / , . - #";
  }
  if (!/[A-Za-z]/.test(v)) {
    return "Address must contain at least one letter";
  }
  return true;
};

export const validateZipcode = (value: string, country?: string) => {
  const v = value || "";

  if (country === "in") {
    // Reject leading/trailing spaces
    if (v !== v.trim()) {
      return "PIN code must not start or end with a space";
    }

    // Must be exactly 6 digits
    if (!/^\d{6}$/.test(v.trim())) {
      return "Enter a valid 6-digit postal code for India";
    }

    return true;
  }

  if (country === "uk") {
    // Reject leading/trailing spaces
    if (v !== v.trim()) {
      return "UK postal code must not start or end with a space";
    }

    // Reject more than one internal space
    const spaceCount = (v.match(/ /g) || []).length;
    if (spaceCount > 1) {
      return "UK postal code can contain at most one internal space";
    }

    // Must be 6–8 characters total (including space if present)
    if (v.length < 6 || v.length > 8) {
      return "UK postal code must be 6–8 characters long";
    }

    // Must be alphanumeric with optional single space
    const ukRegex = /^([A-Za-z0-9]{1,4} [A-Za-z0-9]{1,4}|[A-Za-z0-9]{6,8})$/;
    if (!ukRegex.test(v)) {
      return "Enter a valid UK postal code (alphanumeric, optional single space)";
    }

    return true;
  }

  // Default: accept anything
  return true;
};

const validateFormat = (
  value: string,
  regex: RegExp,
  errorMessage: string,
): true | string => {
  if (!value) {
    return errorMessage;
  }

  const trimmedValue = value.trim();
  if (trimmedValue === "") {
    return errorMessage;
  }

  return regex.test(trimmedValue) ? true : errorMessage;
};

export const validateVatNumber = (vatNumber: string): true | string => {
  const trimmedValue = vatNumber.trim();

  // Reject all-zero VAT numbers (e.g. 00000000, 0000)
  if (/^0+$/.test(trimmedValue)) {
    return "VAT registration number cannot be all zeros.";
  }

  return validateFormat(
    trimmedValue,
    /^[A-Za-z0-9\-/ ]{2,16}$/,
    "VAT registration number must be 2–16 characters long and can only contain letters, digits, hyphens (-), slashes (/), or spaces.",
  );
};
