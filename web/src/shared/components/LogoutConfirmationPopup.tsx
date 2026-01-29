import Popup from "@/shared/components/Popup";
import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import { Button } from "./commonUI/Buttons";

interface LogoutProps {
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * LogoutConfirmationPopup component displays a modal asking user to confirm logout.
 * Features dark mode support, centered content, and action buttons.
 */
const LogoutConfirmationPopup: React.FC<LogoutProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
}) => {
  return (
    <Popup open={isOpen} onClose={onClose}>
      {/* Centering wrapper */}
      <div className="flex items-center justify-center px-0 w-full">
        <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Log Out
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Are you sure you want to log out of your Field Techy account?
                </p>
              </div>
              <div
                onClick={onClose}
                aria-label="Close"
                className="text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <IoCloseSharp className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="p-6 pt-0">
            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
              <Button variant="primary" onClick={onConfirm} type="button">
                Logout
              </Button>
              <Button
                type="button"
                className="col-span-2 bg-red-700 hover:bg-red-800"
                variant="primary"
                onClick={onConfirm}
              >
                Logout All Other Sessions
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default LogoutConfirmationPopup;
