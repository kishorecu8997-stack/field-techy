
import { useEffect } from "react";
import { fcmService } from "@/shared/config/firebaseConfig";
import { useTokenStore } from "@/shared/store";
import { registerDeviceToken } from "@/shared/apiServices/notifications/notificationOpenApiService";
import type { FCMMessage } from "@/shared/store/types";
import { useQueryClient } from "@tanstack/react-query";

export const FCMHandler = () => {
    const {
        updateToken,
        setRegistrationStatus,
        setIsLoading,
        setErrorMessage,
    } = useTokenStore();
    const queryClient = useQueryClient();

    useEffect(() => {
        const initializeFCM = async () => {
            try {
                await fcmService.initialize({
                    onMessage: (message: FCMMessage) => {
                        if (message.notification) {
                            const newNotification = {
                                id: parseInt(message.messageId || Date.now().toString().slice(-9)), // Ensure number ID
                                title: message.notification.title || "New Notification",
                                body: message.notification.body || "",
                                createdAt: new Date().toISOString(),
                                isRead: false,
                                type: "info",
                            };

                            // Update the cache immediately
                            queryClient.setQueryData(
                                [{ _id: 'appGetNotifications' }], // Match the query key structure
                                (oldData: any) => {
                                    if (!oldData) return { data: [newNotification] };

                                    // Check if notification with same ID already exists
                                    const exists = oldData.data?.some((n: any) => n.id === newNotification.id);
                                    if (exists) return oldData;

                                    // Prepend the new notification to the existing list
                                    return {
                                        ...oldData,
                                        data: [newNotification, ...(oldData.data || [])]
                                    };
                                }
                            );
                        }

                        // Invalidate to eventually sync with server
                        queryClient.invalidateQueries({
                            predicate: (query) => {
                                const key = query.queryKey[0] as any;
                                return key && typeof key === 'object' && key._id === 'appGetNotifications';
                            }
                        });
                    },
                    onTokenRefresh: async (newToken: string) => {
                        updateToken(newToken);
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
    ]);

    return null;
};
