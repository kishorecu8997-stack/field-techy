export const ALL_JOBS_STATUS = {
  approve: "Approve",
  reject: "Reject",
} as const;
export type JobsStatus = (typeof ALL_JOBS_STATUS)[keyof typeof ALL_JOBS_STATUS];

export interface ManageJobProps {
  id: number;
  postedBy: {
    name: string;
    email: string;
  };
  jobTitle: string;
  jobDescription: string;
  category: string;
  jobType: string;
  jobPrice: string;
  priority: string;
  country: string;
  state: string;
  city: string;
  startDate: string;
  createdDate: string;
  approvalStatus: string;
}

export const manageJobs: ManageJobProps[] = [
  {
    id: 1,
    postedBy: {
      name: "Nick Wilson",
      email: "kishore@yopmail.com",
    },
    jobTitle: "Field Technician",
    jobDescription:
      "Describe the job responsibilities, expectations, and requirements...",
    category: "Networking",
    jobType: "Full Time",
    jobPrice: "$4500",
    priority: "High",
    createdDate: "1 March, 2025",
    country: "Dubai",
    state: "Khaimah",
    city: "Ajman",
    startDate: "1 March, 2025 9:00 pm",
    approvalStatus: "Job Started",
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
    category: "Networking",
    jobType: "Full Time",
    jobPrice: "$500",
    priority: "Medium",
    createdDate: "1 March, 2025",
    country: "Dubai",
    state: "Khaimah",
    city: "Ajman",
    startDate: "1 March, 2025 9:00 pm",
    approvalStatus: "In progress",
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
    category: "Networking",
    jobType: "Full Time",
    jobPrice: "$3000",
    priority: "Low",
    country: "Dubai",
    state: "Khaimah",
    city: "Ajman",
    startDate: "1 March, 2025 9:00 pm",
    approvalStatus: "Delayed",
    createdDate: "1 March, 2025",
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
    category: "Networking",
    jobType: "Full Time",
    jobPrice: "$600",
    priority: "High",
    country: "Dubai",
    state: "Khaimah",
    city: "Ajman",
    startDate: "1 March, 2025 9:00 pm",
    approvalStatus: "Completed",
    createdDate: "1 March, 2025",
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
    category: "Networking",
    jobType: "Full Time",
    jobPrice: "$4000",
    priority: "Medium",
    country: "Dubai",
    state: "Khaimah",
    city: "Ajman",
    startDate: "1 March, 2025 9:00 pm",
    createdDate: "1 March, 2025",
    approvalStatus: "Job Started",
  },
];

export const AllJobStatus = [
  { value: "approve", label: "Approve" },
  { value: "reject", label: "Reject" },
];

export const AllJobsFilterBy = [
  { value: "category", label: "Category" },
  { value: "location", label: "Location" },
  { value: "budget", label: "Budget" },
  { value: "jobType", label: "Job Type" },
];

export const AllJobsCategory = [
  { value: "retworking", label: "Networking" },
  { value: "resigning", label: "Designing" },
];

export const Region = [
  { value: "region1", label: "Region1" },
  { value: "region2", label: "Region2" },
];

export const AllJobType = [
  { value: "fullTime", label: "Full Time" },
  { value: "onSite", label: "On Site" },
];

//Manage Flagged Jobs
export interface ManageFlaggedJobProps {
  id: number;
  postedBy: {
    name: string;
    email: string;
  };
  jobTitle: string;
  jobDescription: string;
  issueCategory: string;
  issueDescription: string;
  priority: string;
  createdDate: string;
}

export const manageFlaggedJobs: ManageFlaggedJobProps[] = [
  {
    id: 1,
    postedBy: {
      name: "Nick Wilson",
      email: "kishore@yopmail.com",
    },
    jobTitle: "Field Technician",
    jobDescription:
      "Describe the job responsibilities, expectations, and requirements...",
    issueCategory: "Networking",
    issueDescription:
      "	Describe the job responsibilities, expectations, and requirements...",
    priority: "High",
    createdDate: "1 March, 2025",
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
    issueCategory: "Networking",
    issueDescription:
      "	Describe the job responsibilities, expectations, and requirements...",
    priority: "Medium",
    createdDate: "1 March, 2025",
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
    issueCategory: "Networking",
    issueDescription:
      "	Describe the job responsibilities, expectations, and requirements...",
    priority: "Low",
    createdDate: "1 March, 2025",
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
    issueCategory: "Networking",
    issueDescription:
      "	Describe the job responsibilities, expectations, and requirements...",
    priority: "High",
    createdDate: "1 March, 2025",
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
    issueCategory: "Networking",
    issueDescription:
      "	Describe the job responsibilities, expectations, and requirements...",
    priority: "Medium",
    createdDate: "1 March, 2025",
  },
];
