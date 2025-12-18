import React from "react";

interface JobStatusCardProps {
  jobId: string;
  date?: Date | undefined;
  status: "completed" | "pending" | "in-progress" | "Notified" | "Unallocated" | "Partially Assigned" |
  "Assigned" | "Selected" | "Hold" | "Draft" | "Canceled" | "Escalation In Progress" | "Work In Progress" | "Closed";
  onStatusChange?: () => void;
}

/**
 * JobStatusCard Component
 *
 * Displays a card with job details, including job ID, date, and status.
 * Allows users to change the job status.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.jobId - The job ID
 * @param {Date} [props.date] - The date of the job
 * @param {string} props.status - The current status of the job
 * @param {Function} [props.onStatusChange] - A callback function to change the job status
 * @returns {React.ReactElement} The rendered job status card
 *
 * @example
 * <JobStatusCard jobId="123" date={new Date()} status="in-progress" />
 */
const JobStatusCard: React.FC<JobStatusCardProps> = ({
  jobId,
  date,
  status,
  onStatusChange,
}) => {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);

  const getStatusLabel = () => {
    switch (status) {
      case "completed":
        return "Job Completed";
      case "pending":
        return "Pending";
      case "in-progress":
        return "In Progress";
      case "Notified":
        return "Notified";
      case "Unallocated":
        return "Unallocated";
      case "Partially Assigned":
        return "Partially Assigned";
      case "Assigned":
        return "Assigned";
      case "Selected":
        return "Selected";
      case "Hold":
        return "On Hold";
      case "Draft":
        return "Draft";
      case "Canceled":
        return "Canceled";
      case "Escalation In Progress":
        return "Escalation In Progress";
      case "Work In Progress":
        return "Work In Progress";
      case "Closed":
        return "Closed";
      default:
        return "Unknown";
    }
  };

  const getStatusBgColor = () => {
    switch (status) {
      case "completed":
        return "bg-emerald-800 hover:bg-emerald-700";
      case "pending":
        return "bg-yellow-600 hover:bg-yellow-500";
      case "in-progress":
        return "bg-blue-600 hover:bg-blue-500";
      case "Notified":
        return "bg-blue-600 hover:bg-blue-500";
      case "Unallocated":
        return "bg-gray-500 hover:bg-gray-600";
      case "Partially Assigned":
        return "bg-yellow-500 hover:bg-yellow-400";
      case "Assigned":
        return "bg-green-600 hover:bg-green-500";
      case "Selected":
        return "bg-purple-600 hover:bg-purple-500";
      case "Hold":
        return "bg-orange-600 hover:bg-orange-500";
      case "Draft":
        return "bg-gray-300 text-gray-800 hover:bg-gray-400";
      case "Canceled":
        return "bg-red-600 hover:bg-red-500";
      case "Escalation In Progress":
        return "bg-red-500 hover:bg-red-400";
      case "Work In Progress":
        return "bg-blue-700 hover:bg-blue-600";
      case "Closed":
        return "bg-gray-500 hover:bg-gray-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="flex items-center justify-between p-8 bg-gray-200 rounded-lg shadow-sm w-full">
      <div className="flex space-x-10">
        <div>
          <p className="font-bold text-gray-800 mb-2">Job ID:</p>
          <p className="text-gray-600">{jobId}</p>
        </div>
        <div>
          <p className="font-bold text-gray-800 mb-2">Date & Time:</p>
          <p className="text-gray-600">{formattedDate}</p>
        </div>
      </div>
      <button
        onClick={onStatusChange}
        className={`px-4 py-2 rounded-md font-medium text-white transition-colors ${getStatusBgColor()}`}
        disabled={status === "completed"}
      >
        {getStatusLabel()}
      </button>
    </div>
  );
};

export default JobStatusCard;
