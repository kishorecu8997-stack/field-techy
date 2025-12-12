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
  const { locationPermission } = useDeviceStore();
  // Step control: false = Location step, true = Notification step
  // If location is already granted, start at Notification step
  const [isNotificationStep, setIsNotificationStep] = useState(locationPermission === 'granted');

  const { requestLocation, loading: locationLoading } = useGeolocation();
  const { requestNotificationPermission, loading: notificationLoading } = useFCM();

  // Auto-advance if location permission becomes granted (e.g. via background check)
  useEffect(() => {
    if (locationPermission === 'granted') {
      setIsNotificationStep(true);
    }
  }, [locationPermission]);

  return (
    <Popup open={accessPopup} onClose={() => setAccessPopup(false)}>
      <div
        className="flex text-lg justify-end px-6 pt-4 cursor-pointer"
        onClick={() => setAccessPopup(false)}
      >
        <AiOutlineClose />
      </div>

      {!isNotificationStep ? (
        <div className="pb-6 px-10 text-center">
          <img
            src={assetsConfig.icons.location}
            alt="location-icon"
            className="text-center mx-auto my-4"
          />

          <p className="text-2xl font-semibold">Access Your Location</p>
          <p className="text-center mt-4 text-lg text-gray-600">
            Easily grant the owner access to fetch current location and send
            notifications—stay connected, informed, and in control.
          </p>

          {/* Allow Location */}
          <Button
            type="button"
            disabled={locationLoading}
            className="w-full my-6 bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
            onClick={async () => {
              const success = await requestLocation();
              if (success) {
                onAllowLocation?.();
                localStorage.setItem("location_permission", "allowed");
                setIsNotificationStep(true); // Move to Step 2
              } else {
                toast.error("Location access denied or failed.");
                setIsNotificationStep(true); // Move to next step even on failure as per requirement? 
                // User said: "else, throw a toast message saying the appropriate message and move to next"
              }
            }}
          >
            {locationLoading ? 'Allowing...' : 'Allow Access'}
          </Button>

          {/* Deny Location */}
          <button
            type="button"
            disabled={locationLoading}
            className="hover:underline text-gray-600 cursor-pointer bg-transparent border-0 p-0 text-left"
            onClick={() => {
              onDenyLocation?.();
              localStorage.setItem("location_permission", "denied");
              setIsNotificationStep(true);
            }}
          >
            Deny Access
          </button>
        </div>
      ) : (
        /* STEP 2 — NOTIFICATION PERMISSION */
        <div className="pb-6 px-10 text-center">
          <img
            src={assetsConfig.icons.notification}
            alt="notification-icon"
            className="text-center mx-auto my-4"
          />

          <p className="text-2xl font-semibold">Enable Notifications</p>
          <p className="text-center mt-4 text-lg text-gray-600">
            Enable notifications to stay informed with real-time alerts,
            important updates, and timely reminders.
          </p>

          {/* Allow Notification */}
          <Button
            type="button"
            disabled={notificationLoading}
            className="w-full my-6 bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
            onClick={async () => {
              const success = await requestNotificationPermission();
              if (success) {
                onAllowNotification?.();
                localStorage.setItem("notification_permission", "allowed");
              } else {
                toast.error("Notification access denied or failed.");
              }
              setAccessPopup(false);
            }}
          >
            {notificationLoading ? 'Allowing...' : 'Allow Access'}
          </Button>

          {/* Deny Notification */}
          <button
            type="button"
            disabled={notificationLoading}
            className="hover:underline text-gray-600 cursor-pointer bg-transparent border-0 p-0 text-left"
            onClick={() => {
              onDenyNotification?.();
              localStorage.setItem("notification_permission", "denied");
              setAccessPopup(false);
            }}
          >
            Deny Access
          </button>
        </div>
      )}
    </Popup>
  );
}
