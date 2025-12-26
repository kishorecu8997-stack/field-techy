import { getQueue, clearQueue } from "./offlineQueue";
import type { OfflineAction } from "./types";
import { updateJobStatus } from "@/api/fakeApi"; // Replace with your real API

/**
 * Processes queued offline actions when the app comes online.
 */

export async function syncOfflineActions() {
  if (!navigator.onLine) return;

  const queue = getQueue();
  if (!queue.length) return;

  console.log("Syncing offline actions:", queue);

  const failedActions: OfflineAction[] = [];

  for (const action of queue) {
    try {
      await handleAction(action);
    } catch (err) {
      console.error("Action sync failed, will retry later", err);
      failedActions.push(action);
    }
  }

  if (failedActions.length) {
    localStorage.setItem("offline_actions_queue", JSON.stringify(failedActions));
  } else {
    clearQueue();
  }

  console.log("Offline sync completed");
}

async function handleAction(action: OfflineAction) {
  switch (action.type) {
    case "UPDATE_JOB_STATUS":
      return updateJobStatus(action.payload.jobId, action.payload.status);
    default:
      throw new Error(`Unknown offline action type: ${action.type}`);
  }
}