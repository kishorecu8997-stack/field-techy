import React from "react";
import { JOB_TAB_COPY, JOB_TAB_CONFIG } from "@/shared/constants/jobTabs";
import { IoAttach } from "react-icons/io5";
import type { ProposalInfoTabProps } from "../../types.d";

/**
 * Type guard to check if the proposal data is from API (has attachmentUrl)
 */
function isApiProposalData(
  data: ProposalInfoTabProps['submittedProposal']
): data is { proposalDescription: string; attachments?: never; attachmentUrl?: string | null } {
  return 'attachmentUrl' in data;
}

/**
 * ProposalInfoTab Component
 *
 * Displays submitted proposal information including description and attachments.
 * Shows the proposal content in a styled container with timestamp and file attachments.
 *
 * <ProposalInfoTab submittedProposal={submittedProposal} />
 */
const ProposalInfoTab: React.FC<ProposalInfoTabProps> = ({
  submittedProposal,
}) => {
  // Check if this is API data or Form data
  const isApiData = isApiProposalData(submittedProposal);

  // State to hold the attachment URL (handles both API URLs and blob URLs)
  const [attachmentUrl, setAttachmentUrl] = React.useState<string | null>(null);

  // Create/revoke object URL for local file attachments to prevent memory leaks
  React.useEffect(() => {
    let objectUrl: string | null = null;

    if (isApiData) {
      // API data uses the existing attachmentUrl
      setAttachmentUrl(submittedProposal.attachmentUrl ?? null);
    } else if (submittedProposal.attachments && submittedProposal.attachments.length > 0) {
      // Create object URL for local file attachments
      objectUrl = URL.createObjectURL(submittedProposal.attachments[0]);
      setAttachmentUrl(objectUrl);
    } else {
      setAttachmentUrl(null);
    }

    // Cleanup: revoke the object URL when component unmounts or dependencies change
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [isApiData, submittedProposal.attachmentUrl, submittedProposal.attachments]);

  const attachmentName = isApiData
    ? "View Document"
    : submittedProposal.attachments
      ? submittedProposal.attachments[0]?.name ?? null
      : null;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg break-words">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 border border-gray-200 dark:border-gray-700 break-words">
        <div className="flex justify-between items-start">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {JOB_TAB_COPY.proposalDescriptionAndAttachments}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{`${JOB_TAB_COPY.sentOnPrefix}${JOB_TAB_CONFIG.defaultSentOn}`}</p>
        </div>

        <p className="text-sm leading-relaxed text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
          {submittedProposal.proposalDescription}
        </p>

        {attachmentUrl && attachmentName && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <a 
              href={attachmentUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 max-w-full break-all hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <IoAttach className="w-4 h-4" aria-hidden="true" />
              {attachmentName}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalInfoTab;
