/**
 * Formats current date and time to standardized US locale string.
 * Used across forms and timeline components for consistent timestamp display.
 * @returns Formatted string (e.g., "Apr 05, 2026, 1:05 PM")
 */
export const formatDateTime = (): string =>
  new Date().toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
