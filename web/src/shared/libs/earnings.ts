import type { Transaction } from "@/pages/engineer/account_settings/bank_details/types";

export const getMonthEarnings = (
  transactions: Transaction[],
  month: number,
  year: number,
): number => {
  return transactions
    .filter((tx) => tx.amount > 0)
    .filter((tx) => {
      const date = new Date(tx.date);
      return date.getMonth() === month && date.getFullYear() === year;
    })
    .reduce((sum, tx) => sum + tx.amount, 0);
};
