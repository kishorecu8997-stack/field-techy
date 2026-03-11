import { assetsConfig } from "@/assets";
import { Button } from "@/shared/components/commonUI/Buttons";
import { AiOutlineClose } from "react-icons/ai";

interface ConfirmationModalProps {
  actionType: "hold" | "clone" | "cancel"; // new
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * A modal component that confirms a job hold has been successfully sent.
 * It provides buttons to navigate back to the home/dashboard page.
 * It also displays a checkmark icon and a confirmation message.
 */
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  actionType,
  onConfirm,
  onClose,
}) => {
  // Dynamic texts based on action type
  const titles = {
    hold: "Are you sure you want to Hold?",
    clone: "Are you sure you want to Clone?",
    cancel: "Are you sure you want to Cancel?",
  };

  const descriptions = {
    hold: "This will temporarily pause the job until you decide to resume it",
    clone: "This will create a duplicate of the current item.",
    cancel: "This action will remove or cancel the job permanently.",
  };

  const buttonTexts = {
    hold: "Hold the job",
    clone: "Clone the job",
    cancel: "Cancel the job",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 rounded-xl shadow-lg bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Close button */}
        <div className="flex text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white justify-end items-end mb-6">
          <AiOutlineClose onClick={onClose} className="cursor-pointer" />
        </div>
        {/* Content */}
        <div className="text-center pb-4">
          {/* Checkmark icon */}
          <div className="flex items-center justify-center pb-4">
            <img src={assetsConfig.logos.circle_tick} className="w-10 h-10 " />
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {titles[actionType]}
          </h2>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            {descriptions[actionType]}
          </p>
          <div className="flex flex-row gap-4">
            <Button
              onClick={onConfirm}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${
      actionType === "cancel"
        ? "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
        : "bg-emerald-800 hover:bg-emerald-700 focus:ring-emerald-500 text-white"
    }
  `}
            >
              {" "}
              {buttonTexts[actionType]}
            </Button>
            <Button
              onClick={onClose}
              className="w-full py-3 px-6 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-emerald-700 dark:hover:bg-emerald-600"
            >
              Go back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
