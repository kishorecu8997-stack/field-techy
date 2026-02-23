import React, { useState } from "react";
import {
  job,
  logs,
  otherProposal,
  paymentTerms,
  requirements,
  termsData,
  workSubmissions,
} from "@/dummy_data/jobDetailsClient";
import { engineerJobOverview } from "@/dummy_data/engineerJobOverview";
import { networkEngineerProposals } from "@/dummy_data/jobTabs/networkEngineerProposals";
import {
  DUMMY_TABS_LABELS,
  PROPOSAL_POPUP_COPY,
  PROPOSAL_TOAST_MESSAGES,
} from "@/dummy_data/jobTabs/jobsectiondata";
import { JOB_STATUSES } from "@/pages/client/search_result/types";
import type { JobTabSectionProps } from "../types";
import SendProposal from "@/pages/engineer/home/components/SendProposal";
import Proposal from "@/shared/components/Proposal";
import JobOverviewSection from "@/shared/components/JobOverviewSection";
import TabComponent from "@/shared/components/TabComponent";
import WorkLocationMap from "@/shared/components/WorkLocationMap";
import { MAP_DEFAULTS } from "@/shared/constants/mapDefaults";
import { usePopupStore } from "@/shared/store/popupStore";
import JobInfoSection from "./tab_components/JobInfoSection";
import LocationMap from "./tab_components/LocationMap";
import LogComponent from "./tab_components/LogComponent";
import TimelineSection from "./tab_components/timeline_section/TimelineSection";
import WorkSubmissionComponent from "./tab_components/WorkSubmissionComponent";
import ManageProposalsTab from "./tab_components/ManageProposalsTab";
import { toast } from "react-toastify";

/**
 * Client job tab section with conditional  rendering for real jobs vs. dummy network engineer flows.
 * Supports proposal accept/reject popups with centralized copy and toasts.
 * Renders different tab layouts (baseTabs for real jobs, dummyTabs for dummy engineers).
 * Tracks accepted/rejected proposals and manages remaining proposal count per session.
 * Uses dummy data for tabs, proposals, overviews, and location/map defaults.
 * Integrates with shared popup store and react-toastify for UX feedback.
 */
const JobTabSection: React.FC<JobTabSectionProps> = ({
  status,
  isWorkSubmitted,
  isSendProposal,
  activeTab,
  isDummyNetworkEngineer,
  showManageProposals = true,
  onAllCardsApprovedChange,
  onTabChange,
  jobID,
}) => {
  const [acceptedProposals, setAcceptedProposals] = useState<string[]>([]);
  const [rejectedProposals, setRejectedProposals] = useState<string[]>([]);
  const { showPopup } = usePopupStore();

  const remainingProposals = Math.max(
    networkEngineerProposals.length -
    acceptedProposals.length -
    rejectedProposals.length,
    0,
  );

  const handleAcceptProposal = async (proposalId: string) => {
    await showPopup({
      title: PROPOSAL_POPUP_COPY.acceptTitle,
      body: PROPOSAL_POPUP_COPY.acceptBody,
      actionButtons: [
        {
          label: PROPOSAL_POPUP_COPY.cancelLabel,
          value: "cancel",
          variant: "secondary",
          action: async (close) => close(true),
        },
        {
          label: PROPOSAL_POPUP_COPY.acceptLabel,
          value: "accept",
          variant: "primary",
          action: async (close) => {
            if (!acceptedProposals.includes(proposalId)) {
              setAcceptedProposals([...acceptedProposals, proposalId]);
              toast.success(PROPOSAL_TOAST_MESSAGES.accepted, {
                position: "top-right",
              });
            }
            close(true);
          },
        },
      ],
    });
  };

  const handleRejectProposal = async (proposalId: string) => {
    await showPopup({
      title: PROPOSAL_POPUP_COPY.rejectTitle,
      body: PROPOSAL_POPUP_COPY.rejectBody,
      actionButtons: [
        {
          label: PROPOSAL_POPUP_COPY.cancelLabel,
          value: "cancel",
          variant: "secondary",
          action: async (close) => close(true),
        },
        {
          label: PROPOSAL_POPUP_COPY.rejectLabel,
          value: "reject",
          variant: "danger",
          action: async (close) => {
            if (!rejectedProposals.includes(proposalId)) {
              setRejectedProposals([...rejectedProposals, proposalId]);
              toast.error(PROPOSAL_TOAST_MESSAGES.rejected, {
                position: "top-right",
              });
            }
            close(true);
          },
        },
      ],
    });
  };

  const baseTabs = [
    {
      label: "Logs",
      content: <LogComponent logs={logs} />,
      hide: status === JOB_STATUSES.posted,
    },
    {
      label: "Work Submissions",
      content: (
        <WorkSubmissionComponent
          workSubmissions={workSubmissions}
          isWorkSubmitted={isWorkSubmitted}
        />
      ),
      hide: status === JOB_STATUSES.posted,
    },
    {
      label: "Job Information",
      content: <JobInfoSection jobInfo={job} payInfo={paymentTerms} />,
    },
    {
      label: "Requirement",
      content: (
        <Proposal jobTitle={requirements.jobTitle} terms={requirements.terms} />
      ),
    },
    { label: "SPOC", content: <LocationMap /> },
    {
      label: "Other",
      content: (
        <Proposal
          jobTitle={otherProposal.jobTitle}
          terms={otherProposal.terms}
        />
      ),
    },
    {
      label: "Proposal's Terms & Conditions",
      content: (
        <Proposal jobTitle={termsData.jobTitle} terms={termsData.terms} />
      ),
    },
  ];

  // Simplified tab set for the dummy Network Engineer job
  const dummyTabs = [
    {
      label: DUMMY_TABS_LABELS.timeline,
      content: (
        <TimelineSection onAllCardsApprovedChange={onAllCardsApprovedChange} />
      ),
    },
    {
      label: DUMMY_TABS_LABELS.jobOverview,
      content: <JobOverviewSection {...engineerJobOverview} />,
    },
    {
      label: DUMMY_TABS_LABELS.workLocation,
      content: (
        <WorkLocationMap
          latitude={MAP_DEFAULTS.latitude}
          longitude={MAP_DEFAULTS.longitude}
          locationName={MAP_DEFAULTS.locationName}
          address={MAP_DEFAULTS.address}
        />
      ),
    },
    ...(showManageProposals
      ? [
        {
          label: DUMMY_TABS_LABELS.manageProposals,
          content: (
            <ManageProposalsTab
              remainingProposals={remainingProposals}
              acceptedProposals={acceptedProposals}
              rejectedProposals={rejectedProposals}
              onAcceptProposal={handleAcceptProposal}
              onRejectProposal={handleRejectProposal}
            />
          ),
        },
      ]
      : []),
  ];

  const tabs = isDummyNetworkEngineer ? dummyTabs : baseTabs;
  const defaultTab = isDummyNetworkEngineer
    ? DUMMY_TABS_LABELS.defaultTab
    : "Job Information";

  return (
    <div>
      {isSendProposal ? (
        <SendProposal jobId={Number(jobID)} />
      ) : (
        <TabComponent
          tabs={tabs}
          defaultActiveTab={activeTab || defaultTab}
          onTabChange={onTabChange}
        />
      )}
    </div>
  );
};

export default JobTabSection;
