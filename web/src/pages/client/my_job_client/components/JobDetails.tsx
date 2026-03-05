import { earningsData } from "@/dummy_data/jobDetails";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import SidebarJobPostWallet from "@/shared/components/SidebarJobPostWallet";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { SORT_OPTIONS } from "../../search_result/types";
import JobCardDetailsHeader from "./JobCardDetailsHeader";
import JobTabSection from "./JobTabSection";
import { useClientGetJobs } from "@/shared/apiServices/client/clientOpenApiService";
import ChatForJobs from "@/shared/components/ChatForJobs";
import { JOB_TAB_LABELS } from "@/shared/constants/jobTabs";

/**
 * `JobsDetails` is a page component that displays detailed information about a specific job.
 * Uses API data from useClientGetJobs hook.
 */
const JobsDetails: React.FC = () => {
  const params = useParams();
  const [activeTab] = useState(JOB_TAB_LABELS.timeline);
  const jobId = params.jobId;
  const [pageHeading, setPageHeading] = useState("Job Details");
  const [breadcrumbExtra, setBreadcrumbExtra] = useState<string | null>(null);

  // Fetch jobs data from API
  const {
    data: jobsData,
    isLoading,
    error,
    isError,
    refetch,
  } = useClientGetJobs(true);
  // Find the specific job from the API data
  const jobsArray = Array.isArray(jobsData) ? jobsData : [];
  const job =
    jobsArray.find((j: { id?: string | number }) => String(j.id) === jobId) ||
    jobsArray[0];
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen transition-colors duration-200">
        <div className="container mx-auto px-4 py-6">
          <div className="w-full sticky top-[80px] z-10 bg-gray-100 dark:bg-gray-900">
            <MyJobsHeader
              title="Job Details"
              currentSort={SORT_OPTIONS.NEWEST}
              isShowSort={false}
              onSortChange={() => {}}
            />
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600 dark:text-gray-400">
              Loading job details...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen transition-colors duration-200">
        <div className="container mx-auto px-4 py-6">
          <div className="w-full sticky top-[80px] z-10 bg-gray-100 dark:bg-gray-900">
            <MyJobsHeader
              title="Job Details"
              currentSort={SORT_OPTIONS.NEWEST}
              isShowSort={false}
              onSortChange={() => {}}
            />
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="text-red-600 dark:text-red-400">
              Error loading job details
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No job found
  if (!job) {
    return (
      <div className="min-h-screen transition-colors duration-200">
        <div className="container mx-auto px-4 py-6">
          <div className="w-full sticky top-[80px] z-10 bg-gray-100 dark:bg-gray-900">
            <MyJobsHeader
              title="Job Details"
              currentSort={SORT_OPTIONS.NEWEST}
              isShowSort={false}
              onSortChange={() => {}}
            />
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600 dark:text-gray-400">
              {jobsArray.length > 0
                ? `Job with ID ${jobId} not found. Available IDs: ${jobsArray.map((j: { id: number }) => j.id).join(", ")}`
                : "No jobs found for this client"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Format duration
  let durationDisplay = "Not specified";
  if (job.startDate && job.endDate) {
    const startDate = new Date(job.startDate);
    const endDate = new Date(job.endDate);
    durationDisplay = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  } else if (job.startDate) {
    durationDisplay = `Starts: ${new Date(job.startDate).toLocaleDateString()}`;
  }

  // Transform API job to component format
  const formattedJob = {
    id: job.id,
    title: job.jobTitle || "Untitled Job",
    duration: durationDisplay,
    client: "N/A (This is your job)",
    type: job.jobType || "Remote",
    status: job.status || "Posted",
  };

  // Build manual breadcrumb segments for client
  const segments = [
    "client",
    "my-jobs",
    params.jobId ? params.jobId : "",
    breadcrumbExtra === "chats" ? "Chats" : null,
  ].filter((v): v is string => typeof v === "string");

  // Update heading when chat is toggled
  const handleToggleChat = () => {
    setBreadcrumbExtra("chats");
    setPageHeading("Chats");
  };
  const handleCloseChat = () => {
    setBreadcrumbExtra(null);
    setPageHeading("Job Details");
  };

  return (
    <div className="min-h-screen transition-colors duration-200">
      <div className="container mx-auto px-4 py-6">
        <div className="w-full sticky top-[80px] z-10 bg-gray-100 dark:bg-gray-900">
          <MyJobsHeader
            title={pageHeading}
            currentSort={SORT_OPTIONS.NEWEST}
            isShowSort={false}
            onSortChange={() => {}}
            segments={segments}
            isChatVisible={breadcrumbExtra === "chats"}
            handleCloseChat={handleCloseChat}
          />
        </div>
        {breadcrumbExtra === "chats" ? (
          <div className="flex-1 overflow-y-auto">
            <ChatForJobs jobId={String(params.jobId)} currentUser="Client" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <JobCardDetailsHeader
                  job={formattedJob}
                  isLoading={isLoading}
                  isError={isError}
                  refetch={refetch}
                />
                <div className="space-y-6 pt-2">
                  <JobTabSection
                    status={formattedJob.status}
                    activeTab={activeTab}
                    job={job}
                    assignmentId={
                      job.assignmentIds?.[0]
                        ? Number(job.assignmentIds[0])
                        : Number(jobId)
                    }
                    onToggleChat={handleToggleChat}
                  />
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-6 pt-2">
                <SidebarJobPostWallet earnings={earningsData} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsDetails;
