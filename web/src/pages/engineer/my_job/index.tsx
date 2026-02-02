import { earningsData, userData } from "@/dummy_data/jobDetails";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { SORT_OPTIONS, JOB_FILTERS } from "../search_result/types";
import type { JobFilter } from "../search_result/types";
import JobList from "./my_job_components/JobList";
import SidebarProfile from "./my_job_components/SidebarProfile";
import { useState } from "react";
import StatusFilter from "@/shared/components/status_filter_component/StatusFilter";
import FilterButton from "@/shared/components/commonUI/FilterButton";
import { Button } from "@/shared/components/commonUI/Buttons";
import { absoluteUrls } from "@/config/urls";
import { useNavigate } from "react-router-dom";
import { useEngineerGetJobs } from "@/shared/apiServices/engineer/engineerOpenApiService";

/**
 * Displays the engineer's dashboard with job listings and profile sidebar.
 * Includes a header with sorting controls and uses dummy data for user and earnings.
 */
const MyJobsPage = () => {
  const [activeFilter, setActiveFilter] = useState<JobFilter>(
    JOB_FILTERS.ALL_JOBS,
  );
  const navigate = useNavigate();

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

  const { data: jobs, isLoading, isError } = useEngineerGetJobs(jobStatus, jobType);

  const jobFilters = [
    JOB_FILTERS.ALL_JOBS,
    JOB_FILTERS.APPLIED,
    JOB_FILTERS.TODAY,
    JOB_FILTERS.IN_PROGRESS,
    JOB_FILTERS.COMPLETED,
    JOB_FILTERS.DECLINED,
    JOB_FILTERS.CANCELLED,
    JOB_FILTERS.ON_SITE,
    JOB_FILTERS.REMOTE,
    JOB_FILTERS.HYBRID,
  ];

  return (
    <div className=" bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title="My Jobs"
          currentSort={SORT_OPTIONS.NEWEST}
          onSortChange={() => { }}
          isReport
        />
        <div className="flex items-center justify-between mt-4">
          <FilterButton
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter as (filter: string) => void}
            filters={jobFilters}
          />

          <Button
            onClick={() =>
              navigate(absoluteUrls.engineer.home.application_history)
            }
            variant="primary"
            size="md"
            className="bg-teal-800 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded transition focus:ring-teal-600"
            aria-label="Go to Application History"
          >
            Application History
          </Button>
        </div>

        <StatusFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter as (filter: string) => void}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <JobList
            activeFilter={activeFilter}
            jobs={jobs || []}
            isLoading={isLoading}
            isError={isError}
          />
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <SidebarProfile user={userData} earnings={earningsData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyJobsPage;
