import { absoluteUrls } from "@/config/urls";
import { loginData } from "@/dummy_data/personalInfoData";
import { sampleJobs } from "@/dummy_data/searchData";
import FilterPanel from "@/pages/engineer/search_result/components/FilterPanel";
import JobCard from "@/pages/engineer/search_result/components/JobCard";
import Pagination from "@/pages/engineer/search_result/components/Pagination";
import {
  JOB_STATUSES,
  SORT_OPTIONS,
  type Filters,
  type Job,
  type SortOption,
} from "@/pages/engineer/search_result/types";
import { Button } from "@/shared/components/commonUI/Buttons";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import React, { useMemo, useState } from "react";
import type { JobItem } from "../types";


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

  // Keep only jobs that are NOT new or offer
  const allNewJobs = useMemo(() => {
    return sampleJobs.filter((job) => job.status === JOB_STATUSES.new);
  }, []);

  // Step 2: Apply filters
  const filteredJobs = useMemo<Job[]>(() => {
    return allNewJobs.filter((job) => {
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
  }, [allNewJobs, filters]);
  const sortedJobs = useMemo<Job[]>(() => {
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

    // Extract numeric value from salary string, fallback to "pay"
    const extractSalaryNumber = (job: Job): number => {
      const salaryStr = job.salary || job.pay; // use salary first, fallback to pay
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
            parseRelativeTime(a.postedTime) - parseRelativeTime(b.postedTime)
        );

      case SORT_OPTIONS.SALARY:
        return jobsCopy.sort(
          (a, b) => extractSalaryNumber(b) - extractSalaryNumber(a)
        );

      case SORT_OPTIONS.DISTANCE:
        const isRemote = (job: Job) => {
          const loc = (job.location || "").toLowerCase();
          const type = (job.type || "").toLowerCase();
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

          const USER_CITY = loginData[0]?.addressLocation;

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

          const userCoords = CITY_COORDS[USER_CITY];
          if (!userCoords) return 0;

          const haversine = (
            c1: { lat: number; lng: number },
            c2: { lat: number; lng: number }
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

      default:
        return jobsCopy;
    }
  }, [filteredJobs, sortBy, loginData]);

  // Helper to convert dummy Job to JobItem
  const mapJobToJobItem = (job: Job): JobItem => {
    return {
      id: String(job.id),
      clientId: "dummy-client",
      jobTitle: job.title || "Untitled Job",
      jobDescription: job.description || "",
      category: job.category || "",
      jobType: job.employmentType || "CONTRACT",
      jobVisibility: "PUBLIC",
      engagementModel: (job.type as string) || "ON_SITE",
      country: "Unknown",
      state: "Unknown",
      city: "Unknown",
      location: job.location || null,
      startDate: job.startDate || new Date().toISOString(),
      startTime: "09:00:00",
      numberOfVacancy: 1,
      timePeriodOfJob: job.duration || "",
      experience: job.experience || 0,
      salary: job.salary || job.pay || null,
      requirementDeliverable: "",
      otherDetails: "",
      rateCardRequiredSkill: "",
      rateCardExperienceLevel: "MID_LEVEL",
      projectDeadline: "",
      milestoneStructure: "",
      status: (job.status as string) || "NEW",
      featured: false,
      budgetType: job.budgetType || "HOURLY",
      skills: job.skills || [],
      tools: job.tools || [],
      toolImage: null,
      toolAdditionalBudget: null,
      postedTime: job.postedTime || new Date().toISOString(),
      jobDuration: job.duration || "",
      client: {
        id: "dummy-client-id",
        clientType: "COMPANY",
        businessType: "Unknown",
        companyName: job.company || job.client || "Hidden Client",
        contactPersonName: "Unknown",
        email: "hidden@example.com",
        phoneNumber: "",
        country: "",
        state: "",
        city: "",
        postalCode: "",
        address: "",
        industry: "",
        isApproved: true,
        enableNotifications: false,
        profilePicture: job.companyLogo || null,
        governmentIdProofDocument: null,
        certificationQualificationsDocument: null,
        taxDocumentVat: "",
        vatRegistrationNumber: "",
        password: null
      }
    };
  };

  // Step 4: Pagination
  const jobsPerPage = 4;
  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);
  const paginatedJobs = useMemo<JobItem[]>(() => {
    const start = (currentPage - 1) * jobsPerPage;
    return sortedJobs.slice(start, start + jobsPerPage).map(mapJobToJobItem);
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
