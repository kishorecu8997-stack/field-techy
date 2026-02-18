import { absoluteUrls } from "@/config/urls";
import { earningsData, userData } from "@/dummy_data/jobDetails";
import { useEngineerSearchJobs } from "@/shared/apiServices/engineer/engineerOpenApiService";
import AllowAccessPopup from "@/shared/components/commonUI/AllowAccessPopup";
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
  const { data: jobsResponse } = useEngineerSearchJobs({});

  // Transform API response to UI model
  const jobs = useMemo(() => {
    if (!jobsResponse) return [];

    return jobsResponse.map((job): JobItem => {
      const clientDetails = job.clientDetails;

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
        experience: job.experienceLevelId || 0,
        salary: job.totalPrice,
        status: job.status || "NEW",
        skills: [],
        tools: [],
        toolImage: null,
        toolAdditionalBudget: null,
        postedTime: job.createdAt || new Date().toISOString(),
        jobDuration: "10 Days",
        budgetType: null,
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
      jobs?.filter((job) => job.status === "Posted" || job.status === "NEW") ||
      []
    );
  }, [jobs]);

  const recommendedJobs = useMemo(() => {
    return (
      jobs?.filter((job) => job.status === "Posted" || job.status === "NEW") ||
      []
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

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <JobExplorationBanner />
            {findNewJobs.length > 0 && (
              <FeaturedJobs
                jobs={findNewJobs}
                userSkills={[]}
                userTools={profile?.tools || []}
                title="Featured Jobs"
                onViewAll={handleExploreJobs}
              />
            )}

            {paginatedRecommendedJobs.length > 0 && (
              <RecommendedJobs
                jobs={paginatedRecommendedJobs}
                userSkills={[]}
                userTools={profile?.tools || []}
                onViewAll={handleExploreJobs}
                title="Recommended Jobs"
                totalJobs={recommendedJobs.length}
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
              <SidebarProfile user={userData} earnings={earningsData} />
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
