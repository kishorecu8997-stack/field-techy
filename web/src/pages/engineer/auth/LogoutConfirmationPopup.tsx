import { icons } from "@/config/icons";
import Popup from "@/shared/components/Popup";
import { useHomeNavigation } from "@/shared/hooks/useHomeNavigation";
import React from "react";

interface LogoutProps {
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * LogoutConfirmationPopup component displays a modal asking user to confirm logout.
 * Features dark mode support, centered content, and action buttons.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onConfirm - Function called when user confirms logout
 * @param {Function} props.onCancel - Function called when user cancels logout
 *
 * @example
 * <LogoutConfirmationPopup
 *   onConfirm={() => console.log('Logged out')}
 *   onCancel={() => console.log('Cancelled')}
 * />
 */
const LogoutConfirmationPopup: React.FC<LogoutProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
}) => {
  const { goToLogin } = useHomeNavigation();
  return (
    <Popup open={isOpen} onClose={onClose}>
      <div className="flex items-center justify-center z-50">
        <div className="relative w-full max-w-md  dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 rounded-lg shadow-xl overflow-hidden">
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
              <button
                onClick={onCancel}
                className="text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <icons.close className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Body & Buttons */}
          <div className="p-6 pt-4">
            <div className="flex space-x-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClose();
                  onConfirm();
                  goToLogin();
                  localStorage.clear();
                }}
                className="flex-1 px-4 py-2 bg-emerald-700 text-white rounded-lg font-medium hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default LogoutConfirmationPopup;
