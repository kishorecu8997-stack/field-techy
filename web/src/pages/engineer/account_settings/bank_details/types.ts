type TransactionDate = string | Date;
type TransactionStatus = "Pending" | "Approved" | "Completed" | "Failed";

export const WITHDRAW_STATUS = {
  APPROVED: "approved",
  REJECTED: "rejected",
  PENDING: "pending",
} as const;
export type WithdrawStatus = (typeof WITHDRAW_STATUS)[keyof typeof WITHDRAW_STATUS];

export interface Transaction {
  id: number | string;
  description: string;
  amount: number; // positive = credit, negative = debit
  date: TransactionDate;
  status?: TransactionStatus;
}

export interface BankDetails {
  bank?: string;
  amount?: string;
  bankName?: string;
  bankAddress?: string;
  accountNumber?: string;
  swiftcode?: string;
  iban?: string;
  name?: string;
}

export type bankDetails = BankDetails;


