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
 * const { date, time } = formatApiDate("2026-02-26T14:29:00Z");
 * // returns { date: "26/02/2026", time: "02:29 PM" }
 */
export const formatApiDateTime = (dateStr: string | null | undefined) => {
  if (!dateStr) return { date: "---", time: "---" };

  const dateObj = new Date(dateStr);

  // Split into Date: e.g., 26/02/2026
  const date = dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Split into Time: e.g., 02:29 PM
  const time = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return { date, time };
};

/**
 * Timeline item return type from transformLogsToTimelineItems
 */
export interface TimelineItem {
  title: string;
  timestamp: string;
  effectiveTimestamp?: string;
  statusText: string;
  statusColor: string;
  accentColor: string;
  details: string | null;
  attachmentUrl?: string | null;
  logType?: string;
  logId?: number;
  description?: string | null;
  detailsType?: string;
  attachmentName?: string;
  attachments?: Array<{ name: string; url: string }>;
  revisions?: Array<{
    revisionId: number;
    content: string;
    attachmentUrl?: string;
    clientComment?: string;
    clientAttachmentUrl?: string;
    createdAt?: string;
    updatedAt?: string;
    status: string;
  }>;
  // Break request specific fields
  startDate?: string; // Formatted time range for short breaks or date range for long breaks
  endDate?: string;
  breakType?: "short_term" | "long_term";
  duration?: string; // Calculated duration of the break
  detailsLabel?: string; // Label for the details button (e.g., "Break Details")
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
  return logs
    .map((log) => {
      // Skip creating separate "Revision Request" entries - revisions should only show as nested items under Progress Update
      if (
        log.status === "revision_requested" &&
        log.logType !== "progress_update"
      ) {
        return null;
      }

      // For progress_update logs:
      // Include ALL progress updates in Activity Timeline (approved, rejected, pending, revision_requested)
      // Revisions are shown nested inside the progress update
      // NOTE: Show approved progress updates so client/engineer can see the approval in timeline
      if (log.logType === "progress_update" || log.logType === "SUBMISSION") {
        // All progress updates should be shown, including approved ones
        // This allows client to see their approval in timeline
      }

      // Compute effectiveTimestamp for proper sorting:
      // - For progress_update with revisions: use latest revision.updatedAt
      // - Else use log.updatedAt
      // - Else use log.timestamp
      let effectiveTimestamp: string;
      let revisionDetails: string | undefined;
      if (
        (log.logType === "progress_update" || log.logType === "SUBMISSION") &&
        log.revisions &&
        log.revisions.length > 0
      ) {
        // Find the latest revision by updatedAt
        const latestRevision = log.revisions.reduce((latest, rev) => {
          if (!latest) return rev;
          const revDate = rev.updatedAt ? new Date(rev.updatedAt).getTime() : 0;
          const latestDate = latest.updatedAt
            ? new Date(latest.updatedAt).getTime()
            : 0;
          return revDate > latestDate ? rev : latest;
        }, log.revisions[0]);
        effectiveTimestamp =
          latestRevision.updatedAt || log.timestamp || new Date().toISOString();

        // Build revision details string
        const revisionCount = log.revisions.length;
        const latestStatus = latestRevision.status;
        revisionDetails = `${revisionCount} revision${revisionCount > 1 ? "s" : ""} - Latest: ${latestStatus}`;
      } else {
        effectiveTimestamp =
          (log as { updatedAt?: string }).updatedAt ||
          log.timestamp ||
          new Date().toISOString();
      }

      // Generate proper title based on logType
      let title = log.logType;
      let details = log.details;
      let detailsType: string | undefined;
      let statusText: string | undefined;
      let statusColor: string | undefined;

      // For progress updates with revisions, append revision info to details
      if (revisionDetails) {
        details = details ? `${details} | ${revisionDetails}` : revisionDetails;
      }

      // Customize title based on logType and status
      if (log.logType === "SUBMISSION") {
        // Cast to include all possible status values including pending
        // (API may return pending even though type definition doesn't include it)
        if ((log.status as string) === "pending") {
          // Client sees "Proposal Received", Engineer sees "Proposal Submitted"
          title = isClientView ? "Proposal Received" : "Proposal Submitted";
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
      } else if (log.logType === "progress_update") {
        title = "Progress Update";
        // Keep original progress update content - don't overwrite with revision comments
        const originalDetails =
          log.details ||
          (isClientView
            ? "Client reviewed a progress update"
            : "Engineer submitted a progress update");

        // Check if client requested revisions
        if (log.status === "revision_requested") {
          detailsType = "revision";
          details = originalDetails;
        } else {
          details = originalDetails;
        }
        // Check for pending status
        if ((log.status as string) === "pending") {
          statusText = "Pending";
          statusColor = "#f59e0b";
        }
      }

      // Use custom statusText if set, otherwise generate from log.status
      const finalStatusText =
        statusText ||
        log.status.charAt(0).toUpperCase() +
        log.status.slice(1).replace(/_/g, " ");

      // Use custom statusColor if set, otherwise determine from log.status
      const finalStatusColor =
        statusColor ||
        (log.status === "approved"
          ? "#22c55e"
          : log.status === "rejected"
            ? "#ef4444"
            : "#f59e0b");

      // Extract attachment name from URL if available
      const attachmentName = log.attachment?.url
        ? decodeURIComponent(
          log.attachment.url.split("/").pop()?.split("?")[0] || "",
        )
        : undefined;

      return {
        title,
        timestamp: formatApiDate(log.timestamp),
        effectiveTimestamp,
        statusText: finalStatusText,
        statusColor: finalStatusColor,
        accentColor: detailsType === "revision" ? "#f59e0b" : "#3b82f6",
        description: details ?? null,
        details: details ?? null,
        detailsType,
        attachmentUrl: log.attachment?.url,
        attachmentName,
        revisions: log.revisions || [],
        logId: log.id,
        logType: log.logType,
      };
    })
    .filter(Boolean) as TimelineItem[];
};

/**
 * Format time only from a date string (for short term breaks)
 */
export const formatTimeOnly = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "--:--";
  try {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "--:--";
  }
};

/**
 * Format date only from a date string (for long term breaks)
 */
export const formatDateOnly = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "--/--/----";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "--/--/----";
  }
};

/**
 * Calculate duration between two ISO date strings
 * For short term breaks: returns time duration (e.g., "2 hours 30 minutes")
 * For long term breaks: returns date duration (e.g., "3 days")
 */
export const calculateBreakDuration = (
  startDateStr: string | null | undefined,
  endDateStr: string | null | undefined,
  breakType: "short_term" | "long_term" | undefined,
): string => {
  if (!startDateStr || !endDateStr) return "";

  try {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const diffMs = end.getTime() - start.getTime();

    if (breakType === "short_term") {
      // Calculate time duration
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;

      let durationText = "";
      if (hours > 0) durationText += `${hours} hour${hours > 1 ? "s" : ""}`;
      if (minutes > 0) {
        if (durationText) durationText += " ";
        durationText += `${minutes} minute${minutes > 1 ? "s" : ""}`;
      }
      return durationText || "0 minutes";
    } else {
      // Calculate date duration (long term breaks)
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
    }
  } catch {
    return "";
  }
};

/**
 * Transform break requests to timeline items
 * Uses createdAt as effectiveTimestamp for proper sorting
 * Shows time for short_term breaks and date for long_term breaks
 */
export const transformBreakRequestsToItems = (
  breakRequests: GetJobLogsResponse["breakRequests"],
): TimelineItem[] => {
  if (!breakRequests) return [];
  return breakRequests.map((br) => {
    // Format start and end based on break type - show both time and date
    const formatStartEnd = () => {
      const startTime = formatTimeOnly(br.startAt);
      const endTime = formatTimeOnly(br.endAt);
      const startDate = formatDateOnly(br.startAt);
      const endDate = formatDateOnly(br.endAt);

      if (br.type === "short_term") {
        // Short term: show time and date
        return `${startTime} - ${endTime} (${startDate})`;
      } else {
        // Long term: show date and time
        return `${startDate} - ${endDate} (${startTime} - ${endTime})`;
      }
    };

    // Calculate duration
    const duration = calculateBreakDuration(br.startAt, br.endAt, br.type);

    return {
      title: `${br.type === "short_term" ? "Short Term" : "Long Term"} Break`,
      timestamp: formatApiDate(br.createdAt),
      effectiveTimestamp: br.createdAt || undefined,
      statusText: br.status.charAt(0).toUpperCase() + br.status.slice(1),
      statusColor:
        br.status === "approved"
          ? "#22c55e"
          : br.status === "rejected"
            ? "#ef4444"
            : "#f59e0b",
      accentColor: "#8b5cf6",
      details: br.reason,
      detailsType: "break", // Mark this as a break item for ProgressUpdateItem to recognize
      startDate: formatStartEnd(), // Use formatted display string with time and date
      endDate: br.endAt,
      approverComment: br.approverComment || undefined,
      breakType: br.type,
      duration: duration,
      detailsLabel: "Break Details", // Label for the details button
    };
  });
};

/**
 * Transform sign-off sheets to timeline items
 */
export const transformSignOffsToItems = (
  signOffs: GetJobLogsResponse["signOffSheets"],
): TimelineItem[] => {
  if (!signOffs) return [];
  return signOffs.map((so) => {
    // Build attachments array with proper labels for work submission and signature
    const attachments: Array<{ name: string; url: string }> = [];

    if (so.attachment?.url) {
      attachments.push({
        name: decodeURIComponent(
          so.attachment.url.split("/").pop()?.split("?")[0] || "Attachment",
        ),
        url: so.attachment.url,
      });
    }

    if (so.signature?.url) {
      attachments.push({
        name: decodeURIComponent(
          so.signature.url.split("/").pop()?.split("?")[0] ||
          "Attachment",
        ),
        url: so.signature.url,
      });
    }

    return {
      title: "Final Statement",
      timestamp: formatApiDate(so.createdAt),
      effectiveTimestamp: so.createdAt || undefined,
      statusText: so.status.charAt(0).toUpperCase() + so.status.slice(1),
      statusColor:
        so.status === "approved"
          ? "#22c55e"
          : so.status === "rejected"
            ? "#ef4444"
            : "#f59e0b",
      accentColor: "#10b981",
      details: so.details,
      attachments: attachments.length > 0 ? attachments : undefined,
    };
  });
};
