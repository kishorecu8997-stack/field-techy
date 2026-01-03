import { useEffect, useRef } from "react";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import { config } from "@/shared/config/configService";

/**
 * Token expiration duration in milliseconds
 * Retrieved from app configuration (default: 1 hour = 3600000 ms)
 */
export const TOKEN_EXPIRATION_DURATION = config.tokenExpirationDuration;

/**
 * Hook to manage token expiration
 *
 * Checks if the user's session token has expired and automatically logs out
 * if the token has exceeded the expiration duration (1 hour).
 *
 * This hook:
 * - Runs on app mount and whenever the session changes
 * - Checks token expiration every minute
 * - Automatically clears the session if expired (ProtectedRoute will handle redirect)
 *
 * @example
 * ```tsx
 * function App() {
 *   useTokenExpiration();
 *   return <RouterProvider router={routes} />;
 * }
 * ```
 */
export function useTokenExpiration() {
  const session = useUserSessionStore((state) => state.session);
  const logout = useUserSessionStore((state) => state.logout);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // If no session, nothing to check
    if (!session || !session.initiatedAt) {
      return;
    }

    /**
     * Check if the token has expired
     */
    const checkTokenExpiration = () => {
      // Get fresh session state
      const currentSession = useUserSessionStore.getState().session;
      if (!currentSession || !currentSession.initiatedAt) {
        return;
      }

      const now = Date.now();
      const elapsed = now - currentSession.initiatedAt;

      // If token has expired, logout (ProtectedRoute will handle redirect)
      if (elapsed >= config.tokenExpirationDuration) {
        useUserSessionStore.getState().logout();
      }
    };

    // Check immediately
    checkTokenExpiration();

    // Set up interval to check every minute (60000 ms)
    intervalRef.current = setInterval(checkTokenExpiration, 60000);

    // Cleanup on unmount or when session changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [session, logout]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
}
