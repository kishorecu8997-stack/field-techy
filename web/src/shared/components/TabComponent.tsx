import React, { useState } from "react";
import type { TabComponentProps } from "./type";

/**
 * A reusable tab component that allows switching between different content panels.
 * Supports conditional hiding of tabs via the `hide` property.
 *
 * @param {TabComponentProps} props - The props for the TabComponent
 * @returns {JSX.Element} Rendered tab component with active content panel
 *
 * @example
 * <TabComponent
 *   tabs={[
 *     { label: "Logs", content: <LogsContent />, hide: status === 'applied' },
 *     { label: "Job Info", content: <JobInfoSection /> },
 *   ]}
 *   defaultActiveTab="Job Info"
 * />
 */
const TabComponent: React.FC<TabComponentProps> = ({
  tabs,
  defaultActiveTab,
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);
  const visibleTabs = tabs.filter((tab) => !tab.hide);

  if (visibleTabs.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg text-gray-500">
        No tabs available.
      </div>
    );
  }


  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-4">
        {visibleTabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === tab.label
                ? "bg-teal-800 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {visibleTabs.find((tab) => tab.label === activeTab)?.content || (
          <div className="p-6 bg-gray-50 rounded-lg text-gray-500">
            No content available for selected tab.
          </div>
        )}
      </div>
    </div>
  );
};

export default TabComponent;
