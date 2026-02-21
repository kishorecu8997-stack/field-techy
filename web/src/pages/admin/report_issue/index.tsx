import AdminTabComponent from "@/shared/components/AdminTabComponent";
import AllUsersReport from "./components/AllUsersReport";
import ClientReport from "./components/ClientReport";
import CompletedReport from "./components/CompletedReport";
import EngineerReport from "./components/EngineerReport";
import { useState } from "react";
import { BsFilterRight } from "react-icons/bs";
import AdminFilter, { type FilterDataProps} from "@/shared/components/AdminFilter";

/**
 * AdminReportIssue page for admin. Presents AdminReportIssue in tabbed sections using
 * `AdminTabComponent`. Currently includes the `AllUsersReport`,`ClientReport`,`EngineerReport`,`CompletedReport`, tab where
 * commission values can be configured.
 *
 * @component
 * @returns {JSX.Element} AdminReportIssue page with tabbed AdminReportIssue sections.
 */
export default function AdminReportIssue() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // This prop function receives the filter object from the child
  const handleApplyFilters = (data: FilterDataProps) => {
    console.log("Filters Applied:", data);
  };
  const tabs = [
    {
      label: "All Users",
      content: <AllUsersReport />,
      hide: false,
    },
    {
      label: "Client",
      content: <ClientReport />,
      hide: false,
    },
    {
      label: "Engineer",
      content: <EngineerReport />,
      hide: false,
    },
    {
      label: "Completed",
      content: <CompletedReport />,
      hide: false,
    },
  ];

  return (
    <div className="relative w-full h-full px-4 overflow-hidden">
      {/* Header Section */}
      <div className="flex justify-between items-center mt-2 mb-6">
        <p className="font-semibold text-xl">Reported Issue</p>

        {/* Filter Toggle Icon */}
        <BsFilterRight
          className="text-3xl cursor-pointer"
          onClick={() => setIsFilterOpen(true)}
        />
      </div>

      <div className="flex justify-between bg-white dark:bg-gray-800 rounded-lg p-2">
        <AdminTabComponent tabs={tabs} defaultActiveTab="All Users" />
      </div>

      <AdminFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
      />
    </div>
  );
}
