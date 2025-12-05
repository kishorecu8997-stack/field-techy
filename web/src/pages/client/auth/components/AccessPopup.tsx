import { assetsConfig } from "@/assets";
import { Button } from "@/shared/components/commonUI/Buttons";
import Popup from "@/shared/components/Popup";
import { useState, type Dispatch, type SetStateAction } from "react";
import { AiOutlineClose } from "react-icons/ai";

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
  // Step control: false = Location step, true = Notification step
  const [isNotificationStep, setIsNotificationStep] = useState(false);

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
            className="w-full my-6 bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
            onClick={() => {
              onAllowLocation?.();
              localStorage.setItem("location_permission", "allowed");
              setIsNotificationStep(true); // Move to Step 2
            }}
          >
            Allow Access
          </Button>

          {/* Deny Location */}
          <Button
            type="button"
            className="hover:underline text-gray-600 cursor-pointer bg-transparent border-0 p-0 text-left"
            onClick={() => {
              onDenyLocation?.();
              localStorage.setItem("location_permission", "denied");
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
            className="w-full my-6 bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
            onClick={() => {
              onAllowNotification?.();
              localStorage.setItem("notification_permission", "allowed");
              setAccessPopup(false);
            }}
          >
            Allow Access
          </Button>

          {/* Deny Notification */}
          <Button
            type="button"
            className="hover:underline text-gray-600 cursor-pointer bg-transparent border-0 p-0 text-left"
            onClick={() => {
              onDenyNotification?.();
              localStorage.setItem("notification_permission", "denied");
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