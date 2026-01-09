import { addToQueue } from "./offlineQueue";
import type { OfflineAction } from "./types";
import { EngineerAdapter } from "@/shared/apiServices/engineer/engineerAdapter";

/**
 * Fallback implementation of updateJobStatus used when the network is unstable.
 * This wraps the actual API call with offline queueing support.
 */
export async function offlineAwareUpdateJobStatus(jobId: string, status: string) {
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
    return await EngineerAdapter.updateJobStatus(jobId, status);
  } catch (err) {
    console.log("❌ API failed, saving to offline queue", err);
    addToQueue(action);
    return { offline: true, error: err };
  }
}
