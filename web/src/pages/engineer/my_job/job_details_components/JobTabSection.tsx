import { useEffect, useState } from "react";
import {
  type AssignmentStatus,
  type JobStatus,
} from "@/pages/engineer/search_result/types";
import TabComponent from "@/shared/components/TabComponent";
import { JOB_TAB_LABELS } from "@/shared/constants/jobTabs";
import JobInfoSection from "./tab_components/JobInfoSection";
import LocationMap from "./tab_components/LocationMap";
import ProposalInfoTab from "./tab_components/ProposalInfoTab";
import ProposalForm from "./tab_components/ProposalForm";
import SuccessOverlay from "./tab_components/SuccessOverlay";
import TimelineSection from "./tab_components/TimelineSection";
import { useForm } from "react-hook-form";
import type { ProposalFormData, ProgressUpdate, JobInfoSectionProps } from "../types.d";
import { useEngineerApplyJob } from "@/shared/apiServices/engineer/engineerOpenApiService";
import { toast } from "react-toastify";

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
  isSendProposal,
  setSendProposal,
  activeTab,
  setActiveTab,
  OfferJobStatus,
  progressUpdates = [],
  onAddProgressUpdate,
  jobInfo,
  assignmentId,
  jobId,
  // isWorkSubmitted - kept for future use
}: {
  status: JobStatus;
  isSendProposal?: boolean;
  setSendProposal?: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab?: string;
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
  OfferJobStatus?: AssignmentStatus;
  progressUpdates?: ProgressUpdate[];
  onAddProgressUpdate?: (update: ProgressUpdate) => void;
  jobInfo?: JobInfoSectionProps;
  assignmentId?: number;
  jobId?: number;
  isWorkSubmitted?: boolean;
}) => {
  const { mutateAsync: applyJob } = useEngineerApplyJob({
    onSuccess: () => {
      // After successful submission, set hasApplied to true to show Proposal Info tab
      setHasApplied(true);
      // TODO: Invalidate job queries to refetch assignmentId
      // This would require access to queryClient from parent or passing a callback
    },
  });
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
    activeTab || JOB_TAB_LABELS.jobOverview,
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
  const hasAppliedFromApi = OfferJobStatus === "applied" || OfferJobStatus === "accepted" || 
    OfferJobStatus === "assigned" || OfferJobStatus === "start_pending_approval" ||
    OfferJobStatus === "started" || OfferJobStatus === "submit_pending_approval" ||
    OfferJobStatus === "submitted";

  // Show "Job Applied" status instead of "Send Proposal" after submission
  // Priority: API status (persists) > local state (session only)

  const onSubmit = (data: ProposalFormData) => {
    setReviewData(data);
    setShowReview(true);
  };

  // Handler to submit proposal to API
  const handleConfirmProposal = async (data: ProposalFormData): Promise<void> => {
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
        await fetch(response.uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });
      }

      toast.success("Proposal submitted successfully!");
    } catch (error) {
      console.error("Failed to submit proposal:", error);
      toast.error("Failed to submit proposal. Please try again.");
      throw error;
    }
  };

  const attachmentFiles = reviewData?.attachments
    ? Array.from(reviewData.attachments).map((file: unknown) => file instanceof File ? file.name : String(file))
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
      content: <JobInfoSection jobInfo={jobInfo || { jobTitle: "", terms: { items: [] }, files: [] }} />,
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
                submittedProposal={submittedProposal || {
                  proposalDescription: "",
                  attachments: null,
                }}
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
          defaultActiveTab={activeTab || JOB_TAB_LABELS.jobOverview}
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
