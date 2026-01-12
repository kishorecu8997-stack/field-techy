import React from "react";
import { FaRedo } from "react-icons/fa";
import { ApplicationsData } from "@/dummy_data/engineer_profile/applicationData";
import { Button } from "@/shared/components/commonUI/Buttons";
import { getStatusColor } from "@/utils/applicationStatus";

export type Application = (typeof ApplicationsData)[number];

interface ApplicationCardProps {
  application: Application;
  onReapply?: (application: Application) => void; // optional click handler
}
/**
 * ApplicationCard component displays information about a single job application.
 *
 * Props:
 * @param {Object} props - Component props
 * @param {Application} props.application - The application object
 * @param {function(Application): void} [props.onReapply] - Optional callback when "Re-apply" is clicked
 *
 * This component shows:
 * - Job title and company
 * - Applied date
 * - Status badge with color based on application status
 * - Rejection reason tooltip (if status is "Rejected")
 * - Re-apply" button for rejected applications
 */
const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onReapply,
}) => {
  const handleReapplyClick = () => {
    if (onReapply) {
      onReapply(application);
    }
  };

  return (
    <div className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
          {application.title}
        </h3>

        <div className="relative group">
          <span
            className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
              application.status,
            )}`}
          >
            {application.status}
          </span>

          {/* Tooltip only for Rejected status */}
          {application.status === "Rejected" && application.rejectionReason && (
            <div className="relative">
              <div
                id={`tooltip-${application.id}`}
                role="tooltip"
                className="absolute left-1/2 -translate-x-1/2 mt-2
                 hidden group-hover:block focus:block
                 whitespace-nowrap bg-gray-900 text-white text-xs
                 px-3 py-1 rounded shadow-lg z-50"
              >
                {application.rejectionReason}
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        <span className="font-medium">Company:</span> {application.company}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        <span className="font-medium">Applied on:</span>{" "}
        {application.appliedDate}
      </p>

      {application.status === "Rejected" && (
        <Button
          variant="solid" // solid so background & border are applied
          size="sm"
          leftIcon={<FaRedo className="h-3 w-3" />}
          className="mt-3 border bg-teal-800 text-white border-teal-900"
          onClick={handleReapplyClick}
        >
          Re-apply
        </Button>
      )}
    </div>
  );
};

export default ApplicationCard;
