import { useEngineerGetJobs } from "@/shared/apiServices/engineer/engineerOpenApiService";
import FilterButton from "@/shared/components/commonUI/FilterButton";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
// import StatusFilter from "@/shared/components/status_filter_component/StatusFilter";
import { scrollToTop } from "@/utils";
import { useEffect, useState } from "react";
import type { JobFilter } from "../search_result/types";
import { JOB_FILTERS, SORT_OPTIONS } from "../search_result/types";
import Pagination from "@/pages/engineer/search_result/components/Pagination";
import JobList from "./my_job_components/JobList";
import SidebarProfile from "./my_job_components/SidebarProfile";

/**
 * Displays the engineer's dashboard with job listings and profile sidebar.
 * Includes a header with sorting controls and uses dummy data for user and earnings.
 */
const MyJobsPage = () => {
  const [activeFilter, setActiveFilter] = useState<JobFilter>(
    JOB_FILTERS.ALL_JOBS,
  );

  const jobStatus = (() => {
    switch (activeFilter) {
      case JOB_FILTERS.APPLIED:
        return "Posted";
      case JOB_FILTERS.IN_PROGRESS:
        return "In Progress";
      case JOB_FILTERS.COMPLETED:
        return "Closed";
      case JOB_FILTERS.CANCELLED:
        return "Cancelled";
      default:
        return undefined;
    }
  })();

  const jobType = (() => {
    switch (activeFilter) {
      case JOB_FILTERS.ON_SITE:
        return "On site";
      case JOB_FILTERS.REMOTE:
        return "Remote";
      case JOB_FILTERS.HYBRID:
        return "Hybrid";
      default:
        return undefined;
    }
  })();

  const {
    data: jobs,
    isLoading,
    isError,
    refetch,
  } = useEngineerGetJobs(jobStatus, jobType);

  const jobFilters = [
    JOB_FILTERS.ALL_JOBS,
    JOB_FILTERS.APPLIED,
    JOB_FILTERS.IN_PROGRESS,
    JOB_FILTERS.COMPLETED,
    JOB_FILTERS.CANCELLED,
    JOB_FILTERS.ON_SITE,
    JOB_FILTERS.REMOTE,
    JOB_FILTERS.HYBRID,
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    scrollToTop();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [activeFilter]);

  const allJobs = jobs || [];
  const totalPages = Math.ceil(allJobs.length / itemsPerPage);
  const currentJobs = allJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className=" bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title="My Jobs"
          currentSort={SORT_OPTIONS.NEWEST}
          isShowSort={false}
          // todo: implement sort functionality later
          onSortChange={() => { }}
        />
        <div className="flex items-center justify-between mt-4">
          <FilterButton
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter as (filter: string) => void}
            filters={jobFilters}
          />
        </div>

        {/* Following codes for StatusFilter were hide for future usage */}
        {/* <StatusFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter as (filter: string) => void}
        /> */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <JobList
              jobs={currentJobs}
              isLoading={isLoading}
              isError={isError}
              refetch={refetch}
            />
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <SidebarProfile />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyJobsPage;
