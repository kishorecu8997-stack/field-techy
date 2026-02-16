import {
  job,
  logs,
  otherProposal,
  requirements,
  termsData,
  workSubmissions,
} from "@/dummy_data/jobDetails";
import { engineerJobOverview } from "@/dummy_data/engineerJobOverview";
import { networkEngineerProposals } from "@/dummy_data/jobTabs/networkEngineerProposals";
import { useEffect, useState } from "react";
import { IoAttach } from "react-icons/io5";
import {
  JOB_STATUSES,
  type JobStatus,
  type AssignmentStatus,
} from "@/pages/engineer/search_result/types";
import type { OfferedJobStatusType } from "@/pages/engineer/my_job/types.d";
import Proposal from "@/shared/components/Proposal";
import TabComponent from "@/shared/components/TabComponent";
import JobOverviewSection from "@/shared/components/JobOverviewSection";
import WorkLocationMap from "@/shared/components/WorkLocationMap";
import { Button } from "@/shared/components/commonUI/Buttons";
import { MAP_DEFAULTS } from "@/shared/constants/mapDefaults";
import { JOB_TAB_COPY, JOB_TAB_LABELS } from "@/shared/constants/jobTabs";
import LogComponent from "./tab_components/LogComponent";
import JobInfoSection from "./tab_components/JobInfoSection";
import LocationMap from "./tab_components/LocationMap";
import WorkSubmissionComponent from "./tab_components/WorkSubmissionComponent";
import ProposalInfoTab from "./tab_components/ProposalInfoTab";
import ProposalForm from "./tab_components/ProposalForm";
import SuccessOverlay from "./tab_components/SuccessOverlay";
import TimelineSection from "./tab_components/TimelineSection";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { ProposalFormData } from "../types.d";
import { usePopupStore } from "@/shared/store/popupStore";
import type { ProgressUpdate } from "../types.d";

/**
 * Renders a tabbed section for job details based on the current job status.
 *
 * This component conditionally displays various tabs such as Logs, Work Submissions,
 * Job Information, Requirements, SPOC Details, Other Proposals, and Terms & Conditions.
 * Certain tabs (e.g., Logs and Work Submissions) are hidden when the job status is 'applied'.
 * @param {Object} props - The component props.
 * @param {JobStatus} props.status - The current status of the job (e.g., 'applied', 'in_progress').
 * @returns {JSX.Element} A tabbed interface containing job-related information sections.
 * @example
 * <JobTabSection status={JOB_STATUSES.in_progress} />
 */
const JobTabSection = ({
  status,
  isWorkSubmitted,
  isSendProposal,
  setSendProposal,
  activeTab,
  setActiveTab,
  OfferJobStatus,
  isDummyJob,
  workLocation,
  isDummyNetworkEngineer = false,
  showManageProposals = true,
  progressUpdates = [],
  onAddProgressUpdate,
  hideTimelineContent = false,
}: {
  status: JobStatus;
  isWorkSubmitted?: boolean;
  isSendProposal?: boolean;
  setSendProposal?: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab?: string;
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
  OfferJobStatus?: OfferedJobStatusType | AssignmentStatus;
  isDummyJob?: boolean;
  workLocation?: string;
  isDummyNetworkEngineer?: boolean;
  showManageProposals?: boolean;
  progressUpdates?: ProgressUpdate[];
  onAddProgressUpdate?: (update: ProgressUpdate) => void;
  hideTimelineContent?: boolean;
}) => {
  const methods = useForm<ProposalFormData>({
    defaultValues: {
      proposalDescription: "",
      attachments: null,
    },
  });

  const [showReview, setShowReview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [reviewData, setReviewData] = useState<ProposalFormData | null>(null);
  const [acceptedProposals, setAcceptedProposals] = useState<string[]>([]);
  const [rejectedProposals, setRejectedProposals] = useState<string[]>([]);
  const [submittedProposal, setSubmittedProposal] =
    useState<ProposalFormData | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>(
    activeTab || JOB_TAB_LABELS.jobOverview,
  );

  const { showPopup } = usePopupStore();

  useEffect(() => {
    document.body.style.overflow =
      showSuccess || showReview ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showSuccess, showReview]);

  useEffect(() => {
    if (submittedProposal && !isSendProposal && isDummyNetworkEngineer) {
      setSelectedTab(JOB_TAB_LABELS.proposalInfo);
    }
  }, [submittedProposal, isSendProposal, isDummyNetworkEngineer]);

  // Sync local selectedTab to parent's activeTab
  useEffect(() => {
    if (selectedTab !== activeTab) {
      setActiveTab?.(selectedTab);
    }
  }, [selectedTab, activeTab, setActiveTab]);

  const onSubmit = (data: ProposalFormData) => {
    setReviewData(data);
    setShowReview(true);
  };

  const attachmentFiles = reviewData?.attachments
    ? Array.from(reviewData.attachments).map((file) => file.name)
    : [];

  const neutralActiveTabClass =
    "bg-white border border-gray-300 text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-white";
  const neutralInactiveTabClass =
    "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700";

  const shouldHideLogs = !(
    status === JOB_STATUSES.inProgress ||
    status === JOB_STATUSES.closed ||
    OfferJobStatus === "started"
  );

  const activeTabClassName = hideTimelineContent
    ? neutralActiveTabClass
    : undefined;
  const inactiveTabClassName = hideTimelineContent
    ? neutralInactiveTabClass
    : undefined;



  // Network Engineer dummy flow
  if (isDummyNetworkEngineer) {
    const remainingProposals = Math.max(
      networkEngineerProposals.length -
      acceptedProposals.length -
      rejectedProposals.length,
      0,
    );

    const handleAcceptProposal = async (proposalId: string) => {
      await showPopup({
        title: JOB_TAB_COPY.acceptProposalTitle,
        body: JOB_TAB_COPY.acceptProposalBody,
        actionButtons: [
          {
            label: JOB_TAB_COPY.cancel,
            value: "cancel",
            variant: "secondary",
            action: async (close) => close(true),
          },
          {
            label: JOB_TAB_COPY.accept,
            value: "accept",
            variant: "primary",
            action: async (close) => {
              setAcceptedProposals([...acceptedProposals, proposalId]);
              toast.success(JOB_TAB_COPY.proposalAccepted, {
                position: "top-right",
              });
              close(true);
            },
          },
        ],
      });
    };

    const handleRejectProposal = async (proposalId: string) => {
      await showPopup({
        title: JOB_TAB_COPY.rejectProposalTitle,
        body: JOB_TAB_COPY.rejectProposalBody,
        actionButtons: [
          {
            label: JOB_TAB_COPY.cancel,
            value: "cancel",
            variant: "secondary",
            action: async (close) => close(true),
          },
          {
            label: JOB_TAB_COPY.reject,
            value: "reject",
            variant: "danger",
            action: async (close) => {
              setRejectedProposals([...rejectedProposals, proposalId]);
              toast.error(JOB_TAB_COPY.proposalRejected, {
                position: "top-right",
              });
              close(true);
            },
          },
        ],
      });
    };

    const networkEngineerTabs = [
      {
        label: JOB_TAB_LABELS.timeline,
        content:
          hideTimelineContent && selectedTab === JOB_TAB_LABELS.timeline ? (
            <div className="h-1" aria-hidden />
          ) : (
            <TimelineSection
              OfferJobStatus={OfferJobStatus}
              progressUpdates={progressUpdates}
              onAddProgressUpdate={onAddProgressUpdate}
            />
          ),
      },
      {
        label: JOB_TAB_LABELS.jobOverview,
        content: <JobOverviewSection {...engineerJobOverview} />,
      },
      {
        label: JOB_TAB_LABELS.workLocation,
        content: (
          <WorkLocationMap
            latitude={MAP_DEFAULTS.latitude}
            longitude={MAP_DEFAULTS.longitude}
            locationName={MAP_DEFAULTS.locationName}
            address={workLocation || MAP_DEFAULTS.address}
          />
        ),
      },
      ...(submittedProposal
        ? [
          {
            label: JOB_TAB_LABELS.proposalInfo,
            content: (
              <ProposalInfoTab submittedProposal={submittedProposal} />
            ),
          },
        ]
        : []),
      ...(showManageProposals
        ? [
          {
            label: JOB_TAB_LABELS.manageProposals,
            content: (
              <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg break-words">
                <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">{`${JOB_TAB_COPY.totalProposalsLabel} (${remainingProposals})`}</h3>

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
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{`Proposal ${idx + 1}`}</p>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {proposal.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {proposal.role}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{`${JOB_TAB_COPY.receivedOnPrefix}${proposal.receivedOn}`}</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap break-words">
                        {proposal.description}
                      </p>
                      {proposal.attachmentName && (
                        <div className="mb-4">
                          <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-700 dark:text-gray-300 max-w-full break-all">
                            <IoAttach
                              className="w-4 h-4 flex-shrink-0"
                              aria-hidden="true"
                            />
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
                          {JOB_TAB_COPY.reject}
                        </Button>
                        <Button
                          variant="no_style"
                          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                          {JOB_TAB_COPY.viewProfile}
                        </Button>
                        <Button
                          variant="no_style"
                          onClick={() => handleAcceptProposal(proposal.id)}
                          className="px-6 py-2 bg-green-800 hover:bg-green-900 text-white rounded transition font-medium"
                        >
                          {JOB_TAB_COPY.accept}
                        </Button>
                      </div>
                    </div>
                  ))}

                {acceptedProposals.length + rejectedProposals.length >=
                  networkEngineerProposals.length && (
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg text-center">
                      <p className="text-gray-600 dark:text-gray-400">
                        {JOB_TAB_COPY.allProcessed}
                      </p>
                    </div>
                  )}
              </div>
            ),
          },
        ]
        : []),
    ];

    return (
      <div>
        {!isSendProposal ? (
          <TabComponent
            tabs={networkEngineerTabs}
            defaultActiveTab={selectedTab}
            neutralActiveTabClass={neutralActiveTabClass}
            neutralInactiveTabClass={neutralInactiveTabClass}
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
            reviewData={reviewData}
            isDummyNetworkEngineer
          />
        )}
        {showSuccess && (
          <SuccessOverlay onClose={() => setShowSuccess(false)} />
        )}
      </div>
    );
  }

  // Generic tabs
  const tabs = [
    {
      label: JOB_TAB_LABELS.logs,
      content: <LogComponent logs={logs} />,
      hide: shouldHideLogs,
    },
    {
      label: JOB_TAB_LABELS.workSubmissions,
      content: (
        <WorkSubmissionComponent
          workSubmissions={workSubmissions}
          isWorkSubmitted={isWorkSubmitted}
        />
      ),
      hide: shouldHideLogs,
    },
    ...(submittedProposal
      ? [
        {
          label: JOB_TAB_LABELS.proposalInfo,
          content: <ProposalInfoTab submittedProposal={submittedProposal} />,
        },
      ]
      : []),
    ...(isDummyJob
      ? [
        {
          label: JOB_TAB_LABELS.jobOverview,
          content: <JobOverviewSection {...engineerJobOverview} />,
        },
        {
          label: JOB_TAB_LABELS.workLocation,
          content: (
            <WorkLocationMap
              latitude={MAP_DEFAULTS.latitude}
              longitude={MAP_DEFAULTS.longitude}
              locationName={MAP_DEFAULTS.locationName}
              address={workLocation || MAP_DEFAULTS.address}
            />
          ),
        },
      ]
      : [
        {
          label: JOB_TAB_LABELS.jobInformation,
          content: <JobInfoSection jobInfo={job} />,
        },
        {
          label: JOB_TAB_LABELS.requirement,
          content: (
            <Proposal
              jobTitle={requirements.jobTitle}
              terms={requirements.terms}
            />
          ),
        },
        {
          label: JOB_TAB_LABELS.spocDetails,
          content: <LocationMap />,
        },
        {
          label: JOB_TAB_LABELS.other,
          content: (
            <Proposal
              jobTitle={otherProposal.jobTitle}
              terms={otherProposal.terms}
            />
          ),
        },
        {
          label: JOB_TAB_LABELS.terms,
          content: (
            <Proposal jobTitle={termsData.jobTitle} terms={termsData.terms} />
          ),
        },
      ]),
  ];

  return (
    <div>
      {!isSendProposal ? (
        <TabComponent
          tabs={tabs}
          defaultActiveTab={
            activeTab ||
            (isDummyJob
              ? JOB_TAB_LABELS.jobOverview
              : JOB_TAB_LABELS.jobInformation)
          }
          activeClassName={activeTabClassName}
          inactiveClassName={inactiveTabClassName}
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
          reviewData={reviewData}
        />
      )}
      {showSuccess && <SuccessOverlay onClose={() => setShowSuccess(false)} />}
    </div>
  );
};

export default JobTabSection;
