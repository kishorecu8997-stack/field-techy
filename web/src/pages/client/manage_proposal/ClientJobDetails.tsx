import { earningsData } from "@/dummy_data/jobDetails";
import { isDummyNetworkEngineerJob } from "@/constants/dummyJobs";
import JobHeaderCard from "@/pages/engineer/my_job/job_details_components/jobHeaderComponents/JobHeaderCard";
import JobTabSection from "@/pages/client/my_job_client/components/JobTabSection";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import SidebarJobPostWallet from "@/shared/components/SidebarJobPostWallet";
import {
  useClientGetAssignmentDetails,
  useClientGetJobs,
} from "@/shared/apiServices/client/clientOpenApiService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { JobStatus } from "../my_job_client/types.d";
import type { AssignmentStatus } from "../search_result/types";
import type { OfferedJobStatusType } from "../../engineer/my_job/types.d";
import ChatForJobs from "@/shared/components/ChatForJobs";
import { JOB_TAB_LABELS } from "@/shared/constants/jobTabs";

/**
 * Page component displaying detailed information about a specific job.
 * Uses API data from useClientGetJobs hook.
 * @returns {JSX.Element} Job details page layout.
 */
const ClientJobDetails = () => {
  const params = useParams();
  const jobIdParam = params.jobId;

  const [isWorkSubmitted, setIsWorkSubmitted] = useState(false);
  const [isSendProposal, setIsSendProposal] = useState(false);
  const [activeTab, setActiveTab] = useState(JOB_TAB_LABELS.timeline);
  const [OfferJobStatus, setOfferJobStatus] = useState<
    OfferedJobStatusType | AssignmentStatus | undefined
  >(undefined);

  const [openChatJobId, setOpenChatJobId] = useState<string | null>(null);
  const [breadcrumbExtra, setBreadcrumbExtra] = useState<string | null>(null);

  // Dynamic heading
  const [pageHeading, setPageHeading] = useState<string>("Job Details");

  const jobId = Number(params.jobId);

  // Fetch assignment details using jobId
  const {
    data: assignmentData,
    isLoading,
    error,
  } = useClientGetAssignmentDetails({ jobId }, !!jobId);

  // Fallback to useClientGetJobs if needed for job details
  const { data: jobsData } = useClientGetJobs(true);
  const jobsArray = Array.isArray(jobsData) ? jobsData : [];
  const job = jobsArray.find(
    (j: { id?: string | number }) => Number(j.id) === jobId,
  );

  // Get the first assignment from the assignment data
  const assignments = Array.isArray(assignmentData) ? assignmentData : [];
  const firstAssignment = assignments[0];
  const assignmentId = firstAssignment?.assignmentId;

  // Check if this is the dummy Network Engineer job
  const isDummyNetworkEngineer = job
    ? isDummyNetworkEngineerJob(job.id)
    : false;

  // Set default tab based on job type - moved to useEffect to avoid setState during render
  useEffect(() => {
    if (isDummyNetworkEngineer && activeTab === "Job Information") {
      setActiveTab("Job Overview");
    }
  }, [isDummyNetworkEngineer, activeTab]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4 py-6 md:px-6">
          <div className="w-full sticky top-[60px] z-10 bg-gray-100 dark:bg-gray-900">
            <MyJobsHeader
              title="Job Details"
              isReport={false}
              isShowBreadcrumb
              customLabels={{
                [params.jobId || ""]: "Loading...",
              }}
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
  if (error || !job) {
    return (
      <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4 py-6 md:px-6">
          <div className="w-full sticky top-[60px] z-10 bg-gray-100 dark:bg-gray-900">
            <MyJobsHeader
              title="Job Details"
              isReport={false}
              isShowBreadcrumb
              customLabels={{
                [params.jobId || ""]: "Job not found",
              }}
            />
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="text-red-600 dark:text-red-400">
              {error ? "Error loading job details" : "Job not found"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Format duration from startDate and endDate
  let durationDisplay = "Not specified";
  if (job.startDate && job.endDate) {
    const startDate = new Date(job.startDate);
    const endDate = new Date(job.endDate);
    durationDisplay = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  } else if (job.startDate) {
    durationDisplay = `Starts: ${new Date(job.startDate).toLocaleDateString()}`;
  }

  // Get status or default to Posted
  const jobStatus = job.status || "Posted";

  // Chat toggle function
  const handleToggleChat = (jobId: string) => {
    setOpenChatJobId((prev) => {
      const isOpening = prev !== jobId;
      if (isOpening) {
        setBreadcrumbExtra("chats");
        setPageHeading("Chats");
        return jobId;
      } else {
        setBreadcrumbExtra(null);
        setPageHeading("Job Details");
        return null;
      }
    });
  };

  // Close chat handler
  const handleCloseChat = () => {
    setOpenChatJobId(null);
    setBreadcrumbExtra(null);
    setPageHeading("Job Details");
  };

  // Breadcrumb segments for MyJobsHeader
  const segments = [
    "Client",
    "my-jobs",
    params.jobId ?? "",
    breadcrumbExtra === "chats" ? "Chats" : null,
  ].filter((v): v is string => typeof v === "string");

  return (
    <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <div className="w-full sticky top-[60px] z-10 bg-gray-100 dark:bg-gray-900">
          <MyJobsHeader
            title={pageHeading}
            isReport={false}
            isShowBreadcrumb
            customLabels={{
              [params.jobId || ""]: job.jobTitle || "Job",
            }}
            segments={segments}
            isChatVisible={!!openChatJobId}
            handleCloseChat={handleCloseChat}
          />
        </div>
        {openChatJobId ? (
          <div className="flex-1 overflow-y-auto">
            <ChatForJobs jobId={openChatJobId} currentUser="Client" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 space-y-6">
              <JobHeaderCard
                title={job.jobTitle}
                client=""
                duration={durationDisplay}
                type={job.jobType}
                status={jobStatus}
                setIsWorkSubmitted={setIsWorkSubmitted}
                setSendProposal={setIsSendProposal}
                isSendProposal={isSendProposal}
                setActiveTab={setActiveTab}
                setOfferJobStatus={setOfferJobStatus}
                OfferJobStatus={OfferJobStatus}
                hideBreakDetails={isDummyNetworkEngineer}
                hideDurationAndClient={isDummyNetworkEngineer}
                jobLocation={undefined}
                numberOfVacancy={undefined}
                numberOfApplicants={undefined}
                jobId={jobIdParam!}
                onToggleChat={handleToggleChat}
              />
              <JobTabSection
                status={(jobStatus as JobStatus) || "Posted"}
                isWorkSubmitted={isWorkSubmitted}
                isSendProposal={isSendProposal}
                activeTab={activeTab}
                OfferJobStatus={OfferJobStatus}
                isDummyNetworkEngineer={isDummyNetworkEngineer}
                showManageProposals={true}
                job={job}
                assignmentId={assignmentId}
              />
            </div>
            <SidebarJobPostWallet earnings={earningsData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientJobDetails;
