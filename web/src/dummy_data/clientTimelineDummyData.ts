/**
 * Dummy data for Client Timeline Section
 * This file contains all hardcoded timeline card data for the client job timeline
 */

import type { TimelineCardData } from "@/pages/client/my_job_client/types";

// Progress Update Card Data
export const progressUpdateCardData: TimelineCardData = {
  id: "progress-update-1",
  type: "progressUpdate",
  title: "Progress Update",
  description: "Installed lights in Room 105",
  timestamp: "05 Apr 2026, 9:50 AM",
  attachments: [{ name: "lights105.jpg" }],
  accentColor: "#16a34a",
  buttons: ["reject", "requestRevision", "approve"],
};

// Factory function to create Revision Request Update Card Data
// Allow callers to override only non-critical fields (prevent id/type changes)
export function createRevisionUpdateCardData(
  overrides?: Partial<Omit<TimelineCardData, "id" | "type">>,
): TimelineCardData {
  const base: TimelineCardData = {
    id: "revision-update-1",
    type: "revisionRequestUpdate",
    title: "Revision Request Update",
    description: "I have checked and fixed the light",
    timestamp: "05 Apr 2026, 9:50 AM",
    attachments: [{ name: "lights105 fixed.jpg" }],
    accentColor: "#f59e0b",
    buttons: ["reject", "requestRevision", "approve"],
  };
  return {
    ...base,
    ...(overrides || {}),
  };
}

// Revision Request Update Card Data (default instance)
export const revisionRequestUpdateCardData: TimelineCardData =
  createRevisionUpdateCardData();

// Short Term Break Card Data
export const shortTermBreakCardData: TimelineCardData = {
  id: "short-break-1",
  type: "shortTermBreak",
  title: "Short Term Break",
  description: "Lunch: 1:00 PM - 2:00PM (1 hour)",
  timestamp: "05 Apr 2026, 1:05PM",
  accentColor: "#dc2626",
  buttons: ["reject", "approve"],
};

// Final Statement Card Data
export const finalStatementCardData: TimelineCardData = {
  id: "final-statement-1",
  type: "finalStatement",
  title: "Final Statement",
  description:
    "All electrical fittings have been installed and tested successfully. Final site cleanup has been completed. Please review the attached files for final verification.",
  timestamp: "05 Apr 2026, 3:00 PM",
  attachments: [
    { name: "Completion Report.pdf" },
    { name: "Engineer Signature.png" },
  ],
  accentColor: "#16a34a",
  buttons: ["reject", "approve"],
};
