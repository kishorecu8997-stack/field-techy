import { absoluteUrls } from "@/config/urls";
import FilterPanel from "@/pages/engineer/search_result/components/FilterPanel";
import JobCard from "@/pages/engineer/search_result/components/JobCard";
import Pagination from "@/pages/engineer/search_result/components/Pagination";
import {
  SORT_OPTIONS,
  type Filters,
} from "@/pages/engineer/search_result/types";
import {
  useGetEngineerSavedJobs,
  useLookupData,
} from "@/shared/apiServices/engineer/engineerOpenApiService";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { scrollToTop } from "@/utils";
import { useEffect, useMemo, useState } from "react";
import type { JobItem } from "../types";
import type { JobType } from "@/constants/jobTypes";

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
    jobTypeEnum: "",
  });

  const { data, refetch } = useGetEngineerSavedJobs({
    limit: 10,
    page: currentPage,
    jobType: filters.jobTypeEnum as JobType,
    serviceCategoryIds: filters.category || [],
    experienceLevelId: filters.experience || 0,
    skillIds: filters.skills || [],
  });

  const { data: skillsData } = useLookupData("skills");
  const { data: toolsData } = useLookupData("tools");

  useEffect(() => {
    scrollToTop();
    refetch();
  }, [filters, currentPage]);
  console.log(filters.jobTypeEnum);
  

  const savedJobs: JobItem[] = useMemo(() => {
    return (data?.data ?? []).map(
      (job): JobItem => ({
        id: String(job.id),
        jobCode: job.jobCode,
        clientId: String(job.clientId),
        jobTitle: job.jobTitle,
        jobDescription: job.jobDescription ?? "",
        category: job.serviceCategoryId,
        jobType: job.jobType,
        engagementModel: job.engagementModelId,
        countryId: job.countryId,
        stateId: job.stateId,
        cityId: job.cityId,
        location: job.workLocationName ?? null,
        startDate: job.startDate ?? "",
        endDate: job.endDate ?? null,
        numberOfVacancy: job.vacancies ?? 1,
        experience: job.experienceLevelId ?? null,
        salary: job.totalPrice ?? null,
        budgetType: job.rateCardId ? String(job.rateCardId) : null,

        status: job.status || "",

        skills:
          job.skills?.map((skillId: number) => {
            const found = skillsData?.find((s) => s.id === skillId);
            return found?.name ?? String(skillId);
          }) ?? null,

        tools:
          job.tools?.map((toolId: number) => {
            const found = toolsData?.find((s) => s.id === toolId);
            return found?.name ?? String(toolId);
          }) ?? null,
        postedTime: job.createdAt ?? "",
        jobDuration: "",
        rating: Number(job.clientDetails?.averageRating ?? undefined),
        slaLevel: undefined,

        client: {
          id: String(job.clientDetails?.id ?? ""),
          clientType: job.clientDetails?.clientType ?? "",
          companyName: job.clientDetails?.companyName ?? "",
          contactPersonName: job.clientDetails?.personName ?? "",

          email: job.clientDetails?.email ?? "",
          phoneNumber: job.clientDetails?.phoneNumber ?? "",
          country: "",
          state: "",
          city: "",
          postalCode: "",
          address: job.clientDetails?.address ?? "",
        },

        assignmentId: job.assignmentId ?? null,
        assignmentType:
          job.assignmentStatus === "invited"
            ? "invitation"
            : job.assignmentStatus === "applied"
              ? "application"
              : null,
      }),
    );
  }, [data]);

  const totalCount = data?.total ?? 0;

  const jobsPerPage = 10;

  const totalPages = useMemo(() => {
    return Math.ceil(totalCount / jobsPerPage);
  }, [totalCount]);

  const paginatedJobs = savedJobs;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
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
      jobTypeEnum: "",
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
          description={`${data?.summary?.savedJobsCount} saved job${
            data?.summary?.savedJobsCount !== 1 ? "s" : ""
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
            {paginatedJobs.length > 0 && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>

          {/* RIGHT SIDE (Filters) */}
          <div className="lg:col-span-1 sticky top-20 h-fit">
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
