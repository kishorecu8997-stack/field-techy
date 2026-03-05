export const intervalMap = {
  daily: "day",
  weekly: "week",
  monthly: "month",
  yearly: "year",
} as const;

export const statusMap = {
  pending: "pending",
  inProgress: "inprogress",
  completed: "completed",
} as const;

export const roleMap = {
  engineer: "engineer",
  homeClient: "home",
  corporateClient: "corporate",
} as const;

export type IntervalType = keyof typeof intervalMap;
export type StatusType = keyof typeof statusMap;
export type RoleType = keyof typeof roleMap;

export const client = [
  { id: 1, value: "engineer", label: "Engineer" },
  { id: 2, value: "homeClient", label: "Home Client" },
  { id: 3, value: "corporateClient", label: "Corporate Client" },
];

export const days = [
  { id: 1, value: "daily", label: "Daily" },
  { id: 2, value: "weekly", label: "Weekly" },
  { id: 3, value: "monthly", label: "Monthly" },
  { id: 4, value: "yearly", label: "Yearly" },
];

export const status = [
  { id: 1, value: "pending", label: "Pending" },
  { id: 2, value: "inProgress", label: "In Progress" },
  { id: 3, value: "completed", label: "Completed" },
];
