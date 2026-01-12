import React from "react";

interface Props {
  keyword: string;
  count: number;
  total: number;
  className?: string;
}

/**
 * KeywordRow Component
 *
 * Displays a single keyword with its count and percentage of total searches.
 * Used in the "Most Searched Keywords" section.
 *
 * @param {string} keyword - The keyword string.
 * @param {number} count - Number of times the keyword was searched.
 * @param {number} total - Total number of searches (used to calculate percentage).
 *
 * @example
 * <KeywordRow keyword="React" count={120} total={1000} />
 */
const KeywordRow: React.FC<Props> = ({ keyword, count, total, className }) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div
      className={`flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 ${className}`}
    >
      <span>{keyword}</span>
      <span>
        {count} ({percentage}%)
      </span>
    </div>
  );
};

export default KeywordRow;
