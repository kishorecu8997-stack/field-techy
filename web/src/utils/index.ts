/**
 * Creates a path builder function that replaces placeholders in a path template with actual values.
 *
 * @param {string} pathTemplate - The path template with placeholders (e.g., "/users/:id/posts/:postId")
 * @returns {Function} A function that accepts params and returns the built path
 *
 * @example
 * const buildUserPath = createPathBuilder("/users/:id/profile");
 * const path = buildUserPath({ id: "123" });
 * // Returns: "/users/123/profile"
 *
 * @example
 * const buildPostPath = createPathBuilder("/users/:userId/posts/:postId");
 * const path = buildPostPath({ userId: "42", postId: "789" });
 * // Returns: "/users/42/posts/789"
 */
export function createPathBuilder(pathTemplate: string) {
  return (params: Record<string, string | number>) => {
    let path = pathTemplate;
    for (const [key, value] of Object.entries(params)) {
      path = path.replace(`:${key}`, String(value));
    }
    return path;
  };
}

/**
 * Smoothly scrolls the window to the top of the page.
 * Uses smooth scrolling behavior for better user experience.
 *
 * @returns {void}
 *
 * @example
 * // Scroll to top when user clicks a button
 * <button onClick={scrollToTop}>Back to Top</button>
 *
 * @example
 * // Scroll to top after navigation
 * useEffect(() => {
 *   scrollToTop();
 * }, [location.pathname]);
 */
export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

/**
 * Calculates the duration between two dates and returns a human-readable string.
 * Only shows the most significant time units (years, months, or days).
 *
 * @param {string | Date} startDate - The start date
 * @param {string | Date} endDate - The end date
 * @returns {string} A human-readable duration string (e.g., "2 years 3 months")
 *
 * @example
 * const duration = getDuration("2020-01-15", "2023-04-20");
 * // Returns: "3 years 3 months"
 *
 * @example
 * const duration = getDuration(new Date("2023-01-01"), new Date("2023-02-15"));
 * // Returns: "1 month"
 *
 * @example
 * const duration = getDuration("2023-12-01", "2023-12-05");
 * // Returns: "4 days"
 */
export function getDuration(startDate: string | Date, endDate: string | Date) {
  if (!startDate || !endDate) return "";

  const start = new Date(startDate);
  const end = new Date(endDate);

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  // Adjust days and months
  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    days += prevMonth;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Build readable string
  const parts = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? "month" : "months"}`);
  if (days > 0 && parts.length === 0)
    // show days only if no months/years
    parts.push(`${days} ${days === 1 ? "day" : "days"}`);

  return parts.join(" ");
}

/**
 * Builds a URL query string from an object of parameters.
 * Filters out undefined, null, and empty string values.
 *
 * @param {Record<string, any>} params - Object containing query parameters
 * @returns {string} URL-encoded query string (without leading '?')
 *
 * @example
 * const query = buildQuery({ page: 1, limit: 10, search: "engineer" });
 * // Returns: "page=1&limit=10&search=engineer"
 *
 * @example
 * const query = buildQuery({ name: "John", age: null, city: "" });
 * // Returns: "name=John" (null and empty values are filtered out)
 *
 * @example
 * // Use in API calls
 * const params = { status: "active", role: "admin" };
 * fetch(`/api/users?${buildQuery(params)}`);
 */
export const buildQuery = (params: Record<string, any>) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      query.append(key, value);
    }
  });

  return query.toString();
};

/**
 * Converts 12-hour time format (with AM/PM) to 24-hour format.
 *
 * @param {string} time - Time string in 12-hour format (e.g., "2:30 PM")
 * @returns {string} Time string in 24-hour format (e.g., "14:30")
 *
 * @example
 * const time24 = to24("2:30 PM");
 * // Returns: "14:30"
 *
 * @example
 * const time24 = to24("12:00 AM");
 * // Returns: "00:00"
 *
 * @example
 * const time24 = to24("12:00 PM");
 * // Returns: "12:00"
 *
 * @example
 * const time24 = to24("11:45 AM");
 * // Returns: "11:45"
 */
export const to24 = (time: string) => {
  if (!time) return "";
  const [hhmm, period] = time.split(" ");
  let [hour, minute] = hhmm.split(":").map(Number);

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

/**
 * Combines hour, minute, and period (AM/PM) into 24-hour format.
 * Convenience wrapper around the to24 function.
 *
 * @param {string} h - Hour (1-12)
 * @param {string} m - Minute (0-59)
 * @param {string} p - Period ("AM" or "PM")
 * @returns {string} Time in 24-hour format (e.g., "14:30")
 *
 * @example
 * const time = combineTo24("2", "30", "PM");
 * // Returns: "14:30"
 *
 * @example
 * const time = combineTo24("9", "15", "AM");
 * // Returns: "09:15"
 *
 * @example
 * // Use with form inputs
 * const hour = "3";
 * const minute = "45";
 * const period = "PM";
 * const time24 = combineTo24(hour, minute, period);
 * // Returns: "15:45"
 */
export const combineTo24 = (h: string, m: string, p: string) =>
  to24(`${h}:${m} ${p}`);

/**
 * Converts 24-hour time format to total minutes since midnight.
 * Useful for time comparisons and calculations.
 *
 * @param {string | null | undefined} value24 - Time in 24-hour format (e.g., "14:30")
 * @returns {number | null} Total minutes since midnight, or null if invalid
 *
 * @example
 * const minutes = time24ToMinutes("14:30");
 * // Returns: 870 (14 * 60 + 30)
 *
 * @example
 * const minutes = time24ToMinutes("00:00");
 * // Returns: 0
 *
 * @example
 * const minutes = time24ToMinutes("23:59");
 * // Returns: 1439
 *
 * @example
 * // Compare two times
 * const start = time24ToMinutes("09:00");
 * const end = time24ToMinutes("17:30");
 * const duration = end - start; // 510 minutes (8.5 hours)
 */
export const time24ToMinutes = (value24: string | null | undefined) => {
  if (!value24) return null;
  const [h, m] = value24.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};

/**
 * Calculates a detailed duration string between two dates with optional times.
 * Returns a comprehensive breakdown including years, months, days, hours, and minutes.
 *
 * @param {Object} params - The date and time parameters
 * @param {string} params.startDateStr - Start date in ISO format (e.g., "2023-01-15")
 * @param {string} params.endDateStr - End date in ISO format (e.g., "2023-04-20")
 * @param {string} [params.startTime] - Optional start time in 24-hour format (e.g., "09:00")
 * @param {string} [params.endTime] - Optional end time in 24-hour format (e.g., "17:30")
 * @returns {string} A detailed duration string
 *
 * @example
 * const duration = getDurationString({
 *   startDateStr: "2023-01-01",
 *   endDateStr: "2023-01-02",
 *   startTime: "09:00",
 *   endTime: "17:00"
 * });
 * // Returns: "1 day 8 hours"
 *
 * @example
 * const duration = getDurationString({
 *   startDateStr: "2020-01-01",
 *   endDateStr: "2023-06-15"
 * });
 * // Returns: "3 years 5 months 14 days"
 *
 * @example
 * const duration = getDurationString({
 *   startDateStr: "2023-12-01",
 *   endDateStr: "2023-12-01",
 *   startTime: "14:00",
 *   endTime: "16:30"
 * });
 * // Returns: "2 hours 30 minutes"
 */
export function getDurationString({
  startDateStr,
  endDateStr,
  startTime,
  endTime,
}: {
  startDateStr: string;
  endDateStr: string;
  startTime?: string;
  endTime?: string;
}): string {
  function buildDate(dateStr: string, timeStr: string): Date {
    const date = new Date(dateStr);
    const [h, m] = timeStr.split(":").map(Number);
    date.setHours(h);
    date.setMinutes(m);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  const start = buildDate(startDateStr, startTime || "00:00");
  const end = buildDate(endDateStr, endTime || "00:00");

  if (end < start) return "Invalid range";

  // Copy date for calculations
  let temp = new Date(start.getTime());

  let years = 0;
  let months = 0;

  // Count years
  while (true) {
    const next = new Date(temp);
    next.setFullYear(temp.getFullYear() + 1);
    if (next <= end) {
      years++;
      temp = next;
    } else break;
  }

  // Count months
  while (true) {
    const next = new Date(temp);
    next.setMonth(temp.getMonth() + 1);
    if (next <= end) {
      months++;
      temp = next;
    } else break;
  }

  // Remaining difference
  const diffMs = end.getTime() - temp.getTime();
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  // Build output
  const parts: string[] = [];

  if (years > 0) parts.push(`${years} year${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);
  if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);

  if (parts.length === 0) return "0 minutes";

  return parts.join(" ");
}

/**
 * Determines the minimum tentative end date by comparing application end date
 * and tentative start date, returning whichever is later.
 * Useful for job applications or project scheduling.
 *
 * @param {string} applicationEndDate - The application end date in ISO format
 * @param {string} tentativeStartDate - The tentative start date in ISO format
 * @returns {Date} The later of the two dates
 *
 * @example
 * const minDate = getMinTentativeEndDate("2023-12-31", "2024-01-15");
 * // Returns: Date object for 2024-01-15
 *
 * @example
 * const minDate = getMinTentativeEndDate("2024-03-01", "2024-01-01");
 * // Returns: Date object for 2024-03-01
 *
 * @example
 * // Use in form validation
 * const applicationEnd = "2024-06-30";
 * const tentativeStart = "2024-07-01";
 * const minEndDate = getMinTentativeEndDate(applicationEnd, tentativeStart);
 * // User must select end date >= minEndDate
 */
export function getMinTentativeEndDate(
  applicationEndDate: string,
  tentativeStartDate: string
): Date {
  const appEnd = new Date(applicationEndDate);
  const tentStart = new Date(tentativeStartDate);

  // Return whichever is higher (later in time)
  const finalValue = appEnd > tentStart ? appEnd : tentStart;
  return finalValue;
}

export const getExperienceLevel = (years?: number) => {
  if (!years) return "";
  if (years <= 1) return "L1"; // 0-1 year: Junior/Entry-level
  if (years <= 3) return "L2"; // 2-3 years: Mid-level
  return "L3"; // 4+ years: Senior/Expert-level
};


/**
 * Get user id from local storage
 * @returns 
 */
export function getUserId(): string | null {
  const raw = localStorage.getItem("generic-user-session");
  if (!raw) return null;

  const parsed = JSON.parse(raw);
  const userId = parsed?.state?.session?.userId;
  return userId ? String(userId) : null;
}
