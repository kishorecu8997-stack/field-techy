import React from "react";
import { IoAttach } from "react-icons/io5";
import { Button } from "@/shared/components/commonUI/Buttons";
import { DUMMY_TABS_LABELS } from "@/dummy_data/jobTabs/jobsectiondata";
import { networkEngineerProposals } from "@/dummy_data/jobTabs/networkEngineerProposals";

interface ManageProposalsTabProps {
  remainingProposals: number;
  acceptedProposals: string[];
  rejectedProposals: string[];
  onAcceptProposal: (proposalId: string) => void;
  onRejectProposal: (proposalId: string) => void;
}

/**
 * ManageProposalsTab - Renders the proposals list with accept/reject actions
 */
const ManageProposalsTab: React.FC<ManageProposalsTabProps> = ({
  remainingProposals,
  acceptedProposals,
  rejectedProposals,
  onAcceptProposal,
  onRejectProposal,
}) => {
  return (
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
                onClick={() => onRejectProposal(proposal.id)}
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
                onClick={() => onAcceptProposal(proposal.id)}
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
  );
};

export default ManageProposalsTab;
