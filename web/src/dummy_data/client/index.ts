import type { ChatMessage, ChatUser } from "@/pages/engineer/chat/types";

export const users: ChatUser[] = [
  { id: 1, name: "Jack Promp", avatar: "/avatars/jack.png" },
  { id: 2, name: "Emily Stone", avatar: "/avatars/emily.png" },
  { id: 3, name: "Robert Cole", avatar: "/avatars/robert.png" },
];

export const messages: ChatMessage[] = [
  {
    id: 1,
    userId: 1,
    fromMe: false,
    message: "Your payment for the job listing has been processed.",
    timestamp: "16:56",
  },
  {
    id: 2,
    userId: 1,
    fromMe: true,
    message: "Oh I'm sorry, may I see the bill receipt?",
    timestamp: "16:58",
  },
  {
    id: 3,
    userId: 1,
    fromMe: true,
    message: "Okay, I'll pay for it now.",
    timestamp: "16:59",
  },

  // Emily chat
  {
    id: 4,
    userId: 2,
    fromMe: false,
    message: "Hi, did you receive my resume?",
    timestamp: "15:10",
  },
  {
    id: 5,
    userId: 2,
    fromMe: true,
    message: "Yes! reviewing now.",
    timestamp: "15:11",
  },

  // Robert chat
  {
    id: 6,
    userId: 3,
    fromMe: false,
    message: "Is the meeting still scheduled?",
    timestamp: "11:00",
  },
];

export const workTypes = [
  { label: "Remote", value: "remote" },
  { label: "On-site", value: "onsite" },
];

export const projectCoutries = [
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
