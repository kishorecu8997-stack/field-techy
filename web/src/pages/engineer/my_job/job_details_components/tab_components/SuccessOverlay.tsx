import React from "react";
import { Button } from "@/shared/components/commonUI/Buttons";
import { JOB_TAB_COPY } from "@/shared/constants/jobTabs";
import { IoCheckmarkDone } from "react-icons/io5";

const SuccessOverlay = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg w-[380px] max-w-[92vw] mx-4 p-6 text-center">
      <Button
        variant="no_style"
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 text-2xl"
        aria-label="Close"
      >
        ×
      </Button>
      <div className="mx-auto mb-4 flex items-center justify-center">
        <IoCheckmarkDone className="w-12 h-12 text-teal-700" aria-hidden="true" />
      </div>
      <div className="text-gray-900 dark:text-gray-100 font-medium">{JOB_TAB_COPY.successMessage}</div>
    </div>
  </div>
);

export default SuccessOverlay;
