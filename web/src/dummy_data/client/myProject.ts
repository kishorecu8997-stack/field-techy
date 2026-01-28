import type { Project, ProjectSite } from "@/pages/client/my_projects/types";

export const projectData: Project[] = [
  {
    title: "Software Development 2025",
    id: "SOF2025",
    type: "Technology project",
    budget: "₹1,50,000",
    duration: {
      start: "2025-12-12",
      end: "2026-01-07",
    },
    workMode: "On-site & Remote",
    status: "In-Progress",
    onSiteCountries: ["India"],
    remoteCountries: ["USA", "Germany"],
    createdAt: "2024-11-20T10:00:00",
    purchaseOrder: "PO-2024-045",
    jobTypeDetails: {
      type: "Full Time / Part Time",
      hours: "9:00 AM – 6:00 PM",
    },
    description:
      "Develop a full-stack web application with React, Node.js, and MongoDB.",
    remainingbudget: "100,000",
    actualStartDate: "2024-10-05T14:30:00",
    actualEndDate: "2024-10-05T14:30:00",
    distance: 12.5,
  },
  {
    title: "Cloud Migration Project",
    id: "CLOUD2025",
    type: "Infrastructure",
    budget: "₹4,50,000",
    duration: {
      start: "2025-12-15",
      end: "2026-02-15",
    },
    workMode: "On-site & Remote",
    status: "Completed",
    onSiteCountries: ["UAE"],
    remoteCountries: ["Canada", "Australia"],
    createdAt: "2024-10-05T14:30:00",
    purchaseOrder: "PO-2024-088",
    jobTypeDetails: {
      type: "Full Time",
      hours: "10:00 AM – 7:00 PM",
    },
    description:
      "Migrate legacy on-premise systems to AWS with zero downtime strategy.",
    remainingbudget: "1,21,000",
    actualStartDate: "2024-10-05T14:30:00",
    actualEndDate: "2024-10-05T14:30:00",
    distance: 10.5,
  },
  {
    title: "AI Chatbot Integration",
    id: "AI2025",
    type: "Artificial Intelligence",
    budget: "₹3,00,000",
    duration: {
      start: "2026-01-05",
      end: "2026-04-30",
    },
    workMode: "Remote Only",
    status: "Completed",
    onSiteCountries: [],
    remoteCountries: ["India", "Brazil", "UK"],
    createdAt: "2025-01-10T09:15:00",
    purchaseOrder: "PO-2025-012",
    jobTypeDetails: {
      type: "Part Time / Remote",
      hours: "Flexible Hours",
    },
    description:
      "Build and deploy a multilingual AI chatbot for customer support using NLP.",
    remainingbudget: "50,000",
    actualStartDate: "2024-10-05T14:30:00",
    actualEndDate: "2024-10-05T14:30:00",
    distance: 14.5,
  },
  {
    title: "E-commerce Platform Upgrade",
    id: "ECOM2025",
    type: "Web Development",
    budget: "₹3,75,000",
    duration: {
      start: "2025-12-01",
      end: "2026-02-28",
    },
    workMode: "On-site & Remote",
    status: "In-Progress",
    onSiteCountries: ["Singapore"],
    remoteCountries: ["Philippines", "Ireland"],
    createdAt: "2024-12-01T11:45:00",
    purchaseOrder: "PO-2024-122",
    jobTypeDetails: {
      type: "Hybrid",
      hours: "8:00 AM – 5:00 PM",
    },
    description:
      "Upgrade existing e-commerce platform with new payment gateways and PWA support.",
    remainingbudget: "95,000",
    actualStartDate: "2024-10-05T14:30:00",
    actualEndDate: "2024-10-05T14:30:00",
    distance: 9.5,
  },
];

export const projectMembers = [
  {
    id: 1,
    firstName: "Ram",
    lastName: "Risi",
    email: "ramrisi@xyz.in",
    mobile: "9876543210",
    role: "Lead",
  },
  {
    id: 2,
    firstName: "Sita",
    lastName: "Verma",
    email: "sita.verma@abc.co",
    mobile: "9876543211",
    role: "Manager",
  },
];

export const initialSites: ProjectSite[] = [
  {
    id: 1,
    siteId: "SOF123NAMUSA",
    siteName: "Bangalore Tech Park – Block A",
    coordinates: [12.9716, 77.5946],
  },
  {
    id: 2,
    siteId: "SOF456DELIND",
    siteName: "Delhi Innovation Hub – Tower 2",
    coordinates: [28.7041, 77.1025],
  },
  {
    id: 3,
    siteId: "SOF789MUMIND",
    siteName: "Mumbai Business Center – Wing C",
    coordinates: [19.076, 72.8777],
  },
];
