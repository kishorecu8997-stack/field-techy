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

  skills: string[] | null;
  tools: string[] | null;

  toolImage: string | null;
  toolAdditionalBudget: string | null;
  postedTime: string;
  jobDuration: string;
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
