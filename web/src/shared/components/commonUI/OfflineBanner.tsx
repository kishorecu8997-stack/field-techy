import { useNetworkStatus } from "@/offline/useNetworkStatus";

/**
 * A banner component that displays when the application is offline.
 */

export default function OfflineBanner() {
  
  const isOffline = useNetworkStatus("/health"); 

  if (!isOffline) return null;

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        width: "100%",
        padding: "12px 20px",
        backgroundColor: "#FFEB3B",
        color: "#333",
        textAlign: "center",
        fontWeight: 600,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        borderBottom: "1px solid #FDD835",
        zIndex: 999,
        fontFamily: "sans-serif",
        fontSize: "14px",
      }}
    >
      ⚠️ You are currently offline. Changes will sync when connected.
    </div>
  );
}
