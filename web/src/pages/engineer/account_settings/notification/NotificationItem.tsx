import React from "react";
import type { NotificationProps } from "../types";
import { Button } from "@/shared/components/commonUI/Buttons";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { useNavigate } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";

interface NotificationItemProps {
  notification: NotificationProps;
}

/**
 * Renders a single notification item with an icon, title, message, optional job details,
 * timestamp, and action buttons (for job offers). Supports structured display based on notification type.
 */
const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  //this is for testing purpose
  const index = "10";

  const {
    type,
    title,
    message,
    jobTitle,
    location,
    client,
    payment,
    duration,
    timestamp,
    icon,
  } = notification;
  const navigate = useNavigate();
  const { setISOpenSidebar, setActiveKey } = useDrawerStore();

  const renderJobDetails = () => {
    if (!jobTitle) return null;
    return (
      <div className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-200">
        <p>
          <strong>Job Title:</strong> {jobTitle}
        </p>
        {location && (
          <p>
            <strong>Location:</strong> {location}
          </p>
        )}
        {client && (
          <p>
            <strong>Client:</strong> {client}
          </p>
        )}
        {payment && duration && (
          <p>
            <strong>Payment:</strong> {payment} | <strong>Duration:</strong>{" "}
            {duration}
          </p>
        )}
      </div>
    );
  };

  const renderActionButtons = () => {
    if (type !== "job_offer") return null;
    return (
      <div className="flex gap-2 mt-4">
        <Button
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md font-medium transition"
          onClick={() => {
            navigate(`${absoluteUrls.engineer.home.my_jobs}/${index}`);
            setISOpenSidebar(false);
          }}
        >
          Accept
        </Button>
        <Button
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition"
          onClick={() => {
            setActiveKey("cancelOffer");
            setISOpenSidebar(true);
          }}
        >
          Decline
        </Button>
      </div>
    );
  };

  return (
    <div className="flex items-start p-4 mb-4 bg-gray-50 rounded-lg border border-gray-200  dark:bg-gray-600">
      <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full mr-4 shadow-sm dark:bg-gray-400">
        <span className="text-xl">{icon}</span>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start dark:text-gray-200">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-200">
              {title}
            </h3>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">
              {message}
            </p>
            {renderJobDetails()}
            {renderActionButtons()}
          </div>
          <span className="text-xs text-gray-500 ml-4 whitespace-nowrap dark:text-gray-200">
            {timestamp}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
