import React from "react";

/**
 * AnalyticsCard Component
 * 
 * Displays a summary card with a title and a value.
 * Used for showing metrics such as total searches, CTR, or unique keywords.
 *
 * @param {string} title - The title of the metric.
 * @param {string} value - The value of the metric.
 * 
 * @example
 * <AnalyticsCard title="Total Searches" value="1200" />
 */

interface Props {
  title: string;
  value: string;
  className?: string;
}

const AnalyticsCard: React.FC<Props> = ({ title, value, className }) => (
  <div className={`flex-1 min-w-[200px] p-5 bg-white dark:bg-gray-800 shadow rounded-lg text-center ${className}`}>
    <p className="text-gray-500 dark:text-gray-300 mb-2">{title}</p>
    <h3 className="text-2xl font-semibold">{value}</h3>
  </div>
);

export default AnalyticsCard;
