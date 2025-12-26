import { useEffect, useState } from "react";

/**
 * Tracks network status by combining browser signals and server reachability.
 *
 * ⚠️ navigator.onLine alone can report false positives.
 * This hook ALWAYS verifies connectivity by pinging the provided URL.
 */
export function useNetworkStatus(pingUrl: string) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  async function checkConnection() {
    if (!navigator.onLine) {
      setIsOffline(true);
      return;
    }

    try {
      await fetch(pingUrl, { method: "HEAD", cache: "no-store" });
      setIsOffline(false);
    } catch {
      setIsOffline(true);
    }
  }

  useEffect(() => {
    checkConnection();

    const handleOnline = () => checkConnection();
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [pingUrl]);

  return isOffline;
}
