import { icons } from "@/config/icons";
import { Button } from "@/shared/components/commonUI/Buttons";
import { usePopupStore } from "@/shared/store/popupStore";
import { ActionReasonPopup } from "./ActionReasonPopup";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/formatDate";
import { useClientActionOnBreak } from "@/shared/apiServices/client/clientOpenApiService";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { apiClient } from "@/shared/apiServices/apiClient";
import { getJobLogsOptions } from "@/api/@tanstack/react-query.gen";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import { TOAST_MESSAGES } from "@/constants/timelineConstants";

interface BreakRequestDetailsProps {
  onClose: () => void;
  assignmentIds?: number[]; // Array of assignment IDs for multiple engineers
  isClientView?: boolean; // If true, hide action buttons and show all breaks
  engineerNames?: string[]; // Engineer names corresponding to assignment IDs
  regionId?: number; // Region ID for API filtering
}

interface Break {
  id: number;
  assignmentId: number;
  type: "short_term" | "long_term";
  status: "pending" | "approved" | "rejected";
  reason: string;
  startAt: string;
  endAt: string;
  approverComment?: string | null;
  createdAt: string | null;
  engineerName?: string; // Name of the engineer (if available)
}

/**
 * BreakRequestDetails
 *
 * Displays a list of break requests from all engineers with details.
 * Allows the client to approve or reject pending requests.
 *
 * Props:
 * @param {() => void} onClose - Function to close the break request details view or popup
 * @param {number[]} assignmentIds - Array of assignment IDs to fetch break requests for all engineers
 *
 * Features:
 * - Shows break type, dates, duration, reason, and status for all engineers
 * - Shows approver comments when available
 * - Handles short and long term breaks
 * - Opens ActionReasonPopup on Approve/Reject for pending requests
 * - Displays success toast on submission
 */
const BreakRequestDetails: React.FC<BreakRequestDetailsProps> = ({
  onClose,
  assignmentIds,
  isClientView = false,
  engineerNames,
}) => {
  const { showPopup } = usePopupStore();
  const { mutate: actionOnBreak } = useClientActionOnBreak({});

  const regionId = useUserSessionStore.getState().session?.regionId;
  // Fetch job logs for all assignment IDs using useQueries for parallel fetching
  // Use regionId from props
  const results = useQueries({
    queries: (assignmentIds || []).map((id) => ({
      ...getJobLogsOptions({
        client: apiClient,
        path: { assignmentId: id },
        query: { regionId: Number(regionId) },
      }),
      enabled: !!assignmentIds?.length && id > 0,
    })),
  });

  // Derived loading state from all query results
  const isLoading = results.some((r) => r.isLoading);

  // Process break requests from query results - use useMemo to avoid infinite re-renders
  const allBreakRequests = useMemo(() => {
    if (!assignmentIds?.length) {
      return [];
    }

    const breaks: Break[] = [];

    results.forEach((result, assignmentIndex) => {
      if (result.data?.breakRequests) {
        result.data.breakRequests.forEach((brk) => {
          breaks.push({
            ...brk,
            engineerName: engineerNames?.[assignmentIndex] || undefined,
          });
        });
      }
    });

    return breaks;
  }, [assignmentIds, results, engineerNames]);

  // If assignmentIds is provided, show all breaks; otherwise show nothing
  // On client view, show all breaks; on engineer view, show only pending
  const displayBreaks = assignmentIds?.length
    ? isClientView
      ? allBreakRequests
      : allBreakRequests.filter((brk) => brk.status === "pending")
    : [];

  const handleReject = async (brk: Break) => {
    await showPopup({
      title: "",
      body: (
        <ActionReasonPopup
          title="Leave Rejection"
          label="Reason for Reject"
          submitLabel="Submit"
          onSubmit={async ({ reason }) => {
            // Call the API to reject the break
            actionOnBreak({
              body: {
                assignmentId: brk.assignmentId,
                requestId: brk.id,
                action: "reject",
                approverComment: reason,
              },
            } as any);
            const breakTypeMsg =
              brk.type === "long_term"
                ? TOAST_MESSAGES.longBreakRejected
                : TOAST_MESSAGES.shortBreakRejected;
            toast.success(breakTypeMsg);
            onClose();
          }}
          onClose={onClose}
        />
      ),
      actionButtons: [],
    });
  };

  const handleApprovel = async (brk: Break) => {
    await showPopup({
      title: "",
      body: (
        <ActionReasonPopup
          title="Leave Approval"
          label="Reason for Approve"
          submitLabel="Submit"
          onSubmit={async ({ reason }) => {
            // Call the API to approve the break
            actionOnBreak({
              body: {
                assignmentId: brk.assignmentId,
                requestId: brk.id,
                action: "approve",
                approverComment: reason,
              },
            } as any);
            const breakTypeMsg =
              brk.type === "long_term"
                ? TOAST_MESSAGES.longBreakApproved
                : TOAST_MESSAGES.shortBreakApproved;
            toast.success(breakTypeMsg);
            onClose();
          }}
          onClose={onClose}
        />
      ),
      actionButtons: [],
    });
  };

  // Calculate duration between two dates
  const calculateDuration = (startAt: string, endAt: string): string => {
    const start = new Date(startAt);
    const end = new Date(endAt);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return "";

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "1 day";
    } else if (diffDays === 1) {
      return "1 day";
    } else {
      return `${diffDays + 1} days`;
    }
  };

  // Format time only (for short breaks)
  const formatTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format date only (for long breaks)
  const formatDateOnly = (dateStr: string): string => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <LoaderComponent />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 gap-4 max-h-[500px] overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Break Requests Details
        </h2>
        <div
          className="cursor-pointer text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
          onClick={onClose}
        >
          <icons.close className="w-5 h-5" />
        </div>
      </div>

      {displayBreaks.length === 0 ? (
        <p className="text-gray-400 text-center text-sm">
          No break requests found
        </p>
      ) : (
        displayBreaks.map((brk) => (
          <div
            key={brk.id}
            className="border border-[#3D4F6A] rounded-lg p-3 bg-[#223554]"
          >
            {/* Engineer Name - only show on client view */}
            {isClientView && brk.engineerName && (
              <p className="text-gray-200 font-medium text-sm mb-2">
                Engineer: {brk.engineerName}
              </p>
            )}

            {/* Status Badge */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-200 font-medium text-xs">
                {brk.type === "long_term"
                  ? "Long Term Break"
                  : "Short Term Break"}
              </p>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                  brk.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : brk.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {brk.status === "pending"
                  ? "Pending"
                  : brk.status === "approved"
                    ? "Approved"
                    : "Rejected"}
              </span>
            </div>

            <p
              className={`mb-2 inline-block px-2 py-0.5 rounded-2xl text-white text-xs ${
                brk.type === "long_term"
                  ? "bg-orange-400 dark:bg-orange-700"
                  : "bg-green-600 dark:bg-green-700"
              }`}
            >
              {brk.type === "long_term"
                ? `${formatDateOnly(brk.startAt)} - ${formatDateOnly(brk.endAt)} (${calculateDuration(brk.startAt, brk.endAt)})`
                : `${formatTime(brk.startAt)} - ${formatTime(brk.endAt)}`}
            </p>

            <p className="text-gray-300 mb-1 text-sm">
              <span className="font-medium">Reason:</span> {brk.reason}
            </p>

            {/* Show approver comment if available */}
            {brk.approverComment && (
              <p className="text-blue-600 dark:text-blue-400 mb-1 text-sm">
                <span className="font-medium">Comment:</span>{" "}
                {brk.approverComment}
              </p>
            )}

            {brk.createdAt && (
              <p className="text-gray-400 text-xs">
                Applied on: {formatDate(brk.createdAt)}
              </p>
            )}

            {/* Show Approve/Reject buttons only for pending breaks and NOT on client view */}
            {brk.status === "pending" && !isClientView && (
              <div className="w-full">
                <div className="flex justify-end space-x-2 mt-2">
                  <Button
                    onClick={() => handleReject(brk)}
                    variant="outline"
                    size="sm"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprovel(brk)}
                    variant="primary"
                    size="sm"
                  >
                    Approve
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default BreakRequestDetails;
