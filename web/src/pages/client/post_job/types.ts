import type React from "react";

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

export const locationType = {
  remote: "remote",
  onsite: "onsite",
  hybrid: "hybrid",
};

export type locationTypeType = (typeof locationType)[keyof typeof locationType];

export const backFillsType = {
  required: "required",
  notRequired: "not-required",
};

export type backFillsTypeType =
  (typeof backFillsType)[keyof typeof backFillsType];

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
  value: any;
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

export interface PostAJobFieldsProps {
  id?: number;
  projectName: string;
  jobName: string;
  jobTitle: string;
  locationType: locationTypeType;
  location: string;
  experienceLevel: string;
  numberOfVacancy: string;
  skills: string[];
  tools: string[];
  safetyWears: string[];
  task: string;
  description: string;
  backFills: backFillsTypeType;
  budget: string;
  primaryLanguage: string;
  secondaryLanguage: string;
  attachment: File | null;
  otherInfo: string;
  startDate: Date | null;
  startTime: string;
  endDate: Date | null;
  endTime: string;
  jobDuration: string;
  tentativeStartDate: Date | null;
  tentativeEndDate: Date | null;
  tentativeEndTime: string;
  jobOccurrence: OccurrenceType;
  repeatedBy: RepeatByType;
  occurrenceEndType: OccurrenceEndTypeType;
  after: string;
  repeatedByMonth: string;
  repeatedByYear: string;
  templatesName: string;
  JobOccurrenceEndDate: Date | null;
  estimatedDuration: string;
  saveAsTemplate: boolean;
}

export type PostOption = {
  label: string;
  action?: () => void;
  value: string | number;
  tooltip?: string; 
};

export interface SectionData {
  title: string;
  items: InfoItem[];
  onEdit: () => void;
  onDelete: () => Promise<void>;
}

export interface MultiCardProps {
  sections: SectionData[];
  addAction?: React.ReactNode; // common add component
  title?: string;
  disabled?: boolean;
}
