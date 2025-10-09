export interface MyJobsHeaderProps {
  title: string;
  currentSort?: string;
  onSortChange: (sort: SortOption) => void;
  isShowBreadcrumb?: boolean;
  description?: string;
  isShowSort?: boolean;
}

export interface UserProfile {
  name: string;
  phone: string;
  role: string;
  profileCompletion: number; // e.g., 39 for 39%
}

export interface EarningsData {
  balance: number; // e.g., 8250.56
}

export interface SidebarProfileProps {
  user: UserProfile;
  earnings: EarningsData;
}

export interface ClientInfoCardProps {
  name: string;
  memberSince: string;
  location: string;
  rating: string;
  reviews: number;
  verifications: string[];
}

export const Status = {
  applied: "applied",
  inprogress: "inprogress",
  completed: "completed",
} as const;

export type StatusType = (typeof Status)[keyof typeof Status];

export interface JobHeaderCardProps {
  title: string;
  client: string;
  duration: string;
  type?: string;
  status?: StatusType | string;
}

export interface JobTabsProps {
  activeTab: string;
  tabs: string[];
  onTabChange: (tabName: string) => void;
}

export interface PaymentTermsSectionProps {
  amount: string;
  type: string;
}

export interface JobInfoSectionProps {
  jobTitle: string;
  terms: {
    title?: string;
    items: Array<{
      text: string;
    }>;
  };
  files: string[];
}

export interface LogEntry {
  title: string;
  date: string;
  status: "check-in" | "in-progress" | "delayed" | "approved";
  showIcon?: boolean;
  children?: React.ReactNode;
}

interface LogComponentProps {
  logs: LogEntry[];
}

export interface ProposalTermsProps {
  jobTitle?: string;
  terms: {
    title?: string;
    items: Array<{
      text: string;
      subItems?: string[];
    }>;
  };
  element?: React.ReactNode;
}


export interface JobHeaderCardProps {
  title: string;
  client: string;
  duration: string;
  type?: WorkingType | string;
  status?: JobStatus | string;
}


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

export interface WorkInfoItem {
  label: string;
  value: string;
}
