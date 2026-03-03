import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/apiServices/queryKeys";
import {
  type AssignmentStatus,
  type JobStatus,
} from "@/pages/engineer/search_result/types";
import TabComponent from "@/shared/components/TabComponent";
import { JOB_TAB_LABELS } from "@/shared/constants/jobTabs";
import JobOverviewSection from "@/shared/components/JobOverviewSection";
import JobInfoSection from "./tab_components/JobInfoSection";
import LocationMap from "./tab_components/LocationMap";
import ProposalInfoTab from "./tab_components/ProposalInfoTab";
import ProposalForm from "./tab_components/ProposalForm";
import SuccessOverlay from "./tab_components/SuccessOverlay";
import TimelineSection from "./tab_components/TimelineSection";
import { useForm } from "react-hook-form";
import type {
  ProposalFormData,
  ProgressUpdate,
  JobInfoSectionProps,
} from "../types.d";
import type { JobOverviewProps } from "@/shared/components/types";
import {
  useEngineerApplyJob,
  useEngineerGetMyJobs,
} from "@/shared/apiServices/engineer/engineerOpenApiService";
// import type { EngineerSearchJobsResponse } from "@/api";
import { engineerGetMyJobs } from "@/api";
import { engineerGetMyJobsQueryKey } from "@/api/@tanstack/react-query.gen";
import { toast } from "react-toastify";
import { getJobLogs } from "@/api";
import { getJobLogsQueryKey } from "@/api/@tanstack/react-query.gen";
import { apiClient } from "@/shared/apiServices/apiClient";

/**
 * Maps API job data to JobOverviewProps format for the Job Overview tab
 * Uses the existing JobOverviewSection component for comprehensive job details display
 * Similar to the client-side implementation
 */
// const mapEngineerJobToJobOverview = (
//   job: EngineerSearchJobsResponse[number],
// ): JobOverviewProps => {
//   // Helper to safely cast job properties
//   const getJobValue = <T,>(key: string): T | null | undefined => {
//     return (job as Record<string, unknown>)?.[key] as T | null | undefined;
//   };

//   // Extract basic job info
//   const jobTitle = job?.jobTitle || "";
//   const jobDescription = job?.jobDescription || "";

//   // Extract skills - convert numbers to strings (engineer API returns numbers)
//   const rawSkills = getJobValue<number[]>("skills");
//   let skills: string[] = [];
//   if (Array.isArray(rawSkills)) {
//     skills = rawSkills.map((skill) => String(skill));
//   }

//   // Extract tools - convert numbers to strings (engineer API returns numbers)
//   const rawTools = getJobValue<number[]>("tools");
//   let tools: Array<{ name: string; price: string; image?: string }> = [];
//   if (Array.isArray(rawTools)) {
//     tools = rawTools.map((tool) => ({
//       name: String(tool),
//       price: "",
//       image: undefined,
//     }));
//   }

//   // Extract duration from startDate and endDate
//   const startDate = getJobValue<string>("startDate");
//   const endDate = getJobValue<string>("endDate");
//   let duration: string | undefined;
//   if (startDate && endDate) {
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     duration = `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
//   } else if (startDate) {
//     duration = `Starts: ${new Date(startDate).toLocaleDateString()}`;
//   }

//   // Extract work details
//   const engagementModel = getJobValue<string>("jobType") || undefined;
//   const experienceLevel = getJobValue<number>("experienceLevelId")?.toString() || undefined;
//   const numberOfVacancies = job?.vacancies ?? undefined;

//   // Extract earnings info - engineers see totalPrice as total payment
//   const totalPrice = getJobValue<string>("totalPrice");
//   const currencySymbol = getJobValue<string>("currencySymbol") || "$";

//   // Format total payment
//   let totalPayment: string | undefined;
//   if (totalPrice) {
//     totalPayment = `${currencySymbol}${totalPrice}`;
//   }

//   // Extract additional details
//   const rawAdditionalDetails = getJobValue<string>("additionalDetails");
//   let additionalDetails: string[] = [];
//   if (rawAdditionalDetails) {
//     additionalDetails = [rawAdditionalDetails];
//   }

//   // Extract attachments - show as "View Document" with the URL
//   const attachments: Array<{ name: string; url: string }> = [];
//   const attachmentUrl = getJobValue<string | null>("attachmentUrl");
//   if (attachmentUrl) {
//     attachments.push({ name: "View Document", url: attachmentUrl });
//   }

//   return {
//     jobTitle,
//     jobDescription,
//     skills,
//     tools,
//     duration,
//     engagementModel,
//     experienceLevel,
//     numberOfVacancies,
//     totalPayment,
//     additionalDetails,
//     attachments,
//   };
// };

/**
 * Engineer Job Tab Section with simplified 3-tab layout:
 * - Timeline
 * - Job Overview
 * - Work Location
 *
 * Shows Proposal Info tab only after proposal is submitted.
 */
const JobTabSection = ({
  // status - kept for future use
  // isWorkSubmitted - kept for future use
  isSendProposal,
  setSendProposal,
  activeTab,
  setActiveTab,
  OfferJobStatus,
  setOfferJobStatus,
  progressUpdates = [],
  onAddProgressUpdate,
  jobInfo,
  jobOverview,
  assignmentId,
  jobId,
}: {
  status: JobStatus;
  isWorkSubmitted?: boolean;
  isSendProposal?: boolean;
  setSendProposal?: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab?: string;
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
  OfferJobStatus?: AssignmentStatus;
  setOfferJobStatus?: (status: AssignmentStatus) => void;
  progressUpdates?: ProgressUpdate[];
  onAddProgressUpdate?: (update: ProgressUpdate) => void;
  jobInfo?: JobInfoSectionProps;
  jobOverview?: JobOverviewProps;
  assignmentId?: number;
  jobId?: number;
}) => {
  // isWorkSubmitted is used for prop interface compatibility with other components
  // Currently kept for future implementation of work submission tracking
  const queryClient = useQueryClient();

  const { mutateAsync: applyJob } = useEngineerApplyJob({
    onSuccess: async () => {
      // After successful submission, set hasApplied to true to show Proposal Info tab
      setHasApplied(true);
      // Update parent state to reflect the change immediately
      if (setOfferJobStatus) {
        setOfferJobStatus("submitted");
      }
      // Switch to Proposal Info tab
      setSelectedTab(JOB_TAB_LABELS.proposalInfo);
      // Invalidate engineer queries to trigger a refetch and get updated assignmentId
      // This ensures the job data is refreshed without requiring a full page reload
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      // Also invalidate job logs to update the timeline immediately
      if (assignmentId) {
        queryClient.invalidateQueries({ queryKey: ["getJobLogs"] });
        queryClient.invalidateQueries({ queryKey: ["engineer", "jobLogs", assignmentId] });
        // Force refresh timeline cache
        try {
          const response = await getJobLogs({
            client: apiClient,
            path: { assignmentId },
          });
          const exactQueryKey = getJobLogsQueryKey({ path: { assignmentId } });
          queryClient.setQueryData(exactQueryKey, response.data);
        } catch (error) {
          console.error("Error refetching timeline:", error);
        }
      }
    },
  });

  // Fetch engineer jobs from API to get proposal details
  const { data: engineerJobs } = useEngineerGetMyJobs(!!jobId);

  // Get proposal details from API for the current job
  const apiProposalData = engineerJobs?.find((job) => job.id === jobId);
  const methods = useForm<ProposalFormData>({
    defaultValues: {
      proposalDescription: "",
      attachments: null,
    },
  });

  const [showReview, setShowReview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [reviewData, setReviewData] = useState<ProposalFormData | null>(null);
  const [submittedProposal, setSubmittedProposal] =
    useState<ProposalFormData | null>(null);
  // Track if engineer has applied to show Proposal Info tab
  const [hasApplied, setHasApplied] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>(
    activeTab || JOB_TAB_LABELS.timeline,
  );

  useEffect(() => {
    document.body.style.overflow =
      showSuccess || showReview ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showSuccess, showReview]);

  // Sync local selectedTab to parent's activeTab
  useEffect(() => {
    if (selectedTab !== activeTab) {
      setActiveTab?.(selectedTab);
    }
  }, [selectedTab, activeTab, setActiveTab]);

  // Determine if engineer has applied based on OfferJobStatus from API (persists after refresh)
  // This is the primary source of truth - local hasApplied state only works within session
  // Note: "submitted" status is handled by local hasApplied state
  const hasAppliedFromApi =
    OfferJobStatus === "applied" ||
    OfferJobStatus === "accepted" ||
    OfferJobStatus === "assigned" ||
    OfferJobStatus === "start_pending_approval" ||
    OfferJobStatus === "started" ||
    OfferJobStatus === "submit_pending_approval" ||
    OfferJobStatus === "submitted" ||
    OfferJobStatus === "rejected";

  // Show "Job Applied" status instead of "Send Proposal" after submission
  // Priority: API status (persists) > local state (session only)

  const onSubmit = (data: ProposalFormData) => {
    setReviewData(data);
    setShowReview(true);
  };

  // Handler to submit proposal to API
  const handleConfirmProposal = async (
    data: ProposalFormData,
  ): Promise<void> => {
    if (!jobId) {
      toast.error("Job ID is missing. Cannot submit proposal.");
      throw new Error("Job ID is missing");
    }

    // Get the file from attachments if present
    const fileList = data.attachments;
    const file = fileList && fileList.length > 0 ? fileList[0] : null;

    const proposalAttachmentMeta = file
      ? {
          filename: file.name,
          size: file.size,
          mimeType: file.type,
        }
      : undefined;

    try {
      const response = await applyJob({
        body: {
          jobId: Number(jobId),
          proposalDetail: data.proposalDescription || "",
          proposalAttachment: proposalAttachmentMeta,
        },
      });

      // If there's a file and we got an upload URL, upload the file
      if (file && response.uploadUrl) {
        const uploadResponse = await fetch(response.uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error(
            `File upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`,
          );
        }
      }

      // Immediately update UI state before toast
      setHasApplied(true);
      // Also set submitted proposal data so it displays immediately in ProposalInfoTab
      setSubmittedProposal({
        proposalDescription: data.proposalDescription || "",
        attachments: data.attachments,
      });
      setShowSuccess(true);
      // Switch to Proposal Info tab immediately
      setSelectedTab(JOB_TAB_LABELS.proposalInfo);
      // Update parent state to reflect the change immediately
      if (setOfferJobStatus) {
        setOfferJobStatus("submitted");
      }
      // Force refetch timeline to update immediately
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      
      // Manually fetch and update engineerJobs cache for timeline
      try {
        const response = await engineerGetMyJobs({ client: apiClient });
        if (response.data) {
          const exactQueryKey = engineerGetMyJobsQueryKey();
          queryClient.setQueryData(exactQueryKey, response.data);
        }
      } catch (error) {
        console.error("Error refetching engineer jobs:", error);
      }
      
      if (assignmentId) {
        queryClient.invalidateQueries({ queryKey: ["getJobLogs"] });
        queryClient.invalidateQueries({ queryKey: ["engineer", "jobLogs", assignmentId] });
        // Also manually set the cache to trigger immediate update
        try {
          const response = await getJobLogs({
            client: apiClient,
            path: { assignmentId },
          });
          const exactQueryKey = getJobLogsQueryKey({ path: { assignmentId } });
          queryClient.setQueryData(exactQueryKey, response.data);
        } catch (error) {
          console.error("Error refetching timeline:", error);
        }
      }

      toast.success("Proposal submitted successfully!");
    } catch (error) {
      console.error("Failed to submit proposal:", error);
      toast.error("Failed to submit proposal. Please try again.");
      throw error;
    }
  };

  const attachmentFiles = reviewData?.attachments
    ? Array.from(reviewData.attachments).map((file: File) => file.name)
    : [];

  // 3 tabs only: Timeline, Job Overview, Work Location
  const tabs = [
    {
      label: JOB_TAB_LABELS.timeline,
      content: (
        <TimelineSection
          progressUpdates={progressUpdates}
          onAddProgressUpdate={onAddProgressUpdate}
          assignmentId={assignmentId}
          jobId={jobId}
          hasApplied={hasAppliedFromApi || !!hasApplied || !!submittedProposal}
        />
      ),
    },
    {
      label: JOB_TAB_LABELS.jobOverview,
      content: jobOverview ? (
        <JobOverviewSection {...jobOverview} />
      ) : (
        <JobInfoSection
          jobInfo={jobInfo || { jobTitle: "", terms: { items: [] }, files: [] }}
        />
      ),
    },
    {
      label: JOB_TAB_LABELS.workLocation,
      content: <LocationMap />,
    },
    // Show Proposal Info tab after proposal is submitted (from API or local state)
    ...(hasAppliedFromApi || hasApplied || submittedProposal
      ? [
          {
            label: JOB_TAB_LABELS.proposalInfo,
            content: (
              <ProposalInfoTab
                submittedProposal={
                  submittedProposal ||
                  (apiProposalData?.proposalDetail
                    ? {
                        proposalDescription: apiProposalData.proposalDetail,
                        attachmentUrl: apiProposalData.proposalAttachmentUrl,
                      }
                    : {
                        proposalDescription: "",
                        attachments: null,
                      })
                }
                proposalAppliedDate={apiProposalData?.appliedAt}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <div>
      {!isSendProposal ? (
        <TabComponent
          tabs={tabs}
          defaultActiveTab={activeTab || JOB_TAB_LABELS.timeline}
          onTabChange={(tabLabel) => {
            setSelectedTab(tabLabel);
            setActiveTab?.(tabLabel);
          }}
        />
      ) : (
        <ProposalForm
          methods={methods}
          onSubmit={onSubmit}
          attachmentFiles={attachmentFiles}
          showReview={showReview}
          setShowReview={setShowReview}
          setShowSuccess={setShowSuccess}
          setSubmittedProposal={setSubmittedProposal}
          setSendProposal={setSendProposal}
          setSelectedTab={setSelectedTab}
          setHasApplied={setHasApplied}
          reviewData={reviewData}
          onConfirm={handleConfirmProposal}
        />
      )}
      {showSuccess && <SuccessOverlay onClose={() => setShowSuccess(false)} />}
    </div>
  );
};

export default JobTabSection;
