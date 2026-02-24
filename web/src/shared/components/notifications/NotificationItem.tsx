import React from "react";
import type { NotificationItemProps } from "@/shared/types/notification";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { useNavigate } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";
import useNotificationGate from "@/shared/store/useNotificationGate";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import { AiFillThunderbolt } from "react-icons/ai";

/**
 * Renders a single notification item with an icon, title, message, optional job details,
 * timestamp, and action buttons (for job offers). Supports structured display based on notification type.
 */
const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onDismiss,
  onMarkAsRead,
  index = "10", // Default or passed index for navigation
}) => {
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

  const renderActionButtons = (notifId: string | number) => {
    if (type !== "job_offer" || !notification.requiresConfirmation) return null;
    return (
      <div className="flex gap-2 mt-4">
        <AiFillThunderbolt
          className="size-9 p-1 cursor-pointer rounded-full bg-blue-600 hover:bg-blue-700 text-white text-3xl font-medium transition"
          onClick={() => {
            pause(notifId);
          }}
        />
        <IoMdCheckmark
          className="size-9 cursor-pointer p-1 rounded-full bg-emerald-700 text-white hover:bg-emerald-800 text-3xl font-medium transition"
          onClick={() => {
            resume();
            // Assuming this is still correct for engineer navigation
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
    <div
      onClick={() => {
        onMarkAsRead?.(id);
      }}
      className={`relative flex flex-col p-4 mb-4 rounded-lg border transition-colors cursor-pointer duration-200 ${
        !notification.read
          ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
          : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700"
      }`}
    >
      {onDismiss && (
        <IoMdClose
          className="absolute top-2 right-2 size-5 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(id);
          }}
        />
      )}

      <div className="flex items-start w-full gap-4">
        <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm dark:bg-gray-400 shrink-0">
          <span className="text-xl">{icon}</span>
        </div>
        <div className="flex-1 min-w-0 pr-6">
          {" "}
          {/* Added padding-right to prevent overlap with dismiss button */}
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-200 break-words">
              {title}
            </h3>
          </div>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-200 break-words">
            {message}
          </p>
          {renderJobDetails()}
          {renderActionButtons(id)}
        </div>
      </div>

      <div className="flex justify-end mt-2 w-full">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {timestamp}
        </span>
      </div>
    </div>
  );
};

export default NotificationItem;
