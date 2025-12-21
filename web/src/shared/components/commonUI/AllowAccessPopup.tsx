import { assetsConfig } from "@/assets";
import { Button } from "@/shared/components/commonUI/Buttons";
import Popup from "@/shared/components/Popup";
import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useGeolocation } from "@/shared/hooks/useGeolocation";
import { useFCM } from "@/shared/hooks/useFCM";
import { toast } from "react-toastify";
import { useDeviceStore } from "@/shared/store/useDeviceStore";

/**
 * Props for the AllowAccessPopup component.
 *
 * @property {boolean} accessPopup - Whether the access popup is visible.
 * @property {Dispatch<SetStateAction<boolean>>} setAccessPopup - Setter to toggle popup visibility.
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
 * AllowAccessPopup
 *
 * A small two-step permission popup shown to clients:
 * - First step: ask for location access (shows location icon and description).
 * - Second step: when the user clicks "Allow Access" on the first step, show
 *   the notifications permission step.
 *
 * The component renders nothing when `accessPopup` is false.
 *
 * @param {AllowAccessPopupProps} props - Component props
 * @returns {JSX.Element | null} The popup element when visible or null when hidden
 */
export default function AllowAccessPopup({
  accessPopup,
  setAccessPopup,
  onAllowLocation,
  onAllowNotification,
  onDenyLocation,
  onDenyNotification,
}: AllowAccessPopupProps) {
  const {
    locationPermission,
    notificationPermission,
    setLocationPermission,
    setNotificationPermission
  } = useDeviceStore();

  // Determine initial step based on permission states
  // If location is not 'prompt', skip to notification step
  const [isNotificationStep, setIsNotificationStep] = useState(
    locationPermission !== 'prompt'
  );

  const { requestLocation, loading: locationLoading } = useGeolocation();
  const { requestNotificationPermission, loading: notificationLoading } = useFCM();

  // When popup opens, check if we should show it at all
  useEffect(() => {
    if (accessPopup) {
      // If location is not 'prompt', skip to notification
      if (locationPermission !== 'prompt') {
        // If notification is also not 'default', close popup entirely
        if (notificationPermission !== 'default') {
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
        <AiOutlineClose />
      </div>

      {step === PERMISSION_STEPS.LOCATION ? (
        <div className="pb-6 px-10 text-center">
          <img
            src={assetsConfig.icons.location}
            alt="location"
            className="text-center mx-auto my-4"
          />
          <p className="text-2xl font-semibold">Access Your Location</p>
          <p className="text-center mt-4 text-lg text-gray-600">
            Grant access to fetch your current location and provide better
            services.
          </p>

          <Button
            type="button"
            disabled={locationLoading}
            className="w-full my-6 bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
            onClick={async () => {
              const success = await requestLocation();
              if (success) {
                onAllowLocation?.();
                setLocationPermission('granted');
                setIsNotificationStep(true); // Move to Step 2
              } else {
                toast.error("Location access denied or failed.");
                setLocationPermission('denied');
                setIsNotificationStep(true);
              }
            }}
          >
            {locationLoading ? 'Allowing...' : 'Allow Access'}
          </Button>

          <Button
            type="button"
            disabled={locationLoading}
            className="hover:underline text-gray-600 cursor-pointer bg-transparent border-0 p-0 text-left"
            onClick={() => {
              onDenyLocation?.();
              setLocationPermission('denied');
              setIsNotificationStep(true);
            }}
          >
            Deny Access
          </Button>
        </div>
      ) : (
        <div className="pb-6 px-10 text-center">
          <img
            src={assetsConfig.icons.notification}
            alt="notification"
            className="text-center mx-auto my-4"
          />
          <p className="text-2xl font-semibold">Enable Notifications</p>
          <p className="text-center mt-4 text-lg text-gray-600">
            Enable notifications to stay informed with important updates.
          </p>

          <Button
            type="button"
            disabled={notificationLoading}
            className="w-full my-6 bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
            onClick={async () => {
              const success = await requestNotificationPermission();
              if (success) {
                onAllowNotification?.();
                setNotificationPermission('granted');
              } else {
                toast.error("Notification access denied or failed.");
                setNotificationPermission('denied');
              }
              setAccessPopup(false);
            }}
          >
            {notificationLoading ? 'Allowing...' : 'Allow Access'}
          </Button>

          <Button
            type="button"
            disabled={notificationLoading}
            className="hover:underline text-gray-600 cursor-pointer bg-transparent border-0 p-0 text-left"
            onClick={() => {
              onDenyNotification?.();
              setNotificationPermission('denied');
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
