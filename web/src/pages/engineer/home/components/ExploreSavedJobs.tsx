import { absoluteUrls } from "@/config/urls";
import { sampleJobs } from "@/dummy_data/searchData";
import FilterPanel from "@/pages/engineer/search_result/components/FilterPanel";
import JobCard from "@/pages/engineer/search_result/components/JobCard";
import Pagination from "@/pages/engineer/search_result/components/Pagination";
import {
  JOB_STATUSES,
  SORT_OPTIONS,
  type Filters,
} from "@/pages/engineer/search_result/types";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { useMemo, useState } from "react";

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
  });
  
  const allSavedJobs = useMemo(() => {
    return sampleJobs.filter(
      (job) =>
        job.isBookmarked === true
    );
  }, []);

  // Pagination settings
  const jobsPerPage = 4;

  const totalPages = useMemo(() => {
    return Math.ceil(allSavedJobs.length / jobsPerPage);
  }, [allSavedJobs]);

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
          description={`${allSavedJobs.length}+ jobs found`}
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
                />
              ))
            ) : (
              <p>No jobs found.</p>
            )}

            {/* Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
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
