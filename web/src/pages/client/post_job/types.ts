import type React from "react";

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

export const OccurrenceEndType = {
  onDate: "onDate",
  afterDate: "afterDate",
};

export type OccurrenceEndTypeType =
  (typeof OccurrenceEndType)[keyof typeof OccurrenceEndType];

export interface ClientFieldsTypes {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  startDate?: any;
  startTime?: string;
}

export interface ClientInterviewerSectionProps {
  interviewers: DetailItem[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onAdd: () => void;
  composeDetails: (client: any) => DetailsType;
}

// Each label/value pair
export interface DetailItem {
  label: string;
  value: string | number | null | undefined;
}

// Section divider
export interface DetailSection {
  section: string;
}

// Union of both
export type DetailsType = Array<DetailItem | DetailSection>;

// Interviewer fields (your existing shape — adjust if needed}

export interface DetailItem {
  label: string;
  value: string | number | null | undefined;
}

export interface DetailSection {
  section: string;
}

export interface InfoItem {
  label: string;
  value: string;
}

export interface CardProps {
  title: string;
  items: InfoItem[];
  onEdit?: () => void;
  onDelete?: () => void;
  addAction?: React.ReactNode;
}


export interface pointOfContentTypes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  contactType: string;
}