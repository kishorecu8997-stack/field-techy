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

export type TransactionType = 'credit' | 'debit';


export interface TransactionInfo {
  id: number;
  title: string;
  date: string;
  amount: number;
  type: TransactionType;
  status?: string;
}

export interface DownloadInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}


export type FilterData = {  
  startDate: Date | null;
  endDate: Date | null;
};