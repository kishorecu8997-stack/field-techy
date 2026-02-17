import { useEffect, useState } from "react";
import { JOB_TAB_LABELS } from "@/shared/constants/jobTabs";
import TabComponent from "@/shared/components/TabComponent";
import JobInfoSection from "./tab_components/JobInfoSection";
import LocationMap from "./tab_components/LocationMap";
import TimelineSection from "./tab_components/TimelineSection";
import ManageProposalsTab from "./tab_components/ManageProposalsTab";
import type { JobTabSectionProps, JobInfoSectionProps, paymentTermsProps } from "../types";
import { useClientGetAssignmentDetails } from "@/shared/apiServices/client/clientOpenApiService";

/**
 * Maps API job data to JobInfoSectionProps format for the Job Overview tab
 * Uses job prop fields for backward compatibility
 */
const mapClientJobToJobInfo = (job: JobTabSectionProps["job"]): JobInfoSectionProps => {
  const termsItems: Array<{ text: string }> = [];

  // Add job description as first term item if available
  if (job?.jobDescription) {
    termsItems.push({ text: job.jobDescription });
  }

  // Add start and end dates (from API response or fallback)
  const startDate = (job as Record<string, unknown>)?.startDate as string | null | undefined;
  const endDate = (job as Record<string, unknown>)?.endDate as string | null | undefined;
  
  if (startDate) {
    termsItems.push({ text: `Start Date: ${new Date(startDate).toLocaleDateString()}` });
  }
  if (endDate) {
    termsItems.push({ text: `End Date: ${new Date(endDate).toLocaleDateString()}` });
  }

  // Add total price/budget
  const totalPrice = (job as Record<string, unknown>)?.totalPrice as string | null | undefined;
  const currencySymbol = (job as Record<string, unknown>)?.currencySymbol as string | null | undefined;
  if (totalPrice && currencySymbol) {
    termsItems.push({ text: `Budget: ${currencySymbol}${totalPrice}` });
  }

  // Add work location
  const workLocationName = (job as Record<string, unknown>)?.workLocationName as string | null | undefined;
  if (workLocationName) {
    termsItems.push({ text: `Location: ${workLocationName}` });
  }

  // Add job type
  const jobType = (job as Record<string, unknown>)?.jobType as string | null | undefined;
  if (jobType) {
    termsItems.push({ text: `Work Type: ${jobType}` });
  }

  // Add additional details if available
  const additionalDetails = (job as Record<string, unknown>)?.additionalDetails as string | null | undefined;
  if (additionalDetails) {
    termsItems.push({ text: additionalDetails });
  }

  // Handle attachment as file if available
  const files: string[] = [];
  const attachmentUrl = (job as Record<string, unknown>)?.attachmentUrl as string | null | undefined;
  if (attachmentUrl) {
    // Extract filename from URL if it's a full URL
    const urlParts = attachmentUrl.split('/');
    const fileName = urlParts[urlParts.length - 1] || "Job Attachment";
    files.push(fileName);
  }

  return {
    jobTitle: job?.jobTitle || job?.title || "",
    terms: {
      title: "Job Details",
      items: termsItems,
    },
    files,
  };
};

/**
 * Maps API job data to paymentTermsProps format
 * Uses job prop fields for backward compatibility
 */
const mapClientJobToPayInfo = (job: JobTabSectionProps["job"]): paymentTermsProps => {
  const totalPrice = (job as Record<string, unknown>)?.totalPrice as string | null | undefined;
  const currencySymbol = (job as Record<string, unknown>)?.currencySymbol as string | null | undefined;
  
  return {
    title: "Payment Terms",
    amount: totalPrice && currencySymbol ? `${currencySymbol}${totalPrice}` : "",
    priceType: "Fixed",
  };
};

/**
 * Client Job Tab Section with simplified 3-tab layout:
 * - Timeline
 * - Job Overview
 * - Work Location
 * - Manage Proposals (when showManageProposals is true)
 */
const JobTabSection: React.FC<JobTabSectionProps> = ({
  // status - kept for future use
  activeTab,
  job,
  assignmentId,
  showManageProposals,
}) => {
  const [selectedTab, setSelectedTab] = useState<string>(
    activeTab || JOB_TAB_LABELS.timeline,
  );

  // Get jobId from job prop
  const jobId = job?.id ? Number(job.id) : undefined;

  // Fetch assignments/proposals for this job when showManageProposals is true
  const { data: assignmentsData, isLoading: isLoadingAssignments } = useClientGetAssignmentDetails(
    { jobId: jobId },
    !!(showManageProposals && jobId),
  );

  useEffect(() => {
    if (selectedTab !== activeTab) {
      setSelectedTab?.(activeTab || "");
    }
  }, [selectedTab, activeTab]);

  // Prepare job info for JobInfoSection using real API data
  const jobInfo = mapClientJobToJobInfo(job);
  const payInfo = mapClientJobToPayInfo(job);

  // Simplified 3 tabs: Timeline, Job Overview, Work Location, Manage Proposals
  const tabs = [
    {
      label: JOB_TAB_LABELS.timeline,
      content: <TimelineSection assignmentId={assignmentId} jobId={jobId} hasProposals={!!assignmentsData?.length} />,
    },
    {
      label: JOB_TAB_LABELS.jobOverview,
      content: <JobInfoSection jobInfo={jobInfo} payInfo={payInfo} />,
    },
    {
      label: JOB_TAB_LABELS.workLocation,
      content: <LocationMap />,
    },
    // Add Manage Proposals tab when showManageProposals is true
    ...(showManageProposals
      ? [
          {
            label: JOB_TAB_LABELS.manageProposals || "Manage Proposals",
            content: (
              <ManageProposalsTab
                assignments={assignmentsData}
                isLoading={isLoadingAssignments}
                jobId={jobId}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <div>
      <TabComponent
        tabs={tabs}
        defaultActiveTab={activeTab || JOB_TAB_LABELS.timeline}
        onTabChange={(tabLabel) => {
          setSelectedTab(tabLabel);
        }}
      />
    </div>
  );
};

export default JobTabSection;
