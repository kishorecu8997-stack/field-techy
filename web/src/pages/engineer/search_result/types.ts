export const BUDGET_TYPES = {
  Hourly: "hourly",
  Fixed: "fixed",
} as const;
export type BudgetType = (typeof BUDGET_TYPES)[keyof typeof BUDGET_TYPES];

export const JOB_STATUSES = {
  completed: "completed",
  applied: "applied",
  inprogress: "inprogress",
  new: "new",
  offer: "offer",
} as const;
export type JobStatus = (typeof JOB_STATUSES)[keyof typeof JOB_STATUSES];

export const WORKING_TYPES = {
  onsite: "on-site",
  remote: "remote",
} as const;
export type WorkingType = (typeof WORKING_TYPES)[keyof typeof WORKING_TYPES];


export const WORKING_TYPES_PROPERTY = {
  onsite: "On Site",
  remote: "Remote",
};

export const LOG_STATUSES = {
  checkIn: "check-in",
  inProgress: "in-progress",
  delayed: "delayed",
  approved: "approved",
} as const;
export type LogStatus = (typeof LOG_STATUSES)[keyof typeof LOG_STATUSES];

/**
 * Represents a job listing
 */
export interface Job {
  id: number | string;
  title?: string;
  client?: string;
  time?: string;
  description?: string;
  location?: string;
  salary?: string;
  postedTime?: string;
  category?: string;
  rating?: number;
  experience?: number;
  budgetType?: BudgetType | null;
  skills?: string[];
  startDate?: string;
  duration?: string;
  pay?: string;
  status?: JobStatus;
  type?: WorkingType;
  companyLogo?: string;
  company?: string;
  employmentType?: string;
  place: string;
  isBookmarked?: boolean;
}

/**
 * Filter options interface
 */
export interface Filters {
  location: string[];
  category: string[];
  rating: number[];
  experience: number;
  budgetType: BudgetType | null;
  skills: string[];
}

export const SORT_OPTIONS = {
  NEWEST: "newest",
  OLDEST: "oldest",
} as const;
export type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];

export interface Options {
  label: string;
  value: string;
}


export const OfferedJobStatus = {
  initial: "initial",
  accepted: "accepted",
  declined: "declined",
  started: "started",
  checkedIn: "checked-in",
};

export type OfferedJobStatusType = (typeof OfferedJobStatus)[keyof typeof OfferedJobStatus];