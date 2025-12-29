import { absoluteUrls } from "@/config/urls";
import { earningsData, userData } from "@/dummy_data/jobDetails";
import { sampleJobs } from "@/dummy_data/searchData";
import AllowAccessPopup from "@/shared/components/commonUI/AllowAccessPopup";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarProfile from "../my_job/my_job_components/SidebarProfile";
import Pagination from "../search_result/components/Pagination";
import { FeaturedJobs } from "./components/FeaturedJobs";
import JobExplorationBanner from "./components/JobExplorationBanner";
import { RecommendedJobs } from "./components/RecommendedJobs";
import { scrollToTop } from "@/utils";
import OnboardingFlowGuide from "./components/OnboardingFlowGuide";

/**
 * Home page component.
 *
 * @component
 * @returns {JSX.Element} The home page UI.
 */
const Home = () => {
  const navigate = useNavigate();
  const [accessPopup, setAccessPopup] = useState(false);
  const [onboarding, setOnboarding] = useState(false);

  const handleExploreJobs = () => {
    scrollToTop();
    navigate(absoluteUrls.engineer.home.explore_jobs);
  };
  const currentPage = 1;
  const totalPages = 1;
  const handlePageChange = (page: number) => {
    console.log("Page changed to: ", page);
  };
  const findNewJobs = sampleJobs.filter((job) => {
    return job.status === "new";
  });
  const recommendedJobs = findNewJobs.filter((job) => {
    return job.place === "recommended";
  });
  const featuredJobs = findNewJobs.filter((job) => {
    return job.place === "featured";
  });

  useEffect(() => {
    const locationPermission = localStorage.getItem("location_permission");
    const notificationPermission = localStorage.getItem(
      "notification_permission"
    );
    const onboardingsteps = localStorage.getItem("onboarding_guide") === "true";

    if (!locationPermission || !notificationPermission) {
      if (!onboardingsteps) {
        setOnboarding(true);
      } else {
        setAccessPopup(true);
      }
    }
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <JobExplorationBanner />
            <FeaturedJobs
              jobs={featuredJobs}
              title="Featured Jobs"
              onViewAll={handleExploreJobs}
            />
            <RecommendedJobs
              jobs={recommendedJobs}
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

          {/* Allow access popup */}
          <AllowAccessPopup
            accessPopup={accessPopup}
            setAccessPopup={setAccessPopup}
          />

          <OnboardingFlowGuide
            onBoardOpen={onboarding}
            setOnBoard={setOnboarding}
            setAccessPopup={setAccessPopup}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
