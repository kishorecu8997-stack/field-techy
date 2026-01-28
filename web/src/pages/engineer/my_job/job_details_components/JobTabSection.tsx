import {
  job,
  logs,
  otherProposal,
  requirements,
  termsData,
  workSubmissions,
} from "@/dummy_data/jobDetails";
import { useState } from "react";
import {
  JOB_STATUSES,
  type JobStatus,
  type OfferedJobStatusType,
} from "@/pages/engineer/search_result/types";
import TabComponent from "@/shared/components/TabComponent";
import JobInfoSection from "./tab_components/JobInfoSection";
import LocationMap from "./tab_components/LocationMap";
import LogComponent from "./tab_components/LogComponent";
import WorkSubmissionComponent from "./tab_components/WorkSubmissionComponent";
import SendProposal from "@/pages/engineer/home/components/SendProposal";
import Proposal from "@/shared/components/Proposal";
import JobOverviewSection from "@/shared/components/JobOverviewSection";
import drillMachineImg from "@/assets/tools/drill-machine.png";
import crimpingToolImg from "@/assets/tools/crimping-tool.png";
import WorkLocationMap from "@/shared/components/WorkLocationMap";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
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
  // isJobAccepted,
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
  isJobAccepted?: boolean;
}) => {
  // Initialize hooks at the top level (not conditionally)
  const methods = useForm({
    defaultValues: {
      proposalDescription: "",
      attachments: null,
    },
  });

  interface ProposalFormData {
    proposalDescription: string;
    attachments: FileList | null;
  }

  const [showReview, setShowReview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [reviewData, setReviewData] = useState<ProposalFormData | null>(null);
  const [acceptedProposals, setAcceptedProposals] = useState<string[]>([]);
  const [submittedProposal, setSubmittedProposal] = useState<ProposalFormData | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>(activeTab || "Job Overview");

  // Prevent scrolling when success popup or review modal is shown
  useEffect(() => {
    if (showSuccess || showReview) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showSuccess, showReview]);

  // When a proposal is stored and the form is closed, ensure the Proposal Info tab becomes active
  useEffect(() => {
    if (submittedProposal && !isSendProposal && isDummyNetworkEngineer) {
      setSelectedTab("Proposal Info");
    }
  }, [submittedProposal, isSendProposal, isDummyNetworkEngineer]);

  const onSubmit = (data: ProposalFormData) => {
    setReviewData(data);
    setShowReview(true);
  };

  const attachmentFiles = reviewData?.attachments 
    ? Array.from(reviewData.attachments).map(f => f.name)
    : [];

  const shouldHideLogs = !(
    status === JOB_STATUSES.inprogress ||
    status === JOB_STATUSES.completed ||
    OfferJobStatus === "checked-in"
  );
  
  // Special tabs for Network Engineer dummy job
  if (isDummyNetworkEngineer) {
    const networkEngineerTabs = [
      {
        label: "Job Overview",
        content: (
          <JobOverviewSection
            jobTitle="Network Engineer"
            jobDescription="We are looking for a skilled Network Engineer to manage, maintain, and optimize our network infrastructure. The role involves troubleshooting network issues, ensuring system security, and supporting smooth business operations."
            skills={[
              "Cable Routing & Termination",
              "NVR Configuration",
              "IP Camera Installation",
            ]}
            tools={[
              { name: "Drill Machine", price: "₹2,000", image: drillMachineImg },
              { name: "Crimping Tool", price: "₹300", image: crimpingToolImg },
            ]}
            duration="25 Feb 2026 - 31 Mar 2026 (5 Weeks)"
            engagementModel="Weekly"
            experienceLevel="Level 2"
            numberOfVacancies={4}
            weeklyPay="₹2,000 × 5 weeks = ₹10,000"
            toolAllowance="₹2,300"
            totalPayment="₹12,300"
            weeklyPayNote="Weekly pay is paid every week. Tool allowance is paid once."
            additionalDetails={[
              "Testing Video Feed Must Be Recorded And Shared After Installation",
            ]}
            attachments={["Camera Layout Plan.pdf"]}
          />
        ),
      },
      {
        label: "Work Location",
        content: (
          <WorkLocationMap
            latitude={13.0827}
            longitude={80.2707}
            locationName="Work Location"
            address={workLocation || "Chennai, Tamil Nadu, India"}
          />
        ),
      },
      ...(submittedProposal
        ? [
            {
              label: "Proposal Info",
              content: (
                <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg break-words">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 border border-gray-200 dark:border-gray-700 break-words">
                    <div className="flex justify-between items-start">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">Proposal Description and Attachments</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Sent On: 05 Apr 2026, 1:05PM</p>
                    </div>

                    <p className="text-sm leading-relaxed text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
                      {submittedProposal.proposalDescription}
                    </p>

                    {submittedProposal.attachments && submittedProposal.attachments.length > 0 && (
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 max-w-full break-all">
                          📎 {Array.from(submittedProposal.attachments)[0].name}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ),
            },
          ]
        : []),
      ...(showManageProposals
        ? [
            {
              label: "Manage Proposals",
              content: (
                <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg break-words">
                  <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Total Proposals ({2 - acceptedProposals.length})</h3>
                  
                  {/* Proposal 1 */}
                  {!acceptedProposals.includes("albert") && (
                    <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 break-words">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Proposal 1</p>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Albert</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Network Engineer</p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Received On: 05 Apr 2026, 1:05PM</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap break-words">
                        I have hands-on experience as a Network Engineer in configuring, maintaining, and troubleshooting network systems. I have worked with LAN/WAN setups, IP camera installations, and NVR configuration. I can complete this job as per the given requirements and ensure proper testing and smooth network performance.
                      </p>
                      <div className="mb-4">
                        <div className="inline-block bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-700 dark:text-gray-300 max-w-full break-all">
                          📎 Network ConfigurationSamples.pdf
                        </div>
                      </div>
                      <div className="flex gap-3 justify-end">
                        <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                          Reject
                        </button>
                        <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                          View Profile
                        </button>
                        <button 
                          onClick={() => {
                            setAcceptedProposals([...acceptedProposals, "albert"]);
                            toast.success("Proposal accepted successfully!", { position: "top-right" });
                          }}
                          className="px-6 py-2 bg-green-800 hover:bg-green-900 text-white rounded transition font-medium"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Proposal 2 */}
                  {!acceptedProposals.includes("ram") && (
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 break-words">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Proposal 2</p>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Ram</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Network Engineer</p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Received On: 31 Mar 2026, 5:30PM</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap break-words">
                        I am a Network Engineer with experience in network setup, cable routing, and device configuration. I have handled on-site installations and ensured stable connectivity and proper testing after setup. I follow standard practices and will complete the work within the given timeline.
                      </p>
                      <div className="mb-4">
                        <div className="inline-block bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-700 dark:text-gray-300 max-w-full break-all">
                          📎 Site Installation Report.pdf
                        </div>
                      </div>
                      <div className="flex gap-3 justify-end">
                        <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                          Reject
                        </button>
                        <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                          View Profile
                        </button>
                        <button 
                          onClick={() => {
                            setAcceptedProposals([...acceptedProposals, "ram"]);
                            toast.success("Proposal accepted successfully!", { position: "top-right" });
                          }}
                          className="px-6 py-2 bg-green-800 hover:bg-green-900 text-white rounded transition font-medium"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  )}

                  {acceptedProposals.length === 2 && (
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg text-center">
                      <p className="text-gray-600 dark:text-gray-400">All proposals have been processed.</p>
                    </div>
                  )}
                </div>
              ),
            },
          ]
        : []),
    ];

    return (
      <div className="">
        {!isSendProposal ? (
          <TabComponent
            tabs={networkEngineerTabs}
            defaultActiveTab={selectedTab}
          />
        ) : isDummyNetworkEngineer ? (
          // Inline Dummy Job Proposal Form with Review Modal
          <>
            {!showReview ? (
              <div className="rounded-lg overflow-hidden border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-6 text-teal-900 dark:text-teal-100">Please fill these details</h3>
                  <FormContainer methods={methods} onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-6">
                      <TextareaInput
                        name="proposalDescription"
                        label="Proposal Description"
                        placeholder="Write your proposal..."
                        required
                        rules={{
                          required: "Proposal description is required",
                        }}
                      />

                      <FileUpload
                        name="attachments"
                        label="Attachments (Cover Letter, Docs etc.)"
                        placeholder="Attachments (Cover Letter, Docs etc.)"
                        accept=".pdf"
                        required={false}
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 justify-end mt-8">
                      <button
                        type="button"
                        onClick={() => {
                          if (setSendProposal) setSendProposal(false);
                        }}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 transition"
                      >
                        Review Proposal
                      </button>
                    </div>
                  </FormContainer>
                </div>
              </div>
            ) : (
              // Review Modal
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[420px] max-w-[90vw] mx-4 p-6">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Send Proposal</h2>
                  
                  <div className="space-y-6 mb-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Proposal Description</h3>
                      <div className="whitespace-pre-wrap break-words text-gray-900 dark:text-gray-100">
                        {reviewData?.proposalDescription}
                      </div>
                    </div>

                    {attachmentFiles.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Attachments</h3>
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
                                  // Remove file logic here if needed
                                }}
                                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
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
                    <button
                      type="button"
                      onClick={() => setShowReview(false)}
                      className="px-4 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReview(false)}
                      className="px-4 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      Edit Details
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowReview(false);
                        setShowSuccess(true);
                        setTimeout(() => {
                          // After success popup disappears, show Proposal Info with submitted data
                          const data = reviewData || methods.getValues();
                          setSubmittedProposal(data);
                          if (setSendProposal) setSendProposal(false); // show tabs again
                          setSelectedTab("Proposal Info");
                          setShowSuccess(false);
                          methods.reset();
                        }, 4000);
                      }}
                      className="px-4 py-1.5 bg-teal-700 text-sm text-white rounded-md hover:bg-teal-800 transition"
                    >
                      Submit Proposal
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <SendProposal />
        )}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg w-[380px] max-w-[92vw] mx-4 p-6 text-center">
              <button
                type="button"
                onClick={() => setShowSuccess(false)}
                className="absolute right-3 top-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 text-2xl"
                aria-label="Close"
              >
                ×
              </button>
              <div className="mx-auto mb-4 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-12 h-12 text-teal-700" fill="currentColor" aria-hidden="true">
                  {/* Star background */}
                  <path d="M12 2.25a.75.75 0 01.53.22l1.72 1.72 2.34-.2a.75.75 0 01.8.57l.62 2.26 2.12 1.04a.75.75 0 01.36.97l-.95 2.14 1.14 2.05a.75.75 0 01-.28.99l-2 1.2-.24 2.34a.75.75 0 01-.72.66l-2.33.1-1.54 1.75a.75.75 0 01-1.12 0l-1.54-1.75-2.33-.1a.75.75 0 01-.72-.66l-.24-2.34-2-1.2a.75.75 0 01-.28-.99l1.14-2.05-.95-2.14a.75.75 0 01.36-.97l2.12-1.04.62-2.26a.75.75 0 01.8-.57l2.34.2 1.72-1.72a.75.75 0 01.53-.22z" />
                  {/* Checkmark in center */}
                  <path d="M9.53 12.47a.75.75 0 01 1.06 0l1.41 1.41 3.03-3.03a.75.75 0 111.06 1.06l-3.56 3.56a.75.75 0 01-1.06 0l-1.94-1.94a.75.75 0 010-1.06z" fill="white" />
                </svg>
              </div>
              <div className="text-gray-900 dark:text-gray-100 font-medium">
                Proposal has been sent successfully
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Original tabs for other jobs
  const tabs = isDummyJob
    ? [
        {
          label: "Logs",
          content: <LogComponent logs={logs} />,
          hide: shouldHideLogs,
        },
        {
          label: "Work Submissions",
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
                label: "Proposal Info",
                content: (
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg break-words">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 border border-gray-200 dark:border-gray-700 break-words">
                      <div className="flex justify-between items-start">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Proposal Description and Attachments</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Sent On: 05 Apr 2026, 1:05PM</p>
                      </div>

                      <p className="text-sm leading-relaxed text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
                        {submittedProposal.proposalDescription}
                      </p>

                      {submittedProposal.attachments && submittedProposal.attachments.length > 0 && (
                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                          <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 max-w-full break-all">
                            📎 {Array.from(submittedProposal.attachments)[0].name}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ),
              },
            ]
          : []),
        {
          label: "Job Overview",
          content: (
            <JobOverviewSection
              jobTitle="Network Engineer"
              jobDescription="We are looking for a skilled Network Engineer to manage, maintain, and optimize our network infrastructure. The role involves troubleshooting network issues, ensuring system security, and supporting smooth business operations."
              skills={[
                "Cable Routing & Termination",
                "NVR Configuration",
                "IP Camera Installation",
              ]}
              tools={[
                { name: "Drill Machine", price: "₹2,000", image: drillMachineImg },
                { name: "Crimping Tool", price: "₹300", image: crimpingToolImg },
              ]}
              duration="25 Feb 2026 - 31 Mar 2026 (5 Weeks)"
              engagementModel="Weekly"
              experienceLevel="Level 2"
              numberOfVacancies={4}
              weeklyPay="₹2,000 × 5 weeks = ₹10,000"
              toolAllowance="₹2,300"
              totalPayment="₹12,300"
              weeklyPayNote="Weekly pay is paid every week. Tool allowance is paid once."
              additionalDetails={[
                "Testing Video Feed Must Be Recorded And Shared After Installation",
              ]}
              attachments={["Camera Layout Plan.pdf"]}
            />
          ),
        },
        {
          label: "Work Location",
          content: (
            <WorkLocationMap
              latitude={13.0827}
              longitude={80.2707}
              locationName="Work Location"
              address={workLocation || "Chennai, Tamil Nadu, India"}
            />
          ),
        },
        {
          label: "Proposal Info",
          content: (
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 border border-gray-200 dark:border-gray-700 break-words">
                <div className="flex justify-between items-start">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Proposal Description and Attachments</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sent On: 05 Apr 2026, 1:05PM</p>
                </div>

                <p className="text-sm leading-relaxed text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
                  I have hands-on experience as a Network Engineer in configuring, maintaining, and troubleshooting network systems. I have worked with LAN/WAN setups, IP camera installations, and NVR configuration. I can complete the job as per the given requirements and ensure proper testing and smooth network performance.
                </p>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 max-w-full break-all">
                    📎 Network Configuration Samples.pdf
                  </div>
                </div>
              </div>
            </div>
          ),
        },
      ]
    : [
        {
          label: "Logs",
          content: <LogComponent logs={logs} />,
          hide: shouldHideLogs,
        },
        {
          label: "Work Submissions",
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
                label: "Proposal Info",
                content: (
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 border border-gray-200 dark:border-gray-700 break-words">
                      <div className="flex justify-between items-start">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Proposal Description and Attachments</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Sent On: 05 Apr 2026, 1:05PM</p>
                      </div>

                      <p className="text-sm leading-relaxed text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
                        {submittedProposal.proposalDescription}
                      </p>

                      {submittedProposal.attachments && submittedProposal.attachments.length > 0 && (
                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                          <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 max-w-full break-all">
                            📎 {Array.from(submittedProposal.attachments)[0].name}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ),
              },
            ]
          : []),
        {
          label: "Job Information",
          content: <JobInfoSection jobInfo={job} />,
        },
        {
          label: "Requirement",
          content: (
            <Proposal jobTitle={requirements.jobTitle} terms={requirements.terms} />
          ),
        },
        {
          label: "SPOC Details",
          content: <LocationMap />,
        },
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

  // Tabs rendering logic

  return (
    <div className="">
      {!isSendProposal ? (
        <TabComponent
          tabs={tabs}
          defaultActiveTab={activeTab || (isDummyJob ? "Job Overview" : "Job Information")}
        />
      ) : isDummyJob ? (
        // Inline Dummy Job Proposal Form with Review Modal
        <>
          {!showReview ? (
            <div className="rounded-lg overflow-hidden border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-6 text-teal-900 dark:text-teal-100">Please fill these details</h3>
                <FormContainer methods={methods} onSubmit={onSubmit} className="space-y-6">
                  <div className="space-y-6">
                    <TextareaInput
                      name="proposalDescription"
                      label="Proposal Description"
                      placeholder="Write your proposal..."
                      required
                      rules={{
                        required: "Proposal description is required",
                      }}
                    />

                    <FileUpload
                      name="attachments"
                      label="Attachments (Cover Letter, Docs etc.)"
                      placeholder="Attachments (Cover Letter, Docs etc.)"
                      accept=".pdf"
                      required={false}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 justify-end mt-8">
                    <button
                      type="button"
                      onClick={() => {
                        if (setSendProposal) setSendProposal(false);
                      }}
                      className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 transition"
                    >
                      Review Proposal
                    </button>
                  </div>
                </FormContainer>
              </div>
            </div>
          ) : (
            // Review Modal
            <div className="fixed inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[420px] max-w-[90vw] mx-4 p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Send Proposal</h2>
                
                <div className="space-y-6 mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Proposal Description</h3>
                    <div className="whitespace-pre-wrap break-words text-gray-900 dark:text-gray-100">
                      {reviewData?.proposalDescription}
                    </div>
                  </div>

                  {attachmentFiles.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Attachments</h3>
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
                                // Remove file logic here if needed
                              }}
                              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
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
                  <button
                    type="button"
                    onClick={() => setShowReview(false)}
                    className="px-4 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReview(false)}
                    className="px-4 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Edit Details
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReview(false);
                      setShowSuccess(true);
                      setTimeout(() => {
                        setShowSuccess(false);
                        methods.reset();
                        if (setSendProposal) setSendProposal(false);
                      }, 4000);
                    }}
                    className="px-4 py-1.5 bg-teal-700 text-sm text-white rounded-md hover:bg-teal-800 transition"
                  >
                    Submit Proposal
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <SendProposal />
      )}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg w-[380px] max-w-[92vw] mx-4 p-6 text-center">
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="absolute right-3 top-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 text-2xl"
              aria-label="Close"
            >
              ×
            </button>
            <div className="mx-auto mb-4 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-12 h-12 text-teal-700" fill="currentColor" aria-hidden="true">
                {/* Star background */}
                <path d="M12 2.25a.75.75 0 01.53.22l1.72 1.72 2.34-.2a.75.75 0 01.8.57l.62 2.26 2.12 1.04a.75.75 0 01.36.97l-.95 2.14 1.14 2.05a.75.75 0 01-.28.99l-2 1.2-.24 2.34a.75.75 0 01-.72.66l-2.33.1-1.54 1.75a.75.75 0 01-1.12 0l-1.54-1.75-2.33-.1a.75.75 0 01-.72-.66l-.24-2.34-2-1.2a.75.75 0 01-.28-.99l1.14-2.05-.95-2.14a.75.75 0 01.36-.97l2.12-1.04.62-2.26a.75.75 0 01.8-.57l2.34.2 1.72-1.72a.75.75 0 01.53-.22z" />
                {/* Checkmark in center */}
                <path d="M9.53 12.47a.75.75 0 01 1.06 0l1.41 1.41 3.03-3.03a.75.75 0 111.06 1.06l-3.56 3.56a.75.75 0 01-1.06 0l-1.94-1.94a.75.75 0 010-1.06z" fill="white" />
              </svg>
            </div>
            <div className="text-gray-900 dark:text-gray-100 font-medium">
              Proposal has been sent successfully
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobTabSection;
