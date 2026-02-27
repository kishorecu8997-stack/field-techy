import type { AdminGetReportsResponses } from "@/api";
import { useAdminGetReport } from "@/shared/apiServices/admin/adminOpenApiService";
import AdminFilter, {
  type FilterDataProps,
} from "@/shared/components/AdminFilter";
import AdminTabComponent from "@/shared/components/AdminTabComponent";
import { useState } from "react";
import { BsFilterRight } from "react-icons/bs";
import ReportTable from "./components/ReportTable";

type AdminReportIssue = AdminGetReportsResponses[200]["data"][number];

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
  const [pageSize, setPageSize] = useState(10);
  const [allPage, setAllPage] = useState(1);
  const [clientPage, setClientPage] = useState(1);
  const [engineerPage, setEngineerPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const [filterParams, setFilterParams] = useState<FilterDataProps>({
    sortBy: "",
    date: "",
    filters: [],
  });
  const {
    data: allData,
    isLoading: allLoading,
    refetch: refetchAll,
  } = useAdminGetReport({
    page: allPage,
    limit: pageSize,
  });

  const {
    data: clientData,
    isLoading: clientLoading,
    refetch: refetchClient,
  } = useAdminGetReport({
    page: clientPage,
    limit: pageSize,
    reporterRole: "client",
  });

  const {
    data: engineerData,
    isLoading: engineerLoading,
    refetch: refetchEngineer,
  } = useAdminGetReport({
    page: engineerPage,
    limit: pageSize,
    reporterRole: "engineer",
  });

  const {
    data: completedData,
    isLoading: completedLoading,
    refetch: refetchCompleted,
  } = useAdminGetReport({
    page: completedPage,
    limit: pageSize,
    status: "resolved",
  });

  // This prop function receives the filter object from the child
  const handleApplyFilters = (data: FilterDataProps) => {
    setFilterParams(data);
    setIsFilterOpen(false);
  };

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
    <div className="relative w-full h-full px-4 overflow-y-auto">
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
