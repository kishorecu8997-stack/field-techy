import drillMachineImg from "@/assets/tools/drill-machine.png";
import crimpingToolImg from "@/assets/tools/crimping-tool.png";
import type { JobItem } from "@/pages/engineer/home/types";

export const engineerJobOverview = {
  jobTitle: "Network Engineer",
  jobDescription:
    "We are looking for a skilled Network Engineer to manage, maintain, and optimize our network infrastructure. The role involves troubleshooting network issues, ensuring system security, and supporting smooth business operations.",
  skills: [
    "Cable Routing & Termination",
    "NVR Configuration",
    "IP Camera Installation",
  ],
  tools: [
    { name: "Drill Machine", price: "₹2,000", image: drillMachineImg },
    { name: "Crimping Tool", price: "₹300", image: crimpingToolImg },
  ],
  duration: "25 Feb 2026 - 31 Mar 2026 (5 Weeks)",
  engagementModel: "Weekly",
  experienceLevel: "Level 2",
  numberOfVacancies: 4,
  weeklyPay: "₹2,000 × 5 weeks = ₹10,000",
  toolAllowance: "₹2,300",
  totalPayment: "₹12,300",
  weeklyPayNote: "Weekly pay is paid every week. Tool allowance is paid once.",
  additionalDetails: [
    "Testing Video Feed Must Be Recorded And Shared After Installation",
  ],
  attachments: [{ name: "Camera Layout Plan.pdf", url: "#" }],
};

export const exploreJobsDummy: JobItem = {
  id: "dummy-j1",
  clientId: "dummy-client-1",
  jobTitle: "Network Engineer",
  jobDescription:
    "We are looking for a skilled Network Engineer to manage, maintain, and optimize our network infrastructure. The role involves troubleshooting network issues, ensuring system security, and supporting smooth business operations.",
  category: "IT",
  jobType: "CONTRACT",
  engagementModel: 2,
  countryId: 1,
  stateId: 1,
  cityId: 1,
  location: "Chennai, Tamil Nadu, India",
  startDate: "2026-02-25",
  numberOfVacancy: 4,
  experience: "L3",
  salary: "3000",
  status: "NEW",
  budgetType: "FIXED",
  skills: ["Network Configuration", "Security", "Cisco"],
  tools: null,
  toolImage: null,
  toolAdditionalBudget: null,
  postedTime: "Just now",
  jobDuration: "5 weeks",
  rating: 4,
  slaLevel: "",
  client: {
    id: "dummy-client-1",
    clientType: "COMPANY",
    companyName: "teceze",
    contactPersonName: "",
    email: "",
    phoneNumber: "",
    country: "India",
    state: "Tamil Nadu",
    city: "Chennai",
    postalCode: "600001",
    address: "",
  },
};
