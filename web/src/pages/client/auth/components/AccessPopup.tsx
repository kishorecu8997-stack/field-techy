import { assetsConfig } from "@/assets";
import { Button } from "@/shared/components/commonUI/Buttons";
import Popup from "@/shared/components/Popup";
import { useState, type Dispatch, type SetStateAction } from "react";
import { AiOutlineClose } from "react-icons/ai";
/**
 * Props for the AllowAccessPopup component.
 *
 * @property {boolean} accessPopup - Whether the access popup is visible.
 * @property {Dispatch<SetStateAction<boolean>>} setAccessPopup - Setter to toggle popup visibility.
 */
interface AllowAccessPopupProps {
  accessPopup: boolean;
  setAccessPopup: Dispatch<SetStateAction<boolean>>;
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
}: AllowAccessPopupProps) {
  // Local state: whether to show the notifications step instead of location step
  const [enableNotification, setEnableNotification] = useState<boolean>(false);

  if (!accessPopup) return null;

  return (
    <Popup open={accessPopup} onClose={() => setAccessPopup(false)}>
      <div
        className="flex text-lg justify-end px-6 pt-4 cursor-pointer"
        onClick={() => setAccessPopup(false)}
      >
        <AiOutlineClose />
      </div>
      {!enableNotification ? (
        <>
          <div className="pb-6 px-10 text-center">
            <img
              src={assetsConfig.icons.location}
              alt="profile"
              className="text-center mx-auto my-4"
            />
            <p className="text-2xl font-semibold">Access Your Location</p>
            <p className="text-center mt-4 text-lg text-gray-600">
              Easily grant the owner access to fetch current location and send
              notifications—stay connected, informed, and in control.
            </p>

            <Button
              type="button"
              className="w-full my-6 bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
              onClick={() => setEnableNotification(true)}
            >
              Allow Access
            </Button>
            <button
              type="button"
              className="hover:underline text-gray-600 cursor-pointer bg-transparent border-0 p-0 text-left"
              onClick={() => setAccessPopup(false)}
            >
              Deny Access
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="pb-6 px-10 text-center">
            <img
              src={assetsConfig.icons.notification}
              alt="profile"
              className="text-center mx-auto my-4"
            />
            <p className="text-2xl font-semibold">Enable Notifications</p>
            <p className="text-center mt-4 text-lg text-gray-600">
              Enable notifications to stay informed with real-time alerts,
              important updates, and timely reminders. You'll never miss a
              message and can stay connected and in control at all times.
            </p>

            <Button
              type="button"
              className="w-full my-6 bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
              onClick={() => {
                setAccessPopup(false);
              }}
            >
              Allow Access
            </Button>
            <button
              type="button"
              className="hover:underline text-gray-600 cursor-pointer bg-transparent border-0 p-0 text-left"
              onClick={() => setAccessPopup(false)}
            >
              Deny Access
            </button>
          </div>
        </>
      )}
    </Popup>
  );
}