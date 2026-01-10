/**
 * @file Defines constants and enums for the experiences feature.
 */

/** Defines the possible string values for employment types. */
export const EMPLOYMENT_TYPE_VALUES = {
  FULL_TIME: "full-time",
  PART_TIME: "part-time",
  CONTRACT: "contract",
  INTERNSHIP: "internship",
} as const;

/**
 * Type alias for employment types, derived from `EMPLOYMENT_TYPE_VALUES`.
 * This provides type safety without generating runtime enum objects.
 */
export type EmploymentType =
  (typeof EMPLOYMENT_TYPE_VALUES)[keyof typeof EMPLOYMENT_TYPE_VALUES];

/** Defines the possible string values for work location types. */
export const WORK_LOCATION_TYPE_VALUES = {
  ON_SITE: "on-site",
  REMOTE: "remote",
  HYBRID: "hybrid",
} as const;

/**
 * Type alias for work location types, derived from `WORK_LOCATION_TYPE_VALUES`.
 * This provides type safety without generating runtime enum objects.
 */
export type WorkLocationType =
  (typeof WORK_LOCATION_TYPE_VALUES)[keyof typeof WORK_LOCATION_TYPE_VALUES];

/** Options for the Employment Type select field, including display labels. */
export const employmentTypeOptions = [
  { label: "Full-time", value: EMPLOYMENT_TYPE_VALUES.FULL_TIME },
  { label: "Part-time", value: EMPLOYMENT_TYPE_VALUES.PART_TIME },
  { label: "Contract", value: EMPLOYMENT_TYPE_VALUES.CONTRACT },
  { label: "Internship", value: EMPLOYMENT_TYPE_VALUES.INTERNSHIP },
];

/** Options for the Work Location Type select field, including display labels. */
export const workLocationTypeOptions = [
  { label: "On-site", value: WORK_LOCATION_TYPE_VALUES.ON_SITE },
  { label: "Remote", value: WORK_LOCATION_TYPE_VALUES.REMOTE },
  { label: "Hybrid", value: WORK_LOCATION_TYPE_VALUES.HYBRID },
];

/**
 * Dummy data for designations. In a real app, this would likely come from an API.
 */
export const designationOptions = [
  { value: "1", label: "Angular Developer" },
  { value: "2", label: "React Developer" },
  { value: "3", label: "Frontend Engineer" },
  { value: "4", label: "Backend Developer" },
  { value: "5", label: "Full Stack Developer" },
  { value: "6", label: "UI/UX Designer" },
  { value: "7", label: "DevOps Engineer" },
  { value: "8", label: "Software Architect" },
  { value: "9", label: "QA Engineer" },
  { value: "10", label: "Project Manager" },
] as const;
