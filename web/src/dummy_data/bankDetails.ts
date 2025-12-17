import type { Transaction } from "@/pages/engineer/account_settings/bank_details/types";

export const bankDetails = [
  {
    bankName: "Bank of America",
    accountNumber: "1234567890",
    swiftcode: "1234567890",
    bankAddress: "1234 Main Street, Anytown, USA",
    iban: "1234567890",
    name: "Doe",
  },
  {
    bankName: "Bank of America",
    accountNumber: "9344567890",
    swiftcode: "8934567890",
    bankAddress: "1234 Main Street, Anytown, USA",
    iban: "10976567890",
    name: "John ",
  },
];

export const transactions: Transaction[] = [
  {
    id: 1,
    description: "Installation Of CCTV",
    amount: 15.75,
    date: "2025-10-17T11:54:00",
  },
  {
    id: 2,
    description: "Withdraw",
    amount: -50.0,
    date: "2024-02-26T10:30:00",
    status: "Pending",
  },
  {
    id: 3,
    description: "Maintenance of CCTC",
    amount: 20.65,
    date: "2024-02-26T11:54:00",
  },
  {
    id: 4,
    description: "Mobile App UI/UX Designer",
    amount: 100.0,
    date: "2024-02-26T11:54:00",
  },
  {
    id: 5,
    description: "Install Security System",
    amount: 20.65,
    date: "2024-02-25T11:54:00",
  },
  {
    id: 6,
    description: "Network Cable Setup",
    amount: 75.0,
    date: "2024-02-24T09:00:00",
    status: "Completed",
  },
  {
    id: 7,
    description: "Server Maintenance",
    amount: 150.50,
    date: "2024-02-23T14:00:00",
    status: "Completed",
  },
  {
    id: 8,
    description: "Software Installation",
    amount: 45.0,
    date: "2024-02-22T16:45:00",
    status: "Failed",
  },
  {
    id: 9,
    description: "Cloud Storage Subscription",
    amount: -15.0,
    date: "2024-02-21T11:00:00",
    status: "Completed",
  },
  {
    id: 10,
    description: "Hardware Upgrade",
    amount: 250.0,
    date: "2024-02-20T10:30:00",
    status: "Pending",
  },
  {
    id: "tx-101",
    description: "Freelance Project - Alpha",
    date: new Date("2023-11-15"),
    amount: 1250.00,
    status: "Completed",
  },
  {
    id: "tx-102",
    description: "Equipment Purchase",
    date: new Date("2023-11-12"),
    amount: -450.00,
    status: "Completed",
  },
  {
    id: "tx-103",
    description: "Consulting Fee",
    date: new Date("2023-11-10"),
    amount: 800.00,
    status: "Pending",
  },
  {
    id: "tx-104",
    description: "Software Subscription",
    date: new Date("2023-11-05"),
    amount: -29.99,
    status: "Completed",
  },
  {
    id: "tx-105",
    description: "Emergency Repair",
    date: new Date("2023-11-01"),
    amount: 300.00,
    status: "Completed",
  },
  {
    id: "w-101",
    description: "Withdrawal to Bank of America",
    amount: -200.00,
    date: "2024-02-20T10:00:00",
    status: "Approved",
  },
  {
    id: "w-102",
    description: "Withdrawal to Chase",
    amount: -150.00,
    date: "2024-02-15T14:30:00",
    status: "Completed",
  },
  {
    id: "w-103",
    description: "Withdrawal to Wells Fargo",
    amount: -500.00,
    date: "2024-02-10T09:15:00",
    status: "Failed",
  }
];

// Define your bank list (for name lookup)
export const bankList = [
  { value: "state-bank-of-india", label: "State Bank of India" },
  { value: "hdfc-bank", label: "HDFC Bank" },
  { value: "icici-bank", label: "ICICI Bank" },
  { value: "axis-bank", label: "Axis Bank" },
  { value: "bank-of-america", label: "Bank of America" },
  { value: "citi", label: "Citi" },
  { value: "hsbc", label: "HSBC" },
];

export const bankListData = [
  { value: "SBI", label: "SBI" },
  { value: "ICICI", label: "ICICI" },
];
