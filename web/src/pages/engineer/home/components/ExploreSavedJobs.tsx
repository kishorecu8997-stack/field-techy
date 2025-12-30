import { absoluteUrls } from "@/config/urls";
import FilterPanel from "@/pages/engineer/search_result/components/FilterPanel";
import JobCard from "@/pages/engineer/search_result/components/JobCard";
import Pagination from "@/pages/engineer/search_result/components/Pagination";
import {
  SORT_OPTIONS,
  type Filters,
  type Job,
} from "@/pages/engineer/search_result/types";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { useMemo, useState, useEffect } from "react";
import { getSavedJobs } from "@/utils/bookmarkUtils";

/**
 * explore jobs page component
 *
 * @returns {JSX.Element} Rendered application component
 */
const ExploreSavedJobs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
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
  });
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);

  useEffect(() => {
    setSavedJobs(getSavedJobs());
  }, []);
  const refreshSavedJobs = () => {
    setSavedJobs(getSavedJobs());
    setCurrentPage(1);
  };
  const allSavedJobs = savedJobs;

  // Pagination settings
  const jobsPerPage = 4;
  const totalPages = useMemo(() => {
    return Math.ceil(allSavedJobs.length / jobsPerPage);
  }, [allSavedJobs.length]);
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    return allSavedJobs.slice(startIndex, startIndex + jobsPerPage);
  }, [currentPage, allSavedJobs]);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // reset page on filter change
  };
  const handleClearAllFilters = () => {
    setFilters({
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
    });
    setCurrentPage(1);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title="Saved Jobs"
          currentSort={SORT_OPTIONS.NEWEST}
          isShowBreadcrumb={false}
          description={`${allSavedJobs.length} saved job${allSavedJobs.length !== 1 ? "s" : ""
            }`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
          {/* LEFT SIDE (Jobs Listing) */}
          <div className="lg:col-span-3">
            {paginatedJobs.length > 0 ? (
              paginatedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  showBookmark={true}
                  navigateToJob={`${absoluteUrls.engineer.home.my_jobs}/${job.id}`}
                  onBookmarkChange={refreshSavedJobs}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  No jobs found.
                </p>
                <p className="mt-4 text-gray-500 dark:text-gray-300">
                  Browse jobs and click the bookmark icon to save them here!
                </p>
              </div>
            )}

            {/* Pagination Component */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>

          {/* RIGHT SIDE (Filters) */}
          <div className="lg:col-span-1">
            <FilterPanel
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAllFilters}
              currentFilters={filters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreSavedJobs;
