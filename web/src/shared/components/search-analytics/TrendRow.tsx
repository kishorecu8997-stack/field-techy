import React from "react";

/**
 * TrendRow Component
 * 
 * Displays a single search trend row with date and count of searches.
 * Used in the "Search Trends" section.
 *
 * @param {string} date - The date of the searches.
 * @param {number} count - Number of searches on that date.
 * 
 * @example
 * <TrendRow date="2025-12-29" count={50} />
 */

interface Props {
  date: string;
  count: number;
  className?: string;
}

const TrendRow: React.FC<Props> = ({ date, count, className }) => (
  <div className={`flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 ${className}`}>
    <span>{date}</span>
    <span>{count} searches</span>
  </div>
);

export default TrendRow;
