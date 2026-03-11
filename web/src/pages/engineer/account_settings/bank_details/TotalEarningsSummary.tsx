import { useEngineerEarnings } from "@/shared/apiServices/engineer/engineerOpenApiService";
import { formatAmount } from "@/utils/currency";
import React, { useState } from "react";
import { BiTrendingUp } from "react-icons/bi";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
/**
 * TotalEarningsSummary
 *
 * Displays a summarized overview of a user's financial activity, including:
 * - Available balance
 * - Total earnings (all time)
 * - Earnings for the current month
 * - Total completed withdrawals
 *
 * All values are derived from the `transactions` data source.
 */
const TotalEarningsSummary: React.FC = () => {
  const [showBalance, setShowBalance] = useState<boolean>(false);
  const { data, isLoading, isError } = useEngineerEarnings();
  const totalEarnings = data ? Number(data.totalEarnings) : 0;
  const now = new Date();
  // Loading or error message
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden p-6 text-center text-gray-500">
        Loading earnings summary...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden p-6 text-center text-rose-500">
        Failed to load earnings summary
      </div>
    );
  }
  const thisMonthEarnings = data ? Number(data.monthlyEarnings) : 0;
  const totalWithdrawn = data ? Number(data.withdrawn) : 0;
  console.log("Earnings data:", data?.withdrawn);
  const availableBalance = totalEarnings - totalWithdrawn;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r flex justify-between items-center from-teal-600 to-emerald-600 px-6 py-4">
        <div>
          <h2 className="text-xl font-bold text-white">
            Total Earnings Summary
          </h2>
          <p className="text-teal-100 text-sm mt-1">
            As of{" "}
            {now.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div>
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
              aria-label="Hide balance"
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
      </div>

      {/* Main Balance */}
      <div className="px-6 py-8 text-center border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide font-medium">
          Available Balance
        </p>
        <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
          {showBalance
            ? formatAmount(availableBalance, data?.currencySymbol ?? "")
            : "******"}
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
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {showBalance
              ? formatAmount(totalEarnings, data?.currencySymbol ?? "")
              : "******"}
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
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {showBalance
              ? formatAmount(thisMonthEarnings, data?.currencySymbol ?? "")
              : "******"}
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
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {showBalance
              ? formatAmount(totalWithdrawn, data?.currencySymbol ?? "")
              : "******"}
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
