export interface JobPostFormData {
  jobTitle: string;
  jobDescription: string;
  jobType: string;
  country: string;
  state: string;
  city: string;
  startDate: string;
  startTime: string;
  numberOfVacancy: string;
  timePeriod: string;
  skillsRequired: string;
  requirements: string;
  otherInfo: string;
  toolName: string;
  toolImage: File | null;
  additionalBudget: string;
  experienceLevel: string;
  engagementModel: string;
  projectDeadline: string;
  milestoneStructure: string;
  attachments: File | null;
  jobVisibility: string;
}

// Define FormData type
interface FormData {
  jobTitle: string;
  jobDescription: string;
  jobType: string;
  country: string;
  state: string;
  city: string;
  startDate: Date | null;
  startTime?: string;
  numberOfVacancy: string;
  timePeriod: string;
  skillsRequired: string;
  requirements: string;
  otherInfo: string;
  toolName: string;
  toolImage: File | null;
  additionalBudget: string;
  experienceLevel: string;
  engagementModel: string;
  projectDeadline: Date | null;
  milestoneStructure: string;
  attachments: File | null;
  jobVisibility: string;
}

export interface PaymentCardOption {
  id: string;
  last4: string;
  brand: "visa" | "mastercard" | "amex" | "discover" | string;
  name: string;
}

export const OccurrenceFields = {
  repeat: "repeat",
  custom: "custom",
};

export type OccurrenceType =
  (typeof OccurrenceFields)[keyof typeof OccurrenceFields];

export const RepeatByFields = {
  week: "everyWeek",
  month: "everyMonth",
  year: "everyYear",
};

export type RepeatByType = (typeof RepeatByFields)[keyof typeof RepeatByFields];


export const OccurrenceEndType ={
  onDate: "onDate",
  afterDate: "afterDate",
}

export type OccurrenceEndTypeType = (typeof OccurrenceEndType)[keyof typeof OccurrenceEndType];


export interface ClientFieldsTypes {
  firstName: string;
  clientEmail: string;
  clientPhone: string;
  startDate: Date;
  startTime: string;
}
