export interface JobItem {
  id: string;
  clientId: string;

  jobTitle: string;
  jobDescription: string;
  category: string;

  jobType: "CONTRACT" | "FULL_TIME" | "PART_TIME" | string;
  jobVisibility: "PUBLIC" | "PRIVATE" | string;
  engagementModel: "ON_SITE" | "REMOTE" | "HYBRID" | string;

  country: string;
  state: string;
  city: string;

  location: string | null;

  startDate: string; // ISO date
  startTime: string; // HH:mm:ss

  numberOfVacancy: number;
  timePeriodOfJob: string;

  experience: string | null | number;
  salary: string | null;

  requirementDeliverable: string;
  otherDetails: string;

  rateCardRequiredSkill: string;
  rateCardExperienceLevel: "JUNIOR" | "MID_LEVEL" | "SENIOR" | string;

  projectDeadline: string;
  milestoneStructure: string;

  status: "NEW" | "ACTIVE" | "CLOSED" | string;
  featured: boolean;

  budgetType?: "FIXED" | "HOURLY" | "NEGOTIABLE" | string;

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
  businessType: string;

  companyName: string;
  contactPersonName: string;

  email: string;
  phoneNumber: string;

  country: string;
  state: string;
  city: string;
  postalCode: string;
  address: string;

  industry: string;

  isApproved: boolean;
  enableNotifications: boolean;

  profilePicture: string | null;

  governmentIdProofDocument: string | null;
  certificationQualificationsDocument: string | null;

  taxDocumentVat: string;
  vatRegistrationNumber: string;

  password: string | null;
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
