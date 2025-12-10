import { Button } from "@/shared/components/commonUI/Buttons";
import Popup from "@/shared/components/Popup";
import React from "react";
import { IoCloseSharp } from "react-icons/io5";

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
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        {/* Header with close button */}
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
              className="text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
            >
              <IoCloseSharp className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-6 pt-0">
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelss
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-emerald-700 text-white rounded-lg font-medium hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default LogoutConfirmationPopup;