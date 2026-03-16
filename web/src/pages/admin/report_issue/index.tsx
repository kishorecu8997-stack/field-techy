import AdminFilter from "@/shared/components/AdminFilter";
import AdminTabComponent from "@/shared/components/AdminTabComponent";
import { useAdminReports } from "@/shared/hooks/useAdminReports";
import { useState } from "react";
import { BsFilterRight } from "react-icons/bs";
import ReportTable from "./components/ReportTable";

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
  const {
    allData,
    clientData,
    engineerData,
    completedData,
    allLoading,
    clientLoading,
    engineerLoading,
    completedLoading,
    refetchAll,
    refetchClient,
    refetchEngineer,
    refetchCompleted,
    filterParams,
    handleApplyFilters,
    pagination: {
      pageSize,
      setPageSize,
      allPage,
      setAllPage,
      clientPage,
      setClientPage,
      engineerPage,
      setEngineerPage,
      completedPage,
      setCompletedPage,
    },
  } = useAdminReports();

  const tabs = [
    {
      label: "All Users",
      content: (
        <ReportTable
          filterParams={filterParams}
          refetch={refetchAll}
          role="all"
          data={allData?.data ?? []}
          total={allData?.total ?? 0}
          isLoading={allLoading}
          currentPage={allPage}
          setCurrentPage={setAllPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      ),
    },
    {
      label: "Client",
      content: (
        <ReportTable
          filterParams={filterParams}
          refetch={refetchClient}
          role="client"
          data={clientData?.data ?? []}
          total={clientData?.total ?? 0}
          isLoading={clientLoading}
          currentPage={clientPage}
          setCurrentPage={setClientPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      ),
    },
    {
      label: "Engineer",
      content: (
        <ReportTable
          filterParams={filterParams}
          refetch={refetchEngineer}
          role="engineer"
          data={engineerData?.data ?? []}
          total={engineerData?.total ?? 0}
          isLoading={engineerLoading}
          currentPage={engineerPage}
          setCurrentPage={setEngineerPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      ),
    },
    {
      label: "Completed",
      content: (
        <ReportTable
          filterParams={filterParams}
          refetch={refetchCompleted}
          role="completed"
          data={completedData?.data ?? []}
          total={completedData?.total ?? 0}
          isLoading={completedLoading}
          currentPage={completedPage}
          setCurrentPage={setCompletedPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      ),
    },
  ];

  return (
    <div className="relative w-full h-full px-4 flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="flex justify-between items-center mt-2 mb-6 shrink-0">
        <p className="font-semibold text-xl">Reported Issue</p>

        {/* Filter Toggle Icon */}
        <BsFilterRight
          className="text-3xl cursor-pointer"
          onClick={() => setIsFilterOpen(true)}
        />
      </div>

      <div className="flex flex-col flex-1 bg-white dark:bg-gray-800 rounded-lg p-2 overflow-hidden">
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
