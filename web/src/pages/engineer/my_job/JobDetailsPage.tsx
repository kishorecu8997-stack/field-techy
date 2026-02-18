import { isDummyNetworkEngineerJob } from "@/constants/dummyJobs";
import { useEngineerSearchJobs } from "@/shared/apiServices/engineer/engineerOpenApiService";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { getDurationString } from "@/utils";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { SORT_OPTIONS, type JobStatus } from "../search_result/types";
import ClientInfoCard from "./job_details_components/ClientInfoCard";
import FinalStatementForm from "./job_details_components/jobHeaderComponents/FinalStatementForm";
import JobHeaderCard from "./job_details_components/jobHeaderComponents/JobHeaderCard";
import ReviewClientModal from "./job_details_components/jobHeaderComponents/ReviewClientModal";
import JobTabSection from "./job_details_components/JobTabSection";
import type { ProgressUpdate } from "./types.d";

/**
 * Page component displaying detailed information about a specific job.
 *
 * @returns {JSX.Element} Job details page layout.
 */
const JobDetailsPage = () => {
  const params = useParams();
  const isDummyJob = isDummyNetworkEngineerJob(params.jobId);
  const [isWorkSubmitted, setIsWorkSubmitted] = useState(false);
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

  // Always call hooks - pass empty string if jobId is missing or dummy
  // const { data: jobs, isLoading } = useClientGetJobsById(
  //   isDummyJob ? "" : (params.jobId ?? ""),
  // );
  // const { data: client } = useClientGetById(jobs?.clientId ?? "", {
  //   enabled: !!jobs?.clientId && !isDummyJob,
  // });

  const { data: jobList, isLoading } = useEngineerSearchJobs({
    jobId: Number(params.jobId),
  });

  const job = jobList?.[0];

  const location = job?.clientDetails?.address;
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
            onSortChange={() => {}}
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
  if (isLoading && !isDummyJob) {
    return (
      <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4 py-6 md:px-6">
          <MyJobsHeader
            title="Job Details"
            currentSort={SORT_OPTIONS.NEWEST}
            onSortChange={() => {}}
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
  if (!job && !isDummyJob) {
    return (
      <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4 py-6 md:px-6">
          <MyJobsHeader
            title="Job Details"
            currentSort={SORT_OPTIONS.NEWEST}
            onSortChange={() => {}}
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

  // Prepare dummy job data
  const jobTitle = isDummyJob ? "Network Engineer" : (job?.jobTitle as string);
  const clientName = isDummyJob
    ? "-"
    : (job?.clientDetails?.companyName as string);
  const duration = isDummyJob
    ? "5 weeks"
    : getDurationString({
        startDateStr: job?.startDate as string,
        endDateStr: job?.endDate as string,
      });
  const engagementType = isDummyJob ? "ON_SITE" : (job?.jobType as string);
  const jobStatus = isDummyJob ? "New" : (job?.status as JobStatus);

  return (
    <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title="Job Details"
          currentSort={SORT_OPTIONS.NEWEST}
          onSortChange={() => {}}
          isReport
          customLabels={
            isDummyJob ? { "dummy-j1": "Network Engineer" } : undefined
          }
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <JobHeaderCard
              title={jobTitle}
              client={clientName}
              duration={duration as string}
              type={engagementType}
              status={jobStatus}
              setIsWorkSubmitted={setIsWorkSubmitted}
              setSendProposal={setIsSendProposal}
              isSendProposal={isSendProposal}
              setActiveTab={setActiveTab}
              setOfferJobStatus={setOfferJobStatus}
              OfferJobStatus={OfferJobStatus}
              hideBreakDetails={isDummyJob}
              jobLocation={location ?? ""}
              numberOfVacancy={job?.vacancies ?? 0}
              numberOfApplicants={isDummyJob ? 20 : undefined}
              hideDurationAndClient={isDummyJob}
              activeTab={activeTab}
              onAddProgressUpdate={handleAddProgressUpdate}
              onOpenFinalStatement={handleOpenFinalStatement}
            />

            <JobTabSection
              status={jobStatus}
              isWorkSubmitted={isWorkSubmitted}
              isSendProposal={isSendProposal}
              setSendProposal={setIsSendProposal}
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
              memberSince={job?.clientDetails?.companyName as string} // TODO: memberSince not in clientDetails, using companyName as placeholder or fix if available
              location={location as string}
              rating={0} // client details don't have rating
              reviews={0} // client details don't have review count
              verifications={[]} // client details don't have verifications
              onOpenReview={() => setIsReviewOpen(true)}
            />
          </div>
        </div>
      </div>

      <ReviewClientModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        clientName={clientName ?? "Client"}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};

export default JobDetailsPage;
