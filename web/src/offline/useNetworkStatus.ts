import { useEffect, useState } from "react";

/**
 * Tracks whether the browser is online or offline.
 */

export function useNetworkStatus(pingUrl?: string) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  async function checkConnection() {
    if (!navigator.onLine) {
      setIsOffline(true);
      return;
    }

    if (pingUrl) {
      try {
        await fetch(pingUrl, { method: "HEAD", cache: "no-store" });
        setIsOffline(false);
      } catch {
        setIsOffline(true);
      }
    } else {
      setIsOffline(false);
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
  }, []);

  return isOffline;
}
