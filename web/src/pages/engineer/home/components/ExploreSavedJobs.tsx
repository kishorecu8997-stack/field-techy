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
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import { Button } from "@/shared/components/commonUI/Buttons";

/**
 * explore jobs page component
 *
 * @returns {JSX.Element} Rendered application component
 */
const ExploreSavedJobs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
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

  const {
    data,
    refetch,
    isLoading: savedJobsLoading,
  } = useGetEngineerSavedJobs({
    limit: 10,
    page: currentPage,
    jobType: (filters.jobTypeEnum as JobType) || null,
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
        currencySymbol: job.currencySymbol ?? "$",
        budgetType: job.rateCardId ? String(job.rateCardId) : null,
        isSaved: job.isSaved,
        status: job.status || "",

        skills:
          job.skills?.map((skillId: number) => {
            const found = skillsData?.find((s) => s.id === skillId);
            return found?.name ?? String(skillId);
          }) ?? null,

        tools:
          job.tools?.map((tool) => {
            const found = toolsData?.find((s) => s.id === tool.toolId);
            return found?.name ?? String(tool.toolId);
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
  }, [data, skillsData, toolsData]);

  const totalCount = data?.total ?? 0;

  const jobsPerPage = 10;

  const totalPages = useMemo(() => {
    return Math.ceil(totalCount / jobsPerPage);
  }, [totalCount]);

  const paginatedJobs = savedJobs;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToTop();
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    scrollToTop();
  };

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
          isShowSort={false}
          isShowBreadcrumb={false}
          description={`${data?.summary?.savedJobsCount} saved job${
            data?.summary?.savedJobsCount !== 1 ? "s" : ""
          }`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
          {/* LEFT SIDE (Jobs Listing) */}
          <div className="lg:col-span-3">
            {savedJobsLoading ? (
              /* This centers the loader horizontally and vertically */
              <div className="flex h-64 w-full items-center justify-center">
                <LoaderComponent />
              </div>
            ) : paginatedJobs.length > 0 ? (
              paginatedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  showBookmark={true}
                  navigateToJob={`${absoluteUrls.engineer.home.my_jobs}/${job.id}`}
                  onBookmarkChange={refetch}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  No jobs found.
                </p>
                <p className="mt-4 mb-2 text-gray-500 dark:text-gray-300">
                  Browse jobs and click the bookmark icon to save them here!
                </p>
                <Button
                  onClick={handleClearAllFilters}
                  variant="primary"
                  size="lg"
                >
                  Clear all filters
                </Button>
              </div>
            )}

            {/* Pagination Component */}
            {paginatedJobs.length > 0 && totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
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
