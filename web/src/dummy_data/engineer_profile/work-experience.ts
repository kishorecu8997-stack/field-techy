type WorkLocationType = "on-site" | "remote" | "hybrid";
type EmploymentType = "full-time" | "part-time" | "contract" | "internship"; // extend if needed

export interface WorkExperienceEntry {
  id: string;
  designation: string;
  employer: string;
  workLocationType: WorkLocationType;
  employmentType: EmploymentType;
  startDate: string; // ISO 8601 date string (e.g., "2021-06-10")
  endDate: string; // ISO 8601 date string or "present" if current
}

export const workExperienceList: WorkExperienceEntry[] = [
  {
    id: "1",
    designation: "Angular Developer",
    employer: "Zoho Corp",
    workLocationType: "on-site",
    employmentType: "full-time",
    startDate: "2021-06-10",
    endDate: "2023-06-10",
  },
  {
    id: "2",
    designation: "Angular Developer",
    employer: "Freshworks",
    workLocationType: "hybrid",
    employmentType: "full-time",
    startDate: "2022-08-01",
    endDate: "2024-08-01",
  },
  {
    id: "3",
    designation: "Angular Developer",
    employer: "Accenture",
    workLocationType: "remote",
    employmentType: "full-time",
    startDate: "2023-09-15",
    endDate: "2025-09-15",
  },
  {
    id: "4",
    designation: "Angular Developer",
    employer: "TCS",
    workLocationType: "remote",
    employmentType: "full-time",
    startDate: "2023-09-15",
    endDate: "2025-09-15",
  },
];

export type ExperiencesFormData = {
  id: string;
  designation: string;
  employer: string;
  workLocationType: string;
  employmentType: string;
  startDate: Date | null;
  endDate: Date | null;
};

export const experianceEdit: ExperiencesFormData[] = [
  {
    id: "1",
    designation: "1",
    employer: "Zoho Corp",
    workLocationType: "on-site",
    employmentType: "full-time",
    startDate: new Date("2021-06-10"),
    endDate: new Date("2023-06-10"),
  },
  {
    id: "2",
    designation: "1",
    employer: "Freshworks",
    workLocationType: "hybrid",
    employmentType: "full-time",
    startDate: new Date("2022-08-01"),
    endDate: new Date("2024-08-01"),
  },
  {
    id: "3",
    designation: "1",
    employer: "Accenture",
    workLocationType: "remote",
    employmentType: "full-time",
    startDate: new Date("2023-09-15"),
    endDate: new Date("2025-09-15"),
  },
  {
    id: "4",
    designation: "1",
    employer: "TCS",
    workLocationType: "remote",
    employmentType: "full-time",
    startDate: new Date("2023-09-15"),
    endDate: new Date("2025-09-15"),
  },
];

export const EMPLOYMENT_TYPE_VALUES = {
  FULL_TIME: "full-time",
  PART_TIME: "part-time",
  CONTRACT: "contract",
  INTERNSHIP: "internship",
} as const;

export const WORK_LOCATION_TYPE_VALUES = {
  ON_SITE: "on-site",
  REMOTE: "remote",
  HYBRID: "hybrid",
} as const;

export const employmentTypeOptions = [
  { label: "Full-time", value: EMPLOYMENT_TYPE_VALUES.FULL_TIME },
  { label: "Part-time", value: EMPLOYMENT_TYPE_VALUES.PART_TIME },
  { label: "Contract", value: EMPLOYMENT_TYPE_VALUES.CONTRACT },
  { label: "Internship", value: EMPLOYMENT_TYPE_VALUES.INTERNSHIP },
] as const;

export const workLocationTypeOptions = [
  { label: "On-site", value: WORK_LOCATION_TYPE_VALUES.ON_SITE },
  { label: "Remote", value: WORK_LOCATION_TYPE_VALUES.REMOTE },
  { label: "Hybrid", value: WORK_LOCATION_TYPE_VALUES.HYBRID },
] as const;

export const DESIGNATION_OPTIONS = {
  "1": "Angular Developer",
  "2": "React Developer",
  "3": "Frontend Engineer",
  "4": "Backend Developer",
  "5": "Full Stack Developer",
  "6": "UI/UX Designer",
  "7": "DevOps Engineer",
  "8": "Software Architect",
  "9": "QA Engineer",
  "10": "Project Manager",
} as const;

export type DesignationKey = keyof typeof DESIGNATION_OPTIONS;
