import {
  useClientBalance,
  useClientTransactions,
} from "@/shared/apiServices/client/clientOpenApiService";
import { useThemeHook } from "@/shared/hooks/useThemeHook";
import React, { useState } from "react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import type { Transaction } from "../types";
import AddFundComponent from "./AddFundComponent";

interface WalletComponentProps {
  onMenuItemClick: (key: string) => void;
}

const WALLET_COMPONENTS = {
  RECENT_TRANSACTIONS: "recentTransactions",
};

const WalletComponent: React.FC<WalletComponentProps> = ({
  onMenuItemClick,
}) => {
  const isDarkMode = useThemeHook();
  const [showBalance, setShowBalance] = useState<boolean>(false);
  const { data: balanceArr } = useClientBalance();
  const balance = balanceArr?.[0];
  const {
    data: transactionsRaw,
    isLoading: txLoading,
    isError: txError,
  } = useClientTransactions({ limit: 5, sortOrder: "desc" }, true);

  const transactions: Transaction[] = (transactionsRaw?.transactions ?? []).map(
    (tx) => {
      const amountNum = Number(tx.amount);
      const safeAmount = Number.isNaN(amountNum) ? 0 : amountNum;
      const txDate = new Date(tx.timestamp);
      const safeDate = isNaN(txDate.getTime()) ? new Date() : txDate;
      return {
        id: String(tx.id),
        date: safeDate,
        amount: safeAmount,
        type: tx.type,
        description: tx.description?.trim() ?? "Transaction",
      };
    },
  );

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
  const groupTransactionsByDate = (txs: Transaction[]) => {
    const grouped: Record<string, Transaction[]> = {};

    txs.forEach((tx) => {
      const year = tx.date.getFullYear();
      const month = String(tx.date.getMonth() + 1).padStart(2, "0");
      const day = String(tx.date.getDate()).padStart(2, "0");
      const key = `${year}-${month}-${day}T00:00:00`;
      grouped[key] = grouped[key] || [];
      grouped[key].push(tx);
    });

    return grouped;
  };

  // Get human readable date label (Today, Yesterday, or actual date)
  const getDateLabel = (date: Date): string => {
    const now = new Date();

    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    );
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    const txStart = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
      0,
    );

    if (txStart.getTime() === todayStart.getTime()) {
      return "TODAY";
    }
    if (txStart.getTime() === yesterdayStart.getTime()) {
      return "YESTERDAY";
    }

    return date
      .toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      .toUpperCase()
      .replace(/,/g, "");
  };

  // Format currency
  const formatCurrency = (amount: number, currencyCode: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const groupedTransactions = groupTransactionsByDate(transactions);

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <div
      className={`w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-lg ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        }`}
    >
      {/* Balance Section */}
      <div className={`p-4 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        <div className="">
          <p
            className={`text-sm mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
          >
            Current Balance
          </p>
          <div className="flex justify-between items-center">
            <p className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
              {showBalance
                ? balance?.balance != null
                  ? formatCurrency(
                    Number(balance.balance),
                    balance.currencyCode,
                  )
                  : "--"
                : "******"}
            </p>
            {!showBalance ? (
              <BsEyeFill
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
              <BsEyeSlashFill
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
          <AddFundComponent />
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
            className="text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            View all
          </button>
        </div>

        {/* Transaction List */}
        {txLoading ? (
          <div className="py-8 text-center text-gray-500">
            Loading transactions...
          </div>
        ) : txError ? (
          <div className="py-8 text-center text-red-600">
            Could not load transactions
          </div>
        ) : sortedDates.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No transactions yet
          </div>
        ) : (
          sortedDates.map((dateKey) => {
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
                      </div>
                      <div
                        className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                      >
                        {formatDate(transaction.date)}
                      </div>
                    </div>
                    <div
                      className={`font-medium ${transaction.type === "credit"
                        ? isDarkMode
                          ? "text-green-400"
                          : "text-green-600"
                        : isDarkMode
                          ? "text-red-400"
                          : "text-red-600"
                        }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}
                      {formatCurrency(
                        Math.abs(transaction.amount),
                        balance?.currencyCode,
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default WalletComponent;
