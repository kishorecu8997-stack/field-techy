/**
 * @file Defines constants and enums for the experiences feature.
 */

/** Options for the Employment Type select field, matching API lookup IDs. */
export const employmentTypeOptions = [
  { label: "Full-time", value: "1" },
  { label: "Part-time", value: "2" },
  { label: "Contract", value: "3" },
  { label: "Freelance", value: "5" },
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
