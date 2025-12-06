/**
 * @file Centralized type definitions for the "My Jobs" feature.
 *
 * This file contains TypeScript types and interfaces used across various components
 * related to viewing and managing jobs, such as job lists, job details,
 * client information, and work logs.
 */

/**
 * Represents the available options for sorting job lists.
 */
export type SortOption = "newest" | "oldest" | "highest-rated";

/**
 * Represents the possible statuses for a job.
 */
export type JobStatus = "active" | "completed" | "pending" | "cancelled";

/**
 * Represents the type of work arrangement for a job.
 */
export type WorkingType = "remote" | "on-site" | "hybrid";

/**
 * Props for the header component on "My Jobs" pages.
 */
export interface MyJobsHeaderProps {
  title: string;
  currentSort?: SortOption;
  onSortChange?: (sort: SortOption) => void;
  isShowBreadcrumb?: boolean;
  description?: string;
  isReport?: boolean;
  isShowSort?: boolean;
  action?: React.ReactNode
  isReport?:boolean;
  action?:React.ReactNode;
}

/**
 * Defines the shape of a user's basic profile information.
 */
export interface UserProfile {
  name: string;
  phone: string;
  role: string;
  profileCompletion: number; // e.g., 39 for 39%
}

/**
 * Defines the shape of a user's earnings data.
 */
export interface EarningsData {
  balance: number; // e.g., 8250.56
}

/**
 * Props for the sidebar profile component.
 */
export interface SidebarProfileProps {
  user: UserProfile;
  earnings: EarningsData;
}

/**
 * Props for the card displaying client information.
 */
export interface ClientInfoCardProps {
  name: string;
  memberSince: string;
  location: string;
  rating: string;
  reviews: number;
  verifications: string[];
}

export interface JobHeaderCardProps {
  title: string;
  client: string;
  duration: string;
  type?: string;
  status?: StatusType | string;
  setIsWorkSubmitted?: React.Dispatch<React.SetStateAction<boolean>>
  setSendProposal?: React.Dispatch<React.SetStateAction<boolean>>
  isSendProposal?: boolean
  setIsJobAccepted?: Dispatch<SetStateAction<boolean>>
  setActiveTab?: Dispatch<SetStateAction<string>>
  setOfferJobStatus?: Dispatch<SetStateAction<string>>
  OfferJobStatus?: "initial" | "accepted" | "declined" | "started" | "checked-in" | undefined
}

export interface JobTabsProps {
  activeTab: string;
  tabs: string[];
  onTabChange: (tabName: string) => void;
}

/**
 * Props for the section displaying payment terms.
 */
export interface PaymentTermsSectionProps {
  amount: string;
  type: string;
}

/**
 * Props for the section displaying detailed job information.
 */
export interface JobInfoSectionProps {
  jobTitle: string;
  terms: {
    title?: string;
    items: Array<{ text: string }>;
  };
  files: string[];
}

/**
 * Represents the possible statuses for a work log entry.
 */
export type LogStatus = "check-in" | "in-progress" | "delayed" | "approved";

/**
 * A constant object mapping log statuses for consistent usage.
 */
export const LOG_STATUSES = {
  checkIn: "check-in",
  inProgress: "in-progress",
  delayed: "delayed",
  approved: "approved",
} as const;

/**
 * Represents a single entry in a work log.
 */
export interface LogEntry {
  title: string;
  date: string;
  status: LogStatus | string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

/**
 * Props for a component that renders a list of log entries.
 */
export interface LogComponentProps {
  logs: LogEntry[];
}

/**
 * Props for the section displaying proposal terms.
 */
export interface ProposalTermsProps {
  jobTitle?: string;
  terms: {
    title?: string;
    items: Array<{ text: string; subItems?: string[] }>;
  };
  element?: React.ReactNode;
}

/**
 * Props for the header card of a job, displaying summary information.
 */
export interface JobHeaderCardProps {
  title: string;
  client: string;
  duration: string;
  type?: WorkingType | string;
  status?: JobStatus | string;
}

/**
 * Props for the component used to submit work details.
 */
export interface WorkSubmissionComponentProps {
  name: string;
  workDates: string;
  startTime: string;
  endTime: string;
  onsiteTask: boolean;
  location: string;
  fileName: string;
  notes: string;
  signatureUrl?: string;
  isApproved: boolean;
  paymentStatus: string;
  reviewerName: string;
  rating: number;
  reviewComment: string;
}

/**
 * Represents a generic label-value pair for displaying information.
 */
export interface WorkInfoItem {
  label: string;
  value: string;
}
