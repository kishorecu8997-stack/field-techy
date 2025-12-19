import { absoluteUrls } from "@/config/urls";
import { sampleJobs } from "@/dummy_data/searchData";
import FilterPanel from "@/pages/engineer/search_result/components/FilterPanel";
import JobCard from "@/pages/engineer/search_result/components/JobCard";
import Pagination from "@/pages/engineer/search_result/components/Pagination";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import {
  JOB_STATUSES,
  SORT_OPTIONS,
  type Filters,
  type Job,
  type SortOption,
} from "@/pages/engineer/search_result/types";
import React, { useMemo, useState } from "react";
import { Button } from "@/shared/components/commonUI/Buttons";

/**
 * ExploreJobs Page - Browse and filter open job listings
 */
const ExploreJobs: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>(SORT_OPTIONS.RELEVANCE);
  const [filters, setFilters] = useState<Filters>({
    location: [],
    category: [],
    rating: [],
    experience: 0,
    budgetType: null,
    skills: [],
  });
  // Step 1: Base - Only show jobs with status "new"
  const newJobs = useMemo<Job[]>(() => {
    return sampleJobs.filter((job) => job.status === JOB_STATUSES.new);
  }, []);
  // Step 2: Apply filters
  const filteredJobs = useMemo<Job[]>(() => {
    return newJobs.filter((job) => {
      // Location filter
      if (filters.location.length > 0 && job.location) {
        if (!filters.location.includes(job.location)) return false;
      }

      // Category filter
      if (filters.category.length > 0 && job.category) {
        if (!filters.category.includes(job.category)) return false;
      }

      // Skills filter (at least one match required)
      if (filters.skills.length > 0 && job.skills) {
        const hasMatchingSkill = job.skills.some((skill) =>
          filters.skills.includes(skill)
        );
        if (!hasMatchingSkill) return false;
      }

      // Experience filter
      if (filters.experience > 0 && job.experience !== undefined) {
        if (job.experience < filters.experience) return false;
      }

      // Budget type filter
      if (filters.budgetType && job.budgetType !== filters.budgetType) {
        return false;
      }

      // Rating filter (minimum selected rating)
      if (filters.rating.length > 0 && job.rating !== undefined) {
        const minRequiredRating = Math.max(...filters.rating);
        if (job.rating < minRequiredRating) return false;
      }

      return true;
    });
  }, [newJobs, filters]);

  // Step 3: Apply sorting
  const sortedJobs = useMemo<Job[]>(() => {
    const jobsCopy = [...filteredJobs];
    const parseRelativeTime = (timeStr?: string): number => {
      if (!timeStr) return Infinity;
      const str = timeStr.toLowerCase().trim();
      if (str === "just now" || str.includes("second")) return 0;
      if (str.includes("min")) {
        const match = str.match(/(\d+)\s*min/);
        return match ? parseInt(match[1]) : Infinity;
      }
      if (str.includes("hour")) {
        const match = str.match(/(\d+)\s*hour/);
        return match ? parseInt(match[1]) * 60 : Infinity;
      }
      if (str.includes("day")) {
        const match = str.match(/(\d+)\s*day/);
        return match ? parseInt(match[1]) * 1440 : Infinity;
      }
      if (str.includes("week")) {
        const match = str.match(/(\d+)\s*week/);
        return match ? parseInt(match[1]) * 10080 : Infinity;
      }
      return Infinity;
    };
    const extractSalaryNumber = (salary?: string): number => {
      if (!salary) return 0;
      const num = parseInt(salary.replace(/[^0-9]/g, ""), 10);
      return isNaN(num) ? 0 : num;
    };

    switch (sortBy) {
      case SORT_OPTIONS.RELEVANCE:
        return jobsCopy.sort((a, b) => {
          // Primary: Higher rating
          const ratingDiff = (b.rating || 0) - (a.rating || 0);
          if (ratingDiff !== 0) return ratingDiff;
          // Secondary: More recent
          return (
            parseRelativeTime(a.postedTime) - parseRelativeTime(b.postedTime)
          );
        });

      case SORT_OPTIONS.DATE:
        return jobsCopy.sort(
          (a, b) =>
            parseRelativeTime(a.postedTime) - parseRelativeTime(b.postedTime)
        );

      case SORT_OPTIONS.SALARY:
        return jobsCopy.sort(
          (a, b) =>
            extractSalaryNumber(b.salary) - extractSalaryNumber(a.salary)
        );

      case SORT_OPTIONS.DISTANCE:
        // Prioritize remote jobs, then closer locations
        return jobsCopy.sort((a, b) => {
          const aIsRemote =
            a.type === "remote" || a.location?.toLowerCase() === "remote";
          const bIsRemote =
            b.type === "remote" || b.location?.toLowerCase() === "remote";
          if (aIsRemote && !bIsRemote) return -1;
          if (!aIsRemote && bIsRemote) return 1;
          // Simple city-based distance (expand as needed)
          const distances: Record<string, number> = {
            chennai: 0,
            "tamil nadu": 50,
            bangalore: 200,
            hyderabad: 320,
            mumbai: 640,
            delhi: 1100,
          };
          const locA = (a.location || "").toLowerCase();
          const locB = (b.location || "").toLowerCase();
          const distA = distances[locA] ?? 9999;
          const distB = distances[locB] ?? 9999;
          return distA - distB;
        });
      default:
        return jobsCopy;
    }
  }, [filteredJobs, sortBy]);

  // Step 4: Pagination
  const jobsPerPage = 4;
  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);
  const paginatedJobs = useMemo<Job[]>(() => {
    const start = (currentPage - 1) * jobsPerPage;
    return sortedJobs.slice(start, start + jobsPerPage);
  }, [sortedJobs, currentPage]);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1);// reset page on filter change
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
  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-9xl px-2 py-2 md:px-2">
        <MyJobsHeader
          title="Explore Jobs"
          description={`${sortedJobs.length} job${
            sortedJobs.length !== 1 ? "s" : ""
          } found`}
          isShowBreadcrumb={false}
          isShowSort={true}
          isReport={true}
          currentSort={sortBy}
          onSortChange={handleSortChange}
        />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Job Listings - Now shows up to 15 jobs per page */}
          <section className="lg:col-span-3">
            <div className="space-y-6">
              {paginatedJobs.length > 0 ? (
                paginatedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    navigateToJob={`${absoluteUrls.engineer.home.my_jobs}/${job.id}`}
                  />
                ))
              ) : (
                <div className="rounded-lg bg-white p-12 text-center shadow dark:bg-gray-800">
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    No jobs match your current filters.
                  </p>
                  <Button
                    onClick={handleClearAllFilters}
                    className="mt-6 text-lg font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400"
                  >
                    Clear all filters
                  </Button>
                  
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-10">
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
