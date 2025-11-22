import {
  locationType,
  RepeatByFields
} from "@/pages/client/post_job/types";

export const experienceLevel = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "expert", label: "Expert" },
];

export const skills = [
  { value: "skill1", label: "Skill 1" },
  { value: "skill2", label: "Skill 2" },
  { value: "skill3", label: "Skill 3" },
  { value: "skill4", label: "Skill 4" },
];

export const tools = [
  { value: "tool1", label: "Tool 1" },
  { value: "tool2", label: "Tool 2" },
  { value: "tool3", label: "Tool 3" },
  { value: "tool4", label: "Tool 4" },
];

export const task = [
  { value: "task1", label: "Task 1" },
  { value: "task2", label: "Task 2" },
  { value: "task3", label: "Task 3" },
  { value: "task4", label: "Task 4" },
];

export const safetyWears = [
  { value: "safetyWear1", label: "Safety Wear 1" },
  { value: "safetyWear2", label: "Safety Wear 2" },
  { value: "safetyWear3", label: "Safety Wear 3" },
  { value: "safetyWear4", label: "Safety Wear 4" },
];

export const workTypes = [
  { label: "Remote", value: locationType.remote },
  { label: "On-site", value: locationType.onsite },
];

export const primaryLanguageOptions = [
  { value: "language1", label: "Language 1" },
  { value: "language2", label: "Language 2" },
  { value: "language3", label: "Language 3" },
];

export const secondaryLanguageOptions = [
  { value: "language1", label: "Language 1" },
  { value: "language2", label: "Language 2" },
  { value: "language3", label: "Language 3" },
];

export const repeatByOptions = [
  { value: RepeatByFields.week, label: "Every Week" },
  { value: RepeatByFields.month, label: "Every Month" },
  { value: RepeatByFields.year, label: "Every Year" },
];

export const TemplateData = [
  {
    id: 1,
    templatesName: "Template 1",
    projectName: "Website Redesign",
    jobName: "Frontend Developer",
    jobTitle: "React.js Developer",
    locationType: "remote",
    location: "",
    experienceLevel: "intermediate",
    numberOfVacancy: "2",
    skills: ["skill1"],
    tools: ["tool1"],
    task: ["task1"],
    safetyWears: ["safetyWear1"],
    description: "Need a frontend developer to redesign the company website.",
    backFills: "not-required",
    budget: "3000",
    primaryLanguage: "English",
    secondaryLanguage: "Spanish",
    attachment: null,
    otherInfo: "testing",
    startDate: new Date("2025-01-20"),
    startTime: "09:00",
    endDate: new Date("2025-01-20"),
    endTime: "17:00",
    jobDuration: "8 hours",
    tentativeStartDate: null,
    tentativeEndDate: null,
    tentativeEndTime: "",
    jobOccurrence: "repeat",
    repeatedBy: "everyWeek",
    occurrenceEndType: "onDate",
    after: "",
    repeatedByMonth: "",
    repeatedByYear: "",
    JobOccurrenceEndDate: new Date("2025-03-01"),
    estimatedDuration: "6 weeks",
  },
  {
    id: 2,
    projectName: "Warehouse Electrical Upgrade",
    jobName: "Electrician Work",
    jobTitle: "Certified Electrician",
    locationType: "onsite",
    location: "Houston, Texas",
    experienceLevel: "senior",
    numberOfVacancy: "1",
    skills: ["skill1"],
    tools: ["tool1"],
    task: ["task1"],
    safetyWears: ["safetyWear1"],
    description: "Electrical system upgrade and safety inspection.",
    backFills: "required",
    budget: "1500",
    primaryLanguage: "English",
    secondaryLanguage: "",
    attachment: null,
    otherInfo: "testing",
    startDate: new Date("2025-02-10"),
    startTime: "08:00",
    endDate: new Date("2025-02-10"),
    endTime: "16:00",
    jobDuration: "8 hours",
    tentativeStartDate: null,
    tentativeEndDate: null,
    tentativeEndTime: "",
    jobOccurrence: "custom",
    repeatedBy: "week",
    occurrenceEndType: "afterDate",
    after: "0",
    repeatedByMonth: "",
    repeatedByYear: "",
    templatesName: "Template 2",
    JobOccurrenceEndDate: null,
    estimatedDuration: "1 day",
  },
];
