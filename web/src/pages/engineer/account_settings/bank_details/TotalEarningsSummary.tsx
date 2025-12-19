import { transactions } from "@/dummy_data/bankDetails";
import { formatCurrency } from "@/shared/libs/utils";
import React from "react";
import { BiTrendingUp } from "react-icons/bi";

const TotalEarningsSummary: React.FC = () => {
  // Calculate total earnings (only positive/credit amounts)
  const totalEarnings = transactions
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);
  // Calculate this month's earnings
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const thisMonthEarnings = transactions
    .filter((tx) => {
      if (tx.amount <= 0) return false;
      const txDate = new Date(tx.date);
      return (
        txDate.getMonth() === currentMonth &&
        txDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, tx) => sum + tx.amount, 0);
  // Calculate total completed withdrawals (negative amounts with "completed" status or no failed status)
  const totalWithdrawn = transactions
    .filter((tx) => tx.amount < 0 && tx.status !== "failed")
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  // Available balance = total earnings - withdrawals
  const availableBalance = totalEarnings - totalWithdrawn;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Total Earnings Summary</h2>
        <p className="text-teal-100 text-sm mt-1">
          As of{" "}
          {now.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Main Balance */}
      <div className="px-6 py-8 text-center border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide font-medium">
          Available Balance
        </p>
        <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
          {formatCurrency(availableBalance)}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
        {/* Total Earnings All Time */}
        <div className="px-6 py-5 text-center">
          <div className="flex justify-center items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-2">
            <span className="text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
              Total Earnings
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(totalEarnings)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            All time
          </p>
        </div>

        {/* This Month */}
        <div className="px-6 py-5 text-center">
          <div className="flex justify-center items-center gap-3 text-teal-600 dark:text-teal-400 mb-2">
            <span className="text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
              This Month
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(thisMonthEarnings)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {now.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Withdrawn */}
        <div className="px-6 py-5 text-center">
          <div className="flex justify-center items-center gap-3 text-rose-600 dark:text-rose-400 mb-2">
            <BiTrendingUp className="w-6 h-6 rotate-180" />
            <span className="text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
              Withdrawn
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(totalWithdrawn)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Completed withdrawals
          </p>
        </div>
      </div>
    </div>
  );
};

export default TotalEarningsSummary;
