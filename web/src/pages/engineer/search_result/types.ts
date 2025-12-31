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
  hybrid: "hybrid",
} as const;
export type WorkingType = (typeof WORKING_TYPES)[keyof typeof WORKING_TYPES];

export const WORKING_TYPES_PROPERTY = {
  onsite: "On Site",
  remote: "Remote",
  hybrid: "Hybrid",
};

export const LOG_STATUSES = {
  checkIn: "check-in",
  inProgress: "in-progress",
  delayed: "delayed",
  approved: "approved",
} as const;
export type LogStatus = (typeof LOG_STATUSES)[keyof typeof LOG_STATUSES];

export const SLA_LEVELS = {
  FOUR_HOUR: "4-hour response",
  SIX_HOUR: "6-hour response",
  NEXT_DAY: "Next day response",
  THEREAFTER: "Thereafter response",
} as const;
export type SlaLevel = (typeof SLA_LEVELS)[keyof typeof SLA_LEVELS];

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
  tools?: string[];
  slaLevel?: SlaLevel;
  matchScore?: number;
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
  serviceType: string[];
  tools: string[];
  experienceLevel: string[];
  jobType: string[];
  locationType: string[];
  locationRadius: number;
  budgetRange: { min: number; max: number };
  primaryLanguage: string;
  slaLevel: string;
}

export const SORT_OPTIONS = {
  RELEVANCE: "relevance",
  DATE: "date",
  SALARY: "salary",
  DISTANCE: "distance",
  NEWEST: "newest",
} as const;
export type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];

export interface Options {
  label: string;
  value: string;
}

export const JOB_FILTERS = {
  ALL_JOBS: "All Jobs",
  APPLIED: "Applied",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  REMOTE: "Remote",
  ON_SITE: "On-Site",
  HYBRID: "Hybrid",
  TODAY: "Today",
  DECLINED: "Declined",
  CANCELLED: "Cancelled",
} as const;

export type JobFilter = (typeof JOB_FILTERS)[keyof typeof JOB_FILTERS];

export const OfferedJobStatus = {
  initial: "initial",
  accepted: "accepted",
  declined: "declined",
  started: "started",
  checkedIn: "checked-in",
};

export type OfferedJobStatusType =
  (typeof OfferedJobStatus)[keyof typeof OfferedJobStatus];
