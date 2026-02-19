import { icons } from "@/config/icons";
import type { ManageEngineerProps } from "@/pages/admin/engineer/types";

export const manageEngineer: ManageEngineerProps[] = [
  {
    id: 1,
    userId: 101,
    engineerCode: "ENG-1001",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phoneNumber: "+91 9876543210",
    location: "Mumbai, India",
    registrationDate: "2024-02-15",
    balance: 2500,
    profileStatus: "active",
    userStatus: "active",
    averageRating: 4.7,
    engineerID: "ENG-1001",
    walletBalance: "₹2,500",
    kycStatus: "approved",
    employmentStatus: "Active",
    avgRating: 4.7,
    approvalStatus: "Approved",
    lastActiveOn: "2024-02-15",
    submittedDocuments: ["Government ID", "Resume"],
    documents: "View",
  },
  {
    id: 2,
    userId: 102,
    engineerCode: "ENG-1002",
    name: "Bob Smith",
    email: "bob.smith@example.com",
    phoneNumber: "+1 5551234567",
    location: "New York, USA",
    registrationDate: "2024-01-10",
    balance: 3200,
    profileStatus: "active",
    userStatus: "active",
    averageRating: 4.2,
    engineerID: "ENG-1002",
    walletBalance: "$3,200",
    kycStatus: "pending",
    employmentStatus: "Active",
    avgRating: 4.2,
    approvalStatus: "Pending",
    lastActiveOn: "2024-02-12",
    submittedDocuments: ["Resume"],
    documents: "View",
  },
  {
    id: 3,
    userId: 103,
    engineerCode: "ENG-1003",
    name: "Carol Williams",
    email: "carol.williams@example.com",
    phoneNumber: "+44 7700123456",
    location: "London, UK",
    registrationDate: "2023-12-20",
    balance: 2800,
    profileStatus: "inactive",
    userStatus: "suspended",
    averageRating: 4.5,
    engineerID: "ENG-1003",
    walletBalance: "£2,800",
    kycStatus: "approved",
    employmentStatus: "Inactive",
    avgRating: 4.5,
    approvalStatus: "Approved",
    lastActiveOn: "2024-01-15",
    submittedDocuments: ["Government ID", "Resume", "Certificate"],
    documents: "View",
    suspendReason: "Violation of terms",
    suspendFrom: "01 Jan 2025",
    suspendTo: "31 Jan 2025",
    suspendBy: "Admin1",
    suspendOn: "01 Jan 2025",
    currentStatus: "Inactive",
  },
  {
    id: 4,
    userId: 104,
    engineerCode: "ENG-1004",
    name: "David Lee",
    email: "david.lee@example.com",
    phoneNumber: "+61 412345678",
    location: "Sydney, Australia",
    registrationDate: "2024-02-01",
    balance: 3100,
    profileStatus: "active",
    userStatus: "active",
    averageRating: 4.8,
    engineerID: "ENG-1004",
    walletBalance: "A$3,100",
    kycStatus: "approved",
    employmentStatus: "Active",
    avgRating: 4.8,
    approvalStatus: "Approved",
    lastActiveOn: "2024-02-18",
    submittedDocuments: ["Resume", "Portfolio"],
    documents: "View",
  },
  {
    id: 5,
    userId: 105,
    engineerCode: "ENG-1005",
    name: "Eva Martinez",
    email: "eva.martinez@example.com",
    phoneNumber: "+34 612345678",
    location: "Barcelona, Spain",
    registrationDate: "2024-01-05",
    balance: 2950,
    profileStatus: "active",
    userStatus: "active",
    averageRating: 4.6,
    engineerID: "ENG-1005",
    walletBalance: "€2,950",
    kycStatus: "approved",
    employmentStatus: "Active",
    avgRating: 4.6,
    approvalStatus: "Approved",
    lastActiveOn: "2024-02-10",
    submittedDocuments: ["Government ID"],
    documents: "View",
  },
];

export interface ClientReviewProps {
  id: number;
  name: string;
  phone: string;
  email: string;
  jobTitle: string;
  rating: number;
  review: string;
}

export const clientReviews: ClientReviewProps[] = [
  {
    id: 1,
    name: "Alice Johnson",
    phone: "+971501234567",
    email: "alice.johnson@example.com",
    jobTitle: "Senior Developer",
    rating: 4.8,
    review: "Excellent team player and skilled developer.",
  },
  {
    id: 2,
    name: "Bob Smith",
    phone: "+971502345678",
    email: "bob.smith@example.com",
    jobTitle: "Project Manager",
    rating: 4.5,
    review: "Strong leadership and communication skills.",
  },
  {
    id: 3,
    name: "Charlie Davis",
    phone: "+971503456789",
    email: "charlie.davis@example.com",
    jobTitle: "UX Designer",
    rating: 4.2,
    review: "Creative and detail-oriented designer.",
  },
  {
    id: 4,
    name: "Diana Wilson",
    phone: "+971504567890",
    email: "diana.wilson@example.com",
    jobTitle: "QA Engineer",
    rating: 4.6,
    review: "Thorough tester with a keen eye for bugs.",
  },
  {
    id: 5,
    name: "Edward Lee",
    phone: "+971505678901",
    email: "edward.lee@example.com",
    jobTitle: "DevOps Engineer",
    rating: 4.7,
    review: "Great at automating and managing deployments.",
  },
];

// Define constant objects with `as const`
export const DISPUTE_RAISED_BY = {
  client: "Client",
  engineer: "Engineer",
} as const;

export const DISPUTE_PRIORITY_LEVEL = {
  high: "High",
  medium: "Medium",
  low: "Low",
} as const;

export const DISPUTE_RESOLVED_IN_FAVOUR_OF = {
  client: "Client",
  engineer: "Engineer",
} as const;

// Derive union types
export type DisputeRaisedBy =
  (typeof DISPUTE_RAISED_BY)[keyof typeof DISPUTE_RAISED_BY];
export type DisputePriorityLevel =
  (typeof DISPUTE_PRIORITY_LEVEL)[keyof typeof DISPUTE_PRIORITY_LEVEL];
export type DisputeResolvedInFavourOf =
  (typeof DISPUTE_RESOLVED_IN_FAVOUR_OF)[keyof typeof DISPUTE_RESOLVED_IN_FAVOUR_OF];

// Updated interface
export interface DisputeProps {
  id: number;
  raisedBy: DisputeRaisedBy;
  issueCategory: string;
  priorityLevel: DisputePriorityLevel;
  description: string;
  outcome: string;
  resolvedInFavourOf: DisputeResolvedInFavourOf;
}

// Add this dummy data
export const issues: DisputeProps[] = [
  {
    id: 1,
    raisedBy: "Client",
    issueCategory: "Audio Issue in Session",
    priorityLevel: "High",
    description: "Client reported no audio from engineer side.",
    outcome: "Issue resolved by restarting the server.",
    resolvedInFavourOf: "Client",
  },
  {
    id: 2,
    raisedBy: "Engineer",
    issueCategory: "Platform Load Delay",
    priorityLevel: "Medium",
    description: "Engineer noted a 5s delay in dashboard loading.",
    outcome: "Optimized API response and added caching.",
    resolvedInFavourOf: "Engineer",
  },
  {
    id: 3,
    raisedBy: "Client",
    issueCategory: "Payment Gateway Timeout",
    priorityLevel: "High",
    description: "Client unable to complete payment during peak hours.",
    outcome: "Scaled payment service and added retry logic.",
    resolvedInFavourOf: "Client",
  },
  {
    id: 4,
    raisedBy: "Engineer",
    issueCategory: "Missing Documentation",
    priorityLevel: "Low",
    description: "Engineer could not find API docs for new module.",
    outcome: "Updated documentation portal with new section.",
    resolvedInFavourOf: "Engineer",
  },
  {
    id: 5,
    raisedBy: "Client",
    issueCategory: "Session Disconnect",
    priorityLevel: "High",
    description: "Client session disconnected after 10 minutes of inactivity.",
    outcome: "Extended session timeout to 30 minutes.",
    resolvedInFavourOf: "Client",
  },
];

// Define constant objects with `as const`
export const TRANSACTION_TYPE = {
  withdraw: "Withdraw",
  received: "Received",
} as const;

export const TRANSACTION_STATUS = {
  success: "Success",
  failed: "Failed",
  pending: "Pending",
} as const;

// Derive union types
export type TransactionType =
  (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE];
export type TransactionStatus =
  (typeof TRANSACTION_STATUS)[keyof typeof TRANSACTION_STATUS];

// Updated interface
export interface TransactionProps {
  id: number;
  date: string;
  transactionId: string;
  type: TransactionType;
  amount: string;
  status: TransactionStatus;
}

export const transactions: TransactionProps[] = [
  {
    id: 1,
    date: "10-03-2025 14:20:45",
    transactionId: "TXN100001",
    type: "Withdraw",
    amount: "AED 500",
    status: "Success",
  },
  {
    id: 2,
    date: "12-03-2025 09:15:30",
    transactionId: "TXN100002",
    type: "Received",
    amount: "AED 100",
    status: "Success",
  },
  {
    id: 3,
    date: "13-03-2025 18:05:10",
    transactionId: "TXN100003",
    type: "Received",
    amount: "AED 50",
    status: "Failed",
  },
  {
    id: 4,
    date: "15-03-2025 11:45:00",
    transactionId: "TXN100004",
    type: "Received",
    amount: "AED 250",
    status: "Pending",
  },
  {
    id: 5,
    date: "17-03-2025 16:30:20",
    transactionId: "TXN100005",
    type: "Withdraw",
    amount: "AED 75",
    status: "Success",
  },
];

// @/dummy_data/admin/jobs.ts

export const TOGGLE_STATUS = {
  on: "On",
  off: "Off",
} as const;

export type ToggleStatus = (typeof TOGGLE_STATUS)[keyof typeof TOGGLE_STATUS];
export interface JobProps {
  id: number;
  postedBy: {
    name: string;
    email: string;
  };
  jobTitle: string;
  jobDescription: string;
  jobType: string;
  country: string;
  state: string;
  city: string;
  startDate: string; // "1 March, 2025 9:00 pm"
  createdDate: string; // "1 March, 2025"
  status: ToggleStatus;
}

export const jobs: JobProps[] = [
  {
    id: 1,
    postedBy: {
      name: "Nick Wilson",
      email: "kishore@yopmail.com",
    },
    jobTitle: "Field Technician",
    jobDescription:
      "Describe the job responsibilities, expectations, and requirements...",
    jobType: "Full Time",
    country: "Dubai",
    state: "Khaimah",
    city: "Ajman",
    startDate: "1 March, 2025 9:00 pm",
    createdDate: "1 March, 2025",
    status: "Off",
  },
  {
    id: 2,
    postedBy: {
      name: "Nick Wilson",
      email: "kishore@yopmail.com",
    },
    jobTitle: "Field Technician",
    jobDescription:
      "Describe the job responsibilities, expectations, and requirements...",
    jobType: "Full Time",
    country: "Dubai",
    state: "Khaimah",
    city: "Ajman",
    startDate: "1 March, 2025 9:00 pm",
    createdDate: "1 March, 2025",
    status: "Off",
  },
  {
    id: 3,
    postedBy: {
      name: "Nick Wilson",
      email: "kishore@yopmail.com",
    },
    jobTitle: "Field Technician",
    jobDescription:
      "Describe the job responsibilities, expectations, and requirements...",
    jobType: "Full Time",
    country: "Dubai",
    state: "Khaimah",
    city: "Ajman",
    startDate: "1 March, 2025 9:00 pm",
    createdDate: "1 March, 2025",
    status: "Off",
  },
  {
    id: 4,
    postedBy: {
      name: "Nick Wilson",
      email: "kishore@yopmail.com",
    },
    jobTitle: "Field Technician",
    jobDescription:
      "Describe the job responsibilities, expectations, and requirements...",
    jobType: "Full Time",
    country: "Dubai",
    state: "Khaimah",
    city: "Ajman",
    startDate: "1 March, 2025 9:00 pm",
    createdDate: "1 March, 2025",
    status: "Off",
  },
  {
    id: 5,
    postedBy: {
      name: "Nick Wilson",
      email: "kishore@yopmail.com",
    },
    jobTitle: "Field Technician",
    jobDescription:
      "Describe the job responsibilities, expectations, and requirements...",
    jobType: "Full Time",
    country: "Dubai",
    state: "Khaimah",
    city: "Ajman",
    startDate: "1 March, 2025 9:00 pm",
    createdDate: "1 March, 2025",
    status: "Off",
  },
];

export const days = [
  { id: 1, value: "daily", label: "Daily" },
  { id: 2, value: "weekly", label: "Weekly" },
  { id: 3, value: "monthly", label: "Monthly" },
  { id: 4, value: "yearly", label: "Yearly" },
];

export const chartData = [
  { name: "January", users: 28, jobs: 28 },
  { name: "February", users: 48, jobs: 48 },
  { name: "March", users: 40, jobs: 40 },
  { name: "April", users: 18, jobs: 18 },
  { name: "May", users: 85, jobs: 85 },
  { name: "June", users: 27, jobs: 27 },
  { name: "July", users: 90, jobs: 90 },
];

export const EngineerStatus = [
  { value: "pending", label: "Pending" },
  { value: "approve", label: "Approve" },
  { value: "reject", label: "Reject" },
];

export const Employement = [
  { value: "employed", label: "Employed" },
  { value: "unemployed", label: "Unemployed" },
];

export const JobStatus = [
  {
    value: "approved",
    label: "Approve",
    bg: "bg-green-100 text-green-700",
    icon: icons.check,
  },
  {
    value: "pending",
    label: "Pending",
    bg: "bg-yellow-100 text-yellow-700",
    icon: icons.pending,
  },
  {
    value: "rejected",
    label: "Reject",
    bg: "bg-red-100 text-red-700",
    icon: icons.close,
  },
];
