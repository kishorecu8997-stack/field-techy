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