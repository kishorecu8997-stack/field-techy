import { create } from "zustand";
import { transactions as initialTransactions } from "@/dummy_data/bankDetails";
import type { Transaction } from "@/pages/engineer/account_settings/bank_details/types";

export interface TransactionStore {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
}
/**
 * Transaction Store
 * This store manages bank transaction data for the Engineer account settings.
 * It provides:
 * - A list of transactions
 * - A method to add a new transaction to the store
 * Used in the Bank Details / Account Settings pages.
 */
export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: initialTransactions,
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),
}));
