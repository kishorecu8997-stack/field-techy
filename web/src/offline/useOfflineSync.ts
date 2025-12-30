import { useEffect } from "react";
import { useNetworkStatus } from "./useNetworkStatus";
import { syncOfflineActions } from "./syncEngine";

/**
  * React hook to automatically sync queued actions whenever the app goes online.
 */

export function useOfflineSync() {
  const isOffline = useNetworkStatus("/health");

  useEffect(() => {
    if (!isOffline) {
      console.log("Back online - syncing offline actions");
      syncOfflineActions();
    }
  }, [isOffline]);
}
