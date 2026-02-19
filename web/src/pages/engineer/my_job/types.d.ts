import type {
  AssignmentStatus,
  JobStatus as SearchJobStatus,
  SortOption,
  WorkingType as SearchWorkingType,
} from "../search_result/types";
export type { OfferedJobStatusType } from "../search_result/types";

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
// export type SortOption = "Relevance" | "Date" | "Salary" | "Distance";

/**
 * Represents the possible statuses for a job.
 */
export type JobStatus =
  | SearchJobStatus
  | "active"
  | "completed"
  | "pending"
  | "cancelled"
  | string;

/**
 * Represents the type of work arrangement for a job.
 */
export type WorkingType =
  | SearchWorkingType
  | "remote"
  | "on-site"
  | "hybrid"
  | string;

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
  action?: React.ReactNode;
  isShowButton?: boolean;
  buttonText?: string;
  onClick?: () => void;
  customLabels?: Record<string, string>;
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
  rating: number | string;
  reviews: number | string;
  verifications: string[];
  onOpenReview?: () => void;
  onClose?: () => void;
}

export interface JobHeaderCardProps {
  title: string;
  client: string;
  duration: string;
  type?: WorkingType | string;
  status?: JobStatus | string;
  setIsWorkSubmitted?: React.Dispatch<React.SetStateAction<boolean>>;
  setSendProposal?: React.Dispatch<React.SetStateAction<boolean>>;
  isSendProposal?: boolean;
  setIsJobAccepted?: Dispatch<SetStateAction<boolean>>;
  setActiveTab?: Dispatch<SetStateAction<string>>;
  setOfferJobStatus?: Dispatch<
    SetStateAction<OfferedJobStatusType | AssignmentStatus | undefined>
  >;
  OfferJobStatus?: OfferedJobStatusType | AssignmentStatus | undefined;
  hideBreakDetails?: boolean;
  jobLocation?: string;
  numberOfVacancy?: number;
  numberOfApplicants?: number;
  hideDurationAndClient?: boolean;
  assignmentId?: number;
  activeTab?: string;
  onAddProgressUpdate?: (update: ProgressUpdate) => void;
  onOpenFinalStatement?: () => void;
  onToggleChat?: (jobId: string) => void;
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

export interface ProgressUpdate {
  title: string;
  description: string;
  attachmentName?: string;
  timestamp: string;
  statusText?: string;
  statusColor?: string;
  accentColor?: string;
  detailsType?: "break" | "revision" | string;
  detailsLabel?: string;
  startTime?: string;
  endTime?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  reason?: string;
  requestType?: string;
}

// Break request form fields used in break request modal/form
export type BreakRequestFormFields = {
  requestType: "Short Term Break" | "Long Term Break" | "";
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  duration: string;
  reason: string;
};

// Update Log form fields
export type UpdateLogFormFields = {
  title: string;
  notes: string;
  attachments: FileList | null;
};

/**
 * Represents the possible statuses for an offered job.
 */

/**
 * Represents a job-like object with common job properties.
 */
export type JobLike = {
  startDate?: string | Date | null;
  jobDuration?: string | number | null;
  duration?: string | number | null;
  status?: string | null;
  jobTitle?: string | null;
  title?: string | null;
};

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
 * Represents work information items.
 */
export interface WorkInfoItem {
  label: string;
  value: string;
}

/**
 * Form data structure for proposal submission
 * @interface ProposalFormData
 * @property {string} proposalDescription - The proposal description/message
 * @property {FileList | null} attachments - Optional file attachments (PDF)
 */
export interface ProposalFormData {
  proposalDescription: string;
  attachments: FileList | null;
}

/**
 * Props for the ProposalInfoTab component
 * @interface ProposalInfoTabProps
 * @property {ProposalFormData} submittedProposal - The submitted proposal data to display
 */
export interface ProposalInfoTabProps {
  submittedProposal: ProposalFormData;
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
  isApproved?: boolean;
  paymentStatus: string;
  reviewerName: string;
  rating: number;
  reviewComment: string;
}

/**
 * Props for the RevisionRequestUpdateForm component
 */
export interface RevisionRequestUpdateFormProps {
  onClose: () => void;
  onAddProgressUpdate?: (update: ProgressUpdate) => void;
}

/**
 * Form fields for revision update submission
 */
export interface RevisionUpdateFields {
  notes: string;
  attachments: FileList | null;
}