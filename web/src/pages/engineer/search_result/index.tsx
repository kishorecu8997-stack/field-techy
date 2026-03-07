import { absoluteUrls } from "@/config/urls";
import { useEngineerSearchJobs } from "@/shared/apiServices/engineer/engineerOpenApiService";
import { useCountries, useStates, useCities } from "@/shared/hooks/useLookup";
import { mapApiJobToJobItem } from "./mappers";
import { Button } from "@/shared/components/commonUI/Buttons";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdvancedSearchBar from "./components/AdvancedSearchBar";
import FilterPanel from "./components/FilterPanel";
import JobCard from "./components/JobCard";
import Pagination from "./components/Pagination";
import SearchHistory from "./components/SearchHistory";
import { useEngineerProfile } from "@/shared/store/useEngineerStore";
import { SORT_OPTIONS, type Filters, type SortOption } from "./types";
import { scrollToTop } from "@/utils";
import { mapFiltersToApiQuery } from "./utils";

/**
 * Parse filters from URL search params
 * @param searchParams - URL search parameters
 * @returns Parsed filters
 */
const parseFiltersFromUrl = (
  searchParams: URLSearchParams,
): Partial<Filters> => {
  const filters: Partial<Filters> = {};

  // Parse new search fields
  filters.q = searchParams.get("q") || "";
  filters.country = searchParams.get("country") || "";
  filters.state = searchParams.get("state") || "";
  filters.city = searchParams.get("city") || "";

  // Parse array fields
  const locationType = searchParams.get("locationType");
  if (locationType) filters.locationType = locationType.split(",");

  const category = searchParams.get("category");
  if (category) filters.category = category.split(",");

  const skills = searchParams.get("skills");
  if (skills) filters.skills = skills.split(",");

  const rating = searchParams.get("rating");
  if (rating) filters.rating = rating.split(",").map(Number);

  // Parse single value fields
  const experience = searchParams.get("experience");
  if (experience) filters.experience = Number(experience);

  const budgetType = searchParams.get("budgetType");
  if (budgetType && (budgetType === "hourly" || budgetType === "fixed")) {
    filters.budgetType = budgetType;
  }

  // Parse budget range
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (minPrice || maxPrice) {
    filters.budgetRange = {
      min: minPrice ? Number(minPrice) : 0,
      max: maxPrice ? Number(maxPrice) : 10000,
    };
  }

  return filters;
};

/**
 * Convert filters to URL search params
 * @param filters - Filters to convert
 * @returns URL search parameters
 */
const filtersToSearchParams = (filters: Filters): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.country) params.set("country", filters.country);
  if (filters.state) params.set("state", filters.state);
  if (filters.city) params.set("city", filters.city);

  if (filters.locationType.length > 0) {
    params.set("locationType", filters.locationType.join(","));
  }
  if (filters.category.length > 0) {
    params.set("category", filters.category.join(","));
  }
  if (filters.skills.length > 0) {
    params.set("skills", filters.skills.join(","));
  }
  if (filters.rating.length > 0) {
    params.set("rating", filters.rating.join(","));
  }
  if (filters.experience > 0) {
    params.set("experience", String(filters.experience));
  }
  if (filters.budgetType) {
    params.set("budgetType", filters.budgetType);
  }
  if (filters.budgetRange.min > 0) {
    params.set("minPrice", String(filters.budgetRange.min));
  }
  if (filters.budgetRange.max < 10000) {
    params.set("maxPrice", String(filters.budgetRange.max));
  }

  return params;
};

/**
 * Main application component for job search results
 * @returns {JSX.Element} Rendered application component
 */
const SearchResult = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    scrollToTop();
  }, []);
  const profile = useEngineerProfile();

  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Guard to prevent the filters→URL effect from firing when we are
  // already updating filters FROM the URL (breaks the circular sync loop).
  const isUpdatingFromUrl = useRef(false);

  // Initialize filters from URL or use defaults
  const [filters, setFilters] = useState<Filters>(() => {
    const urlFilters = parseFiltersFromUrl(searchParams);
    return {
      q: urlFilters.q || "",
      country: urlFilters.country || "",
      state: urlFilters.state || "",
      city: urlFilters.city || "",
      countryId: null,
      stateId: null,
      cityId: null,
      location: [],
      category: urlFilters.category || [],
      rating: urlFilters.rating || [],
      experience: urlFilters.experience || 0,
      budgetType: urlFilters.budgetType || null,
      skills: urlFilters.skills || [],
      serviceType: [],
      tools: [],
      experienceLevel: [],
      jobType: [],
      locationType: urlFilters.locationType || [],
      locationRadius: 0,
      budgetRange: urlFilters.budgetRange || { min: 0, max: 10000 },
      primaryLanguage: "",
      slaLevel: "",
    };
  });

  // When the URL changes externally (e.g. a new search submitted from the
  // Navbar), re-parse the params and update the filters state so the page
  // reflects the new search rather than keeping the stale previous filters.
  useEffect(() => {
    isUpdatingFromUrl.current = true;
    const urlFilters = parseFiltersFromUrl(searchParams);
    setFilters(prev => ({
      ...prev,
      q: urlFilters.q ?? "",
      country: urlFilters.country ?? "",
      state: urlFilters.state ?? "",
      city: urlFilters.city ?? "",
      // Reset resolved IDs so the lookup effects re-resolve them
      countryId: urlFilters.country !== prev.country ? null : prev.countryId,
      stateId: urlFilters.state !== prev.state ? null : prev.stateId,
      cityId: urlFilters.city !== prev.city ? null : prev.cityId,
      category: urlFilters.category ?? [],
      rating: urlFilters.rating ?? [],
      experience: urlFilters.experience ?? 0,
      budgetType: urlFilters.budgetType ?? null,
      skills: urlFilters.skills ?? [],
      locationType: urlFilters.locationType ?? [],
      budgetRange: urlFilters.budgetRange ?? { min: 0, max: 10000 },
    }));
  }, [searchParams]);

  // Sync filters to URL whenever they change (user interacts with FilterPanel
  // or AdvancedSearchBar). Skip when the change itself came from the URL so
  // we don't immediately overwrite the URL we just read.
  useEffect(() => {
    if (isUpdatingFromUrl.current) {
      isUpdatingFromUrl.current = false;
      return;
    }
    const params = filtersToSearchParams(filters);
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const [sortOption, setSortOption] = useState<SortOption>(
    SORT_OPTIONS.RELEVANCE,
  );
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // ── Location ID Resolution ──────────────────────────────────────────────
  const { data: countryData = [] } = useCountries();
  const { data: stateData = [] } = useStates(filters.countryId, { enabled: !!filters.countryId });
  const { data: cityData = [] } = useCities(filters.stateId, { enabled: !!filters.stateId });

  // Resolve Country ID from name
  useEffect(() => {
    if (countryData.length > 0 && filters.country && !filters.countryId) {
      const found = countryData.find(c => c.name === filters.country);
      if (found) {
        setFilters(prev => ({ ...prev, countryId: found.id }));
      }
    }
  }, [countryData, filters.country]);

  // Resolve State ID from name
  useEffect(() => {
    if (stateData.length > 0 && filters.state && !filters.stateId) {
      const found = stateData.find(s => s.name === filters.state);
      if (found) {
        setFilters(prev => ({ ...prev, stateId: found.id }));
      }
    }
  }, [stateData, filters.state]);

  // Resolve City ID from name
  useEffect(() => {
    if (cityData.length > 0 && filters.city && !filters.cityId) {
      const found = cityData.find(c => c.name === filters.city);
      if (found) {
        setFilters(prev => ({ ...prev, cityId: found.id }));
      }
    }
  }, [cityData, filters.city]);
  // ─────────────────────────────────────────────────────────────────────────

  // Map filters to API query parameters
  const apiQuery = useMemo(() => mapFiltersToApiQuery(filters), [filters]);

  // Fetch jobs with filters applied at the API level
  const { data: rawJobs } = useEngineerSearchJobs(apiQuery);

  const jobs = useMemo(() => {
    return (rawJobs || []).map(mapApiJobToJobItem);
  }, [rawJobs]);

  // Apply client-side sorting and filtering for features not supported by API
  const filteredJobs = useMemo(() => {
    let filtered = [...(jobs || [])];

    // Filter out jobs where all vacancies are filled
    filtered = filtered.filter(
      (job) => (job.assignedEngineerCount ?? 0) < job.numberOfVacancy,
    );

    // Apply multiple job type filter (API only supports single jobType)
    // If more than one job type is selected, filter the rest client-side
    const selectedJobTypes =
      filters.locationType.length > 0 ? filters.locationType : filters.location;

    if (selectedJobTypes.length > 1) {
      // Normalize job types for comparison
      const normalizedSelected = selectedJobTypes.map((jt) =>
        jt.toLowerCase().replace(/[-\s]/g, ""),
      );

      filtered = filtered.filter((job) => {
        if (!job.jobType) return false;
        const normalizedJobType = job.jobType
          .toLowerCase()
          .replace(/[-\s]/g, "");
        return normalizedSelected.includes(normalizedJobType);
      });
    }

    // Apply rating filter (not supported by API)
    if (filters.rating.length > 0) {
      filtered = filtered.filter(
        (job) => job.rating && filters.rating.includes(Math.floor(job.rating)),
      );
    }

    // Apply budget type filter (not supported by API)
    if (filters.budgetType) {
      filtered = filtered.filter(
        (job) => job.budgetType === filters.budgetType,
      );
    }

    // Apply sorting
    if (sortOption === SORT_OPTIONS.DATE) {
      filtered.sort(
        (a, b) =>
          new Date(b.postedTime || "").getTime() -
          new Date(a.postedTime || "").getTime(),
      );
    } else if (sortOption === SORT_OPTIONS.SALARY) {
      filtered.sort(
        (a, b) => parseFloat(b.salary || "0") - parseFloat(a.salary || "0"),
      );
    } else if (sortOption === SORT_OPTIONS.DISTANCE) {
      // Distance-based sorting is not yet implemented; fall back to default (relevance) order.
      filtered.sort(
        (a, b) => (a.location || "").length - (b.location || "").length,
      );
    }
    // Relevance is default, no sorting needed

    return filtered;
  }, [jobs, filters, sortOption]);

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
        }),
      )
      : [];
  });

  // Calculate total pages based on filtered jobs
  useEffect(() => {
    setTotalPages(Math.ceil(filteredJobs.length / 4));
  }, [filteredJobs]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortOption]);
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
    scrollToTop();
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
          (item) => JSON.stringify(item.filters) !== JSON.stringify(filters),
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
          title="Search Resultss"
          isShowBreadcrumb={false}
          description={`${filteredJobs.length} jobs found`}
          isShowSort={false}
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
                className={`w-4 h-4 transition-transform ${showAdvancedSearch ? "rotate-180" : ""
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
                userSkills={profile?.jobSkills || []}
                userTools={profile?.tools || []}
                navigateToJob={`${absoluteUrls.engineer.home.my_jobs}/${job.id}`}
              />
            ))}
            {currentJobs.length > 0 ? (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            ) : (
              <div className="col-span-full flex justify-center items-center min-h-[15rem]">
                <p className="text-gray-500 dark:text-gray-400 text-lg text-center">
                  No jobs found. Try adjusting your filters.
                </p>
              </div>
            )}
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
