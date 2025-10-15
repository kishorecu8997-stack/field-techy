import { absoluteUrls } from "@/config/urls";
import { sampleJobs } from "@/dummy_data/searchData";
import FilterPanel from "@/pages/search_result/components/FilterPanel";
import JobCard from "@/pages/search_result/components/JobCard";
import Pagination from "@/pages/search_result/components/Pagination";
import { SORT_OPTIONS, type Filters } from "@/pages/search_result/types";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { useState } from "react";

/**
 * Main application component for job search results
 *
 * @returns {JSX.Element} Rendered application component
 */
const ExploreJobs = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<Filters>({
    location: [],
    category: [],
    rating: [],
    experience: 0,
    budgetType: null,
    skills: [],
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filterNewJobs = () => {
    return currentJobs.filter((job) => {
      return job.status === "new";
    });
  };
  // Get jobs for current page
  const startIndex = (currentPage - 1) * 4;
  const currentJobs = sampleJobs.slice(startIndex, startIndex + 4);
  const totalPages = Math.ceil(filterNewJobs().length / 4);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
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
  };

  return (
    <div className=" bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title="Explore Jobs"
          currentSort={SORT_OPTIONS.NEWEST}
          isShowBreadcrumb={false}
          description="6000+ jobs found"
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
          <div className="lg:col-span-3">
            {filterNewJobs().map((job) => (
              <JobCard
                key={job.id}
                job={job}
                navigateToJob={`${absoluteUrls.engineer.home.my_jobs}/${job.id}`}
              />
            ))}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>

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

export default ExploreJobs;
