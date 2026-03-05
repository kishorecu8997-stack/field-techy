import type { EngineerAssignment } from "./types";

export type JobsChartGrouping = "daily" | "weekly" | "monthly" | "yearly";

export type JobsChartPoint = {
  name: string;
  jobs: number;
};

export function coerceJobsChartGrouping(
  value: string | null | undefined,
  fallback: JobsChartGrouping = "monthly",
): JobsChartGrouping {
  if (value === "daily") return "daily";
  if (value === "weekly") return "weekly";
  if (value === "monthly") return "monthly";
  if (value === "yearly") return "yearly";
  return fallback;
}

function isValidDate(date: Date) {
  return Number.isFinite(date.getTime());
}

function startOfUtcDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function startOfUtcWeek(date: Date) {
  const utc = startOfUtcDay(date);
  const day = utc.getUTCDay(); // 0..6 (Sun..Sat)
  const daysSinceMonday = (day + 6) % 7; // Monday=0 ... Sunday=6
  utc.setUTCDate(utc.getUTCDate() - daysSinceMonday);
  return utc;
}

function startOfUtcMonth(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function startOfUtcYear(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
}

function addUtcDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function addUtcMonths(date: Date, months: number) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
}

function addUtcYears(date: Date, years: number) {
  return new Date(Date.UTC(date.getUTCFullYear() + years, 0, 1));
}

function getDefaultDateString(assignment: EngineerAssignment) {
  return assignment.appliedAt ?? assignment.invitedAt ?? null;
}

function formatLabel(date: Date, grouping: JobsChartGrouping) {
  switch (grouping) {
    case "daily":
    case "weekly":
      return new Intl.DateTimeFormat(undefined, {
        timeZone: "UTC",
        month: "short",
        day: "numeric",
      }).format(date);

    case "monthly":
      return new Intl.DateTimeFormat(undefined, {
        timeZone: "UTC",
        month: "short",
        year: "numeric",
      }).format(date);

    case "yearly":
      return String(date.getUTCFullYear());
  }
}

export function buildJobsChartData(
  assignments: EngineerAssignment[],
  grouping: JobsChartGrouping,
  getDateString: (assignment: EngineerAssignment) => string | null | undefined = getDefaultDateString,
): JobsChartPoint[] {
  const now = new Date();

  if (!isValidDate(now)) return [];

  if (grouping === "daily") {
    const end = startOfUtcDay(now);
    const start = addUtcDays(end, -6);
    const buckets = new Map<string, JobsChartPoint>();

    for (let i = 0; i < 7; i++) {
      const bucketDate = addUtcDays(start, i);
      const key = bucketDate.toISOString().slice(0, 10);
      buckets.set(key, { name: formatLabel(bucketDate, grouping), jobs: 0 });
    }

    for (const item of assignments) {
      const raw = getDateString(item);
      if (!raw) continue;
      const date = new Date(raw);
      if (!isValidDate(date)) continue;
      const bucketDate = startOfUtcDay(date);
      if (bucketDate < start || bucketDate > end) continue;
      const key = bucketDate.toISOString().slice(0, 10);
      const point = buckets.get(key);
      if (point) point.jobs += 1;
    }

    return Array.from(buckets.values());
  }

  if (grouping === "weekly") {
    const end = startOfUtcWeek(now);
    const start = addUtcDays(end, -7 * 7);
    const buckets = new Map<string, { date: Date; point: JobsChartPoint }>();

    for (let i = 0; i < 8; i++) {
      const bucketDate = addUtcDays(start, i * 7);
      const key = bucketDate.toISOString().slice(0, 10);
      buckets.set(key, {
        date: bucketDate,
        point: { name: formatLabel(bucketDate, grouping), jobs: 0 },
      });
    }

    for (const item of assignments) {
      const raw = getDateString(item);
      if (!raw) continue;
      const date = new Date(raw);
      if (!isValidDate(date)) continue;
      const bucketDate = startOfUtcWeek(date);
      if (bucketDate < start || bucketDate > end) continue;
      const key = bucketDate.toISOString().slice(0, 10);
      const entry = buckets.get(key);
      if (entry) entry.point.jobs += 1;
    }

    return Array.from(buckets.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((e) => e.point);
  }

  if (grouping === "monthly") {
    const end = startOfUtcMonth(now);
    const start = addUtcMonths(end, -11);
    const buckets = new Map<string, { date: Date; point: JobsChartPoint }>();

    for (let i = 0; i < 12; i++) {
      const bucketDate = addUtcMonths(start, i);
      const key = bucketDate.toISOString().slice(0, 7);
      buckets.set(key, {
        date: bucketDate,
        point: { name: formatLabel(bucketDate, grouping), jobs: 0 },
      });
    }

    for (const item of assignments) {
      const raw = getDateString(item);
      if (!raw) continue;
      const date = new Date(raw);
      if (!isValidDate(date)) continue;
      const bucketDate = startOfUtcMonth(date);
      if (bucketDate < start || bucketDate > end) continue;
      const key = bucketDate.toISOString().slice(0, 7);
      const entry = buckets.get(key);
      if (entry) entry.point.jobs += 1;
    }

    return Array.from(buckets.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((e) => e.point);
  }

  const end = startOfUtcYear(now);
  const start = addUtcYears(end, -4);
  const buckets = new Map<string, { date: Date; point: JobsChartPoint }>();

  for (let i = 0; i < 5; i++) {
    const bucketDate = addUtcYears(start, i);
    const key = String(bucketDate.getUTCFullYear());
    buckets.set(key, {
      date: bucketDate,
      point: { name: formatLabel(bucketDate, grouping), jobs: 0 },
    });
  }

  for (const item of assignments) {
    const raw = getDateString(item);
    if (!raw) continue;
    const date = new Date(raw);
    if (!isValidDate(date)) continue;
    const bucketDate = startOfUtcYear(date);
    if (bucketDate < start || bucketDate > end) continue;
    const key = String(bucketDate.getUTCFullYear());
    const entry = buckets.get(key);
    if (entry) entry.point.jobs += 1;
  }

  return Array.from(buckets.values())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((e) => e.point);
}
