import React from 'react';
import type { TransactionInfo } from '../types';
import { sampleTransactions } from '@/dummy_data/invoiceData';

interface TransactionListProps {
  transactions: TransactionInfo[];
}

const RecentTransactionsList: React.FC<TransactionListProps> = ({ 
  transactions = sampleTransactions
}) => {
  // Group transactions by date (Today/Yesterday/Other)
  const groupTransactionsByDate = (transactions: TransactionInfo[] = []) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);

    const grouped: { [key: string]: TransactionInfo[] } = {
      Today: [],
      Yesterday: [],
      Other: [],
    };

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);      
      transactionDate.setHours(0, 0, 0, 0);

      if (transactionDate.getTime() === today.getTime()) {
        grouped.Today.push(transaction);
      } else if (transactionDate.getTime() === yesterday.getTime()) {
        grouped.Yesterday.push(transaction);
      } else {
        grouped.Other.push(transaction);
      }
    });

    return grouped;
  };

  const groupedTransactions = groupTransactionsByDate(transactions);

  const formatAmount = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return amount >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  const getStatusColor = (status?: string) => {
    if (!status) return '';
    switch (status.toLowerCase()) {
      case 'processing':
        return 'bg-amber-500 text-white';
      case 'completed':
        return 'bg-green-500 text-white';
      case 'failed':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getAmountColor = (type: 'credit' | 'debit') => {
    return type === 'credit'
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
      {Object.entries(groupedTransactions).map(([dateGroup, group]) => {
        if (group.length === 0) return null;

        return (
          <div key={dateGroup} className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              {dateGroup}
            </h3>
            <div className="space-y-4">
              {group.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-start justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {transaction.title}
                      </h4>
                      {transaction.status && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {transaction.status}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(transaction.date).toLocaleDateString()} |{' '}
                      {new Date(transaction.date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className={`font-medium ${getAmountColor(transaction.type)}`}>
                    {formatAmount(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentTransactionsList;