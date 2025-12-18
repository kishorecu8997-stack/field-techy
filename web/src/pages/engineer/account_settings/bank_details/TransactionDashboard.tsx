import { formatCurrency, formatDate } from "@/shared/libs/utils";
import { useTransactionStore } from "@/dummy_data/transactionStore";
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { HiFilter, HiSearch } from "react-icons/hi";
import { InputField } from "@/shared/components/commonUI/inputs/InputField";

interface TransactionDashboardProps {
  showAll?: boolean;
  onViewAllClick?: () => void;
}

interface IFormInputs {
  searchTerm: string;
  filterDateFrom: string;
  filterDateTo: string;
}

/**
 * Displays a table of transactions. Can show all or the last 10.
 */
const TransactionDashboard: React.FC<TransactionDashboardProps> = ({
  showAll = false,
  onViewAllClick,
}) => {
  const { transactions } = useTransactionStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const methods = useForm<IFormInputs>({
    defaultValues: {
      searchTerm: "",
      filterDateFrom: "",
      filterDateTo: "",
    },
  });

  const { watch, reset } = methods;
  const { searchTerm, filterDateFrom, filterDateTo } = watch();

  // Filter out transactions with invalid dates and sort by date descending (newest first).
  // This prevents crashes from invalid date objects and ensures the list is always ordered chronologically.
  const validAndSortedTransactions = transactions
    .filter((tx) => !isNaN(new Date(tx.date).getTime()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const hasActiveFilters = !!(searchTerm || filterDateFrom || filterDateTo);

  const filteredTransactions = validAndSortedTransactions.filter((tx) => {
    if (searchTerm && !tx.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    const txDate = new Date(tx.date); // Already validated in the step above
    const txDateStr = txDate.toISOString().split("T")[0];
    if (filterDateFrom && txDateStr < filterDateFrom) return false;
    if (filterDateTo && txDateStr > filterDateTo) return false;

    return true;
  });

  const clearFilters = () => {
    reset();
  };

  // Determine which transactions to display: all filtered, or the 10 most recent ones.
  const transactionsToShow = showAll ? filteredTransactions : validAndSortedTransactions.slice(0, 10);
  const title = showAll ? "All Transactions" : "Last 10 Transactions";

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Approved":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
            {title}
          </h2>
          {!showAll && (
            <div
              onClick={onViewAllClick}
              className="text-teal-600 hover:text-teal-800 font-medium text-sm transition-colors dark:text-teal-400 dark:hover:text-teal-300 cursor-pointer"
              aria-label="View all transactions"
            >
              View All Transactions
            </div>
          )}
        </div>

        {showAll && (
          <div className="mb-6 space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <InputField
                  name="searchTerm"
                  placeholder="Search by description..."
                  leftIcon={<HiSearch className="text-gray-400 text-lg" />}
                  isShowLabel={false}
                  inputClassName="pl-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-teal-500 focus:border-teal-500 p-2.5 text-sm outline-none transition-all"
                />
              </div>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`px-4 py-2 rounded-lg border flex items-center gap-2 text-sm font-medium transition-colors ${
                  isFilterOpen
                    ? "bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-900/30 dark:border-teal-800 dark:text-teal-300"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <HiFilter className="w-5 h-5" />
                Filters
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {isFilterOpen && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700">
                <InputField
                  name="filterDateFrom"
                  label="From Date"
                  type="date"
                  inputClassName="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 text-sm focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
                <InputField
                  name="filterDateTo"
                  label="To Date"
                  type="date"
                  inputClassName="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 text-sm focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>
            )}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-8 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-8 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-8 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-8 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactionsToShow.map((tx) => {
                const isCredit = tx.amount > 0;
                const amountColor = isCredit
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400";
                const sign = isCredit ? "+" : "-";
                const status = tx.status || "Completed";

                return (
                  <tr key={tx.id}>
                    <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {tx.description}
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(new Date(tx.date).toISOString())}
                    </td>
                    <td
                      className={`px-8 py-4 whitespace-nowrap text-sm font-semibold ${amountColor}`}
                    >
                      {sign}
                      {formatCurrency(Math.abs(tx.amount))}
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {transactionsToShow.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">
              {hasActiveFilters ? "No transactions match your filters." : "No transactions found."}
            </p>
          </div>
        )}
      </div>
    </FormProvider>
  );
};

export default TransactionDashboard;
