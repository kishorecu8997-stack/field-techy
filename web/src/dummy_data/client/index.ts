import {
  locationType,
  RepeatByFields
} from "@/pages/client/post_job/types";
import type { ChatMessage, Conversation } from "@/pages/engineer/chat/types";

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
    task: "task1",
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
    saveAsTemplate: true,
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
    saveAsTemplate: true,
  },
];



export const messages: ChatMessage[] = [
  {
    id: "m1",
    conversationId: "c3",
    from: "other",
    text: "Hey marcel, The job submission deadline on our platform is approaching fast.",
    timestamp: "15:42",
  },
  {
    id: "m2",
    conversationId: "c3",
    from: "other",
    text: "Your payment for the job listing has been processed.",
    timestamp: "16:20",
  },
  {
    id: "m3",
    conversationId: "c3",
    from: "me",
    text: "Oh I'm sorry, may I see the bill Receipt?",
    timestamp: "16:28",
  },

  // another conversation
  {
    id: "m4",
    conversationId: "c1",
    from: "other",
    text: "Daily report for yesterday has been generated.",
    timestamp: "09:01",
  },
  {
    id: "m5",
    conversationId: "c4",
    from: "other",
    text: "Pushing the new design to Figma now.",
    timestamp: "10:10",
  },
  {
    id: "m6",
    conversationId: "c4",
    from: "me",
    text: "Great, I’ll review it in a bit.",
    timestamp: "10:12",
  },
];


// src/data/conversations.ts

export const conversations: Conversation[] = [
  {
    id: "c1",
    name: "Daily Report",
    lastMessage: "Okay, it’s all noted.",
    updatedAt: "Yesterday",
    unreadCount: 0,
    type: "personal",
    participants: ["You", "Daily Report Bot"],
  },
  {
    id: "c2",
    name: "Office 450",
    lastMessage: "Okay, it’s all noted.",
    updatedAt: "Yesterday",
    unreadCount: 0,
    type: "personal",
    participants: ["You", "Office Manager"],
  },
  {
    id: "c3",
    name: "Employees Task",
    lastMessage: "Okay, it’s all noted.",
    updatedAt: "Yesterday",
    unreadCount: 4,
    type: "group",
    members: ["Marcel", "HR Team", "Finance", "You"],
  },
  {
    id: "c4",
    name: "Design Squad",
    lastMessage: "Let’s finalize the UI today.",
    updatedAt: "Today",
    unreadCount: 2,
    type: "group",
    members: ["Alice", "Ben", "Chris", "You"],
  },
];


export const projectCountries = [
  { label: "United Kingdom", value: "UK" },
  { label: "India", value: "IN" },
];

export const currencyTypes = [
  { label: "GBP", value: "GBP" },
  { label: "INR", value: "INR" },
];

export const projectGroups = [
  { label: "Engineering", value: "engineering" },
  { label: "Product", value: "product" },
  { label: "Design", value: "design" },
  { label: "Marketing", value: "marketing" },
  { label: "Sales", value: "sales" },
  { label: "Operations", value: "operations" },
];

export const projectRateCards = [
  {
    id: 1,
    service: "Breakfix",
    skill: "Hardware Repair",
    sla: "4H",
    level: "L1",
    country: "India",
    rate: "₹1,500/hr",
  },
  {
    id: 2,
    service: "Breakfix",
    skill: "Onsite Diagnostics",
    sla: "2H",
    level: "L2",
    country: "India",
    rate: "₹2,200/hr",
  },
  {
    id: 3,
    service: "Security",
    skill: "Penetration Testing",
    sla: "48H",
    level: "L3",
    country: "United Kingdom",
    rate: "£80/hr",
  },
  {
    id: 4,
    service: "Database",
    skill: "PostgreSQL Optimization",
    sla: "8H",
    level: "L2",
    country: "United Kingdom",
    rate: "£52/hr",
  },
  {
    id: 5,
    service: "Backend",
    skill: "Node.js API Development",
    sla: "12H",
    level: "L3",
    country: "India",
    rate: "₹2,300/hr",
  },
  {
    id: 6,
    service: "Cloud",
    skill: "Azure Infrastructure Setup",
    sla: "8H",
    level: "L3",
    country: "India",
    rate: "₹2,800/hr",
  },
  {
    id: 7,
    service: "Breakfix",
    skill: "Hardware Replacement",
    sla: "4H",
    level: "L1",
    country: "United Kingdom",
    rate: "£42/hr",
  },
  {
    id: 8,
    service: "Network",
    skill: "Firewall Configuration",
    sla: "6H",
    level: "L2",
    country: "United Kingdom",
    rate: "£58/hr",
  },
  {
    id: 9,
    service: "Frontend",
    skill: "Angular Development",
    sla: "24H",
    level: "L3",
    country: "United Kingdom",
    rate: "£65/hr",
  },
  {
    id: 10,
    service: "DevOps",
    skill: "Kubernetes Deployment",
    sla: "12H",
    level: "L3",
    country: "United Kingdom",
    rate: "£72/hr",
  },
];

export const memberRoles = [
  { label: "Manager", value: "Manager" },
  { label: "Engineer", value: "Engineer" },
  { label: "Designer", value: "Designer" },
  { label: "Lead", value: "Lead" },
];

export const existingMembers = [
  {
    label: "Alice",
    value: "alice",
  },
  {
    label: "Smith",
    value: "smith",
  },
  {
    label: "Sita",
    value: "sita",
  },
  {
    label: "David",
    value: "david",
  },
  {
    label: "Kiran",
    value: "kiran",
  },
];
