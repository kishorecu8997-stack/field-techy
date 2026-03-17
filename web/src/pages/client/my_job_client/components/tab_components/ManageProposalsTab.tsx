import React, { useState, useMemo } from "react";
import { IoAttach } from "react-icons/io5";
import { Button } from "@/shared/components/commonUI/Buttons";
import { DUMMY_TABS_LABELS } from "@/dummy_data/jobTabs/jobsectiondata";
import { useClientActionOnAssignment } from "@/shared/apiServices/client/clientOpenApiService";
import { clientGetAssignmentDetailsQueryKey } from "@/api/@tanstack/react-query.gen";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import Popup from "@/shared/components/Popup";
import { IoCloseSharp } from "react-icons/io5";
import { IoStar } from "react-icons/io5";
import { formatRating } from "@/utils/helpers";

interface Education {
  institute: string;
  degree: string;
  year?: number;
}

interface Engineer {
  id: number;
  name?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  profilePicture?: string | null;
  profilePictureId?: number | null;
  profilePictureUrl?: string | null;
  city?: string | null;
  state?: string | null;
  averageRating?: number | string | null;
  reviewCount?: number | string | null;
  hourlyRate?: number | null;
  skills?: string[];
  education?: Education[] | string[];
  userId?: number;
}

interface Assignment {
  assignmentId: number;
  jobId: number;
  engineerId: number;
  assignmentStatus: string;
  jobStatus?: string | null;
  assignmentType?: "invitation" | "application" | null;
  proposalDetail?: string | null;
  proposalAttachmentUrl?: string | null;
  proposalAttachmentId?: number | null;
  appliedAt?: string | null;
  invitedAt?: string | null;
  engineer?: Engineer;
}

interface ManageProposalsTabProps {
  assignments?: Assignment[];
  isLoading?: boolean;
  jobId?: number;
  numberOfVacancy?: number;
  regionId?: number;
}

/**
 * ManageProposalsTab - Renders the proposals list with accept/reject actions
 * Uses API data from useClientGetAssignmentDetails
 */
const ManageProposalsTab: React.FC<ManageProposalsTabProps> = ({
  assignments = [],
  isLoading = false,
  numberOfVacancy,
  regionId,
}) => {
  const [acceptedProposals, setAcceptedProposals] = useState<string[]>([]);
  const [rejectedProposals, setRejectedProposals] = useState<string[]>([]);
  const [pendingApproveConfirmation, setPendingApproveConfirmation] = useState<
    number | null
  >(null);
  const [pendingRejectConfirmation, setPendingRejectConfirmation] = useState<
    number | null
  >(null);
  const queryClient = useQueryClient();

  // Calculate approved count from assignments
  // Includes all statuses from initial assignment through final statement submission
  const approvedStatuses = [
    "assigned",
    "accepted",
    "started",
    "start_pending_approval",
    "submitted",
    "submit_pending_approval",
  ];
  const approvedProposalsCount = assignments.filter(
    (a) =>
      approvedStatuses.includes((a.assignmentStatus || "").toLowerCase()) ||
      acceptedProposals.includes(String(a.assignmentId)),
  ).length;

  // Sort proposals by appliedAt - first come first served
  const sortedAssignments = useMemo(() => {
    return [...assignments].sort((a, b) => {
      const dateA = a.appliedAt ? new Date(a.appliedAt).getTime() : 0;
      const dateB = b.appliedAt ? new Date(b.appliedAt).getTime() : 0;
      return dateA - dateB; // Ascending order (earliest first)
    });
  }, [assignments]);

  // Check if job is fully filled
  const isJobFullyFilled =
    numberOfVacancy !== undefined && approvedProposalsCount >= numberOfVacancy;

  const { mutateAsync: actionOnAssignment } = useClientActionOnAssignment({
    onSuccess: () => {
      toast.success("Proposal action completed successfully");
      // Invalidate assignment queries to refresh timeline
      queryClient.invalidateQueries({
        queryKey: clientGetAssignmentDetailsQueryKey(),
        predicate: (query): boolean =>
          !!(
            query.queryKey[0] &&
            typeof query.queryKey[0] === "object" &&
            "_id" in query.queryKey[0] &&
            query.queryKey[0]._id === "clientGetAssignmentDetails"
          ),
      });
      // Note: Query invalidation handles UI update - no need for page reload
    },
    onError: (error) => {
      console.error("Failed to action on proposal:", error);
      toast.error("Failed to process proposal. Please try again.");
    },
  });

  const handleAcceptProposal = async (assignmentId: number) => {
    // First show confirmation popup
    setPendingApproveConfirmation(assignmentId);
  };

  const confirmAcceptProposal = async () => {
    if (pendingApproveConfirmation === null) return;
    const assignmentId = pendingApproveConfirmation;
    try {
      await actionOnAssignment({
        body: {
          assignmentId: assignmentId,
          pendingApproval: "application",
          action: "approve",
          regionId: Number(regionId),
        },
      });
      setAcceptedProposals((prev) => [...prev, String(assignmentId)]);
      setPendingApproveConfirmation(null);
    } catch (error) {
      // Error is handled in onError callback
      console.error("Accept proposal error:", error);
      setPendingApproveConfirmation(null);
    }
  };

  const handleRejectProposal = async (assignmentId: number) => {
    // First show confirmation popup
    setPendingRejectConfirmation(assignmentId);
  };

  const confirmRejectProposal = async () => {
    if (pendingRejectConfirmation === null) return;
    const assignmentId = pendingRejectConfirmation;
    try {
      await actionOnAssignment({
        body: {
          assignmentId: assignmentId,
          pendingApproval: "application",
          action: "reject",
          regionId: Number(regionId),
        },
      });
      setRejectedProposals((prev) => [...prev, String(assignmentId)]);
      setPendingRejectConfirmation(null);
    } catch (error) {
      // Error is handled in onError callback
      console.error("Reject proposal error:", error);
      setPendingRejectConfirmation(null);
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
    "invited",
  ];
  const remainingProposals = sortedAssignments.filter(
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

  if (!sortedAssignments || sortedAssignments.length === 0) {
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

      {/* Vacancy Status Display */}
      {numberOfVacancy !== undefined && (
        <div
          className={`mb-4 p-3 rounded-lg ${isJobFullyFilled ? "bg-red-50 dark:bg-red-900/20" : "bg-blue-50 dark:bg-blue-900/20"}`}
        >
          <p
            className={`text-sm font-medium ${isJobFullyFilled ? "text-red-700 dark:text-red-400" : "text-blue-700 dark:text-blue-400"}`}
          >
            {isJobFullyFilled
              ? `All ${numberOfVacancy} vacancy(ies) have been filled. No more approvals allowed.`
              : `Approved: ${approvedProposalsCount} / ${numberOfVacancy} vacancies`}
          </p>
        </div>
      )}

      {remainingProposals.map((proposal, idx) => (
        <div
          key={proposal.assignmentId}
          className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 break-words"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                {`${DUMMY_TABS_LABELS.proposalPrefix} ${idx + 1}`}
              </p>

              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {proposal.engineer?.name || `Engineer #${proposal.engineerId}`}
              </h4>

              {/* ⭐ Average Rating */}
              {proposal.engineer?.averageRating && (
                <div className="flex items-center gap-1 mt-1">
                  <IoStar className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {formatRating(proposal.engineer.averageRating)}
                  </span>
                  {/* Show review only if > 0 */}
                  {Number(proposal.engineer.reviewCount) > 0 && (
                    <>
                      <span className="text-gray-400 mx-1">|</span>

                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {Number(proposal.engineer.reviewCount)}{" "}
                        {Number(proposal.engineer.reviewCount) === 1
                          ? "review"
                          : "reviews"}
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* 🏷 Skills */}
              {proposal.engineer?.skills?.length ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {proposal.engineer!.skills!.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : null}

              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
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

          {(proposal.proposalAttachmentUrl ||
            proposal.proposalAttachmentId) && (
            <div className="mb-4">
              <a
                href={proposal.proposalAttachmentUrl || `#`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-700 dark:text-gray-300 max-w-full break-all hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                <IoAttach className="w-4 h-4 flex-shrink-0" />
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
            {/* <Button
              variant="no_style"
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              {DUMMY_TABS_LABELS.viewProfile}
            </Button> */}
            <Button
              variant="no_style"
              onClick={() => handleAcceptProposal(proposal.assignmentId)}
              disabled={
                acceptedProposals.includes(String(proposal.assignmentId)) ||
                isJobFullyFilled
              }
              className={`px-6 py-2 rounded transition font-medium ${
                isJobFullyFilled
                  ? "bg-gray-400 cursor-not-allowed opacity-50"
                  : "bg-green-800 hover:bg-green-900 text-white"
              }`}
            >
              {isJobFullyFilled ? "Vacancies Filled" : DUMMY_TABS_LABELS.accept}
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

      {/* Approve Confirmation Popup */}
      <Popup
        open={pendingApproveConfirmation !== null}
        onClose={() => setPendingApproveConfirmation(null)}
      >
        <div className="flex items-center justify-center px-0 w-full">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="p-6 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Approve Proposal
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Are you sure you want to approve this proposal? This action
                    cannot be undone.
                  </p>
                </div>
                <div
                  onClick={() => setPendingApproveConfirmation(null)}
                  aria-label="Close"
                  className="text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  <IoCloseSharp className="h-6 w-6" />
                </div>
              </div>
            </div>
            <div className="p-6 pt-0">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="solid"
                  onClick={() => setPendingApproveConfirmation(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={confirmAcceptProposal}
                  type="button"
                  className="bg-green-800 hover:bg-green-900"
                >
                  Approve
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Popup>

      {/* Reject Confirmation Popup */}
      <Popup
        open={pendingRejectConfirmation !== null}
        onClose={() => setPendingRejectConfirmation(null)}
      >
        <div className="flex items-center justify-center px-0 w-full">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="p-6 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Reject Proposal
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Are you sure you want to reject this proposal? This action
                    cannot be undone.
                  </p>
                </div>
                <div
                  onClick={() => setPendingRejectConfirmation(null)}
                  aria-label="Close"
                  className="text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  <IoCloseSharp className="h-6 w-6" />
                </div>
              </div>
            </div>
            <div className="p-6 pt-0">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="solid"
                  onClick={() => setPendingRejectConfirmation(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={confirmRejectProposal}
                  type="button"
                  className="bg-red-700 hover:bg-red-800"
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default ManageProposalsTab;
