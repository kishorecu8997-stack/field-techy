import { useState } from "react";
import { useAdminGetReport } from "@/shared/apiServices/admin/adminOpenApiService";
import type { FilterDataProps } from "@/shared/components/AdminFilter";

/**
 * @hook useAdminReports
 * @description Consolidates all four admin report API calls (All, Client, Engineer, Completed)
 * into a single reusable hook. Manages independent pagination per tab, shared page size,
 * and filter params state.
 *
 * @returns {UseAdminReportsReturn} All data, loading states, pagination controls, filter state, and refetch functions.
 *
 * @example
 * const {
 *   allData, clientData, engineerData, completedData,
 *   allLoading, clientLoading, engineerLoading, completedLoading,
 *   refetchAll, refetchClient, refetchEngineer, refetchCompleted,
 *   pagination, filterParams, handleApplyFilters,
 * } = useAdminReports();
 */
export function useAdminReports() {
  /** Shared page size across all tabs. */
  const [pageSize, setPageSize] = useState(10);

  /** Independent page state per tab. */
  const [allPage, setAllPage] = useState(1);
  const [clientPage, setClientPage] = useState(1);
  const [engineerPage, setEngineerPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);

  /** Filter and sort params applied from the AdminFilter panel. */
  const [filterParams, setFilterParams] = useState<FilterDataProps>({
    sortBy: "",
    date: "",
    filters: [],
  });

  /** Fetches all reports regardless of role or status. */
  const {
    data: allData,
    isLoading: allLoading,
    refetch: refetchAll,
  } = useAdminGetReport({ page: allPage, limit: pageSize });

  /** Fetches reports filtered to reporterRole: "client". */
  const {
    data: clientData,
    isLoading: clientLoading,
    refetch: refetchClient,
  } = useAdminGetReport({
    page: clientPage,
    limit: pageSize,
    reporterRole: "client",
  });

  /** Fetches reports filtered to reporterRole: "engineer". */
  const {
    data: engineerData,
    isLoading: engineerLoading,
    refetch: refetchEngineer,
  } = useAdminGetReport({
    page: engineerPage,
    limit: pageSize,
    reporterRole: "engineer",
  });

  /** Fetches reports filtered to status: "resolved". */
  const {
    data: completedData,
    isLoading: completedLoading,
    refetch: refetchCompleted,
  } = useAdminGetReport({
    page: completedPage,
    limit: pageSize,
    status: "resolved",
  });

  /**
   * Handles filter application from the AdminFilter panel.
   * Updates filterParams and resets all tabs back to page 1.
   *
   * @param {FilterDataProps} data - The filter object from AdminFilter.
   */
  const handleApplyFilters = (data: FilterDataProps) => {
    setFilterParams(data);
    setAllPage(1);
    setClientPage(1);
    setEngineerPage(1);
    setCompletedPage(1);
  };

  return {
    // API data
    allData,
    clientData,
    engineerData,
    completedData,

    // Loading states
    allLoading,
    clientLoading,
    engineerLoading,
    completedLoading,

    // Refetch functions
    refetchAll,
    refetchClient,
    refetchEngineer,
    refetchCompleted,

    // Filter
    filterParams,
    handleApplyFilters,

    // Pagination
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
  };
}
