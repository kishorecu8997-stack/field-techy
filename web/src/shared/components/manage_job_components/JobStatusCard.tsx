import React from "react";

interface JobStatusCardProps {
  jobId: string;
  date?: Date | undefined;
  status: "completed" | "pending" | "in-progress";
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
