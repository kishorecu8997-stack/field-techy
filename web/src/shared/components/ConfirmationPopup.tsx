import Popup from "@/shared/components/Popup";
import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import { Button } from "./commonUI/Buttons";

interface ConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  return (
    <Popup open={isOpen} onClose={onClose}>
      <div className="flex items-center justify-center px-0 w-full">
        <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="p-6 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {message}
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

          <div className="p-6 pt-0">
            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="solid" onClick={onCancel}>
                {cancelText}
              </Button>
              <Button variant="primary" onClick={onConfirm} type="button">
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default ConfirmationPopup;
