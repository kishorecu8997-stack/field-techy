import type { EngineerSearchJobsResponse } from "@/api";
import { isDummyNetworkEngineerJob } from "@/constants/dummyJobs";
import {
  useGetUserRatingAndReviews,
  useLookupData,
} from "@/shared/apiServices/commonOpenApiService";
import {
  useEngineerSearchJobs,
  useGetJobLogs,
} from "@/shared/apiServices/engineer/engineerOpenApiService";
import ChatForJobs from "@/shared/components/ChatForJobs";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import GiveFeedbackModal from "@/shared/components/modals/GiveFeedbackModal";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import type { JobOverviewProps } from "@/shared/components/types";
import { JOB_TAB_LABELS } from "@/shared/constants/jobTabs";
import { usePopupStore } from "@/shared/store/popupStore";
import { getDurationString } from "@/utils";
import { getAttachmentFileName } from "@/shared/libs/utils";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  JOB_STATUSES,
  SORT_OPTIONS,
  type AssignmentStatus,
  type JobStatus,
} from "../search_result/types";
import ClientInfoCard from "./job_details_components/ClientInfoCard";
import FinalStatementForm from "./job_details_components/jobHeaderComponents/FinalStatementForm";
import JobHeaderCard from "./job_details_components/jobHeaderComponents/JobHeaderCard";
import ReviewClientModal from "./job_details_components/jobHeaderComponents/ReviewClientModal";
import ViewClientFeedbackModal from "./job_details_components/jobHeaderComponents/ViewClientFeedbackModal";
import JobTabSection from "./job_details_components/JobTabSection";
import type {
  JobInfoSectionProps,
  OfferedJobStatusType,
  ProgressUpdate,
} from "./types.d";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";

/**
 * Maps API job data to JobInfoSectionProps format for the Job Overview tab
 */
const mapJobToJobInfo = (
  job: EngineerSearchJobsResponse[number],
): JobInfoSectionProps => {
  // Build termsItems array using conditional elements to reduce repetition
  const termsItems: Array<{ text: string }> = [
    // Add job description as first term item if available
    job.jobDescription && { text: job.jobDescription },
    // Add start and end dates
    job.startDate && {
      text: `Start Date: ${new Date(job.startDate).toLocaleDateString()}`,
    },
    job.endDate && {
      text: `End Date: ${new Date(job.endDate).toLocaleDateString()}`,
    },
    // Add total price if available
    job.totalPrice &&
      job.currencySymbol && {
        text: `Budget: ${job.currencySymbol}${job.totalPrice}`,
      },
    // Add work location
    job.workLocationName && { text: `Location: ${job.workLocationName}` },
  ].filter(Boolean) as Array<{ text: string }>;

  // Add job type
  if (job.jobType) {
    termsItems.push({ text: `Work Type: ${job.jobType}` });
  }

  // Add additional details if available
  if (job.additionalDetails) {
    termsItems.push({ text: job.additionalDetails });
  }

  // Handle attachment as file if available
  const files: Array<{ name: string; url: string }> = [];
  if (job.attachmentUrl) {
    // Extract filename from URL if it's a full URL, removing query string parameters
    const urlParts = job.attachmentUrl.split("/");
    const fileNameWithParams =
      urlParts[urlParts.length - 1] || "Job Attachment";
    const fileName = fileNameWithParams.split("?")[0] || "Job Attachment";
    files.push({ name: fileName, url: job.attachmentUrl });
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
 * Maps API job data to JobOverviewProps format for the Job Overview tab
 * Uses the same comprehensive format as the client-side implementation
 */
const mapJobToJobOverview = (
  job: EngineerSearchJobsResponse[number],
  skillMap: Map<number, string>,
  toolMap: Map<string, string>,
  experienceLevelMap: Map<number, string>,
  engagementModelMap: Map<number, string>,
): JobOverviewProps => {
  // Extract basic job info
  const jobTitle = job?.jobTitle || "";
  const jobDescription = job?.jobDescription || "";

  // Extract skills - convert IDs to labels using skillMap
  const skills = Array.isArray(job.skills)
    ? job.skills.map((skill) => {
        const skillId =
          typeof skill === "number" ? skill : parseInt(String(skill), 10);
        const skillLabel = skillMap.get(skillId);
        return skillLabel || String(skill);
      })
    : [];

  // Extract tools - convert IDs to labels using toolMap
  const tools = Array.isArray(job.tools)
    ? job.tools.map((tool) => {
        const toolId = String(tool.toolId);
        const toolLabel = toolMap.get(toolId);
        return {
          name: toolLabel || tool.toolName || toolId,
          price: tool.budget || "",
          image: tool.imageUrl || undefined,
        };
      })
    : [];

  // Extract duration from startDate and endDate
  let duration: string | undefined;
  if (job.startDate && job.endDate) {
    const start = new Date(job.startDate);
    const end = new Date(job.endDate);
    duration = `${start.toLocaleDateString("en-GB")} - ${end.toLocaleDateString("en-GB")}`;
  } else if (job.startDate) {
    duration = `Starts: ${new Date(job.startDate).toLocaleDateString("en-GB")}`;
  }

  // Extract work details - convert engagement model ID to label using engagementModelMap
  let engagementModel: string | undefined;
  if (job.engagementModelId && engagementModelMap.has(job.engagementModelId)) {
    engagementModel = engagementModelMap.get(job.engagementModelId);
  } else {
    // Fallback to jobType if no mapping found
    engagementModel = job.jobType || undefined;
  }

  // Extract experience level - convert ID to label using experienceLevelMap
  let experienceLevel: string | undefined;
  if (job.experienceLevelId) {
    const levelLabel = experienceLevelMap.get(job.experienceLevelId);
    experienceLevel = levelLabel || job.experienceLevelId.toString();
  } else {
    experienceLevel = undefined;
  }

  const numberOfVacancies = job.vacancies ?? undefined;

  // Extract earnings info - engineers see totalPrice as total payment
  const totalPayment =
    job.totalPrice && job.currencySymbol
      ? `${job.currencySymbol}${job.totalPrice}`
      : undefined;

  // Extract additional details
  const additionalDetails = job.additionalDetails
    ? [job.additionalDetails]
    : [];

  // Extract attachments
  const attachments: Array<{ name: string; url: string }> = [];
  if (job.attachmentUrl) {
    attachments.push({
      name: getAttachmentFileName({ url: job.attachmentUrl }),
      url: job.attachmentUrl,
    });
  }

  return {
    jobTitle,
    jobDescription,
    skills,
    tools,
    duration,
    engagementModel,
    experienceLevel,
    numberOfVacancies,
    totalPayment,
    additionalDetails,
    attachments,
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
  const [activeTab, setActiveTab] = useState(JOB_TAB_LABELS.timeline);
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([]);
  const [showFinalStatement, setShowFinalStatement] = useState(false);
  const [_offerJobStatus, setOfferJobStatus] = useState<
    OfferedJobStatusType | AssignmentStatus | undefined
  >();
  const [openChatJobId, setOpenChatJobId] = useState<string | null>(null);
  const [breadcrumbExtra, setBreadcrumbExtra] = useState<string | null>(null);
  const [pageHeading, setPageHeading] = useState<string>("Job Details");
  const { showPopup, closePopup } = usePopupStore();

  // Fetch job data from real API using search endpoint with jobId filter
  const { data: jobList, isLoading: isJobsLoading } = useEngineerSearchJobs({
    jobId: Number(params.jobId),
  });

  const job = jobList?.[0];

  // Fetch skills, tools, experience levels and engagement models from the lookup API
  const { data: skillsResponse } = useLookupData("skills");
  const { data: toolsResponse } = useLookupData("tools");
  const { data: experienceLevelsResponse } = useLookupData("experienceLevels");
  const { data: engagementModelsResponse } = useLookupData("engagementModels");

  // Create skill lookup map for fast ID to label conversion from API data
  const skillMap = useMemo(() => {
    const map = new Map<number, string>();
    (skillsResponse || []).forEach((skill) => {
      map.set(skill.id, skill.name);
    });
    return map;
  }, [skillsResponse]);

  // Create tool lookup map for fast ID to label conversion from API data
  const toolMap = useMemo(() => {
    const map = new Map<string, string>();
    (toolsResponse || []).forEach((tool) => {
      map.set(String(tool.id), tool.name);
    });
    return map;
  }, [toolsResponse]);

  // Create experience level lookup map for fast ID to label conversion
  const experienceLevelMap = useMemo(() => {
    const map = new Map<number, string>();
    (experienceLevelsResponse || []).forEach((level) => {
      map.set(level.id, level.name);
    });
    return map;
  }, [experienceLevelsResponse]);

  // Create engagement model lookup map for fast ID to label conversion
  const engagementModelMap = useMemo(() => {
    const map = new Map<number, string>();
    (engagementModelsResponse || []).forEach((model) => {
      map.set(model.id, model.name);
    });
    return map;
  }, [engagementModelsResponse]);

  // Map job to JobOverviewProps using the lookup maps
  const jobOverview = useMemo(() => {
    if (!job) return undefined;
    return mapJobToJobOverview(
      job,
      skillMap,
      toolMap,
      experienceLevelMap,
      engagementModelMap,
    );
  }, [job, skillMap, toolMap, experienceLevelMap, engagementModelMap]);
  const assignmentId = job?.assignmentId ?? undefined;

  // Fetch job logs to get revision requests from client
  const { data: jobLogs } = useGetJobLogs(assignmentId ?? 0, !!assignmentId);

  // Extract progress updates from job logs for TimelineSection
  // Note: We don't create separate revision entries - revisions are nested under Progress Update
  const apiProgressUpdates = useMemo(() => {
    if (!jobLogs?.logs?.length) return [];

    const updates: ProgressUpdate[] = [];

    for (const log of jobLogs.logs) {
      // Only include progress_update logs (not SUBMISSION which has its own handling)
      if (log.logType === "progress_update") {
        // Get original engineer's content
        const originalContent =
          log.details || "Engineer submitted a progress update";
        const originalAttachment = getAttachmentFileName(log.attachment);
        const originalAttachmentUrl = log.attachment?.url;

        // Determine statusText based on log status OR latest revision status
        // If there's a pending revision, show "Revision Requested"
        // Use 'any' type cast to handle potential 'pending' status from API
        const hasPendingRevision =
          log.revisions &&
          log.revisions.some((rev) => (rev.status as string) === "pending");

        let statusText: string;
        if (log.status === "revision_requested" || hasPendingRevision) {
          statusText = "Revision Requested";
        } else {
          statusText =
            log.status.charAt(0).toUpperCase() +
            log.status.slice(1).replace(/_/g, " ");
        }

        updates.push({
          title: "Progress Update",
          description: originalContent,
          attachmentName: originalAttachment,
          attachmentUrl: originalAttachmentUrl,
          timestamp: log.timestamp
            ? new Date(log.timestamp).toLocaleString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "",
          statusText,
          statusColor:
            log.status === "approved"
              ? "#22c55e"
              : log.status === "rejected"
                ? "#ef4444"
                : "#f59e0b",
          accentColor:
            log.status === "revision_requested" || hasPendingRevision
              ? "#f59e0b"
              : "#3b82f6",
          detailsType:
            log.status === "revision_requested" || hasPendingRevision
              ? "revision"
              : undefined,
          // Include the log ID for revision update API calls
          logId: log.id,
          // Map revisions to include jobLogId as required by type
          revisions: (log.revisions || []).map((rev) => {
            return {
              revisionId: rev.revisionId,
              // prefer jobLogId from rev, otherwise use current log id
              jobLogId: rev.jobLogId ?? log.id,
              logId: rev.jobLogId || log.id,
              content: rev.content ?? null,
              attachmentId: rev.attachmentId ?? null,
              attachmentUrl: rev.attachment?.url ?? null,
              attachmentName: rev.attachment?.filename ?? null,
              status: rev.status,
              clientComment: rev.clientComment ?? null,
              clientAttachmentId: rev.clientAttachmentId ?? null,
              clientAttachment: rev.clientAttachment
                ? {
                    filename: rev.clientAttachment.filename ?? "",
                    id: rev.clientAttachment.id,
                    size: rev.clientAttachment.size ?? 0,
                    url: rev.clientAttachment.url ?? "",
                  }
                : undefined,
              clientAttachmentName: rev.clientAttachment?.filename ?? null,
              createdAt: rev.createdAt ?? null,
              updatedAt: rev.updatedAt ?? null,
            };
          }),
        });
      }
    }

    return updates;
  }, [jobLogs]);

  // Combine manually added progress updates with API progress updates
  const allProgressUpdates = useMemo(() => {
    return [...progressUpdates, ...apiProgressUpdates];
  }, [progressUpdates, apiProgressUpdates]);

  // Check if final statement has been submitted and approved from job logs
  const isFinalStatementSubmitted = useMemo(() => {
    if (!jobLogs?.signOffSheets || jobLogs.signOffSheets.length === 0) {
      return false;
    }
    const signOff = jobLogs.signOffSheets[0];
    // Final statement is submitted if it has any status (pending, approved, or rejected)
    return !!signOff.status;
  }, [jobLogs]);

  // Check if final statement has been approved by client
  const isFinalStatementApproved = useMemo(() => {
    if (!jobLogs?.signOffSheets || jobLogs.signOffSheets.length === 0) {
      return false;
    }
    const signOff = jobLogs.signOffSheets[0];
    return signOff.status === "approved";
  }, [jobLogs]);

  // Check if final statement has been rejected by client
  const isFinalStatementRejected = useMemo(() => {
    if (!jobLogs?.signOffSheets || jobLogs.signOffSheets.length === 0) {
      return false;
    }
    const signOff = jobLogs.signOffSheets[0];
    return signOff.status === "rejected";
  }, [jobLogs]);

  const handleAddProgressUpdate = (update: ProgressUpdate) => {
    setProgressUpdates((prev) => [update, ...prev]);
  };

  const handleOpenFinalStatement = () => setShowFinalStatement(true);
  const handleCloseFinalStatement = () => setShowFinalStatement(false);

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

  const { data: reviewsData } = useGetUserRatingAndReviews(true, assignmentId);
  const regionId = useUserSessionStore((state) => state.session?.regionId);
  const handleOpenGiveClientFeedback = () => {
    showPopup({
      body: (
        <GiveFeedbackModal
          targetName={
            job?.clientDetails?.companyName ||
            job?.clientDetails?.personName ||
            "Test Client"
          }
          targetRole={job?.clientDetails?.clientType || "client"}
          placeholder="Share your feedback about your experience with the client..."
          assignmentId={job?.assignmentId || undefined}
          regionId={regionId || undefined}
        />
      ),
    });
  };

  const handleOpenViewClientFeedback = () => {
    showPopup({
      body: (
        <ViewClientFeedbackModal
          onClose={closePopup}
          clientName={reviewsData?.[0]?.reviewerName || clientName || "Client"}
          clientImage={reviewsData?.[0]?.reviewerProfilePictureUrl || undefined}
          rating={reviewsData?.[0]?.rating || undefined}
          review={reviewsData?.[0]?.review || undefined}
        />
      ),
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
    "Engineer",
    "my-jobs",
    params.jobId ?? "",
    breadcrumbExtra === "chats" ? "Chats" : null,
  ].filter((v): v is string => typeof v === "string");

  // Handle missing jobId with a proper error state
  if (!params.jobId) {
    return (
      <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4 py-6 md:px-6">
          <MyJobsHeader
            title="Job Details"
            currentSort={SORT_OPTIONS.NEWEST}
            isShowSort={false}
            onSortChange={() => {}}
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
            isShowSort={false}
            onSortChange={() => {}}
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
            isShowSort={false}
            onSortChange={() => {}}
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
  const clientName =
    job?.clientDetails?.companyName ||
    job?.clientDetails?.personName ||
    `Client #${clientId}`;
  const jobLocation = job?.workLocationName || "";

  // Format exact date range for display
  const formatDateRange = () => {
    if (!job?.startDate) return "";
    const startDate = new Date(job.startDate);
    const endDate = job.endDate ? new Date(job.endDate) : null;

    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    if (endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    return formatDate(startDate);
  };

  const exactTimeline = formatDateRange();

  // Keep duration for other uses, but use exactTimeline for display
  // Only call getDurationString if both dates are available
  const getJobDuration = (): string => {
    if (!job?.startDate) return "N/A";
    if (!job?.endDate) return "N/A";
    return getDurationString({
      startDateStr: job.startDate,
      endDateStr: job.endDate,
    });
  };

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

  // Determine if proposal is approved (hide buttons when not approved)
  // Show buttons only after the job has started
  const isProposalApproved = assignmentStatus === "started";

  return (
    <div className="min-h-[45rem] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title={pageHeading}
          currentSort={SORT_OPTIONS.NEWEST}
          onSortChange={() => {}}
          isShowSort={false}
          isShowBreadcrumb
          customLabels={
            isDummyJob
              ? { "dummy-j1": "Network Engineer" }
              : { [params.jobId || ""]: jobTitle }
          }
          segments={segments}
          isChatVisible={!!openChatJobId}
          handleCloseChat={handleCloseChat}
        />
        {openChatJobId ? (
          <div className="flex-1 overflow-y-auto">
            <ChatForJobs jobId={openChatJobId} currentUser="Engineer" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 space-y-6">
              <JobHeaderCard
                title={jobTitle}
                client={clientName}
                duration={exactTimeline || getJobDuration()}
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
                numberOfApplicants={job?.assignmentId ? 1 : undefined}
                numberOfApprovedProposals={
                  (job as unknown as { assignedEngineerCount?: number })
                    ?.assignedEngineerCount ?? 0
                }
                activeTab={activeTab}
                onAddProgressUpdate={handleAddProgressUpdate}
                onOpenFinalStatement={handleOpenFinalStatement}
                isFinalStatementSubmitted={isFinalStatementSubmitted}
                isFinalStatementApproved={isFinalStatementApproved}
                isFinalStatementRejected={isFinalStatementRejected}
                assignmentId={assignmentId}
                progressUpdates={allProgressUpdates}
                jobId={params.jobId}
                onToggleChat={handleToggleChat}
                hideChats={!isProposalApproved}
                hideBreakDetails={!isProposalApproved}
                jobStartDate={job?.startDate || undefined}
                jobEndDate={job?.endDate || undefined}
                onOpenGiveClientFeedback={handleOpenGiveClientFeedback}
                onOpenViewClientFeedback={handleOpenViewClientFeedback}
              />

              <JobTabSection
                status={jobStatus}
                isWorkSubmitted={isWorkSubmitted}
                isSendProposal={isSendProposal}
                setSendProposal={setIsSendProposal}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                OfferJobStatus={_offerJobStatus || assignmentStatus}
                setOfferJobStatus={setOfferJobStatus}
                progressUpdates={allProgressUpdates}
                onAddProgressUpdate={handleAddProgressUpdate}
                assignmentId={assignmentId}
                jobId={Number(params.jobId)}
                workLocationLat={job?.workLocationLat ?? null}
                workLocationLng={job?.workLocationLng ?? null}
                workLocationName={job?.workLocationName ?? null}
                jobInfo={
                  job
                    ? mapJobToJobInfo(job)
                    : {
                        jobTitle: "",
                        terms: { title: "Job Details", items: [] },
                        files: [],
                      }
                }
                jobOverview={job ? jobOverview : undefined}
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
                memberSince="-"
                location={job?.clientDetails?.address ?? jobLocation}
                rating={job?.clientDetails?.averageRating ?? 0}
                reviews={job?.clientDetails?.reviewCount ?? 0}
                verifications={[]}
                onOpenReview={() => setIsReviewOpen(true)}
                phoneNumber={job?.clientDetails?.phoneNumber ?? undefined}
                email={job?.clientDetails?.email ?? undefined}
              />
            </div>
          </div>
        )}
      </div>

      {isReviewOpen && (
        <ReviewClientModal
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          clientName={clientName}
          // onSubmit={handleSubmitReview}
        />
      )}
    </div>
  );
};

export default JobDetailsPage;
