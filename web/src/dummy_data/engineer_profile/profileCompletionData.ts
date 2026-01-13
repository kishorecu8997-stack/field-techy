/** FieldStatus represents the completion state of each field: complete, pending, or rejected. */
export type FieldStatus = "complete" | "pending" | "rejected";

/** Defines the types and interfaces for profile fields and sections. */
export interface ProfileField {
  label: string;
  status: FieldStatus;
}
/** ProfileSection represents a section in the profile with its fields, navigation key, and estimated time per field. */
export interface ProfileSection {
  key: string;
  title: string;
  navigateTo: string;
  estimatedMinutesPerField: number;
  fields: ProfileField[];
}

/** profileCompletionData provides sample data for all profile sections including their fields and statuses. */
export const profileCompletionData: ProfileSection[] = [
  {
    key: "personalInfo",
    title: "Personal Info",
    navigateTo: "personalInfo",
    estimatedMinutesPerField: 2,
    fields: [
      { label: "Full Name", status: "complete" },
      { label: "Phone Number", status: "complete" },
      { label: "Address", status: "pending" },
      { label: "Email Verification", status: "pending" },
    ],
  },
  {
    key: "education",
    title: "Education",
    navigateTo: "education",
    estimatedMinutesPerField: 5,
    fields: [
      { label: "University", status: "complete" },
      { label: "Degree", status: "rejected" },
    ],
  },
  {
    key: "experiences",
    title: "Experience",
    navigateTo: "experiences",
    estimatedMinutesPerField: 7,
    fields: [
      { label: "Work Experience1", status: "complete" },
      { label: "Work Experience2", status: "pending" },
      { label: "Work Experience3", status: "pending" },
      { label: "Work Experience", status: "rejected" },
    ],
  },
  {
    key: "documents",
    title: "Documents",
    navigateTo: "documents",
    estimatedMinutesPerField: 10,
    fields: [
      { label: "NIC", status: "complete" },
      { label: "Certificate", status: "pending" },
    ],
  },
  {
    key: "account",
    title: "Account",
    navigateTo: "settings",
    estimatedMinutesPerField: 10,
    fields: [
      { label: "Password", status: "complete" },
      { label: "Bank Account", status: "complete" },
    ],
  },
];
