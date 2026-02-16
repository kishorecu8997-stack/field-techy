import { useEngineerSearchJobs } from "@/shared/apiServices/engineer/engineerOpenApiService";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { getDurationString } from "@/utils";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { SORT_OPTIONS, type JobStatus } from "../search_result/types";
import type { ProgressUpdate } from "./types.d";
import ClientInfoCard from "./job_details_components/ClientInfoCard";
import JobHeaderCard from "./job_details_components/jobHeaderComponents/JobHeaderCard";
import ReviewClientModal from "./job_details_components/jobHeaderComponents/ReviewClientModal";
import { toast } from "react-toastify";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import FinalStatementForm from "./job_details_components/jobHeaderComponents/FinalStatementForm";

/**
 * Page component displaying detailed information about a specific job.
 *
 * @returns {JSX.Element} Job details page layout.
 */
const JobDetailsPage = () => {
  const params = useParams();
  const [isSendProposal, setIsSendProposal] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(
    isDummyJob ? "Job Overview" : "Job Information",
  );
  const [OfferJobStatus, setOfferJobStatus] = useState<
    "initial" | "accepted" | "declined" | "started" | "checked-in" | undefined
  >("initial");
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([]);
  const [showFinalStatement, setShowFinalStatement] = useState(false);

  // Always call hooks - pass 0 if jobId is missing or dummy
  /* const { data: jobData, isLoading } = useEngineerGetJobById(
    Number(params.jobId) || 0,
    !isDummyJob && !!params.jobId,
  ); */

  const { data: searchResults, isLoading } = useEngineerSearchJobs({}, true);
  const jobData = searchResults?.find((j) => String(j.id) === params.jobId);

  const handleSubmitReview = () => {
    toast.success("Review submitted successfully");
    setIsReviewOpen(false);
  };

  const handleAddProgressUpdate = (update: ProgressUpdate) => {
    setProgressUpdates((prev) => [update, ...prev]);
  };

  const handleOpenFinalStatement = () => setShowFinalStatement(true);
  const handleCloseFinalStatement = () => setShowFinalStatement(false);

  // Handle missing jobId with a proper error state
  if (!params.jobId) {
    return (
      <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4 py-6 md:px-6">
          <MyJobsHeader
            title="Job Details"
            currentSort={SORT_OPTIONS.NEWEST}
            onSortChange={() => { }}
            isReport
          />
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Job Not Found</h2>
              <p className="text-gray-600 dark:text-gray-400">
                The job ID is missing or invalid. Please check the URL and try
                again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4 py-6 md:px-6">
          <MyJobsHeader
            title="Job Details"
            currentSort={SORT_OPTIONS.NEWEST}
            onSortChange={() => { }}
            isReport
          />
          <div className="flex items-center justify-center min-h-[400px]">
            <LoaderComponent />
          </div>
        </div>
      </div>
    );
  }

  // Handle case where job data is not found
  if (!jobData) {
    return (
      <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4 py-6 md:px-6">
          <MyJobsHeader
            title="Job Details"
            currentSort={SORT_OPTIONS.NEWEST}
            onSortChange={() => { }}
            isReport
          />
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Job Not Found</h2>
              <p className="text-gray-600 dark:text-gray-400">
                The requested job could not be found.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Prepare mapped job data
  const jobTitle = jobData?.jobTitle || "";
  /* @ts-ignore: Handling complex union type from ClientGetCompanyInfoResponse */
  const clientName = jobData?.clientDetails?.companyName || jobData?.clientDetails?.name || jobData?.clientDetails?.personName || "Unknown Client";
  const duration = getDurationString({
    startDateStr: jobData?.startDate || "",
    endDateStr: jobData?.endDate || "",
  });

  const engagementTypeMapping: Record<string, string> = {
    "On site": "ON_SITE",
    Remote: "REMOTE",
    Hybrid: "HYBRID",
  };

  const engagementType =
    engagementTypeMapping[jobData?.jobType || ""] ||
    (jobData?.jobType as string);

  const statusMapping: Record<string, JobStatus> = {
    Posted: JOB_STATUSES.posted,
    "In Progress": JOB_STATUSES.inProgress,
    Cancelled: JOB_STATUSES.cancelled,
    Closed: JOB_STATUSES.closed,
    Hold: JOB_STATUSES.hold,
    Flagged: JOB_STATUSES.flagged,
  };

  const jobStatus: JobStatus | AssignmentStatus =
    statusMapping[jobData.status as string] ||
    (jobData.status as AssignmentStatus) ||
    JOB_STATUSES.posted;

  // The type is missing in the new API. once the type is added, the type is fixed, and remove this `line @ts-ignore`
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const OfferJobStatus = jobData.assignmentStatus as AssignmentStatus;

  return (
    <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title="Job Details"
          currentSort={SORT_OPTIONS.NEWEST}
          onSortChange={() => { }}
          isReport
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <JobHeaderCard
              title={jobTitle}
              client={clientName}
              duration={duration as string}
              type={engagementType}
              status={jobStatus}
              setSendProposal={setIsSendProposal}
              isSendProposal={isSendProposal}
              setActiveTab={setActiveTab}
              OfferJobStatus={OfferJobStatus}
              hideBreakDetails={isDummyJob}
              jobLocation={isDummyJob ? "Chennai, Tamil Nadu, India" : location}
              numberOfVacancy={isDummyJob ? 4 : jobs?.numberOfVacancy}
              numberOfApplicants={isDummyJob ? 20 : undefined}
              hideDurationAndClient={isDummyJob}
              activeTab={activeTab}
              onAddProgressUpdate={handleAddProgressUpdate}
              onOpenFinalStatement={handleOpenFinalStatement}
            />

            <JobTabSection
              status={jobStatus}
              isSendProposal={isSendProposal}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              OfferJobStatus={OfferJobStatus}
              isDummyJob={isDummyJob}
              workLocation={location as string}
              isDummyNetworkEngineer={isDummyJob}
              showManageProposals={false}
              progressUpdates={progressUpdates}
              onAddProgressUpdate={handleAddProgressUpdate}
              hideTimelineContent={showFinalStatement}
            />

            {showFinalStatement && (
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mt-6">
                <FinalStatementForm
                  onClose={handleCloseFinalStatement}
                  onAddProgressUpdate={handleAddProgressUpdate}
                />
              </div>
            )}
          </div>
          <div className="lg:col-span-1">
            <ClientInfoCard
              name={clientName}
              memberSince={"-"} // Missing in new API
              location={jobData?.clientDetails?.address || ""}
              rating={0} // Missing in new API
              reviews={0} // Missing in new API
              verifications={[]} // Missing in new API
              onOpenReview={() => setIsReviewOpen(true)}
            />
          </div>
        </div>
      </div>

      <ReviewClientModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        clientName={clientName || "Client"}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};

export default JobDetailsPage;
