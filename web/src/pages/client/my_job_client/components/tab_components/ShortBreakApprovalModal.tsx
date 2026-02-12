import React from "react";
import { Button } from "@/shared/components/commonUI/Buttons";
import { MODAL_TITLES } from "@/constants/timelineConstants";

interface ShortBreakApprovalModalProps {
  isOpen: boolean;
  notes: string;
  onNotesChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

/**
 * ShortBreakApprovalModal - Modal for approving short break with notes
 */
const ShortBreakApprovalModal: React.FC<ShortBreakApprovalModalProps> = ({
  isOpen,
  notes,
  onNotesChange,
  onCancel,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {MODAL_TITLES.shortBreakApproval}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Any Notes?
              </label>
              <textarea
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                rows={4}
                placeholder="Complete your work and then take a break"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
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
              onClick={onSubmit}
              className="bg-teal-800 hover:bg-teal-900 text-white px-5 py-2 rounded"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortBreakApprovalModal;
