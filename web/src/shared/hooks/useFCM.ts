import { useState, useCallback, useEffect } from "react";
import { fcmService } from "@/shared/config/firebaseConfig";
import { useDeviceStore } from "@/shared/store/useDeviceStore";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import {
  registerDeviceToken,
  deregisterDeviceToken,
} from "@/shared/apiServices/notifications/notificationOpenApiService";

/**
 * Custom hook to manage Firebase Cloud Messaging (FCM) permissions, token retrieval,
 * and registration with the Field Techy backend.
 *
 * @returns {Object} An object containing:
 * - `requestNotificationPermission`: Function to request notification access and register token.
 * - `checkPermission`: Function to check the current permission status.
 * - `deregisterToken`: Function to deregister the FCM token from the backend.
 * - `loading`: Boolean indicating if a token request is in progress.
 * - `error`: String containing any error message if the request fails.
 */
export const useFCM = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setFcmToken = useDeviceStore((state) => state.setFcmToken);
  const setNotificationPermission = useDeviceStore(
    (state) => state.setNotificationPermission,
  );
  const session = useUserSessionStore((state) => state.session);

  /**
   * Registers the FCM token with the Field Techy backend.
   */
  const registerTokenWithBackend = useCallback(async (token: string) => {
    try {
      console.log("Registering device token with backend...");
      await registerDeviceToken(token);
      console.log("Device token registered successfully");
    } catch (err: any) {
      console.error("Failed to register device token with backend:", err);
    }
  }, []);

  /**
   * Checks the current notification permission status.
   * If permission is already granted, ensures we have a token and it's registered.
   */
  const checkPermission = useCallback(async () => {
    if (!("Notification" in window)) return;
    const permission = Notification.permission;
    setNotificationPermission(permission);

    if (permission === "granted") {
      try {
        // Ensure service is initialized (via FCMHandler) before getting token
        if (fcmService.isInitialized()) {
          const token = await fcmService.getToken();
          if (token) {
            // Check if token is different from stored token to avoid unnecessary API calls
            const storedToken = useDeviceStore.getState().fcmToken;

            if (token !== storedToken) {
              setFcmToken(token);
              await registerTokenWithBackend(token);
            } else {
              console.log(
                "FCM token matches stored token, skipping registration.",
              );
            }
          }
        }
      } catch (err) {
        console.error("Error retrieving token in checkPermission:", err);
      }
    }
  }, [setNotificationPermission, setFcmToken, registerTokenWithBackend]);

  /**
   * Requests notification permission from the user.
   * If granted, retrieves the FCM token, updates store, and registers with backend.
   */
  const requestNotificationPermission =
    useCallback(async (): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        if (!("Notification" in window)) {
          throw new Error("This browser does not support notifications");
        }

        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);

        if (permission === "granted") {
          // Ensure service is initialized
          if (!fcmService.isInitialized()) {
            // If not initialized, we might need to initialize it.
            // But initialization requires callbacks (onMessage etc provided by FCMHandler).
            // Ideally FCMHandler is present. If not, this might fail unless we provide dummy callbacks
            // or move initialization logic here.
            // For now, assuming FCMHandler is present.
            console.warn(
              "FCMService not initialized yet. Make sure FCMHandler is mounted.",
            );
          }

          const token = await fcmService.getToken();

          if (token) {
            setFcmToken(token);
            await registerTokenWithBackend(token);
            setLoading(false);
            return true;
          } else {
            setError("No registration token available.");
            setLoading(false);
            return false;
          }
        } else {
          setError("Notification permission denied");
          setLoading(false);
          return false;
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while retrieving token");
        setLoading(false);
        return false;
      }
    }, [setFcmToken, setNotificationPermission, registerTokenWithBackend]);

  /**
   * Re-check permission and register token when user session changes (e.g. login)
   */
  useEffect(() => {
    if (session?.accessToken) {
      checkPermission();
    }
  }, [session?.accessToken, checkPermission]);

  /**
   * Deregisters the current FCM token from the backend.
   */
  const deregisterToken = useCallback(async () => {
    const token = useDeviceStore.getState().fcmToken;
    if (!token) return;

    setLoading(true);
    try {
      console.log("Deregistering device token from backend...");
      await deregisterDeviceToken(token);
      console.log("Device token deregistered successfully");
      setFcmToken(null);
    } catch (err: any) {
      console.error("Failed to deregister device token:", err);
    } finally {
      setLoading(false);
    }
  }, [setFcmToken]);

  return {
    requestNotificationPermission,
    checkPermission,
    deregisterToken,
    loading,
    error,
  };
};
