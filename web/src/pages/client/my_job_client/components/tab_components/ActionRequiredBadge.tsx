import React from "react";

interface ActionRequiredBadgeProps {
  count?: number;
}

/**
 * ActionRequiredBadge – Displays a static action required badge with a count of pending items.
 */
const ActionRequiredBadge: React.FC<ActionRequiredBadgeProps> = ({ count = 0 }) => {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold text-red-700 bg-red-100">
      Action Required ({count})
    </span>
  );
};

export default ActionRequiredBadge;
