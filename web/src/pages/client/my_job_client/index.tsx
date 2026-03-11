import { earningsData } from "@/dummy_data/jobDetails";
import Pagination from "@/pages/engineer/search_result/components/Pagination";
import FilterButton from "@/shared/components/commonUI/FilterButton";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import SidebarJobPostWallet from "@/shared/components/SidebarJobPostWallet";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import jobFilters, {
  SORT_OPTIONS,
  type Job,
  type JobStatus,
  WORKING_TYPES,
} from "../search_result/types";
import { JOB_STATUSES as API_JOB_STATUSES } from "@/pages/engineer/search_result/types";
import JobCard from "./components/JobCard";
import { scrollToTop } from "@/utils";
import { useClientGetJobs } from "@/shared/apiServices/client/clientOpenApiService";
import type { ClientGetJobsResponse } from "@/api";
import { useServiceCategories } from "@/shared/hooks/useLookup";

// Map the UI filter label → API jobStatus query param
type ApiJobStatus = NonNullable<
  Parameters<typeof useClientGetJobs>[0]
>["jobStatus"];
const FILTER_TO_API_STATUS: Record<string, ApiJobStatus | undefined> = {
  [jobFilters[0]]: undefined, // "All Jobs"    → no filter
  [jobFilters[1]]: API_JOB_STATUSES.inProgress, // "In-Progress" → "In Progress"
  [jobFilters[2]]: API_JOB_STATUSES.closed, // "Completed"   → "Closed"
  [jobFilters[3]]: API_JOB_STATUSES.posted, // "Posted"      → "Posted"
  [jobFilters[4]]: API_JOB_STATUSES.hold, // "Hold"        → "Hold"
};

/**
 * `MyJobsClient` is the main page component for a client to view their jobs.
 * It displays a list of jobs that can be filtered by status (e.g., "All Jobs", "In-Progress").
 * The layout includes a main content area for job listings and a sidebar with wallet information.
 * @returns {React.ReactElement} The rendered "My Jobs" page for the client.
 */
const MyJobsClient: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get("filter");

  // Initialize activeFilter from URL query param if valid
  const [activeFilter, setActiveFilter] = useState<string>(() => {
    if (filterParam && jobFilters.includes(filterParam)) {
      return filterParam;
    }
    return jobFilters[0];
  });

  // Sync activeFilter with URL filter param when it changes (e.g., navigation from Dashboard)
  useEffect(() => {
    if (
      filterParam &&
      jobFilters.includes(filterParam) &&
      filterParam !== activeFilter
    ) {
      setActiveFilter(filterParam);
      setCurrentPage(1); // Reset pagination when filter changes via URL
    }
  }, [filterParam]);

  const apiJobStatus = FILTER_TO_API_STATUS[activeFilter];
  const { data: jobsData, isLoading } = useClientGetJobs({
    jobStatus: apiJobStatus,
    enabled: true,
  });
  const { data: serviceCategories } = useServiceCategories();

  // Create a memoized map of service category ID to name
  const serviceCategoryMap = useMemo(() => {
    const map = new Map<number, string>();
    if (serviceCategories) {
      serviceCategories.forEach((category) => {
        map.set(Number(category.id), category.name);
      });
    }
    return map;
  }, [serviceCategories]);

  // Helper function to calculate duration from start and end dates
  const calculateDuration = (
    startDate: string | null,
    endDate: string | null,
  ): string => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return `${start.toLocaleDateString("en-GB")} - ${end.toLocaleDateString("en-GB")}`;
    } else if (startDate) {
      return `Starts: ${new Date(startDate).toLocaleDateString("en-GB")}`;
    }
    return "Not specified";
  };

  // Helper function to get service category name from ID
  const getServiceCategoryName = (serviceCategoryId: number): string => {
    return (
      serviceCategoryMap.get(serviceCategoryId) ||
      `Service Category ${serviceCategoryId}`
    );
  };

  const mapApiJobToUiJob = (apiJob: ClientGetJobsResponse[0]): Job => ({
    id: apiJob.id,
    title: apiJob.jobTitle,
    type:
      apiJob.jobType === "On site"
        ? WORKING_TYPES.onsite
        : apiJob.jobType === "Remote"
          ? WORKING_TYPES.remote
          : apiJob.jobType === "Hybrid"
            ? WORKING_TYPES.hybrid
            : ((apiJob.jobType as Job["type"]) ?? WORKING_TYPES.remote),
    startDate: apiJob.startDate
      ? new Date(apiJob.startDate).toDateString()
      : "N/A",
    duration: calculateDuration(apiJob.startDate, apiJob.endDate),
    location:
      apiJob.workLocationName || `${apiJob.cityId}, ${apiJob.countryId}`,
    cityId: apiJob.cityId,
    stateId: apiJob.stateId,
    countryId: apiJob.countryId,
    workLocationName: apiJob.workLocationName,
    pay:
      apiJob.totalPrice != null && apiJob.totalPrice !== ""
        ? `${apiJob.totalPrice}`
        : "N/A",
    status: (apiJob.status?.toLowerCase() as JobStatus) || "posted",
    serviceType: getServiceCategoryName(apiJob.serviceCategoryId),
    description: apiJob.jobDescription || undefined,
    postedTime: apiJob.createdAt || undefined,
    currencySymbol: apiJob.currencySymbol || "$",
    regionId: apiJob.regionId,
  });

  // allJobs is already filtered by the API — no client-side filtering needed
  const allJobs: Job[] = useMemo(() => {
    return (jobsData || []).map(mapApiJobToUiJob);
  }, [jobsData, serviceCategoryMap]);

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
    setSearchParams({ filter });
    setCurrentPage(1);
    scrollToTop();
  };

  const totalPages = Math.ceil(allJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = allJobs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200 p-2">
      <div className="w-full sticky top-[60px] z-10 bg-gray-100 dark:bg-gray-900">
        <MyJobsHeader
          title="My Jobs"
          isShowSort={false}
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
                {isLoading ? (
                  // Show loader while loading
                  <div className="col-span-full flex justify-center items-center py-20">
                    <LoaderComponent />
                  </div>
                ) : currentJobs.length > 0 ? (
                  currentJobs.map((job) => <JobCard key={job.id} job={job} />)
                ) : (
                  <p className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">
                    <div className="font-semibold w-fit mx-auto border-2 border-gray-200 dark:border-gray-700 p-20 rounded-lg">
                      No jobs match the selected filter.
                    </div>
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
