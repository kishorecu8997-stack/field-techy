import type { MyJobsHeaderProps } from "@/pages/engineer/my_job/types";
import Breadcrumb from "@/shared/components/Breadcrumb";
import SortDropdown from "@/shared/components/SortDropdown";
import React from "react";

/**
 * MyJobsHeader Component
 * Renders the header section for the My Jobs page, displaying title, breadcrumb navigation, description, and a sort dropdown.
 * @param {MyJobsHeaderProps} props - Configuration props including title, sort options, and display flags
 * @returns {JSX.Element} The rendered header element
 */
const MyJobsHeader: React.FC<MyJobsHeaderProps> = ({
  title,
  currentSort,
  onSortChange,
  isShowBreadcrumb = true,
  description,
  isShowSort = true,
}) => {
  return (
    <div className="py-2">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            <div className="mt-1">
              {isShowBreadcrumb && (
                <Breadcrumb
                  customLabels={{
                    "my-jobs": "My Jobs",
                    "in-progress": "In Progress",
                  }}
                />
              )}
              {description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {description}
                </p>
              )}
            </div>
          </div>
          {isShowSort && (
            <div className="flex-shrink-0">
              <SortDropdown
                currentSort={currentSort}
                onSortChange={onSortChange}
              />
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default MyJobsHeader;
