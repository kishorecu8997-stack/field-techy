export type BudgetType = "hourly" | "fixed";
export const BUDGET_TYPES = {
  Hourly: "hourly",
  Fixed: "fixed",
} as const;

export type JobStatus = "completed" | "posted" | "inprogress"|"hold";
export const JOB_STATUSES = {
  completed: "completed",
  posted: "posted",
  inprogress: "inprogress",
  hold: "hold",
} as const;

export type WorkingType = "on-site" | "remote";
export const WORKING_TYPES = {
  onsite: "on-site",
  remote: "remote",
} as const;


export const WORKING_TYPES_PROPERTY = {
  onsite: "On Site",
  remote: "Remote",
}

export type LogStatus = "check-in" | "in-progress" | "delayed" | "approved";
export const LOG_STATUSES = {
  checkIn: "check-in",
  inProgress: "in-progress",
  delayed: "delayed",
  approved: "approved",
} as const;

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
  engineers?: string;
  engineerAvatars?: string[];  
  serviceType?: string;
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

// Sort options
export type SortOption = "newest" | "oldest";
export const SORT_OPTIONS = {
  NEWEST: "newest",
  OLDEST: "oldest",
} as const;

export interface Options {
  label: string;
  value: string;
}

const jobFilters = ["All Jobs", "In-Progress", "Completed", "Posted", "Hold"];

const jobFilterObj = jobFilters.reduce<Record<number, string>>((acc, filter, index) => {
  acc[index] = filter;
  return acc;
}, {});

export const JOB_FILTERS = jobFilterObj;
export default jobFilters;
