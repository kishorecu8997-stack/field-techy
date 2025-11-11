import type { ServerCategoryProps } from "@/pages/admin/job_category";
import type { NotificationProps } from "@/pages/admin/manage_notification";
import type { PaymentProps } from "@/pages/admin/payment/types";
import type { RateCardProps } from "@/pages/admin/rate_card";

export const serviceCategoriesData: ServerCategoryProps[] = [
  {
    id: "REQ-001",
    categoryImg: "/images/ac-repair.png",
    categoryName: "AC Repair & Maintenance",
    createdDate: "2024-11-01",
    status: true,
  },
  {
    id: "REQ-002",
    categoryImg: "/images/plumbing.png",
    categoryName: "Plumbing Services",
    createdDate: "2024-10-28",
    status: false,
  },
  {
    id: "REQ-003",
    categoryImg: "/images/electrical.png",
    categoryName: "Electrical Wiring & Fixing",
    createdDate: "2024-10-15",
    status: true,
  },
  {
    id: "REQ-004",
    categoryImg: "/images/cleaning.png",
    categoryName: "Home Deep Cleaning",
    createdDate: "2024-09-30",
    status: false,
  },
  {
    id: "REQ-005",
    categoryImg: "/images/painting.png",
    categoryName: "Interior Painting",
    createdDate: "2024-09-25",
    status: true,
  },
];

export const RateCardData: RateCardProps[] = [
  {
    id: "RC-001",
    skillSet: "Electrical Maintenance",
    region: "West",
    location: "Mumbai, India",
    rate: "₹4,800",
    rateType: "Hourly",
    project: "Residential Power Backup Installation",
    createdDate: "2024-11-01",
    status: true,
  },
  {
    id: "RC-002",
    skillSet: "HVAC Technician",
    region: "South",
    location: "Bangalore, India",
    rate: "₹2,500",
    rateType: "Per Project",
    project: "Commercial AC Setup",
    createdDate: "2024-10-22",
    status: true,
  },
  {
    id: "RC-003",
    skillSet: "Plumbing",
    region: "North",
    location: "Delhi, India",
    rate: "₹3,100",
    rateType: "Hourly",
    project: "Corporate Office Maintenance",
    createdDate: "2024-09-15",
    status: false,
  },
  {
    id: "RC-004",
    skillSet: "Solar Panel Installation",
    region: "West",
    location: "Pune, India",
    rate: "₹1,200",
    rateType: "Per Project",
    project: "Industrial Solar Deployment",
    createdDate: "2024-08-12",
    status: true,
  },
  {
    id: "RC-005",
    skillSet: "Painting & Finishing",
    region: "South",
    location: "Chennai, India",
    rate: "₹4,500",
    rateType: "Daily",
    project: "Apartment Interior Painting",
    createdDate: "2024-07-25",
    status: false,
  },
];

export const PaymentData: PaymentProps[] = [
  {
    id: "RC-001",
    clientDetails: {
      name: "Rahul Mehta",
      email: "rahul@example.com",
      phone: "1234567890",
    },
    jobTitle: "Electrical Maintenance",
    jobDescription:
      "Routine inspection and repair of industrial electrical systems.",
    amount: "₹15,000",
    engineerDetails: "Rahul Mehta (ENG-1021)",
    clientStatus: "approved",
    adminStatus: "verified",
  },
  {
    id: "RC-002",
    clientDetails:{
      name: "Green Energy Co.",
      email: "green@example.com",
      phone: "9876543210",
    },
    jobTitle: "Solar Panel Installation",
    jobDescription: "Complete rooftop solar setup for a 5KW system.",
    amount: "₹42,000",
    engineerDetails: "Priya Sharma (ENG-1044)",
    clientStatus: "pending",
    adminStatus: "underReview",
  },
  {
    id: "RC-003",
    clientDetails: {
      name: "BlueLine Apartments",
      email: "blue@example.com",
      phone: "8765432109",
    },
    jobTitle: "Plumbing Overhaul",
    jobDescription:
      "Replacement of old water lines and fixtures across 12 units.",
    amount: "₹28,500",
    engineerDetails: "Vikram Rao (ENG-1009)",
    clientStatus: "inProgress",
    adminStatus: "approved",
  },
  {
    id: "RC-004",
    clientDetails: {
      name: "SmartLiving Interiors",
      email: "smart@example.com",
      phone: "7654321098",
    },
    jobTitle: "Interior Electrical Setup",
    jobDescription: "Full wiring and lighting setup for new luxury apartment.",
    amount: "₹36,000",
    engineerDetails: "Sneha Patel (ENG-1078)",
    clientStatus: "completed",
    adminStatus: "approved",
  },
  {
    id: "RC-005",
    clientDetails:{
      name: "Urban Spaces Ltd.",
      email: "urban@example.com",
      phone: "6543210987",
    },
    jobTitle: "HVAC System Installation",
    jobDescription:
      "Air conditioning and ventilation setup for office floors 3–6.",
    amount: "₹55,000",
    engineerDetails: "Amit Verma (ENG-1035)",
    clientStatus: "cancelled",
    adminStatus: "rejected",
  },
];

export const notificationData: NotificationProps[] = [
  {
    id: "PAY-001",
    title: "Payment Released",
    message:
      "Payment of ₹15,000 has been successfully released to Engineer Rahul Mehta.",
    type: "Credit",
    sendTo: "Rahul Mehta (ENG-1021)",
    createdDate: "2024-11-01",
  },
  {
    id: "PAY-002",
    title: "Invoice Generated",
    message:
      "Invoice INV-5647 for ₹42,000 has been generated for Green Energy Co.",
    type: "Invoice",
    sendTo: "Green Energy Co.",
    createdDate: "2024-10-27",
  },
  {
    id: "PAY-003",
    title: "Refund Processed",
    message: "Refund of ₹12,500 has been processed to client Urban Spaces Ltd.",
    type: "Refund",
    sendTo: "Urban Spaces Ltd.",
    createdDate: "2024-10-15",
  },
  {
    id: "PAY-004",
    title: "Payment Pending",
    message:
      "Awaiting admin approval for ₹28,000 to be credited to Sneha Patel.",
    type: "Pending",
    sendTo: "Sneha Patel (ENG-1078)",
    createdDate: "2024-09-29",
  },
  {
    id: "PAY-005",
    title: "Partial Payment Released",
    message: "50% advance payment of ₹20,000 has been sent to Amit Verma.",
    type: "Credit",
    sendTo: "Amit Verma (ENG-1035)",
    createdDate: "2024-09-10",
  },
];
