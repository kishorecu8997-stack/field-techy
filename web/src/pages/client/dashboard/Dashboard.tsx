import { absoluteUrls } from "@/config/urls";
import { jobOverviewData } from "@/dummy_data/dashboard";
import { earningsData } from "@/dummy_data/jobDetails";
import {
  useClientGetAssignmentDetails,
  useClientGetCompanyInfo,
  useClientGetJobs,
  useClientJobOverviewDashboard,
  useClientExploreEngineers,
} from "@/shared/apiServices/client/clientOpenApiService";
import { useServiceCategories } from "@/shared/hooks/useLookup";
import { useLookupData } from "@/shared/apiServices/commonOpenApiService";
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

// Custom hook to fetch engineer count for a specific category
const useEngineerCountByCategory = (categoryId: number) => {
  const { data, isLoading } = useClientExploreEngineers(
    { page: 1, limit: 1, serviceCategoryId: categoryId },
    true,
  );
  return { count: data?.total ?? 0, isLoading };
};

// Component to display category with engineer count
interface CategoryWithCountProps {
  categoryId: number;
  categoryName: string;
}

const CategoryWithCount: React.FC<CategoryWithCountProps> = ({
  categoryId,
  categoryName,
}) => {
  const { count, isLoading } = useEngineerCountByCategory(categoryId);

  return (
    <ServiceCategoryCard
      id={categoryId}
      name={categoryName}
      engineers={
        isLoading
          ? "Loading..."
          : count > 0
            ? `${count} Engineers`
            : "No engineers"
      }
      categoryId={categoryId}
    />
  );
};

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

  // Fetch service categories from API
  const { data: serviceCategoriesData, isLoading: isLoadingCategories } =
    useLookupData("serviceCategories");

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

  // Fetch in-progress jobs from API with server-side filtering
  const { data: clientJobs } = useClientGetJobs({
    jobStatus: "In Progress",
    enabled: true,
  });
  const { data: serviceCategories } = useServiceCategories();

  // Get in-progress job IDs for fetching assignments
  const inProgressJobIds = useMemo(() => {
    if (!clientJobs) return [];
    return clientJobs
      .filter((job) => job.status === "In Progress")
      .slice(0, 4)
      .map((job) => job.id);
  }, [clientJobs]);

  // Fetch assignments for each in-progress job (max 4 jobs)
  // Call hooks at top level with enabled flag to avoid calls when jobId is undefined
  const assignmentData1 = useClientGetAssignmentDetails(
    { jobId: inProgressJobIds[0] },
    !!inProgressJobIds[0],
  );
  const assignmentData2 = useClientGetAssignmentDetails(
    { jobId: inProgressJobIds[1] },
    !!inProgressJobIds[1],
  );
  const assignmentData3 = useClientGetAssignmentDetails(
    { jobId: inProgressJobIds[2] },
    !!inProgressJobIds[2],
  );
  const assignmentData4 = useClientGetAssignmentDetails(
    { jobId: inProgressJobIds[3] },
    !!inProgressJobIds[3],
  );

  // Build a map of jobId to assignment data
  // Depend on individual data properties instead of the array for effective memoization
  const jobAssignmentsMap = useMemo(() => {
    const map = new Map<number, { avatars: string[]; count: number }>();

    const queries = [
      { data: assignmentData1.data, jobId: inProgressJobIds[0] },
      { data: assignmentData2.data, jobId: inProgressJobIds[1] },
      { data: assignmentData3.data, jobId: inProgressJobIds[2] },
      { data: assignmentData4.data, jobId: inProgressJobIds[3] },
    ];

    queries.forEach(({ data, jobId }) => {
      if (jobId && data) {
        const assignments = data;
        const validAssignments = assignments.filter(
          (a) =>
            a.engineer &&
            (a.assignmentStatus === "assigned" ||
              a.assignmentStatus === "start_pending_approval" ||
              a.assignmentStatus === "started" ||
              a.assignmentStatus === "submitted" ||
              a.assignmentStatus === "submit_pending_approval"),
        );
        const avatars = validAssignments
          .map((a) => a.engineer?.profilePictureUrl)
          .filter((url): url is string => !!url);
        map.set(jobId, {
          avatars,
          count: validAssignments.length,
        });
      }
    });
    return map;
  }, [
    inProgressJobIds,
    assignmentData1.data,
    assignmentData2.data,
    assignmentData3.data,
    assignmentData4.data,
  ]);

  // Memoized map of service category ID to name
  const serviceCategoryMap = useMemo(() => {
    const map = new Map<number, string>();
    if (serviceCategories) {
      serviceCategories.forEach((category) => {
        map.set(Number(category.id), category.name);
      });
    }
    return map;
  }, [serviceCategories]);

  // Helper function to get service category name from ID
  const getServiceCategoryName = (serviceCategoryId: number): string => {
    return (
      serviceCategoryMap.get(serviceCategoryId) ||
      `Service Category ${serviceCategoryId}`
    );
  };

  // Map in-progress jobs to Job type for display
  const inProgressJobsData = useMemo(() => {
    if (!clientJobs) return [];
    const inProgress = clientJobs.slice(0, 4);
    return inProgress.map((job): Job => {
      // Build location string - use workLocationName if available, otherwise try coordinates
      let locationText = job.workLocationName || "Location not specified";
      if (!job.workLocationName && job.workLocationLat && job.workLocationLng) {
        locationText = `${job.workLocationLat}, ${job.workLocationLng}`;
      }
      return {
        id: job.id,
        title: job.jobTitle,
        type:
          job.jobType === "On site"
            ? "on-site"
            : job.jobType === "Remote"
              ? "remote"
              : "hybrid",
        startDate: job.startDate
          ? new Date(job.startDate).toLocaleDateString()
          : "Not scheduled",
        location: locationText,
        workLocationName: job.workLocationName || null,
        cityId: job.cityId,
        stateId: job.stateId,
        countryId: job.countryId,
        duration: job.endDate
          ? job.startDate
            ? `${new Date(job.startDate).toLocaleDateString()} - ${new Date(job.endDate).toLocaleDateString()}`
            : `Not scheduled - ${new Date(job.endDate).toLocaleDateString()}`
          : "Duration not specified",
        serviceType: job.serviceCategoryId
          ? getServiceCategoryName(job.serviceCategoryId)
          : "Service not specified",
        pay:
          job.totalPrice != null
            ? `${job.currencySymbol || "$"}${job.totalPrice}`
            : "Price not set",
        status: "inprogress",
        engineerAvatars: jobAssignmentsMap.get(job.id)?.avatars || [],
        engineers: String(jobAssignmentsMap.get(job.id)?.count || 0),
      };
    });
  }, [clientJobs, serviceCategoryMap, jobAssignmentsMap]);
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

              {isLoadingCategories ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="rounded-xl overflow-hidden shadow-md animate-pulse"
                    >
                      <div className="w-full h-48 bg-gray-300 dark:bg-gray-700" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {serviceCategoriesData?.slice(0, 5).map((category) => (
                    <NavLink
                      key={category.id}
                      to={`${absoluteUrls.client.home.client_Explore_engineers}?category=${category.id}`}
                      onClick={() => scrollToTop()}
                    >
                      <CategoryWithCount
                        categoryId={category.id}
                        categoryName={category.name}
                      />
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">In-Progress Jobs</h2>
                <NavLink
                  to={`${absoluteUrls.client.home.my_jobs}?filter=In-Progress`}
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
