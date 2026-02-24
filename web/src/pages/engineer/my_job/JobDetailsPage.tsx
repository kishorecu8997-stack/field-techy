import { isDummyNetworkEngineerJob } from "@/constants/dummyJobs";
import { useEngineerSearchJobs } from "@/shared/apiServices/engineer/engineerOpenApiService";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { getDurationString } from "@/utils";
import { useState } from "react";
import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";
import {
  JOB_STATUSES,
  SORT_OPTIONS,
  type AssignmentStatus,
  type JobStatus,
} from "../search_result/types";
import type {
  ProgressUpdate,
  OfferedJobStatusType,
  JobInfoSectionProps,
} from "./types.d";
import type { EngineerSearchJobsResponse } from "@/api";
import ClientInfoCard from "./job_details_components/ClientInfoCard";
import FinalStatementForm from "./job_details_components/jobHeaderComponents/FinalStatementForm";
import JobHeaderCard from "./job_details_components/jobHeaderComponents/JobHeaderCard";
import ReviewClientModal from "./job_details_components/jobHeaderComponents/ReviewClientModal";
import JobTabSection from "./job_details_components/JobTabSection";

/**
 * Maps API job data to JobInfoSectionProps format for the Job Overview tab
 */
const mapJobToJobInfo = (
  job: EngineerSearchJobsResponse[number],
): JobInfoSectionProps => {
  const termsItems: Array<{ text: string }> = [];

  // Add job description as first term item if available
  if (job.jobDescription) {
    termsItems.push({ text: job.jobDescription });
  }

  // Add start and end dates
  if (job.startDate) {
    termsItems.push({
      text: `Start Date: ${new Date(job.startDate).toLocaleDateString()}`,
    });
  }
  if (job.endDate) {
    termsItems.push({
      text: `End Date: ${new Date(job.endDate).toLocaleDateString()}`,
    });
  }

  // Add total price if available
  if (job.totalPrice && job.currencySymbol) {
    termsItems.push({ text: `Budget: ${job.currencySymbol}${job.totalPrice}` });
  }

  // Add work location
  if (job.workLocationName) {
    termsItems.push({ text: `Location: ${job.workLocationName}` });
  }

  // Add job type
  if (job.jobType) {
    termsItems.push({ text: `Work Type: ${job.jobType}` });
  }

  // Add additional details if available
  if (job.additionalDetails) {
    termsItems.push({ text: job.additionalDetails });
  }

  // Handle attachment as file if available
  const files: string[] = [];
  if (job.attachmentUrl) {
    // Extract filename from URL if it's a full URL
    const urlParts = job.attachmentUrl.split("/");
    const fileName = urlParts[urlParts.length - 1] || "Job Attachment";
    files.push(fileName);
  }

  return {
    jobTitle: job.jobTitle || "",
    terms: {
      title: "Job Details",
      items: termsItems,
    },
    files,
  };
};

/**
 * Page component displaying detailed information about a specific job.
 * Uses real API data from engineerSearchJobs endpoint.
 *
 * @returns {JSX.Element} Job details page layout.
 */
const JobDetailsPage = () => {
  const params = useParams();
  const isDummyJob = isDummyNetworkEngineerJob(params.jobId);
  const [isWorkSubmitted, setIsWorkSubmitted] = useState(false);
  const [isSendProposal, setIsSendProposal] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Job Information");
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([]);
  const [showFinalStatement, setShowFinalStatement] = useState(false);
  const [_offerJobStatus, setOfferJobStatus] = useState<
    OfferedJobStatusType | AssignmentStatus | undefined
  >();
  const [_isWorkSubmitted] = useState(false);

  // Fetch job data from real API using search endpoint with jobId filter
  const { data: jobList, isLoading: isJobsLoading } = useEngineerSearchJobs({
    jobId: Number(params.jobId),
  });

  const job = jobList?.[0];

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
  if (isJobsLoading && !isDummyJob) {
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
  if (!job && !isDummyJob) {
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

  // Prepare mapped job data from API response - use job as the primary source
  const jobTitle = job?.jobTitle || "";
  const clientId = job?.clientId;
  const jobLocation = job?.workLocationName || "";
  const duration = getDurationString({
    startDateStr: job?.startDate || "",
    endDateStr: job?.endDate || "",
  });
  const assignmentId = job?.assignmentId ?? undefined;

  const engagementTypeMapping: Record<string, string> = {
    "On site": "ON_SITE",
    Remote: "REMOTE",
    Hybrid: "HYBRID",
  };

  const engagementType =
    engagementTypeMapping[job?.jobType || ""] || (job?.jobType as string);

  const statusMapping: Record<string, JobStatus> = {
    Posted: JOB_STATUSES.posted,
    "In Progress": JOB_STATUSES.inProgress,
    Cancelled: JOB_STATUSES.cancelled,
    Closed: JOB_STATUSES.closed,
    Hold: JOB_STATUSES.hold,
    Flagged: JOB_STATUSES.flagged,
  };

  const jobStatus: JobStatus | AssignmentStatus =
    statusMapping[job?.status as string] ||
    (job?.status as AssignmentStatus) ||
    JOB_STATUSES.posted;

  // Get assignment status from API data (maps to OfferedJobStatusType via EngineersActions)
  const assignmentStatus = job?.assignmentStatus as AssignmentStatus;

  return (
    <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title="Job Details"
          currentSort={SORT_OPTIONS.NEWEST}
          onSortChange={() => { }}
          isReport
          customLabels={
            isDummyJob ? { "dummy-j1": "Network Engineer" } : undefined
          }
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <JobHeaderCard
              title={jobTitle}
              client={`Client #${clientId}`}
              duration={duration as string}
              type={engagementType}
              status={jobStatus}
              setIsWorkSubmitted={setIsWorkSubmitted}
              setSendProposal={setIsSendProposal}
              isSendProposal={isSendProposal}
              setActiveTab={setActiveTab}
              OfferJobStatus={_offerJobStatus || assignmentStatus}
              setOfferJobStatus={setOfferJobStatus}
              jobLocation={jobLocation}
              numberOfVacancy={job?.vacancies ?? undefined}
              activeTab={activeTab}
              onAddProgressUpdate={handleAddProgressUpdate}
              onOpenFinalStatement={handleOpenFinalStatement}
              assignmentId={assignmentId}
              jobId={params.jobId}
            />

            <JobTabSection
              status={jobStatus}
              isWorkSubmitted={isWorkSubmitted}
              isSendProposal={isSendProposal}
              setSendProposal={setIsSendProposal}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              OfferJobStatus={assignmentStatus}
              progressUpdates={progressUpdates}
              onAddProgressUpdate={handleAddProgressUpdate}
              assignmentId={assignmentId}
              jobId={Number(params.jobId)}
              jobInfo={
                job
                  ? mapJobToJobInfo(job)
                  : {
                    jobTitle: "",
                    terms: { title: "Job Details", items: [] },
                    files: [],
                  }
              }
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
              name={`Client #${clientId}`}
              memberSince={"-"}
              location={jobLocation}
              rating={0}
              reviews={0}
              verifications={[]}
              onOpenReview={() => setIsReviewOpen(true)}
            />
          </div>
        </div>
      </div>

      {isReviewOpen && (
        <ReviewClientModal
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          clientName={`Client #${clientId}`}
        // onSubmit={handleSubmitReview}
        />
      )}
    </div>
  );
};

export default JobDetailsPage;