import { earningsData } from "@/dummy_data/jobDetails";
import Pagination from "@/pages/engineer/search_result/components/Pagination";
import FilterButton from "@/shared/components/commonUI/FilterButton";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import SidebarJobPostWallet from "@/shared/components/SidebarJobPostWallet";
import React, { useEffect, useMemo, useState } from "react";
import jobFilters, {
  SORT_OPTIONS,
  type Job,
  type JobStatus,
  JOB_STATUSES,
  WORKING_TYPES,
} from "../search_result/types";
import JobCard from "./components/JobCard";
import { scrollToTop } from "@/utils";
import { useClientGetJobs } from "@/shared/apiServices/client/clientOpenApiService";
import type { ClientGetJobsResponse } from "@/api";

/**
 * `MyJobsClient` is the main page component for a client to view their jobs.
 * It displays a list of jobs that can be filtered by status (e.g., "All Jobs", "In-Progress").
 * The layout includes a main content area for job listings and a sidebar with wallet information.
 * @returns {React.ReactElement} The rendered "My Jobs" page for the client.
 */
const MyJobsClient: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>(jobFilters[0]);
  const { data: jobsData } = useClientGetJobs();

  const mapApiJobToUiJob = (apiJob: ClientGetJobsResponse[0]): Job => ({
    id: apiJob.id,
    title: apiJob.jobTitle,
    type:
      apiJob.jobType === "On site"
        ? WORKING_TYPES.onsite
        : WORKING_TYPES.remote,
    startDate: apiJob.startDate
      ? new Date(apiJob.startDate).toDateString()
      : "N/A",
    duration: apiJob.endDate ? "Calculated Duration" : "N/A",
    location:
      apiJob.workLocationName || `${apiJob.cityId}, ${apiJob.countryId}`,
    cityId: apiJob.cityId,
    stateId: apiJob.stateId,
    countryId: apiJob.countryId,
    workLocationName: apiJob.workLocationName,
    pay: apiJob.totalPrice ? `$${apiJob.totalPrice}` : "N/A",
    status: (apiJob.status?.toLowerCase() as JobStatus) || JOB_STATUSES.posted,
    serviceType: "Service Category " + apiJob.serviceCategoryId,
    description: apiJob.jobDescription || undefined,
    postedTime: apiJob.createdAt || undefined,
  });

  const allJobs: Job[] = useMemo(() => {
    return (jobsData || []).map(mapApiJobToUiJob);
  }, [jobsData]);

  const filteredJobs = useMemo(() => {
    if (activeFilter === jobFilters[0]) {
      return allJobs;
    }
    if (activeFilter === jobFilters[1]) {
      return allJobs.filter((job) => job.status === JOB_STATUSES.inprogress);
    }
    if (activeFilter === jobFilters[2]) {
      return allJobs.filter((job) => job.status === JOB_STATUSES.completed);
    }
    if (activeFilter === jobFilters[3]) {
      return allJobs.filter((job) => job.status === JOB_STATUSES.posted);
    }
    if (activeFilter === jobFilters[4]) {
      return allJobs.filter((job) => job.status === JOB_STATUSES.hold);
    }
    return allJobs.filter((job) => job.status === activeFilter);
  }, [activeFilter, allJobs]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  useEffect(() => {
    scrollToTop();
  }, [currentPage]);
  const itemsPerPage = 6;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
    scrollToTop();
  };

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="w-full sticky top-[60px] z-10 bg-gray-100 dark:bg-gray-900">
        <MyJobsHeader
          title="My Jobs"
          currentSort={SORT_OPTIONS.NEWEST}
          isShowBreadcrumb
        />
      </div>
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="">
              <FilterButton
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                filters={jobFilters}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentJobs.length > 0 ? (
                  currentJobs.map((job) => <JobCard key={job.id} job={job} />)
                ) : (
                  <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
                    No jobs match the selected filter.
                  </p>
                )}
              </div>
              {totalPages > 1 && (
                <Pagination
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  currentPage={currentPage}
                />
              )}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <SidebarJobPostWallet earnings={earningsData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyJobsClient;
