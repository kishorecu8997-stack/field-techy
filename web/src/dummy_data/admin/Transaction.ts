import type { TransactionProps } from "@/pages/admin/transactions/engineer_payout/types";

export const transactions: TransactionProps[] = [
  {
    transactionId: "TXN-2025-001",
    clientDetails: {
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      phone: "+1-202-555-0173",
    },
    jobTitle: "Website Development",
    jobDescription:
      "Developed a responsive e-commerce website with payment integration.",
    amount: "$2,500",
    engineerDetails: {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1-202-555-0173",
    },
    paymentStatus: "Completed",
  },
  {
    transactionId: "TXN-2025-002",
    clientDetails: {
      name: "Michael Lee",
      email: "michael.lee@example.com",
      phone: "+1-303-555-0145",
    },
    jobTitle: "Mobile App Design",
    jobDescription: "Designed UI/UX for a cross-platform mobile application.",
    amount: "$1,800",
    engineerDetails: {
      name: "Samantha Green",
      email: "samantha.green@example.com",
      phone: "+1-202-555-0173",
    },
    paymentStatus: "Pending",
  },
  {
    transactionId: "TXN-2025-003",
    clientDetails: {
      name: "Sophia Martinez",
      email: "sophia.martinez@example.com",
      phone: "+1-415-555-0199",
    },
    jobTitle: "API Integration",
    jobDescription:
      "Integrated third-party APIs for payment and authentication services.",
    amount: "$1,200",
    engineerDetails: {
      name: "David Brown",
      email: "david.brown@example.com",
      phone: "+1-202-555-0173",
    },
    paymentStatus: "In Progress",
  },
];
