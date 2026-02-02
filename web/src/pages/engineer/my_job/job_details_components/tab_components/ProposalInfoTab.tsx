import React from "react";
import { JOB_TAB_COPY, JOB_TAB_CONFIG } from "@/shared/constants/jobTabs";

interface ProposalFormData {
  proposalDescription: string;
  attachments: FileList | null;
}

interface ProposalInfoTabProps {
  submittedProposal: ProposalFormData;
}

/**
 * Reusable component to display submitted proposal information
 * Renders proposal description and attachments in a styled container
 */
const ProposalInfoTab: React.FC<ProposalInfoTabProps> = ({
  submittedProposal,
}) => (
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

      {submittedProposal.attachments &&
        submittedProposal.attachments.length > 0 && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 max-w-full break-all">
              📎 {Array.from(submittedProposal.attachments)[0].name}
            </div>
          </div>
        )}
    </div>
  </div>
);

export default ProposalInfoTab;
