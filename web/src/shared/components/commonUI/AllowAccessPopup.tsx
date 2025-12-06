import { assetsConfig } from "@/assets";
import { Button } from "@/shared/components/commonUI/Buttons";
import Popup from "@/shared/components/Popup";
import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
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

  const [enableNotification, setEnableNotification] = useState<boolean>(false);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const geo = await navigator.permissions.query({ name: "geolocation" });
        const notif = Notification.permission;

        // --- CASE 1 ---
        // Notification is granted but location still needs permission => show LOCATION popup only
        if (notif === "granted" && geo.state === "prompt") {
          setEnableNotification(false); // show location step
          return;
        }

        // --- CASE 2 ---
        // If BOTH are decided => hide popup forever
        if (
          (geo.state === "granted" || geo.state === "denied") &&
          (notif === "granted" || notif === "denied")
        ) {
          setAccessPopup(false);
          return;
        }

        // --- CASE 3 ---
        // If location still needs prompting => show first step
        if (geo.state === "prompt") {
          setEnableNotification(false);
          return;
        }

        // --- CASE 4 ---
        // If location done but notification not decided => second step
        if (
          (geo.state === "granted" || geo.state === "denied") &&
          notif === "default"
        ) {
          setEnableNotification(true);
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


  const handleRealLocationRequest = () => {
    navigator.geolocation.getCurrentPosition(
      () => {
        // Success
        if (Notification.permission === "default") {
          setEnableNotification(true); // Go to notification step
        } else {
          setAccessPopup(false); // Done
        }
      },
      () => {
        // User denied location
        if (Notification.permission === "default") {
          setEnableNotification(true); // Ask for notifications anyway
        } else {
          setAccessPopup(false);
        }
      }
    );
  };

  // Request actual notifications from browser
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


      {!enableNotification ? (
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


          <button
            type="button"
            className="hover:underline text-gray-600 cursor-pointer bg-transparent border-0 p-0 text-left"
            onClick={() => {
              if (Notification.permission === "default") {
                setEnableNotification(true); // Move to notification popup
              } else {
                setAccessPopup(false);
              }
            }}
          >
            Deny Access
          </button>
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


          <button
            type="button"
            className="hover:underline text-gray-600 cursor-pointer bg-transparent border-0 p-0 text-left"
            onClick={() => {
              setAccessPopup(false); // close popup on deny
            }}
          >
            Deny Access
          </button>

        </div>
      )}
    </Popup>
  );
}
