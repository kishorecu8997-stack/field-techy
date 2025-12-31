import { STATUS_COLOR_MAP } from "./StatusConfig";
import React from "react";

interface JobStatusBadgeProps {
  status?: string;
}
export const JobStatusBadge: React.FC<JobStatusBadgeProps> = ({ status = "UNKNOWN" }) => {
  // Convert to uppercase and replace spaces with underscores
  const normalizedStatus = status
  .trim()
  .toUpperCase()
  .replace(/\s+/g, "_"); 
  const colorClass = STATUS_COLOR_MAP[normalizedStatus] || "bg-gray-300 text-black";
  return (
    <span
      title={normalizedStatus}
      data-status={normalizedStatus}
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${colorClass} ring-1 ring-gray-200`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
};

export default JobStatusBadge;