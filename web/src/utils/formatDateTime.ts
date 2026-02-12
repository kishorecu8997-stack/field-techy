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
/**
 * Convenience function to get current formatted date and time
 * @returns Current date/time formatted string
 */
export const formatNow = () => formatDateTime();

/**
 * Formats a date string to MM/DD/YYYY format
 * @param dateString - ISO date string or timestamp
 * @returns Formatted date string "MM/DD/YYYY" or "-" if no date provided
 */
export const formatDateToMMDDYYYY = (dateString?: string): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};