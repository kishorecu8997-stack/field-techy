import { absoluteUrls } from "@/config/urls";
import { useEngineerSearchJobs } from "@/shared/apiServices/engineer/engineerOpenApiService";
import AllowAccessPopup from "@/shared/components/commonUI/AllowAccessPopup";
import ErrorState from "@/shared/components/commonUI/ErrorState";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import { useFCM } from "@/shared/hooks/useFCM";
import { useGeolocation } from "@/shared/hooks/useGeolocation";
import { useDeviceStore } from "@/shared/store/useDeviceStore";
import { useEngineerProfile } from "@/shared/store/useEngineerStore";
import { scrollToTop } from "@/utils";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarProfile from "../my_job/my_job_components/SidebarProfile";
import Pagination from "../search_result/components/Pagination";
import { FeaturedJobs } from "./components/FeaturedJobs";
import JobExplorationBanner from "./components/JobExplorationBanner";
import { RecommendedJobs } from "./components/RecommendedJobs";
import type { JobItem } from "./types";

/**
 * Home page component.
 *
 * @component
 * @returns {JSX.Element} The home page UI.
 */
const Home = () => {
  useEffect(() => {
    scrollToTop();
  }, []);
  const navigate = useNavigate();

  // Use engineer search jobs to fetch available jobs
  const {
    data: jobsResponse,
    isLoading,
    isError,
    refetch,
  } = useEngineerSearchJobs({});

  // Transform API response to UI model
  const jobs = useMemo(() => {
    if (!jobsResponse) return [];

    return jobsResponse.map((job): JobItem => {
      const clientDetails = job.clientDetails;
      const pay = job.totalPrice;
      const currencySymbol = job.currencySymbol ?? "$";

      // const formattedPay = formatAmount(pay, currencySymbol);

      return {
        id: job.id.toString(),
        jobCode: job.jobCode,
        clientId: job.clientId.toString(),
        jobTitle: job.jobTitle,
        jobDescription: job.jobDescription || "",
        category: job.serviceCategoryId,
        jobType: job.jobType,
        engagementModel: job.engagementModelId,
        countryId: job.countryId,
        stateId: job.stateId,
        cityId: job.cityId,
        location: job.workLocationName || null,
        startDate: job.startDate || new Date().toISOString(),
        endDate: job.endDate || null,
        numberOfVacancy: job.vacancies || 1,
        assignedEngineerCount:
          (job as unknown as { assignedEngineerCount?: number })
            .assignedEngineerCount || 0,
        experience: job.experienceLevelId || 0,
        salary: pay,
        currencySymbol: currencySymbol,
        status: job.status || "NEW",
        skills: [],
        tools: [],
        toolImage: null,
        toolAdditionalBudget: null,
        postedTime: job.createdAt || new Date().toISOString(),
        // jobDuration: "",
        budgetType: null,
        isSaved: job.isSaved,
        client: {
          id: job.clientId.toString(),
          clientType: clientDetails?.clientType || "unknown",
          companyName:
            clientDetails?.companyName ||
            clientDetails?.personName ||
            "Unknown",
          contactPersonName: clientDetails?.personName || "Unknown",
          email: clientDetails?.email || "",
          phoneNumber: clientDetails?.phoneNumber || "",
          state: "",
          city: "",
          country: "",
          postalCode: "",
          address: clientDetails?.address || "",
        },
        assignmentId: job.assignmentId,
        assignmentType: null,
      };
    });
  }, [jobsResponse]);

  const profile = useEngineerProfile();

  const handleExploreJobs = () => {
    scrollToTop();
    navigate(absoluteUrls.engineer.home.explore_jobs);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  const findNewJobs = useMemo(() => {
    return (
      jobs?.filter(
        (job) =>
          (job.status === "Posted" || job.status === "NEW") &&
          (job.assignedEngineerCount ?? 0) < job.numberOfVacancy,
      ) || []
    );
  }, [jobs]);

  const recommendedJobs = useMemo(() => {
    return (
      jobs?.filter(
        (job) =>
          (job.status === "Posted" || job.status === "NEW") &&
          (job.assignedEngineerCount ?? 0) < job.numberOfVacancy,
      ) || []
    );
  }, [jobs]);

  const totalPages = Math.ceil(recommendedJobs.length / jobsPerPage);

  const paginatedRecommendedJobs = useMemo(() => {
    const start = (currentPage - 1) * jobsPerPage;
    return recommendedJobs.slice(start, start + jobsPerPage);
  }, [recommendedJobs, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToTop();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderComponent />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <JobExplorationBanner />
            {isError && (
              <ErrorState
                title="Unable to Load Jobs"
                message="Something went wrong. Please try again later."
                onRetry={refetch}
              />
            )}
            {!isError && !jobsResponse?.length && (
              <p className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">
                <div className="font-semibold w-fit mx-auto border-2 border-gray-200 dark:border-gray-700 p-20 rounded-lg">
                  No jobs found.
                </div>
              </p>
            )}
            {findNewJobs.length > 0 && (
              <FeaturedJobs
                jobs={findNewJobs}
                userSkills={[]}
                userTools={profile?.tools || []}
                title="Featured Jobs"
                onViewAll={handleExploreJobs}
                bookMarkRefetch={refetch}
              />
            )}

            {paginatedRecommendedJobs.length > 0 && (
              <RecommendedJobs
                jobs={paginatedRecommendedJobs}
                userSkills={[]}
                userTools={profile?.tools || []}
                onViewAll={handleExploreJobs}
                title="Recommended Jobss"
                totalJobs={recommendedJobs.length}
                bookMarkRefetch={refetch}
              />
            )}
            {recommendedJobs.length > 5 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>

          {/* Sidebar - takes 1 column on large screens */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <SidebarProfile />
            </div>
          </div>

          {/* Permission management isolated in its own component to prevent Home re-renders */}
          <PermissionManager />
        </div>
      </div>
    </div>
  );
};

/**
 * Isolated component to handle permission checks and popup showing
 * This prevents the entire Home component from re-rendering when permissions change
 */
const PermissionManager = () => {
  const [accessPopup, setAccessPopup] = useState(false);
  const locationPermission = useDeviceStore(
    (state) => state.locationPermission,
  );
  const notificationPermission = useDeviceStore(
    (state) => state.notificationPermission,
  );
  const { checkPermission: checkLocationPermission } = useGeolocation();
  const { checkPermission: checkNotificationPermission } = useFCM();

  useEffect(() => {
    checkLocationPermission();
    checkNotificationPermission();
  }, [checkLocationPermission, checkNotificationPermission]);

  useEffect(() => {
    const onboardingsteps = localStorage.getItem("onboarding_guide") === "true";
    if (
      locationPermission === "prompt" ||
      notificationPermission === "default"
    ) {
      if (onboardingsteps) {
        setAccessPopup(true);
      }
    }
  }, [locationPermission, notificationPermission]);

  return (
    <AllowAccessPopup
      accessPopup={accessPopup}
      setAccessPopup={setAccessPopup}
    />
  );
};

export default Home;
