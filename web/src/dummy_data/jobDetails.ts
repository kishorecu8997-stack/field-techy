import type {
  LogEntry,
  ProposalTermsProps,
  JobInfoSectionProps,
  WorkSubmissionComponentProps,
} from "@/pages/engineer/my_job/types";
import type { Job } from "@/pages/engineer/search_result/types";

export const logs: LogEntry[] = [
  {
    title: "Check In To Office",
    date: "12-Feb-2024, 07:30 PM",
    status: "check-in",
    showIcon: true,
  },
  {
    title: "Need To Work Tomorrow",
    date: "12-Feb-2024, 07:30 PM",
    status: "in-progress",
  },
  {
    title: "Work Completed",
    date: "13-Feb-2024, 06:15 PM",
    status: "approved",
    showIcon: true,
  },
];

export const workSubmissions: WorkSubmissionComponentProps = {
  name: "Nick Wilson",
  workDates: "28-Mar-2024 to 29-Mar-2024",
  startTime: "28-Mar-2024, 09:00 AM",
  endTime: "29-Mar-2024, 07:00 PM",
  onsiteTask: true,
  location: "3517 W. Gray St, Utica, Pennsylvania 57867",
  fileName: "Workfile.doc",
  notes: "With over 5 years of extensive experience...",
  signatureUrl: "/signature.png",
  isApproved: true,
  paymentStatus: "The payment has been released by client",
  reviewerName: "User Name",
  rating: 4,
  reviewComment: "The vistas from every platform were absolutely stunning...",
};

export const termsData: ProposalTermsProps = {
  jobTitle: "Angular Developer",
  terms: {
    title: "Proposal's Terms & Conditions",
    items: [
      {
        text: "Required 10 engineers",
      },
      {
        text: "Job duration may extend by an additional 2 hours if necessary.",
      },
      {
        text: "Tool required - Router, RJ 45 LAN cable, Switches",
      },
      {
        text: "Skills needed:",
        subItems: [
          "Installation of cables",
          "Error detection",
          "Basic structure cabling",
        ],
      },
      {
        text: "All engineers must follow safety protocols and stick to the scheduled timeline.",
      },
    ],
  },
};

export const job: JobInfoSectionProps = {
  jobTitle: "Angular Developer",
  terms: {
    title: "Proposal's Terms & Conditions",
    items: [
      {
        text: "Produce clean, efficient code; test and deploy program and systems",
      },
      {
        text: "Review feedback and make necessary adjustments by 15-Feb-2024.",
      },
      {
        text: "Implementation phase begins on 16-Feb-2024",
      },
      {
        text: "Conduct user acceptance testing and finalize documentation",
      },
      {
        text: "Launch the project to users on 01-Mar-2024",
      },
    ],
  },
  files: ["File Documents.doc", "File Documents.doc", "Image Document.jpg"],
};

export const otherProposal: ProposalTermsProps = {
  jobTitle: "Angular Developer",
  terms: {
    items: [
      {
        text: "Should Know to Speak in French and English",
      },
      {
        text: "Additionally Should be able to Troubleshoot, install, maintain and repair equipments.",
      },
    ],
  },
};

export const requirements: ProposalTermsProps = {
  jobTitle: "Angular Developer",
  terms: {
    title: "Requirements",
    items: [
      {
        text: "Required 10 engineers",
      },
      {
        text: "Might require additional 2 hours.",
      },
      {
        text: "Tool required - Router, RJ 45 LAN cable, Switches",
      },
    ],
  },
};

export const jobs: Job[] = [
  {
    id: "1",
    title: "Install Security System at Client.",
    client: "SafeHomes Inc.",
    startDate: "May 28, 2025, 10:00 AM",
    duration: "8 Hours of Work",
    location: "San Francisco, CA",
    pay: "400",
    status: "completed",
    type: "on-site",
  },
  {
    id: "2",
    title: "Mobile App UI/UX Designer and Product Designer",
    client: "SafeHomes Inc.",
    startDate: "May 28, 2025, 10:00 AM",
    duration: "8 Hours of Work",
    location: "San Francisco, CA",
    pay: "400",
    status: "applied",
    type: "remote",
  },
  {
    id: "3",
    title: "Mobile App UI/UX Designer and Product Designer",
    client: "SafeHomes Inc.",
    startDate: "May 28, 2025, 10:00 AM",
    duration: "8 Hours of Work",
    location: "San Francisco, CA",
    pay: "400",
    status: "inprogress",
    type: "remote",
  },
  {
    id: "4",
    title: "Install Security System at Client.",
    client: "SafeHomes Inc.",
    startDate: "May 28, 2025, 10:00 AM",
    duration: "8 Hours of Work",
    location: "San Francisco, CA",
    pay: "400",
    status: "completed",
    type: "on-site",
  },
];

export const jobHeaderData = {
  title: "Mobile App UI/UX Designer and Product Designer",
  client: "TechNova Co",
  duration: "8 Hours of Work",
};

export const client = {
  name: "TechNova Co",
  memberSince: "Dec 23, 2018",
  location: "United Kingdom",
  rating: "4.2/5.0",
  reviews: 23,
  verifications: [
    "Identity verified",
    "Payment Verified",
    "Deposit made",
    "Profile completed",
    "Phone verified",
    "Email Verified",
  ],
};

// Updated markers to show the correct location
export const exampleMarkers = {
  id: 1,
  position: [43.0987, -75.2258] as [number, number], // Coordinates for Utica, NY
  title: "Work Location",
  description: "3517 W. Gray St. Utica, Pennsylvania 57867",
  maxZoom: 14,
};

export const userData = {
  name: "Michel Brown",
  phone: "+91 74582405XX",
  role: "Software Engineer",
  profileCompletion: 39,
};

export const earningsData = {
  balance: 8250.56,
};
