import React from "react";
import type { Filters } from "../types";

interface SearchHistoryItem {
  id: string;
  filters: Filters;
  timestamp: Date;
}

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onApplyHistory: (filters: Filters) => void;
  onClearHistory: () => void;
}

/**
 * SearchHistory component displays the last 10 searches and allows reapplying them
 *
 * @param {SearchHistoryProps} props - Component props
 * @returns {JSX.Element} Rendered search history component
 */
const SearchHistory: React.FC<SearchHistoryProps> = ({
  history,
  onApplyHistory,
  onClearHistory,
}) => {
  if (history.length === 0) {
    return null;
  }

  const formatFilters = (filters: Filters): string => {
    const parts: string[] = [];
    if (filters.location.length > 0)
      parts.push(`Location: ${filters.location.join(", ")}`);
    if (filters.skills.length > 0)
      parts.push(`Skills: ${filters.skills.join(", ")}`);
    if (filters.serviceType.length > 0)
      parts.push(`Service: ${filters.serviceType.join(", ")}`);
    if (filters.experienceLevel.length > 0)
      parts.push(`Experience: ${filters.experienceLevel.join(", ")}`);
    if (filters.jobType.length > 0)
      parts.push(`Job Type: ${filters.jobType.join(", ")}`);
    if (filters.locationType.length > 0)
      parts.push(`Location Type: ${filters.locationType.join(", ")}`);
    if (filters.primaryLanguage)
      parts.push(`Language: ${filters.primaryLanguage}`);
    if (filters.slaLevel) parts.push(`SLA: ${filters.slaLevel}`);
    if (filters.locationRadius > 0)
      parts.push(`Radius: ${filters.locationRadius}km`);
    if (filters.budgetRange.min > 0 || filters.budgetRange.max < 10000)
      parts.push(
        `Budget: $${filters.budgetRange.min}-$${filters.budgetRange.max}`,
      );
    if (filters.tools.length > 0)
      parts.push(`Tools: ${filters.tools.join(", ")}`);

    return parts.length > 0 ? parts.join(" | ") : "No filters applied";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Recent Searches
        </h3>
        <button
          onClick={onClearHistory}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Clear History
        </button>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {history.map((item) => (
          <div
            key={item.id}
            className="p-3 bg-gray-50 dark:bg-gray-700 rounded border cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            onClick={() => onApplyHistory(item.filters)}
          >
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">
              {formatFilters(item.filters)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {item.timestamp.toLocaleString("en-US", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
