export type JobStatus =
  | "All Jobs"
  | "In-Progress"
  | "Completed"
  | "Posted"
  | "Hold";

export interface Job {
  id: number;
  title: string;
  date: string;
  location: string;
  duration: string;
  serviceType: string;
  price: string;
  workMode: string;
  status: Exclude<JobStatus, "All Jobs">; // "All Jobs" is only for UI filter
}

export interface JobCardHeaderProps {
  title: string;
  hours: number;
  client: string;
  status: "On Site" | "Remote" | "Pending";
  onApprove: () => void;
  onRequestRevision: () => void;
}

export interface JobCardProps {
  title: string;
  hours: number;
  client: string;
  status: "On Site" | "Remote" | "Pending";
  onApprove: () => void;
  onRequestRevision: () => void;
}

export interface JobHeaderCardProps {
  title: string;
  client: string;
  duration: string;
  type?: WorkingType | string;
  status?: JobStatus | string;
}

export interface JobHeaderCardProps {
  title: string;
  client: string;
  duration: string;
  type?: string;
  status?: StatusType | string;
  setIsApprovalSubmitted?: React.Dispatch<React.SetStateAction<boolean>>;
  setSendProposal?: React.Dispatch<React.SetStateAction<boolean>>;
  isSendProposal?: boolean;
  setIsJobAccepted?: Dispatch<SetStateAction<boolean>>;
  setActiveTab?: Dispatch<SetStateAction<string>>;
}

export interface LogComponentProps {
  logs: LogEntry[];
}

export interface LogEntry {
  title: string;
  date: string;
  status: LogStatus | string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export interface JobInfoSectionProps {
  jobTitle: string;
  terms: {
    title?: string;
    items: Array<{ text: string }>;
  };
  files: string[];
}

export interface WorkInfoItem {
  label: string;
  value: string;
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
}

export interface paymentTermsProps {
  title: string;
  amount: string;
  priceType: string;
}

export interface JobTabsProps {
  activeTab: string;
  tabs: string[];
  onTabChange: (tabName: string) => void;
}

export interface ProposalTermsProps {
  jobTitle?: string;
  terms: {
    title?: string;
    items: Array<{ text: string; subItems?: string[] }>;
  };
  element?: React.ReactNode;
}
