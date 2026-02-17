import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  appGetNotificationsOptions,
  appMarkNotificationAsReadMutation,
  appDeleteNotificationMutation,
  appMarkAllNotificationsAsReadMutation,
} from "@/api/@tanstack/react-query.gen";
import { apiClient } from "../apiClient";
import { mapApiNotification } from "./notificationAdapter";

/**
 * Shared Notification API services
 */

export function useAppNotifications() {
  const result = useQuery({
    ...appGetNotificationsOptions({
      client: apiClient,
    }),
    refetchOnWindowFocus: true, // Critical for real-time feel when tab is focused
    staleTime: 0, // Always consider notifications potentially stale to allow immediate updates
  });

  // Automatically map the data using the adapter
  const mappedData = result.data?.data?.map(mapApiNotification) ?? [];

  // Sort by createdAt descending (newest first)
  mappedData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return {
    ...result,
    notifications: mappedData,
  };
}

// Helper to invalidate notifications reliably using predicate matching
const invalidateNotifications = (queryClient: any) => {
  queryClient.invalidateQueries({
    predicate: (query: any) => {
      const key = query.queryKey[0];
      return key && typeof key === 'object' && key._id === 'appGetNotifications';
    }
  });
};

export function useAppMarkNotificationAsRead(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...appMarkNotificationAsReadMutation({
      client: apiClient,
    }),
    onSuccess: (data) => {
      invalidateNotifications(queryClient);
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useAppMarkAllNotificationsAsRead(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...appMarkAllNotificationsAsReadMutation({
      client: apiClient,
    }),
    onSuccess: (data) => {
      invalidateNotifications(queryClient);
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useAppDeleteNotification(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...appDeleteNotificationMutation({
      client: apiClient,
    }),
    onSuccess: (data) => {
      invalidateNotifications(queryClient);
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Raw API registration for device tokens
 */
export async function registerDeviceToken(token: string) {
  const { appRegisterDeviceToken } = await import("@/api/sdk.gen");
  return appRegisterDeviceToken({
    client: apiClient,
    body: {
      token,
      platform: "web",
      deviceId: `web-${window.navigator.userAgent.substring(0, 50)}-${Date.now()}`,
    },
  });
}

/**
 * Remove device token
 */
export async function deregisterDeviceToken(token: string) {
  const { appRemoveDeviceToken } = await import("@/api/sdk.gen");
  return appRemoveDeviceToken({
    client: apiClient,
    body: {
      token,
    },
  });
}
