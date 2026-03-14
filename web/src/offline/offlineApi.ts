import { addToQueue } from "./offlineQueue";
import type { OfflineAction } from "./types";
import { apiClient } from "@/shared/apiServices/apiClient";
import { engineerRequestStart } from "@/api/sdk.gen";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";

/**
 * Fallback implementation of updateJobStatus used when the network is unstable.
 * This wraps the actual API call with offline queueing support.
 */
export async function offlineAwareUpdateJobStatus(
  jobId: string,
  status: string,
) {
  const isOffline = !navigator.onLine;

  const action: OfflineAction = {
    type: "UPDATE_JOB_STATUS",
    payload: { jobId, status },
    timestamp: Date.now(),
  };

  if (isOffline) {
    console.log("📥 Offline - adding action to queue", action);
    addToQueue(action);
    return { offline: true };
  }

  try {
    // Map status string to appropriate API call
    // note: this is a best-effort mapping based on common status transitions
    if (status === "In Progress") {
      return await engineerRequestStart({
        client: apiClient,
        body: {
          assignmentId: Number(jobId),
          regionId: Number(useUserSessionStore.getState().session?.regionId),
        },
      });
    } else if (status === "Completed") {
      console.warn(
        "Skipping 'Completed' status update via offline wrapper. Real attachments are required.",
      );
      return null;
    }

    // Default or other statuses - simplistic implementation
    // If there was a generic update status endpoint, we would use it here.
    // Since EngineerAdapter is gone, we throw or return null if no matching SDK method found.
    console.warn(`No direct API mapping found for status: ${status}`);
    return null;
  } catch (err) {
    console.log("❌ API failed, saving to offline queue", err);
    addToQueue(action);
    return { offline: true, error: err };
  }
}
