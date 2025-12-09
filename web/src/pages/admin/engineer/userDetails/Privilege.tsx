import React from "react";

interface ToggleStatusProps {
  label: string;
  status: string;
  isActive?: boolean;
  onClick?: () => void;
}

const ToggleStatus: React.FC<ToggleStatusProps> = ({
  label,
  status,
  isActive = false,
  onClick,
}) => {
  const baseClasses =
    "px-3 py-1 rounded-md text-sm font-medium cursor-pointer transition-colors w-fit";
  const activeClasses = "bg-white text-gray-500 border border-gray-300 w-fit";
  const inactiveClasses =
    "bg-gray-100 text-gray-700 border border-gray-300 w-fit";

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold dark:text-white text-gray-700">{label}</label>
      <div
        className={`${baseClasses} ${
          isActive ? activeClasses : inactiveClasses
        }`}
        onClick={onClick}
      >
        {status}
      </div>
    </div>
  );
};

/**
 * Previlage Component
 *
 * Displays a set of interactive toggle-style status indicators for managing an engineer's privileges.
 * Includes three configurable toggles:
 * - Top Rated Engineer (Yes/No)
 * - Blacklist status (Active/Inactive)
 * - Priority Access (Enabled/Disabled)
 *
 * Each toggle shows a label and a clickable status button that switches between two states.
 * The component uses local React state to manage the active/inactive state of each privilege.
 *
 * Note: "Previlage" is intentionally spelled as per the UI requirement (common variant of "Privilege").
 *
 * @component
 * @example
 * return (
 *   <Previlage />
 * );
 *
 * @returns {JSX.Element} A responsive row of privilege toggle cards for engineer management.
 */
export default function Previlege() {
  const [topRated, setTopRated] = React.useState(true);
  const [blacklist, setBlacklist] = React.useState(true);
  const [priorityAccess, setPriorityAccess] = React.useState(false);
  return (
    <div className="flex flex-col md:flex-row gap-6 mb-4 justify-between my-auto px-4 w-6/12">
      <ToggleStatus
        label="Top Rated Engineer"
        status={topRated ? "Yes" : "No"}
        isActive={topRated}
        onClick={() => setTopRated(!topRated)}
      />
      <ToggleStatus
        label="Blacklist"
        status={blacklist ? "Active" : "Inactive"}
        isActive={blacklist}
        onClick={() => setBlacklist(!blacklist)}
      />
      <ToggleStatus
        label="Priority Access"
        status={priorityAccess ? "Enabled" : "Disabled"}
        isActive={priorityAccess}
        onClick={() => setPriorityAccess(!priorityAccess)}
      />
    </div>
  );
}
