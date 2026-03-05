import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

interface InvitationSentProps {
  onClose: () => void;
}

/**
 * A modal component that confirms a job invitation has been successfully sent.
 * It provides a button to navigate back to the home/dashboard page.
 *
 * @param {InvitationSentProps} props - The props for the component.
 * @returns {React.ReactElement} A React functional component that renders the invitation sent confirmation modal.
 */
const InvitationSentModal: React.FC<InvitationSentProps> = ({ onClose }) => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 rounded-xl shadow-lg bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Close button */}
        <div className="flex justify-end items-end mb-6">
          <AiOutlineClose onClick={onClose} className="cursor-pointer text-black dark:text-white"/>
        </div>
        {/* Content */}
        <div className="text-center pb-4">
          {/* Checkmark icon */}
          <div className="flex items-center justify-center pb-4">
            <img src={assetsConfig.logos.circle_tick} className="w-10 h-10 " />
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Invitation sent
          </h2>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            You have successfully sent a job invitation to the engineer.
          </p>

          {/* Back to Home button */}
          <Button
            onClick={() => navigate(absoluteUrls.client.home.dashboard)}
            className="w-full py-3 px-6 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-emerald-700 dark:hover:bg-emerald-600"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvitationSentModal;
