import { ProposalsList } from "@/dummy_data/client/manage-proposal";
import { earningsData } from "@/dummy_data/jobDetails";
import { sampleJobs } from "@/dummy_data/searchDataClient";
import { sampleJobs as sampleJobs1 } from "@/dummy_data/searchData";
import { isDummyNetworkEngineerJob } from "@/constants/dummyJobs";
import JobHeaderCard from "@/pages/engineer/my_job/job_details_components/jobHeaderComponents/JobHeaderCard";
import JobTabSection from "@/pages/client/my_job_client/components/JobTabSection";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import SidebarJobPostWallet from "@/shared/components/SidebarJobPostWallet";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChatForJobs from "@/shared/components/ChatForJobs";
import {
  type AssignmentStatus,
  type JobStatus,
  type OfferedJobStatusType,
} from "../../engineer/search_result/types";

const ClientJobDetails = () => {
  const params = useParams();
  const jobIdParam = params.jobId;

  const [isWorkSubmitted, setIsWorkSubmitted] = useState(false);
  const [isSendProposal, setIsSendProposal] = useState(false);
  const [allCardsApproved, setAllCardsApproved] = useState(false);
  const [activeTab, setActiveTab] = useState("Job Information");
  const [OfferJobStatus, setOfferJobStatus] = useState<
    AssignmentStatus | OfferedJobStatusType | undefined
  >(undefined);

  const [openChatJobId, setOpenChatJobId] = useState<string | null>(null);
  const [breadcrumbExtra, setBreadcrumbExtra] = useState<string | null>(null);

  // Dynamic heading
  const [pageHeading, setPageHeading] = useState<string>("Job Details");

  const jobId = Number(params.jobId);
  const id = Number(params.id);

  // Find the relevant job/proposal
  const proposal = ProposalsList.find((job) => job.id === id);
  const data = sampleJobs.find((job) => job.id === jobId);
  const matchedJob = proposal
    ? sampleJobs1.find((job) => job.id === proposal.jobID)
    : data
      ? sampleJobs.find((job) => job.id === jobId)
      : null;

  const isDummyNetworkEngineer = isDummyNetworkEngineerJob(matchedJob?.id);

  const numberOfVacancy =
    isDummyNetworkEngineer && matchedJob && "numberOfVacancy" in matchedJob
      ? (matchedJob as { numberOfVacancy?: number }).numberOfVacancy
      : undefined;

  const numberOfApplicants =
    isDummyNetworkEngineer && matchedJob && "numberOfApplicants" in matchedJob
      ? (matchedJob as { numberOfApplicants?: number }).numberOfApplicants
      : undefined;

  // Default tab for dummy job
  useEffect(() => {
    if (isDummyNetworkEngineer && activeTab === "Job Information") {
      setActiveTab("Job Overview");
    }
  }, [isDummyNetworkEngineer, activeTab]);

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
            isShowBreadcrumb
            customLabels={{
              [params.jobId || ""]: matchedJob?.title ?? "Job",
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
              title={matchedJob?.title as string}
              client={matchedJob?.client as string}
              duration={matchedJob?.duration as string}
              type={matchedJob?.type}
              status={matchedJob?.status as string | undefined}
              setIsWorkSubmitted={setIsWorkSubmitted}
              setSendProposal={setIsSendProposal}
              isSendProposal={isSendProposal}
              setActiveTab={setActiveTab}
              setOfferJobStatus={setOfferJobStatus}
              OfferJobStatus={OfferJobStatus}
              hideBreakDetails={isDummyNetworkEngineer}
              hideDurationAndClient={isDummyNetworkEngineer}
              jobLocation={
                isDummyNetworkEngineer ? matchedJob?.location : undefined
              }
              numberOfVacancy={numberOfVacancy}
              numberOfApplicants={numberOfApplicants}
              activeTab={activeTab}
              allCardsApproved={allCardsApproved}
              onToggleChat={handleToggleChat}
              jobId={jobIdParam!}
            />

            <JobTabSection
              status={matchedJob?.status as JobStatus}
              isWorkSubmitted={isWorkSubmitted}
              isSendProposal={isSendProposal}
              activeTab={activeTab}
              OfferJobStatus={OfferJobStatus}
              isDummyNetworkEngineer={isDummyNetworkEngineer}
              showManageProposals
              onAllCardsApprovedChange={setAllCardsApproved}
              onTabChange={setActiveTab}
              jobID={String(jobId)}
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
