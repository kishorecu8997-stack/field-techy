import { isDummyNetworkEngineerJob } from "@/constants/dummyJobs";
import { earningsData } from "@/dummy_data/jobDetails";
import JobTabSection from "@/pages/client/my_job_client/components/JobTabSection";
import JobHeaderCard from "@/pages/engineer/my_job/job_details_components/jobHeaderComponents/JobHeaderCard";
import { JOB_STATUSES } from "@/pages/engineer/search_result/types";
import {
  useClientGetAssignmentDetails,
  useClientGetJobs,
} from "@/shared/apiServices/client/clientOpenApiService";
import ChatForJobs from "@/shared/components/ChatForJobs";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import SidebarJobPostWallet from "@/shared/components/SidebarJobPostWallet";
import { JOB_TAB_LABELS } from "@/shared/constants/jobTabs";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import type { OfferedJobStatusType } from "../../engineer/my_job/types.d";
import type { JobStatus } from "../my_job_client/types.d";
import type { AssignmentStatus } from "../search_result/types";
// import ErrorState from "@/shared/components/commonUI/ErrorState";
// import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";

/**
 * Page component displaying detailed information about a specific job.
 * Uses API data from useClientGetJobs hook.
 * @returns {JSX.Element} Job details page layout.
 */
const ClientJobDetails = () => {
  const params = useParams();
  const jobIdParam = params.jobId;

  const [searchParams] = useSearchParams();
  const regionIdParam = searchParams.get("regionId");

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

  const { data: jobsData } = useClientGetJobs({
    jobId,
    regionId: regionIdParam ? Number(regionIdParam) : undefined,
    enabled: true,
  });

  // Fallback to useClientGetJobs if needed for job details
  const jobsArray = Array.isArray(jobsData) ? jobsData : [];
  type ExtendedJob = (typeof jobsArray)[0] & {
    clientDetails?: { personName?: string };
  };

  const job = (jobsArray as ExtendedJob[]).find((j) => Number(j.id) === jobId);
  const {
    data: assignmentData,
    isLoading,
  } = useClientGetAssignmentDetails({ jobId, regionId: job?.regionId });

  const assignments = Array.isArray(assignmentData) ? assignmentData : [];
  const approvedStatuses = [
    "assigned",
    "accepted",
    "started",
    "start_pending_approval",
    "submitted",
    "submit_pending_approval",
  ];
  const numberOfApprovedProposals = assignments.filter((a) =>
    approvedStatuses.includes((a.assignmentStatus || "").toLowerCase()),
  ).length;
  const numberOfVacancy = job?.vacancies ?? undefined;
  const isDummyNetworkEngineer = job
    ? isDummyNetworkEngineerJob(job.id)
    : false;

  useEffect(() => {
    if (isDummyNetworkEngineer && activeTab === "Job Information") {
      setActiveTab("Job Overview");
    }
  }, [isDummyNetworkEngineer, activeTab]);

  // Format duration from startDate and endDate
  let durationDisplay = "Not specified";
  if (job?.startDate && job?.endDate) {
    const startDate = new Date(job.startDate);
    const endDate = new Date(job.endDate);
    durationDisplay = `${startDate.toLocaleDateString("en-GB")} - ${endDate.toLocaleDateString("en-GB")}`;
  } else if (job?.startDate) {
    durationDisplay = `Starts: ${new Date(job.startDate).toLocaleDateString("en-GB")}`;
  }

  // Get status or default to Posted
  const jobStatus = job?.status || "Posted";

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
            isShowSort={false}
            isShowBreadcrumb
            customLabels={{
              [params.jobId || ""]:
                job?.jobTitle || (isLoading ? "Loading..." : "Job not found"),
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
                title={job?.jobTitle || ""}
                client={job?.clientDetails?.personName || ""}
                duration={durationDisplay}
                type={job?.jobType || ""}
                status={jobStatus}
                setIsWorkSubmitted={setIsWorkSubmitted}
                setSendProposal={setIsSendProposal}
                isSendProposal={isSendProposal}
                setActiveTab={setActiveTab}
                setOfferJobStatus={setOfferJobStatus}
                OfferJobStatus={OfferJobStatus}
                hideBreakDetails={isDummyNetworkEngineer}
                hideClient={true}
                jobLocation={job?.workLocationName || ""}
                numberOfVacancy={numberOfVacancy}
                numberOfApplicants={assignments.length}
                numberOfApprovedProposals={numberOfApprovedProposals}
                jobId={jobIdParam!}
                onToggleChat={handleToggleChat}
                allAssignmentIds={
                  assignments
                    .map((a) => a.assignmentId)
                    .filter(Boolean) as number[]
                }
                engineerNames={
                  assignments
                    .map((a) => a.engineer?.name)
                    .filter(Boolean) as string[]
                }
                allCardsApproved={job?.status === JOB_STATUSES.closed}
                activeTab={activeTab}
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
                jobID={jobIdParam}
                numberOfVacancy={numberOfVacancy}
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
