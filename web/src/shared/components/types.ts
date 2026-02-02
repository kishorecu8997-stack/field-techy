import type { SortOption } from "@/pages/engineer/search_result/types";

export interface SortDropdownProps {
  currentSort?: SortOption;
  onSortChange?: (sort: SortOption) => void;
}

export type Attachment = { name: string; url: string };

export interface JobOverviewProps {
  jobTitle: string;
  jobDescription: string;
  skills?: string[];
  tools?: Array<{ name: string; price: string; image?: string }>;
  duration?: string;
  engagementModel?: string;
  experienceLevel?: string;
  numberOfVacancies?: number;
  weeklyPay?: string;
  toolAllowance?: string;
  totalPayment?: string;
  weeklyPayNote?: string;
  additionalDetails?: string[];
  attachments?: Array<Attachment | string>;
}
