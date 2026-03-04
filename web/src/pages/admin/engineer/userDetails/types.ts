export interface ClientReviewProps {
  id: number;
  reviewerName: string;
  reviewerPhoneNumber: string;
  reviewerEmail: string;
  profileUrl: string;
  jobTitle: string;
  rating: number;
  review: string;
  type: string; // e.g., "client"
  createdAt: string; // ISO date string
}

export const DISPUTE_RAISED_BY = {
  client: "Client",
  engineer: "Engineer",
} as const;

export const DISPUTE_PRIORITY_LEVEL = {
  high: "High",
  medium: "Medium",
  low: "Low",
} as const;

export const DISPUTE_RESOLVED_IN_FAVOUR_OF = {
  client: "Client",
  engineer: "Engineer",
} as const;

// Derive union types
export type DisputeRaisedBy =
  (typeof DISPUTE_RAISED_BY)[keyof typeof DISPUTE_RAISED_BY];
export type DisputePriorityLevel =
  (typeof DISPUTE_PRIORITY_LEVEL)[keyof typeof DISPUTE_PRIORITY_LEVEL];
export type DisputeResolvedInFavourOf =
  (typeof DISPUTE_RESOLVED_IN_FAVOUR_OF)[keyof typeof DISPUTE_RESOLVED_IN_FAVOUR_OF];

export interface DisputeProps {
  id: number;
  reportedById: number;
  jobId: number;
  reportedByRole: "client" | "engineer";
  priorityLevel: DisputePriorityLevel;
  issueCategory: string;
  detailedDescription: string;
  attachFile: {
    id: number | null;
    url: string;
    filename: string;
    size: string;
  };
  status: "pending" | "resolved";
  createdAt: string;
  updatedAt: string;
  adminViewedAt: string | null;
}
