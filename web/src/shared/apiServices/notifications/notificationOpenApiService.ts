import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  appGetNotificationsOptions,
  appMarkNotificationAsReadMutation,
  appDeleteNotificationMutation,
  appMarkAllNotificationsAsReadMutation,
} from "@/api/@tanstack/react-query.gen";
import { apiClient } from "../apiClient";
import { mapApiNotification } from "./notificationAdapter";
import { appRegisterDeviceToken } from "@/api/sdk.gen";
import { getStableDeviceId } from "@/shared/store/useDeviceStore";

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
  mappedData.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return {
    ...result,
    notifications: mappedData,
  };
}

export const NOTIFICATIONS_QUERY_ID = "appGetNotifications";

// Helper to invalidate notifications reliably using predicate matching
const invalidateNotifications = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  /**
   * We use a predicate to match the query key because the generated SDK uses
   * an object containing an `_id` field as the first element of the query key array.
   * This approach is more robust than matching by a fixed array, as it targets
   * all queries for this endpoint regardless of any additional parameters
   * (like filter options or search queries) that might be present in the query key.
   */
  queryClient.invalidateQueries({
    predicate: (query) => {
      const key = query.queryKey[0] as { _id?: string };
      return (
        key && typeof key === "object" && key._id === NOTIFICATIONS_QUERY_ID
      );
    },
  });
};

export function useAppMarkNotificationAsRead(options?: {
  onSuccess?: (data: unknown) => void;
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
  onSuccess?: (data: unknown) => void;
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
  onSuccess?: (data: unknown) => void;
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
  const deviceId = getStableDeviceId();

  return appRegisterDeviceToken({
    client: apiClient,
    body: {
      token,
      platform: "web",
      deviceId,
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
