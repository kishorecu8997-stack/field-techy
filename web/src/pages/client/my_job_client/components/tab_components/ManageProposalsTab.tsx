import React, { useState } from "react";
import { IoAttach } from "react-icons/io5";
import { Button } from "@/shared/components/commonUI/Buttons";
import { DUMMY_TABS_LABELS } from "@/dummy_data/jobTabs/jobsectiondata";
import { useClientActionOnAssignment } from "@/shared/apiServices/client/clientOpenApiService";
import { clientGetAssignmentDetailsQueryKey } from "@/api/@tanstack/react-query.gen";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";

interface ManageProposalsTabProps {
  assignments?: Array<{
    assignmentId: number;
    jobId: number;
    engineerId: number;
    assignmentStatus: string;
    proposalDetail?: string | null;
    proposalAttachmentUrl?: string | null;
    proposalAttachmentId?: number | null;
    appliedAt?: string | null;
    invitedAt?: string | null;
    engineer?: {
      id: number;
      name?: string;
      email?: string;
      profileImageUrl?: string;
    };
  }>;
  isLoading?: boolean;
  jobId?: number;
}

/**
 * ManageProposalsTab - Renders the proposals list with accept/reject actions
 * Uses API data from useClientGetAssignmentDetails
 */
const ManageProposalsTab: React.FC<ManageProposalsTabProps> = ({
  assignments = [],
  isLoading = false,
  // jobId kept for future use
}) => {
  const [acceptedProposals, setAcceptedProposals] = useState<string[]>([]);
  const [rejectedProposals, setRejectedProposals] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { mutateAsync: actionOnAssignment } = useClientActionOnAssignment({
    onSuccess: () => {
      toast.success("Proposal action completed successfully");
      // Invalidate assignment queries to refresh timeline
      queryClient.invalidateQueries({
        queryKey: clientGetAssignmentDetailsQueryKey(),
        predicate: (query): boolean =>
          !!(query.queryKey[0] &&
          typeof query.queryKey[0] === "object" &&
          "_id" in query.queryKey[0] &&
          query.queryKey[0]._id === "clientGetAssignmentDetails"),
      });
      window.location.reload()
    },
    onError: (error) => {
      console.error("Failed to action on proposal:", error);
      toast.error("Failed to process proposal. Please try again.");
    },
  });

  const handleAcceptProposal = async (assignmentId: number) => {
    try {
      await actionOnAssignment({
        body: {
          assignmentId: assignmentId,
          pendingApproval: "application",
          action: "approve",
        },
      });
      setAcceptedProposals((prev) => [...prev, String(assignmentId)]);
    } catch (error) {
      // Error is handled in onError callback
      console.error("Accept proposal error:", error);
    }
  };

  const handleRejectProposal = async (assignmentId: number) => {
    try {
      await actionOnAssignment({
        body: {
          assignmentId: assignmentId,
          pendingApproval: "application",
          action: "reject",
        },
      });
      setRejectedProposals((prev) => [...prev, String(assignmentId)]);
    } catch (error) {
      // Error is handled in onError callback
      console.error("Reject proposal error:", error);
    }
  };

  // Filter proposals that haven't been processed yet
  // Also filter out proposals that are already approved/accepted from the API
  // Also filter out proposals where job has started (start_pending_approval, started, submitted, etc.)
  // Also filter out rejected proposals
  const processedStatuses = [
    "accepted",
    "assigned",
    "approved",
    "start_pending_approval",
    "started",
    "submit_pending_approval",
    "submitted",
    "rejected",
  ];
  const remainingProposals = assignments.filter(
    (proposal) =>
      !processedStatuses.includes(
        proposal.assignmentStatus?.toLowerCase() || "",
      ) &&
      !acceptedProposals.includes(String(proposal.assignmentId)) &&
      !rejectedProposals.includes(String(proposal.assignmentId)),
  );

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center min-h-[200px]">
        <LoaderComponent />
      </div>
    );
  }

  if (!assignments || assignments.length === 0) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
        <p className="text-gray-600 dark:text-gray-400">
          No proposals received yet.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg break-words">
      <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
        {`${DUMMY_TABS_LABELS.proposalsHeading} (${remainingProposals.length})`}
      </h3>

      {remainingProposals.map((proposal, idx) => (
        <div
          key={proposal.assignmentId}
          className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 break-words"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{`${DUMMY_TABS_LABELS.proposalPrefix} ${idx + 1}`}</p>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {proposal.engineer?.name || `Engineer #${proposal.engineerId}`}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Status: {proposal.assignmentStatus}
              </p>
            </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
              {proposal.appliedAt || proposal.invitedAt
                ? `${DUMMY_TABS_LABELS.receivedOn} ${new Date(
                    proposal.appliedAt || proposal.invitedAt || "",
                  ).toLocaleDateString()}`
                : ""}
            </span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap break-words">
            {proposal.proposalDetail || "No proposal details provided"}
          </p>
          {(proposal.proposalAttachmentUrl || proposal.proposalAttachmentId) && (
            <div className="mb-4">
              <a
                href={proposal.proposalAttachmentUrl || `#`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-700 dark:text-gray-300 max-w-full break-all hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                <IoAttach
                  className="w-4 h-4 flex-shrink-0"
                  aria-hidden="true"
                />
                View Attachment
              </a>
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <Button
              variant="no_style"
              onClick={() => handleRejectProposal(proposal.assignmentId)}
              disabled={rejectedProposals.includes(
                String(proposal.assignmentId),
              )}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
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
              onClick={() => handleAcceptProposal(proposal.assignmentId)}
              disabled={acceptedProposals.includes(
                String(proposal.assignmentId),
              )}
              className="px-6 py-2 bg-green-800 hover:bg-green-900 text-white rounded transition font-medium disabled:opacity-50"
            >
              {DUMMY_TABS_LABELS.accept}
            </Button>
          </div>
        </div>
      ))}

      {remainingProposals.length === 0 && (
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
