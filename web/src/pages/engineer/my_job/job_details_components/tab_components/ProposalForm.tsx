import React from "react";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { TextareaInput } from "@/shared/components/commonUI/inputs";
import { JOB_TAB_COPY, JOB_TAB_CONFIG, JOB_TAB_LABELS } from "@/shared/constants/jobTabs";
import { IoClose } from "react-icons/io5";
import type { ProposalFormData } from "../../types.d";
import type { UseFormReturn } from "react-hook-form";

/**
 * Proposal form component for submitting job proposals with review functionality
 *
 * Renders a form for engineers to submit job proposals with description and file attachments.
 * Includes a conditional review modal for confirming proposal details before submission.
 * Handles form validation, file uploads, and success state management.
 *
 * @param {Object} props - The component props.
 * @param {UseFormReturn<ProposalFormData>} props.methods - React Hook Form methods for form management.
 * @param {Function} props.onSubmit - Callback function triggered when form is submitted.
 * @param {string[]} props.attachmentFiles - Array of attachment file names.
 * @param {boolean} props.showReview - Whether to display the review modal instead of form.
 * @param {Function} props.setShowReview - Function to toggle review modal visibility.
 * @param {Function} props.setShowSuccess - Function to show success overlay after submission.
 * @param {Function} [props.setSubmittedProposal] - Optional function to store submitted proposal data.
 * @param {Function} [props.setSendProposal] - Optional function to control proposal sending state.
 * @param {Function} [props.setSelectedTab] - Optional function to switch active tab after submission.
 * @param {ProposalFormData | null} props.reviewData - Proposal data to display in review modal.
 * @param {boolean} [props.isDummyNetworkEngineer] - Optional flag for dummy network engineer flow (defaults to false).
 * @returns {JSX.Element} A form component or review modal depending on showReview state.
 *
 * @example
 * <ProposalForm
 *   methods={useForm<ProposalFormData>()}
 *   onSubmit={handleSubmit}
 *   attachmentFiles={files}
 *   showReview={isReviewMode}
 *   setShowReview={setIsReviewMode}
 *   setShowSuccess={setSuccess}
 *   reviewData={formData}
 * />
 */
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
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
                        aria-label="Remove attachment"
                      >
                        <IoClose size={16} />
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

export default ProposalForm;
