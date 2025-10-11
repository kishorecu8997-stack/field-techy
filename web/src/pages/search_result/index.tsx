import { sampleJobs } from "@/dummy_data/searchData";
import { useEffect, useState } from "react";
import MyJobsHeader from "../../shared/components/MyJobsHeader";
import FilterPanel from "./components/FilterPanel";
import JobCard from "./components/JobCard";
import Pagination from "./components/Pagination";
import { SORT_OPTIONS, type Filters, type Job } from "./types";

/**
 * Main application component for job search results
 *
 * @returns {JSX.Element} Rendered application component
 */
const SearchResult = () => {
  // State management
  const [jobs] = useState<Job[]>(sampleJobs);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(sampleJobs);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState<Filters>({
    location: [],
    category: [],
    rating: [],
    experience: 0,
    budgetType: null,
    skills: [],
  });

  // Calculate total pages based on filtered jobs
  useEffect(() => {
    setTotalPages(Math.ceil(filteredJobs.length / 4));
  }, [filteredJobs]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...jobs];

    // Apply location filter
    if (filters.location.length > 0) {
      filtered = filtered.filter((job) =>
        filters.location.some((loc) => job.location?.includes(loc))
      );
    }

    // Apply category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter((job) =>
        filters.category.some((cat) => job.category?.includes(cat))
      );
    }

    // Apply rating filter
    if (filters.rating.length > 0) {
      filtered = filtered.filter(
        (job) => job.rating && filters.rating.includes(job.rating)
      );
    }

    // Apply experience filter
    if (filters.experience > 0) {
      filtered = filtered.filter(
        (job) => job.experience && job.experience >= filters.experience
      );
    }

    // Apply budget type filter
    if (filters.budgetType) {
      filtered = filtered.filter(
        (job) => job.budgetType === filters.budgetType
      );
    }

    // Apply skills filter
    if (filters.skills.length > 0) {
      filtered = filtered.filter((job) =>
        filters.skills.some((skill) => job.skills?.includes(skill))
      );
    }

    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [jobs, filters]);

  /**
   * Handle filter changes
   * @param {Filters} newFilters - New filter state
   */
  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  /**
   * Clear all filters
   */
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

  /**
   * Handle page change
   * @param {number} page - New page number
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Get jobs for current page
  const startIndex = (currentPage - 1) * 4;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + 4);

  return (
    <div className=" bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title="Search Result"
          isShowBreadcrumb={false}
          onSortChange={() => {}}
          currentSort={SORT_OPTIONS.NEWEST}
          description={`${filteredJobs.length} jobs found`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {currentJobs.map((job) => (
              <JobCard key={job.id} job={job} />
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

export default SearchResult;
