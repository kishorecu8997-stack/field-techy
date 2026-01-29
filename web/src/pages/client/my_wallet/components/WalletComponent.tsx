import type { WalletData, Transaction } from "../types";
import { sampleWalletData } from "@/dummy_data/sampleWalletData";
import { useThemeHook } from "@/shared/hooks/useThemeHook";
import React, { useState } from "react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

interface WalletComponentProps {
  data?: WalletData;
  onMenuItemClick: (key: string) => void;
}

const WALLET_COMPONENTS = {
  ADD_FUND: "clientAddFund",
  RECENT_TRANSACTIONS: "recentTransactions",
};

const WalletComponent: React.FC<WalletComponentProps> = ({
  data = sampleWalletData,
  onMenuItemClick,
}) => {
  const isDarkMode = useThemeHook();
  const [showBalance, setShowBalance] = useState<boolean>(false);
  // Format date to display as "27 Feb, 2024 | 11:54 AM"
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  // Group transactions by date
  const groupTransactionsByDate = (transactions: Transaction[]) => {
    const grouped: { [key: string]: Transaction[] } = {};

    transactions.forEach((transaction) => {
      const dateKey = transaction.date.toISOString().split("T")[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(transaction);
    });

    return grouped;
  };

  // Get human readable date label (Today, Yesterday, or actual date)
  const getDateLabel = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Normalize dates to compare only day/month/year
    const normalizeDate = (d: Date) => {
      const normalized = new Date(d);
      normalized.setHours(0, 0, 0, 0);
      return normalized;
    };

    const dateOnly = normalizeDate(date);
    const todayOnly = normalizeDate(today);
    const yesterdayOnly = normalizeDate(yesterday);

    if (dateOnly.getTime() === todayOnly.getTime()) {
      return "TODAY";
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
      return "YESTERDAY";
    } else {
      return date
        .toLocaleDateString("en-US", {
          // weekday: 'long',
          year: "numeric",
          month: "short",
          day: "numeric",
        })
        .toUpperCase();
    }
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const groupedTransactions = groupTransactionsByDate(data.transactions);

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <div
      className={`w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-lg ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* Balance Section */}
      <div className={`p-4 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        <div className="">
          <p
            className={`text-sm mb-1 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Current Balance
          </p>
          <div className="flex justify-between items-center">
            <p className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
              {showBalance ? formatCurrency(data.currentBalance) : "******"}
            </p>
            {!showBalance ? (
              <BsEyeSlashFill
                className="cursor-pointer text-lg"
                onClick={() => setShowBalance(true)}
                role="button"
                aria-label="Show balance"
                tabIndex={0}
                onKeyDown={(event: React.KeyboardEvent<SVGElement>) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setShowBalance((prev) => !prev);
                  }
                }}
              />
            ) : (
              <BsEyeFill
                className="cursor-pointer text-lg"
                onClick={() => setShowBalance(false)}
                role="button"
                aria-label="Show balance"
                tabIndex={0}
                onKeyDown={(event: React.KeyboardEvent<SVGElement>) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setShowBalance((prev) => !prev);
                  }
                }}
              />
            )}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => onMenuItemClick(WALLET_COMPONENTS.ADD_FUND)}
              className={`mt-4 px-6 py-2 rounded-full font-medium transition-colors cursor-pointer ${
                isDarkMode
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-emerald-700 hover:bg-emerald-800 text-white"
              }`}
            >
              Add Fund
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <button
            onClick={() =>
              onMenuItemClick(WALLET_COMPONENTS.RECENT_TRANSACTIONS)
            }
            className={`cursor-pointer text-sm ${
              isDarkMode
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-700"
            }`}
          >
            View All
          </button>
        </div>

        {/* Transaction List */}
        {sortedDates.map((dateKey) => {
          const transactionsForDate = groupedTransactions[dateKey];
          const date = new Date(dateKey);

          return (
            <div key={dateKey} className="mb-6">
              {/* Date Header */}
              <div className="flex gap-1 items-center ">
                <div>{getDateLabel(date)}</div>
                <div className="border-b w-full border-gray-200" />
              </div>

              {/* Transactions for this date */}
              {transactionsForDate.map((transaction) => (
                <div
                  key={transaction.id}
                  className={`flex justify-between items-start py-3 `}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">
                        {transaction.description}
                      </div>
                      {transaction.status && (
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            transaction.status === "processing"
                              ? isDarkMode
                                ? "bg-yellow-600 text-white"
                                : "bg-yellow-100 text-yellow-800"
                              : transaction.status === "completed"
                                ? isDarkMode
                                  ? "bg-green-600 text-white"
                                  : "bg-green-100 text-green-800"
                                : isDarkMode
                                  ? "bg-red-600 text-white"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.status.charAt(0).toUpperCase() +
                            transaction.status.slice(1)}
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {formatDate(transaction.date)}
                    </div>
                  </div>
                  <div
                    className={`font-medium ${
                      transaction.type === "credit"
                        ? isDarkMode
                          ? "text-green-400"
                          : "text-green-600"
                        : isDarkMode
                          ? "text-red-400"
                          : "text-red-600"
                    }`}
                  >
                    {transaction.type === "credit" ? "+" : "-"}
                    {formatCurrency(Math.abs(transaction.amount)).replace(
                      "$",
                      "",
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WalletComponent;
