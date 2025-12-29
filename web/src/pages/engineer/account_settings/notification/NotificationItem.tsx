import React from "react";
import type { NotificationProps } from "../types";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { useNavigate } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";
import useNotificationGate from "@/shared/store/useNotificationGate";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import { AiFillThunderbolt } from "react-icons/ai";

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
  //this is for testing purpose, will be removed later
  const index = "10";

  const {
    id,
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
  const { resume, pause } = useNotificationGate();
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

  const renderActionButtons = (id: number) => {
    if (type !== "job_offer" || !notification.requiresConfirmation) return null;
    return (
      <div className="flex gap-2 mt-4">
        <AiFillThunderbolt
          className="size-9 p-1 cursor-pointer rounded-full bg-blue-600 hover:bg-blue-700 text-white text-3xl font-medium transition"
          onClick={() => {
            pause(id);
          }}
        />
        <IoMdCheckmark
          className="size-9 cursor-pointer p-1 rounded-full bg-emerald-700 text-white hover:bg-emerald-800 text-3xl font-medium transition"
          onClick={() => {
            resume();
            navigate(`${absoluteUrls.engineer.home.my_jobs}/${index}`);
            setISOpenSidebar(false);
          }}
        />
        <IoMdClose
          className="size-9 p-1 cursor-pointer rounded-full bg-red-600 hover:bg-red-700 text-white text-3xl font-medium transition"
          onClick={() => {
            resume();
            setActiveKey("cancelOffer");
            setISOpenSidebar(true);
          }}
        />
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
            {renderActionButtons(id)}
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
