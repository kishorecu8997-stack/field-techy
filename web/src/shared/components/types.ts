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
  userType?: 'engineer' | 'client';
}

/**
 * Props for WorkLocationMap component
 * @property {number} [latitude] - Latitude coordinate for map center
 * @property {number} [longitude] - Longitude coordinate for map center
 * @property {string} [locationName] - Name of the location to display
 * @property {string} [address] - Full address to display in marker popup
 */
export interface WorkLocationMapProps {
  latitude?: number;
  longitude?: number;
  locationName?: string;
  address?: string;
}

/**
 * Represents a single timeline item with title, timestamp, and optional status
 */
export type TimelineItem = {
  title: string;
  timestamp: string;
  accentColor?: string;
  statusText?: string;
  statusColor?: string;
  attachmentUrl?: string | null;
  attachmentName?: string;
  details?: string | null;
  description?: string | null;
  attachments?: Array<{ name: string; url: string }>;
};

/**
 * Props for TimelineList component
 */
export interface TimelineListProps {
  items: TimelineItem[];
  className?: string;
}

export const TIMELINE_LIST_DEFAULTS = {
  accentColor: "#2f80ed",
  statusColor: "#f59e0b",
} as const;
