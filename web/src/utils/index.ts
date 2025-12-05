export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Custom time formatter
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

export const buildQuery = (params: Record<string, any>) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      query.append(key, value);
    }
  });

  return query.toString();
};

export const to24 = (time: string) => {
  if (!time) return "";
  const [hhmm, period] = time.split(" ");
  let [hour, minute] = hhmm.split(":").map(Number);

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

export const combineTo24 = (h: string, m: string, p: string) =>
  to24(`${h}:${m} ${p}`);

export const time24ToMinutes = (value24: string | null | undefined) => {
  if (!value24) return null;
  const [h, m] = value24.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};

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

export function getMinTentativeEndDate(
  applicationEndDate: string,
  tentativeStartDate: string
): Date {
  const appEnd = new Date(applicationEndDate);
  const tentStart = new Date(tentativeStartDate);

  // Return whichever is higher (later in time)
  const finalValue = appEnd > tentStart ? appEnd : tentStart;
  console.log("finalValue :", finalValue);
  return finalValue;
}
