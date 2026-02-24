import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Interface representing the state of the device store.
 */
interface DeviceState {
  /** The Firebase Cloud Messaging token for push notifications. */
  fcmToken: string | null;
  /** The current geolocation of the user. */
  location: { lat: number; lng: number } | null;
  /** The current status of the location permission. */
  locationPermission: PermissionState | "prompt" | "granted" | "denied";
  /** The current status of the notification permission. */
  notificationPermission: NotificationPermission;
  /** Stable device identifier for the current browser/device. */
  deviceId: string | null;
  /** Sets the FCM token. */
  setFcmToken: (token: string | null) => void;
  /** Sets the device identifier. */
  setDeviceId: (id: string) => void;
  /** Sets the user's location. */
  setLocation: (location: { lat: number; lng: number } | null) => void;
  /** Sets the location permission status. */
  setLocationPermission: (
    status: PermissionState | "prompt" | "granted" | "denied",
  ) => void;
  /** Sets the notification permission status. */
  setNotificationPermission: (status: NotificationPermission) => void;
}

/**
 * Zustand store for managing device-related state such as geolocation and FCM tokens.
 * This store is persisted to localStorage under the key 'device-storage'.
 */
export const useDeviceStore = create<DeviceState>()(
  persist(
    (set) => ({
      fcmToken: null,
      deviceId: null,
      location: null,
      locationPermission: "prompt",
      notificationPermission: "default",
      setFcmToken: (token) => set({ fcmToken: token }),
      setDeviceId: (id) => set({ deviceId: id }),
      setLocation: (location) => set({ location }),
      setLocationPermission: (status) => set({ locationPermission: status }),
      setNotificationPermission: (status) =>
        set({ notificationPermission: status }),
    }),
    {
      name: "device-storage",
    },
  ),
);

/**
 * Ensures a stable device ID exists and returns it.
 */
export const getStableDeviceId = (): string => {
  const store = useDeviceStore.getState();
  if (store.deviceId) return store.deviceId;

  const newId =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `web-${Math.random().toString(36).substring(2, 15)}-${Date.now()}`;

  store.setDeviceId(newId);
  return newId;
};
