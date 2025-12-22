export interface Transaction {
  id: number | string;
  description: string;
  amount: number; // positive = credit, negative = debit
  date: string | Date; // ISO date string or formatted date
  status?: "Pending" | "Approved" | "Completed" | "Failed"; // optional status
}

export interface BankDetails {
  bank: string;
  amount: string;
}
export type bankDetails = BankDetails;
