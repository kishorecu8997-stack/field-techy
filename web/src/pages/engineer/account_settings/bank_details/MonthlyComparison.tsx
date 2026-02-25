import { formatCurrency } from "@/shared/libs/utils";
import React, { useState } from "react";
import {
  BiTrendingUp,
  BiTrendingDown,
  BiCalendar,
  BiChevronDown,
  BiChevronUp,
} from "react-icons/bi";
import { useEngineerEarnings } from "@/shared/apiServices/engineer/engineerOpenApiService";

/**
 * MonthlyComparison Component
 * Displays a summary and detailed comparison of the user's earnings for the current month versus the previous month.
 * @component
 * @example
 * <MonthlyComparison />
 * @returns {JSX.Element} The rendered MonthlyComparison component.
 * */
const MonthlyComparison: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const now = new Date();
  const { data, isLoading, isError } = useEngineerEarnings();
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden p-6 text-center text-gray-500">
        Loading monthly comparison...
      </div>
    );
  }

  if (isError || !data?.monthlyComparison) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden p-6 text-center text-rose-500">
        Failed to load monthly comparison
      </div>
    );
  }
  const comparison = data?.monthlyComparison;
  const currencyCode = data?.currencyCode;
  const currentMonthAmount = Number(comparison?.currentMonth.amount ?? 0);
  const lastMonthAmount = Number(comparison?.lastMonth.amount ?? 0);
  const percentageChange = Number(comparison?.change.percentage ?? 0);
  const isIncrease = comparison?.change.type === "increase";
  const isSame = percentageChange === 0;
  const thisMonthName = comparison?.currentMonth.name ?? "";
  const lastMonthName = comparison?.lastMonth.name ?? "";
  const changeText = isSame
    ? "Same as last month"
    : isIncrease
      ? `+${Math.abs(percentageChange)}% vs ${lastMonthName}`
      : `-${Math.abs(percentageChange)}% vs ${lastMonthName}`;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Clickable Compact Label */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
            <BiCalendar className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Monthly Comparison
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {formatCurrency(currentMonthAmount, currencyCode ?? "USD")}
              </span>{" "}
              this month ({thisMonthName}) — {changeText}
            </p>
          </div>
        </div>

        <div
          className={`transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          {isExpanded ? (
            <BiChevronUp className="w-6 h-6 text-gray-500" />
          ) : (
            <BiChevronDown className="w-6 h-6 text-gray-500" />
          )}
        </div>
      </div>

      {/* Expandable Full Details */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-8 pt-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Last Month */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Last Month
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {lastMonthName}
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(lastMonthAmount, currencyCode ?? "USD")}
              </p>
            </div>

            {/* Change Indicator */}
            <div className="flex flex-col items-center justify-center space-y-5">
              {isSame ? (
                <>
                  <p className="text-xl font-medium text-gray-600 dark:text-gray-400">
                    No change
                  </p>
                </>
              ) : (
                <>
                  <div
                    className={`w-[4.5rem] h-[4.5rem] rounded-full flex items-center justify-center shadow-xl ${
                      isIncrease
                        ? "bg-emerald-100 dark:bg-emerald-900/40"
                        : "bg-rose-100 dark:bg-rose-900/40"
                    }`}
                  >
                    {isIncrease ? (
                      <BiTrendingUp className="w-14 h-14 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <BiTrendingDown className="w-14 h-14 text-rose-600 dark:text-rose-400" />
                    )}
                  </div>
                  <div>
                    <p
                      className={`text-2xl font-bold ${
                        isIncrease
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {isIncrease ? "+" : ""}
                      {Math.abs(percentageChange).toFixed(0)}%
                    </p>
                    <p className="text-base text-gray-600 dark:text-gray-400 mt-2 font-medium">
                      vs last month
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* This Month */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                This Month
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {thisMonthName}
              </p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(currentMonthAmount, currencyCode ?? "USD")}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-3">
                {now.getDate()} days in
              </p>
              {isIncrease && currentMonthAmount > 0 && (
                <p className="mt-4 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  On track to beat last month!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyComparison;
