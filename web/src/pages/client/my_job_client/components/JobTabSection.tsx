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
import { JOB_STATUSES } from "@/pages/client/search_result/types";
import type { JobTabSectionProps } from "../types";
import SendProposal from "@/pages/engineer/home/components/SendProposal";
import Proposal from "@/shared/components/Proposal";
import JobOverviewSection from "@/shared/components/JobOverviewSection";
import TabComponent from "@/shared/components/TabComponent";
import WorkLocationMap from "@/shared/components/WorkLocationMap";
import { Button } from "@/shared/components/commonUI/Buttons";
import { MAP_DEFAULTS } from "@/shared/constants/mapDefaults";
import { usePopupStore } from "@/shared/store/popupStore";
import JobInfoSection from "./tab_components/JobInfoSection";
import LocationMap from "./tab_components/LocationMap";
import LogComponent from "./tab_components/LogComponent";
import TimelineSection from "./tab_components/TimelineSection";
import WorkSubmissionComponent from "./tab_components/WorkSubmissionComponent";
import { IoAttach } from "react-icons/io5";
import { toast } from "react-toastify";

const DUMMY_TABS_LABELS = {
  timeline: "Timeline",
  jobOverview: "Job Overview",
  workLocation: "Work Location",
  manageProposals: "Manage Proposals",
  proposalsHeading: "Total Proposals",
  proposalPrefix: "Proposal",
  receivedOn: "Received on:",
  reject: "Reject",
  viewProfile: "View Profile",
  accept: "Accept",
  allProcessed: "All proposals processed.",
  defaultTab: "Job Overview",
};

const PROPOSAL_POPUP_COPY = {
  acceptTitle: "Accept Proposal",
  acceptBody: "Are you sure you want to accept this proposal?",
  rejectTitle: "Reject Proposal",
  rejectBody: "Are you sure you want to reject this proposal?",
  cancelLabel: "Cancel",
  acceptLabel: "Accept",
  rejectLabel: "Reject",
} as const;

const PROPOSAL_TOAST_MESSAGES = {
  accepted: "Proposal accepted successfully",
  rejected: "Proposal rejected successfully",
} as const;


/**
 * Client job tab section with conditional rendering for real jobs vs. dummy network engineer flows.
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
    { label: DUMMY_TABS_LABELS.timeline, content: <TimelineSection /> },
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
              <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg break-words">
                <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
                  {`${DUMMY_TABS_LABELS.proposalsHeading} (${remainingProposals})`}
                </h3>

                {networkEngineerProposals
                  .filter(
                    (proposal) =>
                      !acceptedProposals.includes(proposal.id) &&
                      !rejectedProposals.includes(proposal.id),
                  )
                  .map((proposal, idx) => (
                    <div
                      key={proposal.id}
                      className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 break-words"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{`${DUMMY_TABS_LABELS.proposalPrefix} ${idx + 1}`}</p>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {proposal.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {proposal.role}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{`${DUMMY_TABS_LABELS.receivedOn} ${proposal.receivedOn}`}</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap break-words">
                        {proposal.description}
                      </p>
                      {proposal.attachmentName && (
                        <div className="mb-4">
                          <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-700 dark:text-gray-300 max-w-full break-all">
                            <IoAttach className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                            {proposal.attachmentName}
                          </div>
                        </div>
                      )}
                      <div className="flex gap-3 justify-end">
                        <Button
                          variant="no_style"
                          onClick={() => handleRejectProposal(proposal.id)}
                          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                          {DUMMY_TABS_LABELS.reject}
                        </Button>
                        <Button
                          variant="no_style"
                          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                          {DUMMY_TABS_LABELS.viewProfile}
                        </Button>
                        <Button
                          variant="no_style"
                          onClick={() => handleAcceptProposal(proposal.id)}
                          className="px-6 py-2 bg-green-800 hover:bg-green-900 text-white rounded transition font-medium"
                        >
                          {DUMMY_TABS_LABELS.accept}
                        </Button>
                      </div>
                    </div>
                  ))}

                {acceptedProposals.length + rejectedProposals.length >=
                  networkEngineerProposals.length && (
                  <div className="p-6 bg-white dark:bg-gray-800 rounded-lg text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                      {DUMMY_TABS_LABELS.allProcessed}
                    </p>
                  </div>
                )}
              </div>
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
        <SendProposal />
      ) : (
        <TabComponent tabs={tabs} defaultActiveTab={activeTab || defaultTab} />
      )}
    </div>
  );
};

export default JobTabSection;
