import React from "react";
import { HiStar } from "react-icons/hi";
import { usePopupStore } from "@/shared/store/popupStore";
import GiveFeedbackModal from "@/shared/components/modals/GiveFeedbackModal";
import { Button } from "./Buttons";

interface GiveFeedbackButtonProps {
  targetName: string;
  targetRole?: string;
  placeholder?: string;
  label?: string;
  className?: string;
  textClassName?: string;
  stopPropagation?: boolean;
  bodyClassName?: string;
  assignmentId?: number;
}

/**
 * A reusable button component that opens the GiveFeedbackModal when clicked.
 * Includes a star icon and configurable label/styles.
 */
const GiveFeedbackButton: React.FC<GiveFeedbackButtonProps> = ({
  targetName,
  targetRole,
  placeholder = "The overall experience was good and focused.",
  label = "Give Feedback",
  className = "flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 transition-opacity hover:opacity-80 underline cursor-pointer",
  textClassName = "",
  stopPropagation = false,
  bodyClassName,
  assignmentId,
}) => {
  const { showPopup } = usePopupStore();

  const handleClick = (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.stopPropagation();
    }

    showPopup({
      body: (
        <GiveFeedbackModal
          targetName={targetName}
          targetRole={targetRole}
          placeholder={placeholder}
          assignmentId={assignmentId}
        />
      ),
      bodyClassName,
    });
  };

  return (
    <Button
      variant="no_style"
      className={className}
      onClick={handleClick}
      leftIcon={<HiStar aria-hidden="true" className="h-5 w-5 text-yellow-500" />}
    >
      <span className={textClassName}>{label}</span>
    </Button>
  );
};

export default GiveFeedbackButton;
