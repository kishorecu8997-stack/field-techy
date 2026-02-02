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
import {
  JOB_STATUSES,
  type JobStatus,
  type OfferedJobStatusType,
} from "@/pages/engineer/search_result/types";
import Proposal from "@/shared/components/Proposal";
import TabComponent from "@/shared/components/TabComponent";
import JobOverviewSection from "@/shared/components/JobOverviewSection";
import WorkLocationMap from "@/shared/components/WorkLocationMap";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import { MAP_DEFAULTS } from "@/shared/constants/mapDefaults";
import { JOB_TAB_COPY, JOB_TAB_CONFIG, JOB_TAB_LABELS } from "@/shared/constants/jobTabs";
import LogComponent from "./tab_components/LogComponent";
import JobInfoSection from "./tab_components/JobInfoSection";
import LocationMap from "./tab_components/LocationMap";
import WorkSubmissionComponent from "./tab_components/WorkSubmissionComponent";
import ProposalInfoTab from "./tab_components/ProposalInfoTab";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "react-toastify";

/**
 * Renders a tabbed section for job details based on the current job status.
 *
 * This component conditionally displays various tabs such as Logs, Work Submissions,
 * Job Information, Requirements, SPOC Details, Other Proposals, and Terms & Conditions.
 * Certain tabs (e.g., Logs and Work Submissions) are hidden when the job status is 'applied'.
 *
 * @param {Object} props - The component props.
 * @param {JobStatus} props.status - The current status of the job (e.g., 'applied', 'in_progress').
 * @returns {JSX.Element} A tabbed interface containing job-related information sections.
 *
 * @example
 * <JobTabSection status={JOB_STATUSES.in_progress} />
 */
interface ProposalFormData {
  proposalDescription: string;
  attachments: FileList | null;
}

const JobTabSection = ({
  status,
  isWorkSubmitted,
  isSendProposal,
  setSendProposal,
  activeTab,
  OfferJobStatus,
  isDummyJob,
  workLocation,
  isDummyNetworkEngineer = false,
  showManageProposals = true,
}: {
  status: JobStatus;
  isWorkSubmitted?: boolean;
  isSendProposal?: boolean;
  setSendProposal?: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab?: string;
  OfferJobStatus?: OfferedJobStatusType;
  isDummyJob?: boolean;
  workLocation?: string;
  isDummyNetworkEngineer?: boolean;
  showManageProposals?: boolean;
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
  const [submittedProposal, setSubmittedProposal] = useState<ProposalFormData | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>(activeTab || JOB_TAB_LABELS.jobOverview);

  useEffect(() => {
    document.body.style.overflow = showSuccess || showReview ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showSuccess, showReview]);

  useEffect(() => {
    if (submittedProposal && !isSendProposal && isDummyNetworkEngineer) {
      setSelectedTab(JOB_TAB_LABELS.proposalInfo);
    }
  }, [submittedProposal, isSendProposal, isDummyNetworkEngineer]);

  const onSubmit = (data: ProposalFormData) => {
    setReviewData(data);
    setShowReview(true);
  };

  const attachmentFiles = reviewData?.attachments
    ? Array.from(reviewData.attachments).map((file) => file.name)
    : [];

  const shouldHideLogs = !(
    status === JOB_STATUSES.inprogress ||
    status === JOB_STATUSES.completed ||
    OfferJobStatus === "checked-in"
  );

  // Network Engineer dummy flow
  if (isDummyNetworkEngineer) {
    const remainingProposals = Math.max(networkEngineerProposals.length - acceptedProposals.length, 0);

    const networkEngineerTabs = [
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
              content: <ProposalInfoTab submittedProposal={submittedProposal} />,
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
                    .filter((proposal) => !acceptedProposals.includes(proposal.id))
                    .map((proposal, idx) => (
                      <div
                        key={proposal.id}
                        className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 break-words"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{`Proposal ${idx + 1}`}</p>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{proposal.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{proposal.role}</p>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{`${JOB_TAB_COPY.receivedOnPrefix}${proposal.receivedOn}`}</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap break-words">{proposal.description}</p>
                        {proposal.attachmentName && (
                          <div className="mb-4">
                            <div className="inline-block bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-700 dark:text-gray-300 max-w-full break-all">
                              📎 {proposal.attachmentName}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-3 justify-end">
                          <Button
                            variant="no_style"
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
                            onClick={() => {
                              setAcceptedProposals([...acceptedProposals, proposal.id]);
                              toast.success(JOB_TAB_COPY.proposalAccepted, { position: "top-right" });
                            }}
                            className="px-6 py-2 bg-green-800 hover:bg-green-900 text-white rounded transition font-medium"
                          >
                            {JOB_TAB_COPY.accept}
                          </Button>
                        </div>
                      </div>
                    ))}

                  {acceptedProposals.length >= networkEngineerProposals.length && (
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg text-center">
                      <p className="text-gray-600 dark:text-gray-400">{JOB_TAB_COPY.allProcessed}</p>
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
          <TabComponent tabs={networkEngineerTabs} defaultActiveTab={selectedTab} />
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
        {showSuccess && <SuccessOverlay onClose={() => setShowSuccess(false)} />}
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
      content: <WorkSubmissionComponent workSubmissions={workSubmissions} isWorkSubmitted={isWorkSubmitted} />,
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
            content: <Proposal jobTitle={requirements.jobTitle} terms={requirements.terms} />,
          },
          {
            label: JOB_TAB_LABELS.spocDetails,
            content: <LocationMap />,
          },
          {
            label: JOB_TAB_LABELS.other,
            content: <Proposal jobTitle={otherProposal.jobTitle} terms={otherProposal.terms} />,
          },
          {
            label: JOB_TAB_LABELS.terms,
            content: <Proposal jobTitle={termsData.jobTitle} terms={termsData.terms} />,
          },
        ]),
  ];

  return (
    <div>
      {!isSendProposal ? (
          <TabComponent
            tabs={tabs}
            defaultActiveTab={activeTab || (isDummyJob ? JOB_TAB_LABELS.jobOverview : JOB_TAB_LABELS.jobInformation)}
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

const ProposalForm = ({
  methods,
  onSubmit,
  attachmentFiles,
  showReview,
  setShowReview,
  setShowSuccess,
  setSubmittedProposal,
  setSendProposal,
  setSelectedTab,
  reviewData,
  isDummyNetworkEngineer = false,
}: {
  methods: UseFormReturn<ProposalFormData>;
  onSubmit: (data: ProposalFormData) => void;
  attachmentFiles: string[];
  showReview: boolean;
  setShowReview: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setSubmittedProposal?: React.Dispatch<React.SetStateAction<ProposalFormData | null>>;
  setSendProposal?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTab?: React.Dispatch<React.SetStateAction<string>>;
  reviewData: ProposalFormData | null;
  isDummyNetworkEngineer?: boolean;
}) => (
  <>
    {!showReview ? (
      <div className="rounded-lg overflow-hidden border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6 text-teal-900 dark:text-teal-100">{JOB_TAB_COPY.sectionTitle}</h3>
          <FormContainer methods={methods} onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-6">
              <TextareaInput
                name="proposalDescription"
                label={JOB_TAB_COPY.proposalDescriptionLabel}
                placeholder={JOB_TAB_COPY.proposalDescriptionPlaceholder}
                required
                rules={{
                  required: JOB_TAB_COPY.proposalDescriptionRequired,
                }}
              />

              <FileUpload
                name="attachments"
                label={JOB_TAB_COPY.attachmentsLabel}
                placeholder={JOB_TAB_COPY.attachmentsLabel}
                accept={JOB_TAB_CONFIG.fileUpload.accept}
                required={false}
                maxPages={JOB_TAB_CONFIG.fileUpload.maxPages}
              />
            </div>

            <div className="flex gap-3 justify-end mt-8">
              <Button
                variant="no_style"
                type="button"
                onClick={() => {
                  if (setSendProposal) setSendProposal(false);
                }}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                {JOB_TAB_COPY.cancel}
              </Button>
              <Button
                variant="no_style"
                type="submit"
                className="px-6 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 transition"
              >
                {JOB_TAB_COPY.reviewProposal}
              </Button>
            </div>
          </FormContainer>
        </div>
      </div>
    ) : (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[420px] max-w-[90vw] mx-4 p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{JOB_TAB_COPY.sendProposalTitle}</h2>

          <div className="space-y-6 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{JOB_TAB_COPY.proposalDescriptionLabel}</h3>
              <div className="whitespace-pre-wrap break-words text-gray-900 dark:text-gray-100">{reviewData?.proposalDescription}</div>
            </div>

            {attachmentFiles.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{JOB_TAB_COPY.attachmentsTitle}</h3>
                <div className="flex flex-wrap gap-2">
                  {attachmentFiles.map((fileName, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-full text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2"
                    >
                      {fileName}
                      <button
                        type="button"
                        onClick={() => {
                          // optional file removal placeholder
                        }}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
                        aria-label="Remove attachment"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex gap-2 justify-end">
            <Button
              variant="no_style"
              type="button"
              onClick={() => setShowReview(false)}
              className="px-4 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              {JOB_TAB_COPY.cancel}
            </Button>
            <Button
              variant="no_style"
              type="button"
              onClick={() => setShowReview(false)}
              className="px-4 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              {JOB_TAB_COPY.editDetails}
            </Button>
            <Button
              variant="no_style"
              type="button"
              onClick={() => {
                setShowReview(false);
                setShowSuccess(true);
                setTimeout(() => {
                  setShowSuccess(false);
                  const data = reviewData || methods.getValues();
                  if (setSubmittedProposal) setSubmittedProposal(data);
                  if (setSendProposal) setSendProposal(false);
                  if (isDummyNetworkEngineer && setSelectedTab) setSelectedTab(JOB_TAB_LABELS.proposalInfo);
                  methods.reset();
                }, JOB_TAB_CONFIG.successDelayMs);
              }}
              className="px-4 py-1.5 bg-teal-700 text-sm text-white rounded-md hover:bg-teal-800 transition"
            >
              {JOB_TAB_COPY.submitProposal}
            </Button>
          </div>
        </div>
      </div>
    )}
  </>
);

const SuccessOverlay = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg w-[380px] max-w-[92vw] mx-4 p-6 text-center">
      <Button
        variant="no_style"
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 text-2xl"
        aria-label="Close"
      >
        ×
      </Button>
      <div className="mx-auto mb-4 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-12 h-12 text-teal-700" fill="currentColor" aria-hidden="true">
          <path d="M12 2.25a.75.75 0 01.53.22l1.72 1.72 2.34-.2a.75.75 0 01.8.57l.62 2.26 2.12 1.04a.75.75 0 01.36.97l-.95 2.14 1.14 2.05a.75.75 0 01-.28.99l-2 1.2-.24 2.34a.75.75 0 01-.72.66l-2.33.1-1.54 1.75a.75.75 0 01-1.12 0l-1.54-1.75-2.33-.1a.75.75 0 01-.72-.66l-.24-2.34-2-1.2a.75.75 0 01-.28-.99l1.14-2.05-.95-2.14a.75.75 0 01.36-.97l2.12-1.04.62-2.26a.75.75 0 01.8-.57l2.34.2 1.72-1.72a.75.75 0 01.53-.22z" />
          <path d="M9.53 12.47a.75.75 0 011.06 0l1.41 1.41 3.03-3.03a.75.75 0 111.06 1.06l-3.56 3.56a.75.75 0 01-1.06 0l-1.94-1.94a.75.75 0 010-1.06z" fill="white" />
        </svg>
      </div>
      <div className="text-gray-900 dark:text-gray-100 font-medium">{JOB_TAB_COPY.successMessage}</div>
    </div>
  </div>
);

export default JobTabSection;
