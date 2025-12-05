import React from "react";
import type { JobTabsProps } from "../types";

/**
 * Renders a horizontal tab navigation bar for job details sections.
 */
const JobTabs: React.FC<JobTabsProps> = ({ activeTab, tabs, onTabChange }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
      {tabs.map((tab) => (
        <div
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 ${
            tab === activeTab
              ? "bg-teal-800 text-white shadow-sm"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          {tab}
        </div>
      ))}
    </div>
  );
};

export default JobTabs;
