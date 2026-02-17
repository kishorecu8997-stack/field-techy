import { useEffect } from "react";
import { fcmService } from "@/shared/config/firebaseConfig";
import { useMessageStore, useTokenStore } from "@/shared/store";
import { registerDeviceToken } from "@/shared/apiServices/notifications/notificationOpenApiService";
import { toast } from "react-toastify";
import type { FCMMessage } from "@/shared/store/types";
import { useQueryClient } from "@tanstack/react-query";

export const FCMHandler = () => {
    const { addMessage } = useMessageStore();
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
                        console.log("FCM Message received:", message);
                        addMessage(message);

                        // Invalidate notification queries to trigger a re-fetch
                        queryClient.invalidateQueries({
                            predicate: (query) => {
                                const key = query.queryKey[0] as any;
                                return key && typeof key === 'object' && key._id === 'appGetNotifications';
                            }
                        });

                        if (message.notification) {
                            // toast.info(
                            //     `${message.notification.title}: ${message.notification.body}`,
                            // );
                            console.log(
                                `${message.notification.title}: ${message.notification.body}`,
                            );
                        }
                    },
                    onTokenRefresh: async (newToken: string) => {
                        console.log("Token refreshed:", newToken);
                        updateToken(newToken);
                        setIsLoading(true);
                        try {
                            await registerDeviceToken(newToken);
                            setRegistrationStatus(true);
                            console.log("Token registered with server");
                        } catch (error) {
                            console.error("Failed to register token with server:", error);
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
                        console.error("FCM Error:", error);
                        setErrorMessage(error.message);
                    },
                });
            } catch (error) {
                console.error("Failed to initialize FCM:", error);
            }
        };

        initializeFCM();
    }, [
        addMessage,
        updateToken,
        setRegistrationStatus,
        setIsLoading,
        setErrorMessage,
        queryClient,
    ]);

    return null;
};
