import { absoluteUrls } from "@/config/urls";
import FilterPanel from "@/pages/engineer/search_result/components/FilterPanel";
import JobCard from "@/pages/engineer/search_result/components/JobCard";
import Pagination from "@/pages/engineer/search_result/components/Pagination";
import {
  SORT_OPTIONS,
  type Filters,
  type SortOption,
} from "@/pages/engineer/search_result/types";
import { useEngineerSearchJobs } from "@/shared/apiServices/engineer/engineerOpenApiService";
import { Button } from "@/shared/components/commonUI/Buttons";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { useEngineerProfile } from "@/shared/store/useEngineerStore";
import React, { useMemo, useState } from "react";
import type { JobItem } from "../types";
import { mapApiJobToJobItem } from "@/pages/engineer/search_result/mappers";
import type { JobType } from "@/constants/jobTypes";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import { scrollToTop } from "@/utils";

/**
 * ExploreJobs Page - Browse and filter open job listings
 */
const ExploreJobs: React.FC = () => {
  const profile = useEngineerProfile();
  const [currentPage, setCurrentPage] = useState(1);
  const isRecommended = location.pathname.includes("recommended");
  const isFeatured = location.pathname.includes("featured");
  const isExplore = location.pathname.includes("explore");

  const [filters, setFilters] = useState<Filters>({
    q: "",
    country: "",
    state: "",
    city: "",
    countryId: null,
    stateId: null,
    cityId: null,
    location: [],
    category: [],
    rating: [],
    experience: 0,
    budgetType: null,
    skills: [],
    budgetRange: { min: 0, max: 0 },
    serviceType: [],
    tools: [],
    experienceLevel: [],
    jobType: [],
    locationType: [],
    locationRadius: 0,
    primaryLanguage: "",
    slaLevel: "",
    jobTypeEnum: "",
  });
  const {
    data: apiJobsResponse,
    refetch: searchJobsRefetch,
    isLoading: exploreJobsLoading,
  } = useEngineerSearchJobs({
    jobType: (filters.jobTypeEnum as JobType) || null,
    serviceCategoryIds: filters.category || [],
    experienceLevelId: filters.experience || 0,
    skillIds: filters.skills || [],
    isExplore: isExplore && true,
    sortBy: isRecommended ? "relevant" : "latest",
    isFeatured: isFeatured && true,
  });

  const apiJobs = useMemo(() => {
    return (apiJobsResponse || []).map(mapApiJobToJobItem);
  }, [apiJobsResponse]);

  const [sortBy, setSortBy] = useState<SortOption>(SORT_OPTIONS.RELEVANCE);

  // Step 4: Pagination
  const jobsPerPage = 4;
  const totalPages = Math.ceil(apiJobs.length / jobsPerPage);
  const paginatedJobs = useMemo<JobItem[]>(() => {
    const start = (currentPage - 1) * jobsPerPage;
    return apiJobs.slice(start, start + jobsPerPage);
  }, [apiJobs, currentPage]);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToTop();
  };
  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // reset page on filter change
    scrollToTop();
  };
  const handleClearAllFilters = () => {
    setFilters({
      q: "",
      country: "",
      state: "",
      city: "",
      countryId: null,
      stateId: null,
      cityId: null,
      location: [],
      category: [],
      rating: [],
      experience: 0,
      budgetType: null,
      skills: [],
      budgetRange: { min: 0, max: 0 },
      serviceType: [],
      tools: [],
      experienceLevel: [],
      jobType: [],
      locationType: [],
      locationRadius: 0,
      primaryLanguage: "",
      slaLevel: "",
      jobTypeEnum: "",
    });
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-9xl px-2 py-2 md:px-2">
        <MyJobsHeader
          title={
            isRecommended
              ? "Recommended Jobs"
              : isFeatured
                ? "Featured Jobs"
                : "Explore Jobs"
          }
          description={`${apiJobs.length} job${
            apiJobs.length !== 1 ? "s" : ""
          } found`}
          isShowBreadcrumb={false}
          isShowSort={false}
          currentSort={sortBy}
          onSortChange={handleSortChange}
        />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Job Listings - Now shows up to 4 jobs per page */}
          <section className="lg:col-span-3">
            <div className="space-y-6">
              {/* Added flex and items-center */}
              {exploreJobsLoading ? (
                <div className="flex h-64 w-full items-center justify-center">
                  <LoaderComponent />
                </div>
              ) : paginatedJobs.length > 0 ? (
                paginatedJobs.map((job) => (
                  <div key={job.id} className="w-full">
                    {/* Ensure JobCard takes full width of the container */}
                    <JobCard
                      job={job}
                      userSkills={profile?.jobSkills || []}
                      userTools={profile?.tools || []}
                      navigateToJob={`${absoluteUrls.engineer.home.my_jobs}/${job.id}`}
                      onBookmarkChange={searchJobsRefetch}
                    />
                  </div>
                ))
              ) : (
                /* Empty state centered */
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600 dark:text-gray-400">
                    No jobs found.
                  </p>
                  <p className="mt-4 mb-2 text-gray-500 dark:text-gray-300">
                    Browse jobs and click the bookmark icon to save them here!
                  </p>
                  <Button
                    onClick={handleClearAllFilters}
                    variant="primary"
                    size="lg"
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>

            {/* Center the Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </section>

          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6">
              <FilterPanel
                currentFilters={filters}
                onFilterChange={handleFilterChange}
                onClearAll={handleClearAllFilters}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ExploreJobs;
