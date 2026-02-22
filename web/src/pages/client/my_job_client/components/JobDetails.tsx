import { earningsData } from "@/dummy_data/jobDetails";
import { sampleJobs } from "@/dummy_data/searchDataClient";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import SidebarJobPostWallet from "@/shared/components/SidebarJobPostWallet";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { SORT_OPTIONS, type JobStatus } from "../../search_result/types";
import JobCardDetailsHeader from "./JobCardDetailsHeader";
import JobTabSection from "./JobTabSection";

/**
 * `JobsDetails` is a page component that displays detailed information about a specific job.
 * It features a header with job status and actions, a filterable section for different job aspects
 * (like logs, submissions, etc.), and a sidebar with wallet information.
 * @returns {React.ReactElement} The rendered job details page.
 */
const JobsDetails: React.FC = () => {
  const params = useParams();
  const [isWorkSubmitted] = useState(false);
  const [isSendProposal] = useState(false);
  const [isJobAccepted] = useState(false);
  const [activeTab] = useState("Job Information");
  const [pageHeading, setPageHeading] = useState("Job Details");
  const [breadcrumbExtra, setBreadcrumbExtra] = useState<string | null>(null);

  const filter = () => {
    return sampleJobs.find((job) => {
      return job.id === Number(params.jobId);
    });
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
      <div className="container  mx-auto px-4 py-6">
        <div className="w-full sticky top-[80px] z-10 bg-gray-100 dark:bg-gray-900">
          <MyJobsHeader
            title={pageHeading}
            currentSort={SORT_OPTIONS.NEWEST}
            isReport={breadcrumbExtra !== "chats"}
            isShowSort={breadcrumbExtra !== "chats"}
            onSortChange={() => {}}
            segments={segments}
            isChatVisible={breadcrumbExtra === "chats"}
            handleCloseChat={handleCloseChat}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
              <JobCardDetailsHeader />
              <div className="space-y-6 pt-2">
                <JobTabSection
                  status={filter()?.status as JobStatus}
                  isWorkSubmitted={isWorkSubmitted}
                  isSendProposal={isSendProposal}
                  isJobAccepted={isJobAccepted}
                  activeTab={activeTab}
                  jobID={String(params.jobId)}
                  onToggleChat={handleToggleChat}
                />
                {/* {breadcrumbExtra === "chats" && (
                  <button
                    className="mt-2 px-4 py-2 bg-gray-200 rounded"
                    onClick={handleCloseChat}
                  >
                    Back to Job
                  </button>
                )} */}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-6 pt-2">
              <SidebarJobPostWallet earnings={earningsData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsDetails;
