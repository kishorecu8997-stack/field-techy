import { formatDateTime } from "@/utils/formatDateTime";
import type { GetJobLogsResponse } from "@/api";

/**
 * Format a date string to display format
 * Uses en-US locale with short month, 2-digit day, full year, and 12-hour time
 */
export const formatApiDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return formatDateTime();
  try {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return formatDateTime();
  }
};

/**
 * Timeline item return type from transformLogsToTimelineItems
 */
export interface TimelineItem {
  title: string;
  timestamp: string;
  statusText: string;
  statusColor: string;
  accentColor: string;
  details: string | null;
  attachmentUrl?: string | null;
}

/**
 * Transform API logs to timeline items with proper labels
 * @param logs - Array of job logs from API
 * @param isClientView - If true, shows "Proposal Received" for pending status (client view)
 *                       If false, shows "Proposal Submitted" for pending status (engineer view)
 */
export const transformLogsToTimelineItems = (
  logs: GetJobLogsResponse["logs"],
  isClientView: boolean = false,
): TimelineItem[] => {
  return logs.map((log) => {
    // Generate proper title based on logType
    let title = log.title || log.logType;
    let details = log.details;

    // Customize title based on logType and status
    if (log.logType === "SUBMISSION") {
      // Cast to include all possible status values including pending
      // (API may return pending even though type definition doesn't include it)
      if ((log.status as string) === "pending") {
        // Client sees "Proposal Received", Engineer sees "Proposal Submitted"
        title = isClientView
          ? "Proposal Received"
          : "Proposal Submitted";
        details =
          details ||
          (isClientView
            ? "Proposals received. Manage them in the Manage Proposals tab."
            : "Engineer submitted a proposal for this job");
      } else if (log.status === "approved") {
        title = "Proposal Accepted";
        details =
          details ||
          (isClientView
            ? "Client accepted a proposal"
            : "Client accepted the proposal");
      } else if (log.status === "rejected") {
        title = "Proposal Rejected";
        details =
          details ||
          (isClientView
            ? "Client rejected a proposal"
            : "Client rejected the proposal");
      }
    } else if (log.logType === "JOB_POSTED") {
      title = "Job Posted";
      details = details || "Client posted a new job";
    } else if (log.logType === "JOB_STARTED") {
      title = "Job Started";
      details = details || "Work has started on this job";
    } else if (log.logType === "JOB_COMPLETED") {
      title = "Job Completed";
      details = details || "Job has been completed";
    }

    return {
      title,
      timestamp: formatApiDate(log.timestamp),
      statusText:
        log.status.charAt(0).toUpperCase() +
        log.status.slice(1).replace(/_/g, " "),
      statusColor:
        log.status === "approved"
          ? "#22c55e"
          : log.status === "rejected"
            ? "#ef4444"
            : "#f59e0b",
      accentColor: "#3b82f6",
      details: details ?? null,
      attachmentUrl: log.attachmentUrl,
    };
  });
};
