import React from "react";
import { HiChevronUp } from "react-icons/hi";
import { Button } from "@/shared/components/commonUI/Buttons";

interface TimelineToggleButtonProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

/**
 * TimelineToggleButton - Toggles collapse state for all cards
 */
const TimelineToggleButton: React.FC<TimelineToggleButtonProps> = ({
  isCollapsed,
  onToggle,
}) => {
  return (
    <div className="flex justify-end px-4 pt-3">
      <Button
        type="button"
        className="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
        aria-label="Toggle section"
        onClick={onToggle}
      >
        <HiChevronUp
          className={`h-5 w-5 transition-transform ${isCollapsed ? "rotate-180" : ""}`}
        />
      </Button>
    </div>
  );
};

export default TimelineToggleButton;
