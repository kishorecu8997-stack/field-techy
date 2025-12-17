import { create } from 'zustand';
import { transactions as initialTransactions } from '@/dummy_data/bankDetails';
import type { Transaction } from '@/pages/engineer/account_settings/bank_details/types';

interface TransactionStore {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: initialTransactions,
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),
}));