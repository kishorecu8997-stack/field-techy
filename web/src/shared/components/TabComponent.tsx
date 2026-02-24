import React, { useEffect, useState } from "react";

interface TabItem {
  label: string;
  content: React.ReactNode;
  hide?: boolean;
  badge?: number | boolean; // badge can be a count number or boolean for simple dot
}

interface TabComponentProps {
  tabs: TabItem[];
  defaultActiveTab?: string;
  isShowTabs?: boolean;
  onTabChange?: (tabLabel: string) => void;
  activeClassName?: string;
  inactiveClassName?: string;
  neutralActiveTabClass?: string;
  neutralInactiveTabClass?: string;
}

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
  isShowTabs = true,
  onTabChange,
  activeClassName = "bg-teal-800 text-white",
  inactiveClassName = "bg-white border border-gray-300 dark:border-gray-600 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700",
  neutralActiveTabClass,
  neutralInactiveTabClass,
}) => {
  const finalActiveClassName = neutralActiveTabClass || activeClassName;
  const finalInactiveClassName = neutralInactiveTabClass || inactiveClassName;
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  const visibleTabs = tabs.filter((tab) => !tab.hide);

  // 🔥 Sync active tab whenever defaultActiveTab prop changes
  useEffect(() => {
    setActiveTab(defaultActiveTab);
  }, [defaultActiveTab]);

  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
    onTabChange?.(tabLabel);
  };

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
        {isShowTabs &&
          visibleTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => handleTabClick(tab.label)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer relative ${
                activeTab === tab.label
                  ? finalActiveClassName
                  : finalInactiveClassName
              }`}
            >
              <span className="flex items-center gap-2">
                {tab.label}
                {tab.badge && (
                  <span className="flex items-center justify-center ml-1 min-w-5 h-5 px-1.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {typeof tab.badge === "number" ? tab.badge : ""}
                  </span>
                )}
              </span>
            </button>
          ))}
      </div>

      <div className="mt-4">
        {visibleTabs.find((tab) => tab.label === activeTab)?.content || null}
      </div>
    </div>
  );
};

export default TabComponent;
