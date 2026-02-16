import React from "react";
import { Button } from "@/shared/components/commonUI/Buttons";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * ConfirmModal - Reusable confirmation modal with title, message, and actions
 */
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm mx-4">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            {message}
          </p>

          <div className="flex justify-end gap-3">
            <Button
              variant="no_style"
              type="button"
              onClick={onCancel}
              className="border border-gray-300 dark:border-gray-600 px-5 py-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              className="bg-teal-800 hover:bg-teal-900 text-white px-5 py-2 rounded"
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
