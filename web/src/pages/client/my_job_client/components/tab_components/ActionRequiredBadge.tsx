import React from "react";

/**
 * ActionRequiredBadge - Displays a static action required badge
 */
const ActionRequiredBadge: React.FC = () => {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold text-red-700 bg-red-100">
      Action Required (1)
    </span>
  );
};

export default ActionRequiredBadge;
