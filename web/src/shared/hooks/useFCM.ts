import { useState, useCallback, useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "@/shared/config/firebaseConfig";
import { useDeviceStore } from "@/shared/store/useDeviceStore";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import { config } from "../config/configService";
import {
  registerDeviceToken,
  deregisterDeviceToken,
} from "@/shared/apiServices/notifications/notificationOpenApiService";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Custom hook to manage Firebase Cloud Messaging (FCM) permissions, token retrieval,
 * and registration with the Field Techy backend.
 *
 * @returns {Object} An object containing:
 * - `requestNotificationPermission`: Function to request notification access and register token.
 * - `checkPermission`: Function to check the current permission status.
 * - `registerToken`: Function to manually register the FCM token with the backend.
 * - `deregisterToken`: Function to deregister the FCM token from the backend.
 * - `loading`: Boolean indicating if a token request is in progress.
 * - `error`: String containing any error message if the request fails.
 */
export const useFCM = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const fcmToken = useDeviceStore((state) => state.fcmToken);
  const setFcmToken = useDeviceStore((state) => state.setFcmToken);
  const setNotificationPermission = useDeviceStore(
    (state) => state.setNotificationPermission,
  );

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
      // We don't throw here to avoid breaking the UI, but we log it
    }
  }, []);

  /**
   * Helper to register the Service Worker if not already active.
   * This ensures the SW is installed even if main.tsx didn't do it.
   */
  const registerServiceWorker = useCallback(async () => {
    if (!("serviceWorker" in navigator)) {
        throw new Error("Service Workers are not supported");
    }
    
    try {
        const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
            scope: "/",
        });
        console.log("Service Worker registered/retrieved in useFCM:", registration.scope);
        
        // Wait for it to be ready to ensure it's active
        await navigator.serviceWorker.ready;
        return registration;
    } catch (err) {
        console.error("Service Worker registration failed inside useFCM:", err);
        throw err;
    }
  }, []);

  /**
   * Initialize Service Worker on mount
   */
  /**
   * Checks the current notification permission status.
   * If permission is already granted, ensures we have a token and it's registered.
   */
  const checkPermission = useCallback(async () => {
    if (!("Notification" in window)) return;
    const permission = Notification.permission;
    setNotificationPermission(permission);
    
    // If permission is already granted, we MUST ensure we have a fresh token
    // and that it is registered with the backend.
    if (permission === "granted") {
      try {
        // Ensure SW is registered before refreshing token
        const serviceWorkerRegistration = await registerServiceWorker();

        const token = await getToken(messaging, {
            vapidKey: config.firebase.vapidKey,
        });

        if (token) {
            // Update store if different (or just to be safe)
            setFcmToken(token);
            // Always register with backend to ensure session freshness
            await registerTokenWithBackend(token);
        }
      } catch (err) {
        console.error("Error retrieving token in checkPermission:", err);
      }
    }
  }, [setNotificationPermission, setFcmToken, registerTokenWithBackend, registerServiceWorker]);

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
          // Ensure SW is registered before asking for token
          // const serviceWorkerRegistration = await registerServiceWorker();

          const token = await getToken(messaging, {
            vapidKey: config.firebase.vapidKey,
          });
          
          if (token) {
            setFcmToken(token);
            await registerTokenWithBackend(token);
            setLoading(false);
            return true;
          } else {
            setError("No registration token available. Ensure VAPID key is correct.");
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
    }, [setFcmToken, setNotificationPermission, registerTokenWithBackend, registerServiceWorker]);

  /**
   * Initialize Service Worker on mount
   */
  useEffect(() => {
    registerServiceWorker().catch(err => {
        console.error("Failed to register Service Worker on mount:", err);
    });
  }, [registerServiceWorker]);

  const session = useUserSessionStore((state) => state.session);

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
      // We don't throw, just log
    } finally {
      setLoading(false);
    }
  }, [setFcmToken]);


  const queryClient = useQueryClient();

  /**
   * Set up foreground message listener
   */
  useEffect(() => {
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
      
      // Auto-refresh the notifications list and badge count
      // We use a predicate to match the object-based query key from the generator
      queryClient.invalidateQueries({
        predicate: (query) => {
            const key = query.queryKey[0] as any;
            return key && typeof key === 'object' && key._id === 'appGetNotifications';
        }
      });

      // Show a toast notification for foreground messages
      if (payload.notification) {
        toast.info(`${payload.notification.title}: ${payload.notification.body}`, {
            position: "top-right",
            autoClose: 5000,
        });
      }
    });

    // Also listen for messages from the Service Worker (background/hidden tabs)
    const handleSWMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'FCM_MESSAGE') {
        console.log("Service Worker message received:", event.data);
        queryClient.invalidateQueries({
            predicate: (query) => {
                const key = query.queryKey[0] as any;
                return key && typeof key === 'object' && key._id === 'appGetNotifications';
            }
          });
      }
    };

    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener("message", handleSWMessage);
    }

    return () => {
      unsubscribe();
      if (navigator.serviceWorker) {
        navigator.serviceWorker.removeEventListener("message", handleSWMessage);
      }
    };
  }, [queryClient]);

  return {
    requestNotificationPermission,
    checkPermission,
    deregisterToken,
    registerServiceWorker,
    loading,
    error,
  };
};
