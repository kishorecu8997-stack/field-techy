import React from "react";
import { LOG_STATUSES } from "@/pages/engineer/search_result/types";
import type { LogComponentProps, LogEntry } from "../../types";

/**
 * Individual log item renderer (internal, not exported)
 */
const LogItem: React.FC<LogEntry> = ({
  title,
  date,
  status,
  showIcon = false,
  children,
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case LOG_STATUSES.checkIn:
        return {
          border: "border-l-4 border-yellow-500",
          badge: "bg-yellow-500 text-white",
          icon: "",
        };
      case LOG_STATUSES.inProgress:
        return {
          border: "border-l-4 border-blue-500",
          badge: "bg-blue-600 text-white",
          icon: "",
        };
      case LOG_STATUSES.delayed:
        return {
          border: "border-l-4 border-orange-500",
          badge: "bg-orange-600 text-white",
          icon: "",
        };
      case LOG_STATUSES.approved:
        return {
          border: "border-l-4 border-emerald-500",
          badge: "bg-emerald-700 text-white",
          icon: "",
        };
      default:
        return {
          border: "border-l-4 border-gray-300",
          badge: "bg-gray-500 text-white",
          icon: "",
        };
    }
  };

  const { border, badge, icon } = getStatusStyles();

  return (
    <div className={`p-4 bg-gray-100 dark:bg-gray-800 rounded-lg ${border}`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </h4>
          <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">
            {date}
          </p>
          {children && (
            <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 break-all">
              {children}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showIcon && <span className="text-xs">{icon}</span>}
          <span className={`px-3 py-1 rounded text-xs font-medium ${badge}`}>
            {status === LOG_STATUSES.checkIn && "Check In"}
            {status === LOG_STATUSES.inProgress && "In Progress"}
            {status === LOG_STATUSES.delayed && "Delayed"}
            {status === LOG_STATUSES.approved && "Approved"}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * A reusable component that renders a list of log entries.
 */
const LogComponent: React.FC<LogComponentProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg text-center text-gray-500">
        No logs available.
      </div>
    );
  }

  return (
    <>
      <div className="mb-2 text-sm font-bold text-gray-800 dark:text-gray-200">
        Logs
      </div>
      <div className="space-y-4">
        {logs.map((log, index) => (
          <LogItem key={index} {...log} />
        ))}
      </div>
    </>
  );
};

export default LogComponent;
