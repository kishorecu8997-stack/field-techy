import { assetsConfig } from "@/assets";
import { Button } from "@/shared/components/commonUI/Buttons";
import Popup from "@/shared/components/Popup";
import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useGeolocation } from "@/shared/hooks/useGeolocation";
import { useFCM } from "@/shared/hooks/useFCM";
import { toast } from "react-toastify";
import { useDeviceStore } from "@/shared/store/useDeviceStore";

/**
 * Props for the AllowAccessPopup component.
 */
interface AllowAccessPopupProps {
  accessPopup: boolean;
  setAccessPopup: Dispatch<SetStateAction<boolean>>;
  onAllowLocation?: () => void;
  onAllowNotification?: () => void;
  onDenyLocation?: () => void;
  onDenyNotification?: () => void;
}

/**
 * AllowAccessPopup – Two-step Permission Popup
 */
export default function AllowAccessPopup({
  accessPopup,
  setAccessPopup,
  onAllowLocation,
  onAllowNotification,
  onDenyLocation,
  onDenyNotification,
}: AllowAccessPopupProps) {
  const locationPermission = useDeviceStore(
    (state) => state.locationPermission,
  );
  const notificationPermission = useDeviceStore(
    (state) => state.notificationPermission,
  );
  const setLocationPermission = useDeviceStore(
    (state) => state.setLocationPermission,
  );
  const setNotificationPermission = useDeviceStore(
    (state) => state.setNotificationPermission,
  );

  // Determine initial step based on permission states
  // If location is not 'prompt', skip to notification step
  const [isNotificationStep, setIsNotificationStep] = useState(
    locationPermission !== "prompt",
  );

  const { requestLocation, loading: locationLoading } = useGeolocation();
  const { requestNotificationPermission, loading: notificationLoading } =
    useFCM();

  // When popup opens, check if we should show it at all
  useEffect(() => {
    if (accessPopup) {
      // If location is not 'prompt', skip to notification
      if (locationPermission !== "prompt") {
        // If notification is also not 'default', close popup entirely
        if (notificationPermission !== "default") {
          setAccessPopup(false);
        } else {
          setIsNotificationStep(true);
        }
      }
    }
  }, [accessPopup, locationPermission, notificationPermission, setAccessPopup]);

  return (
    <Popup open={accessPopup} onClose={() => setAccessPopup(false)}>
      <div
        className="flex text-lg justify-end px-6 pt-4 cursor-pointer"
        onClick={() => setAccessPopup(false)}
      >
        <AiOutlineClose className="dark:text-white" />
      </div>

      {!isNotificationStep ? (
        <div className="pb-6 px-10 text-center">
          <img
            src={assetsConfig.icons.location}
            alt="location-icon"
            className="text-center mx-auto my-4 brightness-150"
          />

          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Access Your Location
          </p>

          <p className="text-center mt-4 text-lg text-gray-600 dark:text-gray-400">
            Easily grant the owner access to fetch current location and send
            notifications—stay connected, informed, and in control.
          </p>

          {/* Allow Location */}
          <Button
            type="button"
            disabled={locationLoading}
            className="w-full my-2 bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
            onClick={async () => {
              const success = await requestLocation();
              if (success) {
                onAllowLocation?.();
                setLocationPermission("granted");
                setIsNotificationStep(true); // Move to Step 2
              } else {
                toast.error("Location access denied or failed.");
                setLocationPermission("denied");
                setIsNotificationStep(true);
              }
            }}
          >
            {locationLoading ? "Allowing..." : "Allow Access"}
          </Button>

          {/* Deny Location */}
          <Button
            type="button"
            disabled={locationLoading}
            className="w-full my-2 bg-gradient-to-r from-rose-700 to-rose-900 text-white py-2 rounded-lg hover:opacity-90 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1"
            onClick={() => {
              onDenyLocation?.();
              setLocationPermission("denied");
              setIsNotificationStep(true);
            }}
          >
            Deny Access
          </Button>
        </div>
      ) : (
        /* STEP 2 — NOTIFICATION PERMISSION */
        <div className="pb-6 px-10 text-center">
          <img
            src={assetsConfig.icons.notification}
            alt="notification-icon"
            className="text-center mx-auto my-4 filter brightness-150"
          />

          <p className="text-2xl font-semibold dark:text-white">
            Enable Notifications
          </p>
          <p className="text-center mt-4 text-lg text-gray-600 dark:text-gray-400">
            Enable notifications to stay informed with real-time alerts,
            important updates, and timely reminders.
          </p>

          {/* Allow Notification */}
          <Button
            type="button"
            disabled={notificationLoading}
            className="w-full my-2 bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
            onClick={async () => {
              const success = await requestNotificationPermission();
              if (success) {
                onAllowNotification?.();
                setNotificationPermission("granted");
              } else {
                toast.error("Notification access denied or failed.");
                setNotificationPermission("denied");
              }
              setAccessPopup(false);
            }}
          >
            {notificationLoading ? "Allowing..." : "Allow Access"}
          </Button>

          {/* Deny Notification */}
          <Button
            type="button"
            disabled={notificationLoading}
            className="w-full my-2 bg-gradient-to-r from-rose-700 to-rose-900 text-white py-2 rounded-lg hover:opacity-90 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1"
            onClick={() => {
              onDenyNotification?.();
              setNotificationPermission("denied");
              setAccessPopup(false);
            }}
          >
            Deny Access
          </Button>
        </div>
      )}
    </Popup>
  );
}
