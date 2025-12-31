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
  notified: "Notified",
  unallocated: "Unallocated",
  partiallyAssigned: "Partially Assigned",
  assigned: "Assigned",
  selected: "Selected",
  hold: "Hold",
  draft: "Draft",
  canceled: "Canceled",
  escalationInProgress: "Escalation In Progress",
  workInProgress: "Work In Progress", 
  closed: "Closed"
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

export const getExperienceLevel = (years?: number) => {
  if (years === undefined || years === 0) return "Not specified";
  if (years <= 1) return "L1"; // 0-1 year: Junior/Entry-level
  if (years <= 3) return "L2"; // 2-3 years: Mid-level
  return "L3"; // 4+ years: Senior/Expert-level
};


export const LOG_STATUSES = {
  checkIn: "check-in",
  inProgress: "in-progress",
  delayed: "delayed",
  approved: "approved",
} as const;
export type LogStatus = (typeof LOG_STATUSES)[keyof typeof LOG_STATUSES];

export const SERVICE_TYPES = {
  dedicated: "Dedicated",
  dispatch: "Dispatch",
  scheduled: "Scheduled",
} as const;

export type ServiceType = (typeof SERVICE_TYPES)[keyof typeof SERVICE_TYPES];

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
  allocationType?: 'Automatic' | 'Manual';
  serviceType?: ServiceType;
  languages?: string;
  tools?: string[];
  poc?: {
    name: string; // e.g., "Raj Patel"
    role?: string; // e.g., "Project Coordinator"
    avatar?: string; // optional avatar URL
  };
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

/**
 * Sort options
 */
export const SORT_OPTIONS = {
  RELEVANCE: "relevance",
  DATE: "date",
  SALARY: "salary",
  DISTANCE: "distance",
  NEWEST: "newest",
} as const;

export type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];
// → "relevance" | "date" | "salary" | "distance"

/**
 * Generic option shape (label/value)
 */
export interface Options {
  label: string;
  value: string;
}

/**
 * Offered job status flow
 */
export const OfferedJobStatus = {
  initial: "initial",
  accepted: "accepted",
  declined: "declined",
  started: "started",
  checkedIn: "checked-in",
} as const;

export type OfferedJobStatusType =
  (typeof OfferedJobStatus)[keyof typeof OfferedJobStatus];
