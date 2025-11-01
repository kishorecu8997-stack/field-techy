export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  status?: 'processing' | 'completed' | 'failed';
  date: Date;
}

export interface WalletData {
  currentBalance: number;
  transactions: Transaction[];
}

export interface TransactionInfo {
  id: number;
  title: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  status?: string;
}