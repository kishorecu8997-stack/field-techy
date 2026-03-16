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
  useEngineerMarkProposalFileUploaded,
} from "@/shared/apiServices/engineer/engineerOpenApiService";
import { engineerGetMyJobs } from "@/api";
import { engineerGetMyJobsQueryKey } from "@/api/@tanstack/react-query.gen";
import { toast } from "react-toastify";
import { getJobLogs } from "@/api";
import { getJobLogsQueryKey } from "@/api/@tanstack/react-query.gen";
import { apiClient } from "@/shared/apiServices/apiClient";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";

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
  workLocationLat,
  workLocationLng,
  workLocationName,
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
  workLocationLat?: string | number | null;
  workLocationLng?: string | number | null;
  workLocationName?: string | null;
}) => {
  // isWorkSubmitted is used for prop interface compatibility with other components
  // Currently kept for future implementation of work submission tracking
  const queryClient = useQueryClient();
  const regionId = useUserSessionStore.getState().session?.regionId;

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
        queryClient.invalidateQueries({
          queryKey: ["engineer", "jobLogs", assignmentId],
        });
        // Force refresh timeline cache
        try {
          const response = await getJobLogs({
            client: apiClient,
            path: { assignmentId },
            query: {
              regionId: Number(regionId),
            },
          });
          const exactQueryKey = getJobLogsQueryKey({
            path: { assignmentId },
            query: {
              regionId: Number(regionId),
            },
          });
          queryClient.setQueryData(exactQueryKey, response.data);
        } catch (error) {
          console.error("Error refetching timeline:", error);
        }
      }
    },
  });

  // Mutation for marking proposal file as uploaded
  const { mutateAsync: markUploaded } = useEngineerMarkProposalFileUploaded();

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

  useEffect(() => {
    document.body.style.overflow =
      showSuccess || showReview ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showSuccess, showReview]);

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

  const showTimelineTab =
    hasAppliedFromApi || !!hasApplied || !!submittedProposal;
  const defaultTabLabel = showTimelineTab
    ? JOB_TAB_LABELS.timeline
    : JOB_TAB_LABELS.jobOverview;
  const initialTab =
    activeTab && (showTimelineTab || activeTab !== JOB_TAB_LABELS.timeline)
      ? activeTab
      : defaultTabLabel;

  const [selectedTab, setSelectedTab] = useState<string>(initialTab);

  useEffect(() => {
    // Keep selected tab valid when timeline is hidden before proposal.
    if (!showTimelineTab && selectedTab === JOB_TAB_LABELS.timeline) {
      setSelectedTab(JOB_TAB_LABELS.jobOverview);
      return;
    }

    if (!activeTab && selectedTab !== defaultTabLabel) {
      setSelectedTab(defaultTabLabel);
    }
  }, [showTimelineTab, selectedTab, activeTab, defaultTabLabel]);

  // Sync local selectedTab to parent's activeTab
  useEffect(() => {
    if (selectedTab !== activeTab) {
      setActiveTab?.(selectedTab);
    }
  }, [selectedTab, activeTab, setActiveTab]);

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
          regionId: Number(regionId),
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

        // Mark the file as uploaded so the client can view it
        await markUploaded({
          body: { jobId: Number(jobId), regionId: Number(regionId) },
        });
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
        const response = await engineerGetMyJobs({
          client: apiClient,
          query: {
            regionId,
          },
        });
        if (response.data) {
          const exactQueryKey = engineerGetMyJobsQueryKey({
            query: {
              regionId,
            },
          });
          queryClient.setQueryData(exactQueryKey, response.data);
        }
      } catch (error) {
        console.error("Error refetching engineer jobs:", error);
      }

      if (assignmentId) {
        queryClient.invalidateQueries({ queryKey: ["getJobLogs"] });
        queryClient.invalidateQueries({
          queryKey: ["engineer", "jobLogs", assignmentId],
        });
        // Also manually set the cache to trigger immediate update
        try {
          const response = await getJobLogs({
            client: apiClient,
            path: { assignmentId },
            query: {
              regionId: Number(regionId),
            },
          });
          const exactQueryKey = getJobLogsQueryKey({
            path: { assignmentId },
            query: {
              regionId: Number(regionId),
            },
          });
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
    ...(showTimelineTab
      ? [
          {
            label: JOB_TAB_LABELS.timeline,
            content: (
              <TimelineSection
                progressUpdates={progressUpdates}
                onAddProgressUpdate={onAddProgressUpdate}
                assignmentId={assignmentId}
                jobId={jobId}
                hasApplied={
                  hasAppliedFromApi || !!hasApplied || !!submittedProposal
                }
              />
            ),
          },
        ]
      : []),
    {
      label: JOB_TAB_LABELS.jobOverview,
      content: jobOverview ? (
        <JobOverviewSection {...jobOverview} userType="engineer" />
      ) : (
        <JobInfoSection
          jobInfo={jobInfo || { jobTitle: "", terms: { items: [] }, files: [] }}
        />
      ),
    },
    {
      label: JOB_TAB_LABELS.workLocation,
      content: (
        <LocationMap
          workLocationLat={workLocationLat}
          workLocationLng={workLocationLng}
          workLocationName={workLocationName}
        />
      ),
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
          defaultActiveTab={selectedTab}
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
