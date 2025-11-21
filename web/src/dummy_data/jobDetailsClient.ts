import type { JobInfoSectionProps, LogEntry, ProposalTermsProps, WorkSubmissionComponentProps } from "@/pages/client/my_job_client/types";


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
};


export const job: JobInfoSectionProps = {
  jobTitle: "Angular Developer",
  terms: {
    title: "Job information",
    items: [
      {
        text: "Created on 10-Nov-2025, 09:00 AM",
      },
      {
        text: "Tentative Start on: 12-Nov-2025",
      },
      {
        text: "Produce clean, efficient code; test and deploy program and systems",
      },
      {
        text: "Review feedback and make necessary adjustments by 15-Nov-2025",
      },
      {
        text: "Conduct user acceptance testing and finalize documentation",
      },
      {
        text:"Launch the project to users on 01-Dec-2025"
      }
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
      {
        text:"Skills required - Installing cables, Error detections, Basic structure cabling"
      },
      {
        text:"Task - Installation of anti-virus, Firewall config, MOM sign"
      },
    ],
  },
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
