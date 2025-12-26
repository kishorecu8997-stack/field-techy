import { addToQueue } from "./offlineQueue";
import type { OfflineAction } from "./types";
import { updateJobStatus } from "@/api/fakeApi";

/**
 * Fallback implementation of updateJobStatus used when the original
 * "@/api/fakeApi" module is not available.
 * In a real application, this should call the backend API.
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
    return await updateJobStatus(jobId, status);
  } catch (err) {
    console.log("❌ API failed, saving to offline queue", err);
    addToQueue(action);
    return { offline: true, error: err };
  }
}
