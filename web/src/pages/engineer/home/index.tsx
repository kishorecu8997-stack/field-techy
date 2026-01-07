import { absoluteUrls } from "@/config/urls";
import { earningsData, userData } from "@/dummy_data/jobDetails";
import { useGetJobs } from "@/shared/apiServices/client/clientService";
import { useEngineerGetById } from "@/shared/apiServices/engineer/engineerService";
import AllowAccessPopup from "@/shared/components/commonUI/AllowAccessPopup";
import { useFCM } from "@/shared/hooks/useFCM";
import { useGeolocation } from "@/shared/hooks/useGeolocation";
import { useDeviceStore } from "@/shared/store/useDeviceStore";
import { getUserId, scrollToTop } from "@/utils";
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
  const navigate = useNavigate();
  const { data: jobs } = useGetJobs();

  const userId = getUserId();
  if (!userId) return null;
  const { data: engineerJobs } = useEngineerGetById(userId);
  console.log("engineerJobs", engineerJobs);

  const handleExploreJobs = () => {
    scrollToTop();
    navigate(absoluteUrls.engineer.home.explore_jobs);
  };
  const currentPage = 1;
  const totalPages = 1;
  const handlePageChange = (page: number) => {
    console.log("Page changed to: ", page);
  };
  const findNewJobs = useMemo(() => {
    return jobs?.filter((job) => job.status === "NEW") || [];
  }, [jobs]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <JobExplorationBanner />
            <FeaturedJobs
              jobs={findNewJobs as JobItem[]}
              title="Featured Jobs"
              onViewAll={handleExploreJobs}
            />
            <RecommendedJobs
              jobs={[]}
              onViewAll={handleExploreJobs}
              title="Recommended Jobs"
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
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
  const locationPermission = useDeviceStore((state) => state.locationPermission);
  const notificationPermission = useDeviceStore((state) => state.notificationPermission);
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
