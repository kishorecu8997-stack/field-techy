import React from "react";
import { FaRedo } from "react-icons/fa";
import { ApplicationsData } from "@/dummy_data/engineer_profile/applicationData";

export type Application = typeof ApplicationsData[number];

interface ApplicationCardProps {
  application: Application;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "Completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
          {application.title}
        </h3>

        {/* Status Badge with tooltip */}
        <div className="relative group">
          <span
            className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
              application.status
            )}`}
          >
            {application.status}
          </span>

          {/* Tooltip only for Rejected status */}
          {application.status === "Rejected" && application.rejectionReason && (
            <div
              className="absolute left-1/2 -translate-x-1/2 mt-2
                         hidden group-hover:block
                         whitespace-nowrap
                         bg-gray-900 text-white text-xs
                         px-3 py-1 rounded shadow-lg z-50"
            >
              {application.rejectionReason}
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        <span className="font-medium">Company:</span> {application.company}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        <span className="font-medium">Applied on:</span> {application.appliedDate}
      </p>

      <button className="mt-3 flex items-center gap-1 text-teal-700 text-sm font-medium hover:underline">
        <FaRedo className="h-3 w-3" />
        Re-apply
      </button>
    </div>
  );
};

export default ApplicationCard;
