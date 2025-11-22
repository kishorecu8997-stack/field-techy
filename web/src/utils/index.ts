export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}


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
  if (days > 0 && parts.length === 0)  // show days only if no months/years
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
