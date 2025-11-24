import type { MyJobsHeaderProps } from "@/pages/engineer/my_job/types";
import ReportPage from "@/pages/engineer/report";
import Breadcrumb from "@/shared/components/Breadcrumb";
import SortDropdown from "@/shared/components/SortDropdown";
import React from "react";
import { Button } from "./commonUI/Buttons";

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
  isReport = true,
  action,
  isShowButton = false,
  buttonText = "Invite To Job",
  onClick,
}) => {
  const [isShowReport, setIsShowReport] = React.useState(false);

  return (
    <div className="py-2">
      <header className="sticky top-[80px] z-10 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-4 md:px-6">
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
                    home: "Home",
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
          <>
            <div className="flex flex-row flex-shrink-0 justify-center items-center gap-4">
              {action && action}
              {isReport && (
                <div
                  className="underline cursor-pointer hover:text-teal-900"
                  onClick={() => setIsShowReport(true)}
                >
                  Report
                </div>
              )}
              {isShowSort && (
                <SortDropdown
                  currentSort={currentSort}
                  onSortChange={onSortChange}
                />
              )}
              {isShowButton && (
                <Button
                  onClick={onClick}
                  variant="primary"
                  type="submit"
                  className="bg-teal-800 dark:bg-teal text-white"
                >
                  {buttonText}
                </Button>
              )}
            </div>
          </>
        </div>
      </header>
      <ReportPage open={isShowReport} onClose={() => setIsShowReport(false)} />
    </div>
  );
};

export default MyJobsHeader;
