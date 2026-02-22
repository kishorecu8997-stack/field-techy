import React from "react";

interface SwitchToVideoCallModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const SwitchToVideoCallModal: React.FC<SwitchToVideoCallModalProps> = ({
  isVisible,
  onCancel,
  onConfirm,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-opacity-40"
        onClick={onCancel}
      />

      {/* Modal content */}
      <div className="relative z-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-sm mx-4">
        {/* Top section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Switch Call
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Switch to video call to share your screen
          </p>
        </div>

        {/* Bottom section - buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors font-medium"
          >
            Switch
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwitchToVideoCallModal;
