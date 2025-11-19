import type { JobDataProps } from "@/pages/admin/jobs/types";

export const client = {
  name: "Peter Parker",
  email: "peter@gmail.com",
  phone: "+91 98765-43210",
};

export const engineer = {
  name: "Peter Quill",
  email: "peter@gmail.com",
  phone: "+91 98765-43210",
};

export const engineersList = [
  { id: "eng1", name: "Peter Quill" },
  { id: "eng2", name: "Tony Stark" },
  { id: "eng3", name: "Bruce Banner" },
];

export const jobData: JobDataProps[] = [
  {
    id: "#Ride001",
    clientDetails: {
      name: "Peter Parker",
      email: "peter@gmail.com",
      phone: "+91 98765-43210",
    },
    engineerDetails: {
      name: "Peter Quill",
      email: "peter@gmail.com",
      phone: "+91 98765-43210",
    },
    company: "Google",
    title: "Mobile App UI/UX Designer",
    description:
      "Responsible for designing and developing user interfaces for mobile applications.",
    companyLogo: "/logos/google.png",
    category: "IT",
    jobType: "Full-Time",
    locationType: "On Site",
    salary: "$180,000",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    createdDate: "2024-11-01",
    status: "completed",
  },
  {
    id: "#Ride002",
    clientDetails: {
      name: "Peter Parker",
      email: "peter@gmail.com",
      phone: "+91 98765-43210",
    },
    engineerDetails: {
      name: "Peter Quill",
      email: "peter@gmail.com",
      phone: "+91 98765-43210",
    },
    company: "Google",
    title: "Mobile App UI/UX Designer",
    description:
      "Responsible for designing and developing user interfaces for mobile applications.",
    companyLogo: "/logos/google.png",
    category: "IT",
    jobType: "Full-Time",
    locationType: "On Site",
    salary: "$180,000",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    createdDate: "2024-11-01",
    status: "pending",
  },
  {
    id: "#Ride003",
    clientDetails: {
      name: "Peter Parker",
      email: "peter@gmail.com",
      phone: "+91 98765-43210",
    },
    engineerDetails: {
      name: "Peter Quill",
      email: "peter@gmail.com",
      phone: "+91 98765-43210",
    },
    company: "Google",
    title: "Mobile App UI/UX Designer",
    description:
      "Responsible for designing and developing user interfaces for mobile applications.",
    companyLogo: "/logos/google.png",
    category: "IT",
    jobType: "Full-Time",
    locationType: "On Site",
    salary: "$180,000",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    createdDate: "2024-11-01",
    status: "in-progress",
  },
];

export const TrackingData = [
  {
    id: 1,
    date: "2024-11-01",
    checkIn: "09:00 AM",
    checkOut: "06:00 PM",
    Total: "9 hours",
  },
  {
    id: 2,
    date: "2024-11-02",
    checkIn: "09:15 AM",
    checkOut: "06:30 PM",
    Total: "9 hours 15 minutes",
  },
  {
    id: 3,
    date: "2024-11-03",
    checkIn: "08:45 AM",
    checkOut: "05:45 PM",
    Total: "9 hours",
  },
  {
    id: 4,
    date: "2024-11-04",
    checkIn: "09:30 AM",
    checkOut: "07:00 PM",
    Total: "9 hours 30 minutes",
  },
  {
    id: 5,
    date: "2024-11-05",
    checkIn: "08:30 AM",
    checkOut: "05:00 PM",
    Total: "8 hours 30 minutes",
  },
];

export const PaymentData = [
  {
    id: "PAY-001",
    amount: "$250.00",
    clientStatus: "Approved",
    adminStatus: "Approved",
  },
  {
    id: "PAY-002",
    amount: "$1,200.50",
    clientStatus: "Rejected",
    adminStatus: "Rejected",
  },
  {
    id: "PAY-003",
    amount: "$75.25",
    clientStatus: "Rejected",
    adminStatus: "Rejected",
  },
  {
    id: "PAY-004",
    amount: "$500.00",
    clientStatus: "Rejected",
    adminStatus: "Approved",
  },
  {
    id: "PAY-005",
    amount: "$325.75",
    clientStatus: "Rejected",
    adminStatus: "Approved",
  },
];
