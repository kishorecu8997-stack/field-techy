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
