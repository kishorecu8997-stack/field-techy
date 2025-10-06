import React from 'react';

interface JobFilterTabsProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

/**
 * JobFilterTabs Component
 * Renders a set of filter tabs for job status categories.
 *
 * @param {Object} props - Component props
 * @param {string[]} props.tabs - Array of tab labels
 * @param {string} props.activeTab - Currently active tab label
 * @param {(tab: string) => void} props.onTabChange - Callback when tab is clicked
 * @returns {JSX.Element} Rendered tab group
 */
const JobFilterTabs: React.FC<JobFilterTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-2 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab
              ? 'bg-emerald-700 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default JobFilterTabs;