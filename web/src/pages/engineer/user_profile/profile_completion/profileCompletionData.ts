/**
 * ProfileFieldStatus represents the completion state of each field: complete, pending, or rejected.
 * ProfileSection represents a section in the profile with its fields, navigation key, and estimated time per field.
 * `profileCompletionData` provides sample data for all profile sections including their fields and statuses.
 */
export type ProfileFieldStatus = "complete" | "pending" | "rejected";
export interface ProfileField {
  label: string;
  status: ProfileFieldStatus;
}

export interface ProfileSection {
  key: string;
  title: string;
  navigateTo: string;
  estimatedMinutesPerField: number;
  fields: ProfileField[];
}

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
      { label: "Work Experience 1", status: "complete" },
      { label: "Work Experience 2", status: "pending" },
      { label: "Work Experience 3", status: "pending" },
      { label: "Work Experience 4", status: "rejected" },
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
