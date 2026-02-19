import React, { useState } from "react";
import { HiFilter } from "react-icons/hi";
import { IoDownload } from "react-icons/io5";
import type { Transaction } from "../types";
import Popup from "@/shared/components/Popup";
import DownloadInvoice from "./DownloadInvoice";
import Filter from "./Filter";
import {
  useClientBalance,
  useClientTransactions,
} from "@/shared/apiServices/client/clientOpenApiService";

const RecentTransactionsList: React.FC = () => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setMonth(today.getMonth() - 3);
  startDate.setHours(0, 0, 0, 0);
  const endDate = today;
  endDate.setHours(23, 59, 59, 999);
  const startDateStr = startDate.toISOString();
  const endDateStr = endDate.toISOString();
  const { data: balance } = useClientBalance();
  const {
    data: transactionsRaw,
    isLoading,
    isError,
  } = useClientTransactions(
    {
      sortOrder: "desc",
      limit: 100,
    },
    true,
  );
  const transactions: Transaction[] = (transactionsRaw ?? []).map((tx) => ({
    id: String(tx.id),
    date: new Date(tx.timestamp),
    amount: Number(tx.amount ?? 0),
    type: tx.type,
    description: tx.description ?? "Transaction",
  }));

  // Group transactions by date (Today/Yesterday/Other)
  const groupTransactionsByDate = (txs: Transaction[]) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);

    const grouped: Record<string, Transaction[]> = {
      Today: [],
      Yesterday: [],
      Other: [],
    };

    txs.forEach((tx) => {
      const txDate = new Date(tx.date);
      txDate.setHours(0, 0, 0, 0);
      if (txDate.getTime() === today.getTime()) grouped.Today.push(tx);
      else if (txDate.getTime() === yesterday.getTime())
        grouped.Yesterday.push(tx);
      else grouped.Other.push(tx);
    });

    return grouped;
  };

  const groupedTransactions = groupTransactionsByDate(transactions);

  const formatAmount = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString("en-US", {
      style: "currency",
      currency: balance?.currencyCode ?? "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    if (isLoading)
      return <div className="text-center py-8">Loading transactions...</div>;
    if (isError)
      return (
        <div className="text-center py-8 text-red-600">
          Failed to load transactions
        </div>
      );
    if (!transactions.length)
      return (
        <div className="text-center py-8 text-gray-500">
          No transactions yet
        </div>
      );

    return amount >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  const getAmountColor = (type: "credit" | "debit") => {
    return type === "credit"
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-red-600 dark:text-red-400";
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
                        {transaction.description}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(transaction.date).toLocaleDateString()} |{" "}
                      {new Date(transaction.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div
                    className={`font-medium ${getAmountColor(transaction.type)}`}
                  >
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

export const ActionButtonsForRecentTransactions = () => {
  const [isInvoicePopupOpen, setIsInvoicePopupOpen] = useState<boolean>(false);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState<boolean>(false);

  return (
    <>
      <div
        onClick={
          isInvoicePopupOpen
            ? () => setIsInvoicePopupOpen(false)
            : () => setIsInvoicePopupOpen(true)
        }
        aria-label="Download"
        className="text-gray-700 hover:text-gray-900"
      >
        <IoDownload className="h-6 w-6 cursor-pointer" />
      </div>
      <div
        onClick={
          isFilterPopupOpen
            ? () => setIsFilterPopupOpen(false)
            : () => setIsFilterPopupOpen(true)
        }
        aria-label="Filter"
        className="text-gray-700 hover:text-gray-900"
      >
        <HiFilter className="h-6 w-6 cursor-pointer" />
      </div>

      <Popup
        open={isInvoicePopupOpen}
        onClose={() => setIsInvoicePopupOpen(false)}
      >
        <DownloadInvoice
          isOpen={isInvoicePopupOpen}
          onClose={() => setIsInvoicePopupOpen(false)}
          onDownload={() => {
            console.log("Downloading invoice...");
            setIsInvoicePopupOpen(false);
          }}
        />
      </Popup>
      <Popup
        open={isFilterPopupOpen}
        onClose={() => setIsFilterPopupOpen(false)}
        inputClassName="sm:max-w-xl sm:rounded-lg sm:shadow-xl w-full max-h-screen flex flex-col bg-white dark:bg-gray-800 inset-0 sm:inset-auto fixed sm:relative h-full sm:h-auto"
      >
        <Filter
          isOpen={isFilterPopupOpen}
          onClose={() => setIsFilterPopupOpen(false)}
          onFilter={() => {
            console.log("Applying filters...");
            setIsFilterPopupOpen(false);
          }}
        />
      </Popup>
    </>
  );
};
