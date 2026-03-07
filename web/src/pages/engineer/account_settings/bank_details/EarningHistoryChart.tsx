import CustomTooltip from "@/pages/engineer/home/components/CustomTooltip";
import { useEngineerEarnings, useEngineerGetPersonalInfo } from "@/shared/apiServices/engineer/engineerOpenApiService";
import { formatAmount } from "@/utils/currency";
import React, { useMemo, useState } from "react";
import { BiChevronDown, BiChevronUp, BiLineChart } from "react-icons/bi";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
interface ChartData {
  month: string;
  earnings: number;
}
/**
 * EarningHistoryChart Component
 *
 * Renders a line chart showing the user's monthly earnings history using
 * data fetched from the engineer earnings API.
 *
 * The component:
 * - Retrieves earnings history via `useEngineerEarnings`
 * - Transforms API response into chart-friendly data (month, earnings)
 * - Displays the latest month’s earnings summary
 * - Supports an expandable/collapsible chart view
 *
 * Currency formatting is derived from the API response (`currencyCode` and
 * `currencySymbol`) and applied consistently across the chart and labels.
 *
 * @component
 * @returns {JSX.Element} A collapsible earnings history line chart.
 */
const EarningHistoryChart: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data, isLoading, error } = useEngineerEarnings();
  const currencyCode = data?.currencyCode;
  const currencySymbol = data?.currencySymbol || "$";

  const chartData: ChartData[] = useMemo(() => {
    if (!data?.earningsHistory) return [];

    return data.earningsHistory.map((item) => {
      const date = new Date(item.date);
      return {
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        earnings: Number(item.amount),
      };
    });
  }, [data]);

  const latest = chartData.length
    ? chartData[chartData.length - 1]
    : { earnings: 0, month: "No data" };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
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
                {formatAmount(latest.earnings, data?.currencySymbol ?? "")}
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

      {/* Chart Body */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-6 pb-6">
          {isLoading ? (
            <p className="text-center text-gray-500 mt-6">Loading chart...</p>
          ) : error ? (
            <p className="text-center text-rose-500 mt-6">
              Failed to load earnings history
            </p>
          ) : chartData.length === 0 ? (
            <p className="text-center text-gray-500 mt-6">
              No earnings history yet.
            </p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={chartData}
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
                    tickFormatter={(value: number) =>
                      value >= 1000
                        ? `${currencySymbol}${(value / 1000).toFixed(0)}k`
                        : `${currencySymbol}${value}`
                    }
                  />
                  <Tooltip
                    content={
                      <CustomTooltip currencyCode={currencyCode ?? "USD"} />
                    }
                  />
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
                Monthly earnings trend • {chartData.length} months tracked
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EarningHistoryChart;
