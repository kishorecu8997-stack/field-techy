import { addToQueue, getQueue, clearQueue } from "./offlineQueue";
import type { OfflineAction } from "./types";
// import { updateJobStatus } from "@/api/fakeApi"; // Replace with your real API

/**
 * Processes queued offline actions when the app comes online.
 */

export async function syncOfflineActions() {
  if (typeof window === "undefined") return
  if (!window.navigator.onLine) return


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

clearQueue()
failedActions.forEach((a) => addToQueue(a))


  console.log("Offline sync completed");
}

async function handleAction(action: OfflineAction) {
  switch (action.type) {
    case "UPDATE_JOB_STATUS":
      console.log("Simulating API sync:", action.payload)

      // simulate network delay
      await new Promise((res) => setTimeout(res, 500))

      return true

    default:
      throw new Error(`Unknown offline action type: ${action.type}`)
  }
}
