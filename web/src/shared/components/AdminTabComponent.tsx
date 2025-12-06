import React, { useEffect, useState } from "react";
import type { TabComponentProps } from "./type";

/**
 * A reusable admin tab component that allows switching between different content panels.
 * Supports both controlled (`activeTab` + `onTabChange`) and uncontrolled (`defaultActiveTab`) modes.
 * Also supports conditional hiding of tabs via the `hide` property.
 *
 * @param {TabComponentProps} props - The props for the AdminTabComponent
 * @returns {JSX.Element} Rendered tab component with active content panel
 *
 * @example
 * <AdminTabComponent
 *   tabs={[
 *     { label: "Basic Information", content: <BasicInfo /> },
 *     { label: "Documents", content: <Documents /> },
 *   ]}
 *   activeTab={activeTab}
 *   onTabChange={setActiveTab}
 * />
 */
const AdminTabComponent: React.FC<TabComponentProps> = ({
  tabs,
  activeTab: controlledActiveTab,
  onTabChange,
  defaultActiveTab,
}) => {
  // Determine if component is controlled or uncontrolled
  const isControlled = controlledActiveTab !== undefined;

  // Local state (only used in uncontrolled mode)
  const [uncontrolledActiveTab, setUncontrolledActiveTab] = useState(
    defaultActiveTab || tabs.find((tab) => !tab.hide)?.label || ""
  );

  const visibleTabs = tabs.filter((tab) => !tab.hide);

  // Derive current active tab
  const activeTab = isControlled ? controlledActiveTab : uncontrolledActiveTab;

  // Sync with parent if defaultActiveTab changes
  useEffect(() => {
    if (!isControlled && defaultActiveTab) {
      setUncontrolledActiveTab(defaultActiveTab);
    }
  }, [defaultActiveTab, isControlled]);

  if (visibleTabs.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg text-gray-500">
        No tabs available.
      </div>
    );
  }

  const handleTabClick = (label: string) => {
    if (isControlled) {
      onTabChange?.(label);
    } else {
      setUncontrolledActiveTab(label);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex border-b md:border-b-2 border-gray-200  gap-4 overflow-x-auto">
        {visibleTabs.map((tab) => (
          <div
            key={tab.label}
            onClick={() => handleTabClick(tab.label)}
            className={`px-1 py-2 font-medium transition-colors cursor-pointer relative ${
              activeTab === tab.label
                ? "text-[#2668e8] border-b-2 border-[#2668e8]"
                : "text-gray-700 dark:text-white hover:text-[#2668e8]"
            }`}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <div className="mt-4 w-full flex-1 overflow-y-auto">
        {visibleTabs.find((tab) => tab.label === activeTab)?.content || (
          <div className="p-6 bg-gray-50 rounded-lg text-gray-500">
            No content available for the selected tab.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTabComponent;
