import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BiLineChart, BiChevronDown, BiChevronUp } from "react-icons/bi";
import { formatCurrency } from "@/shared/libs/utils";
import CustomTooltip from "@/pages/engineer/home/components/CustomTooltip";
import type { MonthlyData } from "@/shared/libs/utils"; // ✅ type-only import

/**
 * EarningHistoryChart Component
 * Displays a line chart of the user's monthly earnings history with an expandable view.
 *
 * @component
 * @example
 * <EarningHistoryChart />
 *  @returns {JSX.Element} The rendered EarningHistoryChart component.
 *
 */
const EarningHistoryChart: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get monthly earnings
  const data: MonthlyData[] = getMonthlyEarnings();

  // Get latest earnings safely
  const latest = data.length
    ? data[data.length - 1]
    : { earnings: 0, month: "No data" };

  if (!data.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No earnings history yet. Start completing jobs!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
            <BiLineChart className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Earnings History
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Latest:{" "}
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {formatCurrency(latest.earnings)}
              </span>{" "}
              in {latest.month}
            </p>
          </div>
        </div>
        <div
          className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""
            }`}
        >
          {isExpanded ? (
            <BiChevronUp className="w-6 h-6 text-gray-500" />
          ) : (
            <BiChevronDown className="w-6 h-6 text-gray-500" />
          )}
        </div>
      </div>

      {/* Chart */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-6 pb-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 13, fill: "#6b7280" }}
                stroke="#9ca3af"
              />
              <YAxis
                tick={{ fontSize: 13, fill: "#6b7280" }}
                stroke="#9ca3af"
                tickFormatter={(value) =>
                  value >= 1000 ? `$${(value / 1000).toFixed(0)}k` : `$${value}`
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#10b981"
                strokeWidth={4}
                dot={{ fill: "#10b981", r: 6, strokeWidth: 2 }}
                activeDot={{ r: 9, stroke: "#059669", strokeWidth: 3 }}
                animationDuration={1800}
              />
            </LineChart>
          </ResponsiveContainer>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-5">
            Monthly earnings trend • {data.length} months tracked
          </p>
        </div>
      </div>
    </div>
  );
};

export default EarningHistoryChart;
