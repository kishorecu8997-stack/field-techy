import { sampleJobs } from "@/dummy_data/searchData";
import { useEffect, useState } from "react";
import FilterPanel from "./components/FilterPanel";
import AdvancedSearchBar from "./components/AdvancedSearchBar";
import JobCard from "./components/JobCard";
import Pagination from "./components/Pagination";
import { SORT_OPTIONS, type Filters, type Job, type SortOption } from "./types";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { absoluteUrls } from "@/config/urls";
import SearchHistory from "./components/SearchHistory";
import { Button } from "@/shared/components/commonUI/Buttons";

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
    serviceType: [],
    tools: [],
    experienceLevel: [],
    jobType: [],
    locationType: [],
    locationRadius: 0,
    budgetRange: { min: 0, max: 10000 },
    primaryLanguage: "",
    slaLevel: "",
  });

  const [sortOption, setSortOption] = useState<SortOption>(
    SORT_OPTIONS.RELEVANCE
  );
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // Search history state
  const [searchHistory, setSearchHistory] = useState<
    Array<{ id: string; filters: Filters; timestamp: Date }>
  >(() => {
    const saved = localStorage.getItem("searchHistory");
    return saved
      ? JSON.parse(saved).map(
          (item: { id: string; filters: Filters; timestamp: string }) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          })
        )
      : [];
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
    // Apply sorting
    if (sortOption === SORT_OPTIONS.DATE) {
      filtered.sort(
        (a, b) =>
          new Date(b.postedTime || "").getTime() -
          new Date(a.postedTime || "").getTime()
      );
    } else if (sortOption === SORT_OPTIONS.SALARY) {
      filtered.sort(
        (a, b) => parseFloat(b.salary || "0") - parseFloat(a.salary || "0")
      );
    } else if (sortOption === SORT_OPTIONS.DISTANCE) {
      // Distance-based sorting is not yet implemented; fall back to default (relevance) order.
      filtered.sort(
        (a, b) => (a.location || "").length - (b.location || "").length
      );
    }
    // Relevance is default, no sorting needed
    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [jobs, filters, sortOption]);
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
      serviceType: [],
      tools: [],
      experienceLevel: [],
      jobType: [],
      locationType: [],
      locationRadius: 0,
      budgetRange: { min: 0, max: 10000 },
      primaryLanguage: "",
      slaLevel: "",
    });
  };
  /**
   * Handle page change
   * @param {number} page - New page number
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  /**
   * Handle sort change
   * @param {string} sort - New sort option
   */
  const handleSortChange = (sort: string) => {
    setSortOption(sort as SortOption);
  };

  /**
   * Handle applying history item
   * @param {Filters} historyFilters - Filters from history to apply
   */
  const handleApplyHistory = (historyFilters: Filters) => {
    setFilters(historyFilters);
  };

  /**
   * Handle clearing search history
   */
  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  /**
   * Handle saving current search to history
   */
  const handleSaveCurrentSearch = () => {
    const newHistoryItem = {
      id: Date.now().toString(),
      filters: filters,
      timestamp: new Date(),
    };
    setSearchHistory((prev) => {
      const updated = [
        newHistoryItem,
        ...prev.filter(
          (item) => JSON.stringify(item.filters) !== JSON.stringify(filters)
        ),
      ].slice(0, 10);
      localStorage.setItem("searchHistory", JSON.stringify(updated));
      return updated;
    });
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
          description={`${filteredJobs.length} jobs found`}
          isShowSort={false}
        />
        <AdvancedSearchBar
          onFilterChange={handleFilterChange}
          currentFilters={filters}
          sortOption={sortOption}
          onSortChange={handleSortChange}
        />

        <SearchHistory
          history={searchHistory}
          onApplyHistory={handleApplyHistory}
          onClearHistory={handleClearHistory}
        />

        <div className="mb-4">
          <Button
            leftIcon={
              <svg
                className={`w-4 h-4 transition-transform ${
                  showAdvancedSearch ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            }
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
          >
            Advanced Search
          </Button>
        </div>

        {showAdvancedSearch && (
          <AdvancedSearchBar
            onFilterChange={handleFilterChange}
            currentFilters={filters}
            sortOption={sortOption}
            onSortChange={handleSortChange}
            onSaveCurrentSearch={handleSaveCurrentSearch}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
          <div className="lg:col-span-3">
            {currentJobs.map((job) => (
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

export default SearchResult;
