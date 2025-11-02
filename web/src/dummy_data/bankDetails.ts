import type { Transaction } from "@/pages/engineer/account_settings/bank_details/TransactionDashboard";

export const bankDetails = [
  {
    bankName: "Bank of America",
    accountNumber: "1234567890",
    swiftcode: "1234567890",
    bankAddress: "1234 Main Street, Anytown, USA",
    iban: "1234567890",
    name: "John Doe",
  },
  {
    bankName: "Bank of America",
    accountNumber: "1234567890",
    swiftcode: "1234567890",
    bankAddress: "1234 Main Street, Anytown, USA",
    iban: "1234567890",
    name: "John Doe",
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
    status: "processing",
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
