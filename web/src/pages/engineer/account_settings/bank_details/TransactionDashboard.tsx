import { transactions } from "@/dummy_data/bankDetails";
import { formatCurrency, formatDate } from '@/shared/libs/utils';
import React from 'react';

// Define TypeScript interfaces
export interface Transaction {
  id: number;
  description: string;
  amount: number; // positive = credit, negative = debit
  date: string; // ISO date string or formatted date
  status?: 'processing' | 'completed' | 'failed'; // optional status
}

interface TransactionDashboardProps {
  onViewAllClick?: () => void;
}

/**
 * Displays a categorized list of financial transactions (Today, Yesterday, Earlier) with amount styling,
 * status badges, and formatted dates. Supports an optional "View All" action and handles empty states.
 */
const TransactionDashboard: React.FC<TransactionDashboardProps> = ({
  onViewAllClick,
}) => {

  // Group transactions by day (Today / Yesterday / Older)
  const groupTransactionsByDay = (txs: Transaction[]) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayTxs: Transaction[] = [];
    const yesterdayTxs: Transaction[] = [];
    const olderTxs: Transaction[] = [];

    txs.forEach((tx) => {
      const txDate = new Date(tx.date);
      if (txDate.toDateString() === today.toDateString()) {
        todayTxs.push(tx);
      } else if (txDate.toDateString() === yesterday.toDateString()) {
        yesterdayTxs.push(tx);
      } else {
        olderTxs.push(tx);
      }
    });

    return { todayTxs, yesterdayTxs, olderTxs };
  };

  const { todayTxs, yesterdayTxs, olderTxs } = groupTransactionsByDay(transactions);



  // Render transaction item
  const renderTransaction = (tx: Transaction) => {
    const isCredit = tx.amount > 0;
    const amountColor = isCredit
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-rose-600 dark:text-rose-400';
    const sign = isCredit ? '+' : '-';

    return (
      <div
        key={tx.id}
        className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700"
      >
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {tx.description}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatDate(tx.date)}
          </div>
          {tx.status === 'processing' && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full font-medium">
              Processing
            </span>
          )}
        </div>
        <div className={`font-semibold ${amountColor}`}>
          {sign}
          {formatCurrency(Math.abs(tx.amount))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
          Recent Transactions
        </h2>
        {onViewAllClick && (
          <button
            onClick={onViewAllClick}
            className="text-teal-600 hover:text-teal-800 font-medium text-sm transition-colors dark:text-teal-400 dark:hover:text-teal-300 cursor-pointer"
            aria-label="View all transactions"
          >
            View All
          </button>
        )}
      </div>

      {todayTxs.length > 0 && (
        <>
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-4 mb-2">
            Today
          </h3>
          {todayTxs.map(renderTransaction)}
        </>
      )}

      {yesterdayTxs.length > 0 && (
        <>
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-4 mb-2">
            Yesterday
          </h3>
          {yesterdayTxs.map(renderTransaction)}
        </>
      )}

      {olderTxs.length > 0 && (
        <>
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-4 mb-2">
            Earlier
          </h3>
          {olderTxs.map(renderTransaction)}
        </>
      )}

      {transactions.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-6">
          No transactions yet.
        </p>
      )}
    </div>
  );
};

export default TransactionDashboard;