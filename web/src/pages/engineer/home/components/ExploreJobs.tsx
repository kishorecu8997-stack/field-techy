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

/**
 * ExploreJobs Page - Browse and filter open job listings
 */
const ExploreJobs: React.FC = () => {
  const profile = useEngineerProfile();
  const { data: apiJobsResponse } = useEngineerSearchJobs({});

  const apiJobs = useMemo(() => {
    return (apiJobsResponse || []).map(mapApiJobToJobItem);
  }, [apiJobsResponse]);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>(SORT_OPTIONS.RELEVANCE);
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

  // Filter jobs by status NEW and add dummy job at the top
  const allNewJobs = useMemo(() => {
    const apiNewJobs = (apiJobs || []).filter((job) => job.status === "NEW");
    return apiNewJobs;
  }, [apiJobs]);

  // Step 2: Apply filters
  const filteredJobs = useMemo<JobItem[]>(() => {
    return allNewJobs.filter((job) => {
      // Location filter
      if (filters.location.length > 0 && job.location) {
        if (!filters.location.some((loc) => job.location?.includes(loc)))
          return false;
      }

      // Category filter
      if (filters.category.length > 0 && job.category) {
        if (!filters.category.includes(String(job.category))) return false;
      }

      // Skills filter (at least one match required)
      if (filters.skills.length > 0 && job.skills) {
        const hasMatchingSkill = job.skills.some((skill) =>
          filters.skills.includes(skill),
        );
        if (!hasMatchingSkill) return false;
      }

      // Experience filter
      if (filters.experience > 0 && job.experience !== undefined) {
        if (Number(job.experience) < filters.experience) return false;
      }

      // Budget type filter
      if (filters.budgetType && job.budgetType) {
        if (job.budgetType.toLowerCase() !== filters.budgetType.toLowerCase())
          return false;
      }

      // Rating filter (checks if job rating matches any selected rating)
      if (filters.rating.length > 0 && job.rating !== undefined) {
        if (!filters.rating.includes(Math.floor(job.rating))) return false;
      }

      return true;
    });
  }, [allNewJobs, filters]);

  const sortedJobs = useMemo<JobItem[]>(() => {
    const jobsCopy = [...filteredJobs];

    // Parse relative time string like "2 hours ago", "5 days ago", etc.
    const parseRelativeTime = (timeStr?: string): number => {
      if (!timeStr) return 0; // treat missing dates as "now"

      const str = timeStr.toLowerCase().trim();

      if (str === "just now" || str.includes("second")) return 0;

      if (str.includes("min")) {
        const match = str.match(/(\d+)\s*min/);
        return match ? parseInt(match[1], 10) : 0;
      }

      if (str.includes("hour")) {
        const match = str.match(/(\d+)\s*hour/);
        return match ? parseInt(match[1], 10) * 60 : 0;
      }

      if (str.includes("day")) {
        const match = str.match(/(\d+)\s*day/);
        return match ? parseInt(match[1], 10) * 1440 : 0;
      }

      if (str.includes("week")) {
        const match = str.match(/(\d+)\s*week/);
        return match ? parseInt(match[1], 10) * 10080 : 0;
      }

      console.warn(`Unrecognized time format: "${timeStr}"`);
      return 0; // fallback to "now"
    };

    // Extract numeric value from salary string
    const extractSalaryNumber = (job: JobItem): number => {
      const salaryStr = job.salary;
      if (!salaryStr) return 0;
      const num = parseFloat(salaryStr.replace(/[^0-9.]/g, ""));
      return isNaN(num) ? 0 : num;
    };

    switch (sortBy) {
      case SORT_OPTIONS.RELEVANCE:
        return jobsCopy.sort((a, b) => {
          const ratingDiff = (b.rating || 0) - (a.rating || 0);
          if (ratingDiff !== 0) return ratingDiff;
          return (
            parseRelativeTime(a.postedTime) - parseRelativeTime(b.postedTime)
          );
        });

      case SORT_OPTIONS.DATE:
        return jobsCopy.sort(
          (a, b) =>
            parseRelativeTime(a.postedTime) - parseRelativeTime(b.postedTime),
        );

      case SORT_OPTIONS.SALARY:
        return jobsCopy.sort(
          (a, b) => extractSalaryNumber(b) - extractSalaryNumber(a),
        );

      case SORT_OPTIONS.DISTANCE: {
        const isRemote = (job: JobItem) => {
          const loc = (job.location || "").toLowerCase();
          const type = (job.jobType || "").toLowerCase();
          return (
            type === "remote" ||
            loc.includes("remote") ||
            loc.includes("work from home") ||
            loc.includes("wfh") ||
            loc.includes("anywhere")
          );
        };

        return jobsCopy.sort((a, b) => {
          const aRemote = isRemote(a);
          const bRemote = isRemote(b);

          if (aRemote && !bRemote) return -1;
          if (!aRemote && bRemote) return 1;
          if (aRemote && bRemote) return 0;

          const USER_CITY = profile?.location || profile?.address;

          const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
            chennai: { lat: 13.0827, lng: 80.2707 },
            bangalore: { lat: 12.9716, lng: 77.5946 },
            hyderabad: { lat: 17.385, lng: 78.4867 },
            mumbai: { lat: 19.076, lng: 72.8777 },
            delhi: { lat: 28.7041, lng: 77.1025 },
            pune: { lat: 18.5204, lng: 73.8567 },
            kolkata: { lat: 22.5726, lng: 88.3639 },
            gurgaon: { lat: 28.4595, lng: 77.0266 },
            gurugram: { lat: 28.4595, lng: 77.0266 },
            noida: { lat: 28.5355, lng: 77.391 },
          };

          const getCityKey = (location: string): string | null => {
            const loc = location.toLowerCase().trim();
            if (CITY_COORDS[loc]) return loc;
            for (const city of Object.keys(CITY_COORDS)) {
              if (loc.includes(city)) return city;
            }
            if (loc.includes("tamil nadu") || loc.includes("tn"))
              return "chennai";
            if (loc.includes("karnataka")) return "bangalore";
            if (loc.includes("telangana")) return "hyderabad";
            if (loc.includes("maharashtra") && !loc.includes("pune"))
              return "mumbai";
            return null;
          };

          const cityA = getCityKey(a.location || "");
          const cityB = getCityKey(b.location || "");

          if (!cityA && !cityB) return 0;
          if (!cityA) return 1;
          if (!cityB) return -1;

          const userCoords = USER_CITY
            ? CITY_COORDS[USER_CITY.toLowerCase()]
            : null;
          if (!userCoords) return 0;

          const haversine = (
            c1: { lat: number; lng: number },
            c2: { lat: number; lng: number },
          ) => {
            const toRad = (x: number) => (x * Math.PI) / 180;
            const R = 6371;
            const dLat = toRad(c2.lat - c1.lat);
            const dLng = toRad(c2.lng - c1.lng);
            const a =
              Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(c1.lat)) *
              Math.cos(toRad(c2.lat)) *
              Math.sin(dLng / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
          };

          return (
            haversine(userCoords, CITY_COORDS[cityA]) -
            haversine(userCoords, CITY_COORDS[cityB])
          );
        });
      }

      default:
        return jobsCopy;
    }
  }, [filteredJobs, sortBy, profile]);

  // Step 4: Pagination
  const jobsPerPage = 4;
  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);
  const paginatedJobs = useMemo<JobItem[]>(() => {
    const start = (currentPage - 1) * jobsPerPage;
    return sortedJobs.slice(start, start + jobsPerPage);
  }, [sortedJobs, currentPage]);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-9xl px-2 py-2 md:px-2">
        <MyJobsHeader
          title="Explore Jobs"
          description={`${sortedJobs.length} job${sortedJobs.length !== 1 ? "s" : ""
            } found`}
          isShowBreadcrumb={false}
          isShowSort={true}
          isReport={true}
          currentSort={sortBy}
          onSortChange={handleSortChange}
        />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Job Listings - Now shows up to 4 jobs per page */}
          <section className="lg:col-span-3">
            <div className="space-y-6">
              {paginatedJobs.length > 0 ? (
                paginatedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    userSkills={profile?.jobSkills || []}
                    userTools={profile?.tools || []}
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
                    className="mt-6 text-lg font-medium  hover:text-teal-700 dark:text-teal-400"
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
