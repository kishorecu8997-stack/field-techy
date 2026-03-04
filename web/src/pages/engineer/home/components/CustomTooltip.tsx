import React from "react";
import { formatCurrency } from "@/shared/libs/utils";

/**
 * CustomTooltip
 *
 * Tooltip component for Recharts that displays the label
 * and formatted earnings value for a data point.
 *
 * @param active - Whether the tooltip is visible
 * @param payload - Array of chart data points
 * @param label - Label for the current data point
 * @returns JSX.Element or null
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  currencyCode: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  currencyCode,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
        </p>
        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
          {formatCurrency(payload[0].value, currencyCode)}
        </p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
