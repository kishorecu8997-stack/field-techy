import { assetsConfig } from "@/assets";
import { Button } from "@/shared/components/commonUI/Buttons";
import Popup from "@/shared/components/Popup";
import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { AiOutlineClose } from "react-icons/ai";

/**
 * Permission step constants and derived union type:
 * "location" | "notification"
 */

export const PERMISSION_STEPS = {
  LOCATION: "location",
  NOTIFICATION: "notification",
} as const;

export type PermissionStep =
  (typeof PERMISSION_STEPS)[keyof typeof PERMISSION_STEPS];

  // LOCATION permission states from navigator.permissions
export const GEO_STATES = {
  GRANTED: "granted",
  DENIED: "denied",
  PROMPT: "prompt",
} as const;

export type GeoPermissionState =
  (typeof GEO_STATES)[keyof typeof GEO_STATES];

// Notification.permission states
export const NOTIFICATION_STATES = {
  DEFAULT: "default",
  GRANTED: "granted",
  DENIED: "denied",
} as const;

export type NotificationPermissionState =
  (typeof NOTIFICATION_STATES)[keyof typeof NOTIFICATION_STATES];

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
  const [step, setStep] = useState<PermissionStep>(PERMISSION_STEPS.LOCATION);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const geo = await navigator.permissions.query({ name: "geolocation" });
        const notif = Notification.permission;

        // --- CASE 1 ---
        // Notification granted but location undecided => show LOCATION step
        if (notif === NOTIFICATION_STATES.GRANTED && geo.state === GEO_STATES.PROMPT) {
          setStep(PERMISSION_STEPS.LOCATION);
          return;
        }

        // --- CASE 2 ---
        // Both location + notification decided => close popup
if (
  (geo.state === GEO_STATES.GRANTED || geo.state === GEO_STATES.DENIED) &&
  (notif === NOTIFICATION_STATES.GRANTED || notif === NOTIFICATION_STATES.DENIED)
) {
  setAccessPopup(false);
  return;
}


        // --- CASE 3 ---
        // Location undecided => first step
if (geo.state === GEO_STATES.PROMPT) {
  setStep(PERMISSION_STEPS.LOCATION);
  return;
}


        // --- CASE 4 ---
        // Location decided but notification undecided => second step
if (
  (geo.state === GEO_STATES.GRANTED || geo.state === GEO_STATES.DENIED) &&
  notif === NOTIFICATION_STATES.DEFAULT
) {
  setStep(PERMISSION_STEPS.NOTIFICATION);
  return;
}


        // fallback
        setAccessPopup(false);
      } catch (err) {
        console.error(err, "Error checking permissions");
      }
    };

    if (accessPopup) checkPermissions();
  }, [accessPopup, setAccessPopup]);

  if (!accessPopup) return null;

  /**
   * Handle real location permission request
   */
  const handleRealLocationRequest = () => {
    navigator.geolocation.getCurrentPosition(
      () => {
        // Success: location allowed
        if (Notification.permission === NOTIFICATION_STATES.DEFAULT) {
          setStep(PERMISSION_STEPS.NOTIFICATION);
        } else {
          setAccessPopup(false);
        }
      },
      () => {
        // Location denied
        if (Notification.permission === NOTIFICATION_STATES.DEFAULT) {
          setStep(PERMISSION_STEPS.NOTIFICATION);
        } else {
          setAccessPopup(false);
        }
      }
    );
  };

  /**
   * Handle real notification permission request
   */
  const handleRealNotificationRequest = async () => {
    await Notification.requestPermission();
    setAccessPopup(false);
  };

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
            className="w-full my-6 bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
            onClick={handleRealLocationRequest}
          >
            Allow Access
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full bg-transparent border-0 text-gray-600 hover:underline p-0 shadow-none rounded-lg py-2"
            onClick={() => {
              if (Notification.permission === "default") {
                setStep(PERMISSION_STEPS.NOTIFICATION);
              } else {
                setAccessPopup(false);
              }
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
            className="w-full my-6 bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
            onClick={handleRealNotificationRequest}
          >
            Allow Access
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full bg-transparent border-0 text-gray-600 hover:underline p-0 shadow-none rounded-lg py-2"
            onClick={() => setAccessPopup(false)}
          >
            Deny Access
          </Button>
        </div>
      )}
    </Popup>
  );
}
