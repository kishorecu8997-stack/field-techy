import { absoluteUrls } from "@/config/urls";
import { jobOverviewData, serviceCategoriesData } from "@/dummy_data/dashboard";
import { earningsData } from "@/dummy_data/jobDetails";
import { sampleJobs } from "@/dummy_data/searchDataClient";
import {
  useClientGetCompanyInfo,
  useClientJobOverviewDashboard,
} from "@/shared/apiServices/client/clientOpenApiService";
import AllowAccessPopup from "@/shared/components/commonUI/AllowAccessPopup";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useFCM } from "@/shared/hooks/useFCM";
import { useGeolocation } from "@/shared/hooks/useGeolocation";
import { useClientCompanyInfoStore } from "@/shared/store/useClientCompanyInfoStore";
import { useDeviceStore } from "@/shared/store/useDeviceStore";
import React, { useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import SidebarJobPostWallet from "../../../shared/components/SidebarJobPostWallet";
import type { Job } from "../search_result/types";
import InProgressJobCard from "./components/InProgressJobCard";
import JobOverviewCard from "./components/JobOverview";
import ServiceCategoryCard from "./components/ServiceCategoryCard";
import { scrollToTop } from "@/utils";
import type { JobOverview } from "./type";

/**
 * `Dashboard` component serves as the main dashboard for the client user.
 * It displays an overview of jobs, service categories, and in-progress jobs.
 * It also includes a sidebar with wallet and job posting information.
 */
const Dashboard: React.FC = () => {
  const [accessPopup, setAccessPopup] = React.useState<boolean>(false);
  const { locationPermission, notificationPermission } = useDeviceStore();
  const { checkPermission: checkLocationPermission } = useGeolocation();
  const { checkPermission: checkNotificationPermission } = useFCM();
  const { setCompanyInfo } = useClientCompanyInfoStore();
  const { data: clientInfo } = useClientGetCompanyInfo();
  useEffect(() => {
    if (clientInfo) {
      setCompanyInfo(clientInfo);
    }
  }, [clientInfo, setCompanyInfo]);
  const { data: ClientJobOverview } = useClientJobOverviewDashboard();
  const summary = ClientJobOverview?.summary;

  const jobOverview: JobOverview[] = [
    { ...jobOverviewData[0], count: summary?.activeJobsCount ?? 0 },
    { ...jobOverviewData[1], count: summary?.completedJobsCount ?? 0 },
    { ...jobOverviewData[2], count: summary?.cancelledJobsCount ?? 0 },
  ];

  const inProgressJobsData = useMemo(
    () => sampleJobs.filter((job) => job.status === "inprogress"),
    [],
  );
  // Check actual browser permission states on mount and sync with store
  useEffect(() => {
    checkLocationPermission();
    checkNotificationPermission();
  }, [checkLocationPermission, checkNotificationPermission]);

  useEffect(() => {
    if (
      locationPermission === "prompt" ||
      notificationPermission === "default"
    ) {
      setAccessPopup(true);
    }
  }, [locationPermission, notificationPermission]);

  return (
    <div className=" bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Job Overview</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {jobOverview.map((job) => (
                <JobOverviewCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  count={job.count}
                  status={job.status}
                  buttonShow={job.buttonShow}
                />
              ))}
            </div>

            {/* Rest of your dashboard sections (unchanged) */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Service Categories</h2>
                <nav className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <NavLink
                    to={absoluteUrls.client.home.client_Explore_engineers}
                    onClick={() => scrollToTop()}
                    className="hover:text-teal-800 text-[1rem] whitespace-nowrap"
                  >
                    <Button
                      variant="link"
                      className="text-sm text-emerald-700 dark:text-emerald-400 hover:underline"
                    >
                      View all
                    </Button>
                  </NavLink>
                </nav>
              </div>

              <NavLink
                to={absoluteUrls.client.home.client_Explore_engineers}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 cursor-pointer hover:text-teal-800 text-[1rem] whitespace-nowrap"
              >
                {serviceCategoriesData.map((category) => (
                  <ServiceCategoryCard key={category.id} {...category} />
                ))}
              </NavLink>
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">In-Progress Jobs</h2>
                <NavLink
                  to={absoluteUrls.client.home.my_jobs}
                  onClick={() => scrollToTop()}
                  className="hover:text-teal-800 text-[1rem] whitespace-nowrap"
                >
                  <Button
                    variant="link"
                    className="text-sm text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    View all
                  </Button>
                </NavLink>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 cursor-pointer">
                {inProgressJobsData.map((job: Job) => (
                  <InProgressJobCard
                    key={job.id}
                    job={job}
                    navigateToJob={`${absoluteUrls.client.home.my_jobs}/${job.id}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <SidebarJobPostWallet earnings={earningsData} />
            </div>
          </div>
        </div>
      </div>

      <AllowAccessPopup
        accessPopup={accessPopup}
        setAccessPopup={setAccessPopup}
      />
    </div>
  );
};

export default Dashboard;
