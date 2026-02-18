import { useEffect } from "react";
import { fcmService } from "@/shared/config/firebaseConfig";
import { useTokenStore } from "@/shared/store";
import { useDeviceStore } from "@/shared/store/useDeviceStore";
import { registerDeviceToken } from "@/shared/apiServices/notifications/notificationOpenApiService";
import type { FCMMessage } from "@/shared/store/types";
import { useQueryClient } from "@tanstack/react-query";
import type { AppGetNotificationsResponse } from "@/api/types.gen";

type CachedNotification = Omit<
  AppGetNotificationsResponse["data"][number],
  "id"
> & { id: string | number };

export const FCMHandler = () => {
  const { updateToken, setRegistrationStatus, setIsLoading, setErrorMessage } =
    useTokenStore();
  const { setFcmToken } = useDeviceStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    const initializeFCM = async () => {
      try {
        await fcmService.initialize({
          onMessage: (message: FCMMessage) => {
            if (message.notification) {
              const newNotification = {
                id: message.messageId || Date.now().toString(),
                title: message.notification.title || "New Notification",
                body: message.notification.body || "",
                createdAt: new Date().toISOString(),
                isRead: false,
                type: "info",
              };

              // Update the cache immediately
              queryClient.setQueryData(
                [{ _id: "appGetNotifications" }], // Match the query key structure
                (oldData: { data: CachedNotification[] } | undefined) => {
                  if (!oldData) return { data: [newNotification as CachedNotification] };

                  // Check if notification with same ID already exists
                  const exists = oldData.data?.some(
                    (n) => n.id === newNotification.id,
                  );
                  if (exists) return oldData;

                  // Prepend the new notification to the existing list
                  return {
                    ...oldData,
                    data: [newNotification, ...(oldData.data || [])],
                  };
                },
              );
            }

            // Invalidate to eventually sync with server
            queryClient.invalidateQueries({
              predicate: (query) => {
                const key = query.queryKey[0] as { _id?: string };
                return (
                  key &&
                  typeof key === "object" &&
                  key._id === "appGetNotifications"
                );
              },
            });
          },
          onTokenRefresh: async (newToken: string) => {
            // Check if token is actually new
            const currentToken = useDeviceStore.getState().fcmToken;

            // Always update local store
            updateToken(newToken);

            if (newToken !== currentToken) {
              setFcmToken(newToken); // Update persisted device store

              setIsLoading(true);
              try {
                await registerDeviceToken(newToken);
                setRegistrationStatus(true);
              } catch (error) {
                setErrorMessage("Failed to sync notification token");
                setRegistrationStatus(false);
              } finally {
                setIsLoading(false);
              }
            } else {
              console.log(
                "FCMHandler: Token matches stored token, skipping registration.",
              );
            }
          },
          onTokenLoading: (loading: boolean) => {
            setIsLoading(loading);
          },
          onError: (error: Error) => {
            setErrorMessage(error.message);
          },
        });
      } catch (error) {
        console.error("Failed to initialize FCM:", error);
      }
    };

    initializeFCM();
  }, [
    updateToken,
    setRegistrationStatus,
    setIsLoading,
    setErrorMessage,
    queryClient,
    setFcmToken,
  ]);

  return null;
};
