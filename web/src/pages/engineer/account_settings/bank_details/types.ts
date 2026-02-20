export interface Transaction {
  id: number;
  description: string;
  walletId: number;
  amount: string; // positive = credit, negative = debit
  timestamp: string;
  type: "credit" | "debit";
}

export interface BankDetails {
  bank: string;
  amount: string;
}
export type bankDetails = BankDetails;
