import type { MyJobsHeaderProps } from "@/pages/engineer/my_job/types";
import ReportPage from "@/pages/engineer/report";
import Breadcrumb from "@/shared/components/Breadcrumb";
import SortDropdown from "@/shared/components/SortDropdown";
import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "./commonUI/Buttons";
import { IoChevronBack } from "react-icons/io5";

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
  buttonText,
  onClick,
  customLabels: propCustomLabels,
  segments,
  isChatVisible,
  handleCloseChat,
}) => {
  const [isShowReport, setIsShowReport] = React.useState(false);
  const location = useLocation();

  const isAuthRoute = location.pathname.includes("/auth/");

  if (isAuthRoute) {
    return (
      <div className="w-full sticky top-0 z-10 bg-gray-100 dark:bg-gray-900 mb-2">
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-3 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                {isChatVisible && handleCloseChat && (
                  <button
                    onClick={handleCloseChat}
                    className="text-black dark:text-white font-bold"
                    aria-label="Go back to job details"
                  >
                    <IoChevronBack size={20} />
                  </button>
                )}
                {title}
              </h1>
              {description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
        </header>
      </div>
    );
  }

  // Full header for protected routes (after login)
  return (
    <div className="w-full sticky top-[60px] z-10 bg-gray-100 dark:bg-gray-900 mb-2">
      <div className="">
        <header className="sticky top-[80px] z-10 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {isChatVisible && handleCloseChat && (
                  <button
                    onClick={handleCloseChat}
                    className="text-black dark:text-white font-bold"
                    aria-label="Go back to job details"
                  >
                    <IoChevronBack size={20} />
                  </button>
                )}
                {title}
              </h1>
              <div className="mt-1">
                {isShowBreadcrumb && (
                  <Breadcrumb
                    customLabels={{
                      "my-jobs": "My Jobs",
                      "in-progress": "In Progress",
                      "application-history": "Application History",
                      home: "Home",
                      ...propCustomLabels,
                    }}
                    segments={segments}
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
              <div className="flex flex-row flex-shrink-0 justify-end items-center gap-4">
                {action}
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
        <ReportPage
          open={isShowReport}
          onClose={() => setIsShowReport(false)}
        />
      </div>
    </div>
  );
};

export default MyJobsHeader;
