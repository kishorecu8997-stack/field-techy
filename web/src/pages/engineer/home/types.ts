export interface JobItem {
  id: string;
  jobCode?: string;
  clientId: string;

  jobTitle: string;
  jobDescription: string;
  category: string | number;

  jobType: "On site" | "Remote" | "Hybrid" | string;
  engagementModel: number;

  countryId?: number;
  stateId?: number;
  cityId?: number;

  location: string | null;

  startDate: string; // ISO date
  endDate?: string | null;

  numberOfVacancy: number;

  // Number of engineers already assigned to this job
  assignedEngineerCount?: number;

  experience: string | null | number;
  salary: string | null;
  budgetType: string | null;
  currencySymbol?: string;
  isSaved?: boolean;
  status:
    | "Posted"
    | "In Progress"
    | "Cancelled"
    | "Closed"
    | "Hold"
    | "Flagged"
    | string;

  skills: string[] | null;
  tools: string[] | null;

  toolImage?: string | null;
  toolAdditionalBudget?: string | null;
  postedTime: string;
  jobDuration?: string;
  rating?: number;
  slaLevel?: string;
  client: Client;

  // Additional assignment fields from API
  assignmentId?: number | null;
  assignmentType?: "invitation" | "application" | null;

  // Timestamp fields for job start
  startRequestedAt?: string | null;
  startedAt?: string | null;
}

export interface Client {
  id: string;
  clientType: "home" | "corporate" | string;

  companyName: string;
  contactPersonName: string;

  email: string;
  phoneNumber: string;

  country: string;
  state: string;
  city: string;
  postalCode: string;
  address: string;
}

/**
 * Form values for proposal submission
 * @interface ProposalFormValues
 * @property {string} description - The proposal description text
 * @property {FileList | null} attachment - Optional PDF file attachment
 */
export interface ProposalFormValues {
  description: string;
  attachment: FileList | null;
}

/**
 * Props for NewSendProposal component
 * @interface NewSendProposalProps
 * @property {() => void} [onCancel] - Optional callback function when proposal submission is cancelled
 */
export interface NewSendProposalProps {
  onCancel?: () => void;
}
