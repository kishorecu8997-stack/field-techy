import React, { useState } from "react";
import {
  useEngineerBalance,
  useEngineerTransactions,
} from "@/shared/apiServices/engineer/engineerOpenApiService";
import { Button } from "@/shared/components/commonUI/Buttons";
import { DatePickerInput } from "@/shared/components/commonUI/inputs/DatePickerInput";
import { InputField } from "@/shared/components/commonUI/inputs/InputField";
import { formatCurrency, formatDate } from "@/shared/libs/utils";
import { FormProvider, useForm } from "react-hook-form";
import { HiFilter, HiSearch } from "react-icons/hi";
import Pagination from "../../search_result/components/Pagination";

interface TransactionDashboardProps {
  showAll?: boolean;
  onViewAllClick?: () => void;
}

interface IFormInputs {
  searchTerm: string;
  filterDateFrom: Date | null;
  filterDateTo: Date | null;
}

const TransactionDashboard: React.FC<TransactionDashboardProps> = ({
  showAll = false,
  onViewAllClick,
}) => {
  // --- Engineer balance ---
  const { data: balanceArr } = useEngineerBalance();
  const balance = balanceArr?.[0];
  const currencyCode = balance?.currencyCode ?? "USD";

  // --- Form state ---
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const methods = useForm<IFormInputs>({
    defaultValues: { searchTerm: "", filterDateFrom: null, filterDateTo: null },
  });
  const { watch, reset } = methods;
  const { searchTerm, filterDateFrom, filterDateTo } = watch();

  // --- Pagination state ---
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; // items per page

  // --- Date range for last 3 months ---
  const today = new Date();
  const startDate3MonthsAgo = new Date(today);
  startDate3MonthsAgo.setMonth(today.getMonth() - 3);
  startDate3MonthsAgo.setHours(0, 0, 0, 0);
  const endDateToday = new Date(today);
  endDateToday.setHours(23, 59, 59, 999);

  const startDateStr = startDate3MonthsAgo.toISOString();
  const endDateStr = endDateToday.toISOString();

  const {
    data: transactionsRaw,
    isLoading,
    isError,
  } = useEngineerTransactions(
    { sortOrder: "desc", startDate: startDateStr, endDate: endDateStr },
    true,
  );

  // --- Loading & error states ---
  if (isLoading)
    return (
      <div className="w-full py-8 text-center text-gray-500">
        Loading transactions...
      </div>
    );

  if (isError)
    return (
      <div className="w-full py-8 text-center text-red-500">
        An error occurred while loading transactions. Please try again later.
      </div>
    );

  // const validTransactions = (transactionsRaw || []).filter(
  //   (tx) => !isNaN(new Date(tx.timestamp).getTime()),
  // );

  const transactionsArray = Array.isArray(transactionsRaw)
  ? transactionsRaw
  : [];

const validTransactions = transactionsArray.filter(
  (tx) => !isNaN(new Date(tx.timestamp).getTime()),
);

  const hasActiveFilters = !!(searchTerm || filterDateFrom || filterDateTo);

  const filteredTransactions = validTransactions.filter((tx) => {
    if (
      searchTerm &&
      !tx.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;

    const txDate = new Date(tx.timestamp);
    if (filterDateFrom && txDate < filterDateFrom) return false;
    if (filterDateTo && txDate > filterDateTo) return false;

    return true;
  });

  // --- Client-side pagination ---
  const totalPages = Math.ceil(filteredTransactions.length / limit);
  const pageTransactions = filteredTransactions.slice(
    (currentPage - 1) * limit,
    currentPage * limit,
  );

  const clearFilters = () => {
    reset();
    setCurrentPage(1);
  };

  const title = showAll ? "All Transactions" : "Last 10 Transactions";

  return (
    <FormProvider {...methods}>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Header */}
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

        {/* Filters */}
        {showAll && (
          <div className="mb-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative w-80">
                <InputField
                  name="searchTerm"
                  placeholder="Search by description..."
                  leftIcon={<HiSearch className="text-gray-400 text-lg" />}
                  isShowLabel={false}
                  inputClassName="h-[42px] pl-8 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                />
              </div>

              <div
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`h-[42px] px-4 rounded-lg border flex items-center gap-2 text-sm font-medium transition-colors ${
                  isFilterOpen
                    ? "bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-900/30 dark:border-teal-800 dark:text-teal-300"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <HiFilter className="w-4 h-4" />
                Filters
              </div>

              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
                >
                  Clear
                </Button>
              )}
            </div>

            {isFilterOpen && (
              <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700">
                <DatePickerInput name="filterDateFrom" label="From Date" />
                <DatePickerInput
                  name="filterDateTo"
                  label="To Date"
                  minDate={
                    filterDateFrom ? new Date(filterDateFrom) : undefined
                  }
                />
              </div>
            )}
          </div>
        )}

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {pageTransactions.map((tx) => {
                const txAmount = Number(tx.amount);
                const isCredit = tx.type === "credit";
                const amountColor = isCredit
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400";
                const sign = isCredit ? "+" : "-";

                return (
                  <tr key={tx.id}>
                    <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {tx.description}
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(new Date(tx.timestamp).toISOString())}
                    </td>
                    <td
                      className={`px-8 py-4 whitespace-nowrap text-sm font-semibold ${amountColor}`}
                    >
                      {sign}
                      {formatCurrency(Math.abs(txAmount), currencyCode)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {!isLoading && !isError && pageTransactions.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">
              {hasActiveFilters
                ? "No transactions match your filters."
                : "No transactions found."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {showAll && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </FormProvider>
  );
};

export default TransactionDashboard;
