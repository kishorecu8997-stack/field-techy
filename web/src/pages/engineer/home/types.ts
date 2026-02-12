export interface JobItem {
  id: string;
  clientId: string;

  jobTitle: string;
  jobDescription: string;
  category: string;

  jobType: "CONTRACT" | "FULL_TIME" | "PART_TIME" | string;
  engagementModel: number;

  countryId?: number;
  stateId?: number;
  cityId?: number;

  location: string | null;

  startDate: string; // ISO date

  numberOfVacancy: number;

  experience: string | null | number;
  salary: string | null;
  budgetType: string | null;

  status: "NEW" | "ACTIVE" | "CLOSED" | string;

  skills: string[] | null;
  tools: string[] | null;

  toolImage: string | null;
  toolAdditionalBudget: string | null;
  postedTime: string;
  jobDuration: string;
  rating?: number;
  slaLevel?: string;
  client: Client;
}

export interface Client {
  id: string;
  clientType: "HOME" | "COMPANY" | string;

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
