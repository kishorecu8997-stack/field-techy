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

/**
 * Generates an array of page numbers with optional ellipsis ("...") for large ranges.
 * Example: [1, '...', 4, 5, 6, '...', 10] when currentPage = 5, totalPages = 10
 */
export const generatePageRange = (
  currentPage: number,
  totalPages: number,
  delta: number = 2
): (number | '...')[] => {
  if (totalPages <= 1) return [1];

  const range: (number | '...')[] = [];

  // Always include first page
  range.push(1);

  const left = currentPage - delta;
  const right = currentPage + delta;

  // Ellipsis after first if needed
  if (left > 2) {
    range.push('...');
  }

  // Add pages around current
  for (let i = Math.max(2, left); i <= Math.min(totalPages - 1, right); i++) {
    range.push(i);
  }

  // Ellipsis before last if needed
  if (right < totalPages - 1) {
    range.push('...');
  }

  // Always include last page (if more than 1)
  if (totalPages > 1) {
    range.push(totalPages);
  }

  // Remove duplicates (e.g., when totalPages=2)
  return Array.from(new Set(range));
};