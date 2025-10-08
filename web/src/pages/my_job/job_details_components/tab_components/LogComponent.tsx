import React from "react";
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
      case "check-in":
        return {
          border: "border-l-4 border-yellow-500",
          badge: "bg-yellow-500 text-white",
          icon: "",
        };
      case "in-progress":
        return {
          border: "border-l-4 border-blue-500",
          badge: "bg-blue-600 text-white",
          icon: "",
        };
      case "delayed":
        return {
          border: "border-l-4 border-orange-500",
          badge: "bg-orange-600 text-white",
          icon: "",
        };
      case "approved":
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
    <div className={`p-4 bg-gray-100 rounded-lg ${border}`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-800">{title}</h4>
          <p className="text-sm text-gray-600 mt-1">{date}</p>
          {children && (
            <div className="mt-3 text-sm text-gray-700">{children}</div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showIcon && <span className="text-xs">{icon}</span>}
          <span className={`px-3 py-1 rounded text-xs font-medium ${badge}`}>
            {status === "check-in" && "Check In"}
            {status === "in-progress" && "In Progress"}
            {status === "delayed" && "Delayed"}
            {status === "approved" && "Approved"}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * A reusable component that renders a list of log entries.
 * Accepts an array of log objects and displays them in a vertical stack.
 * Fully typed, documented, and styled with Tailwind CSS.
 *
 * @param {LogComponentProps} props - The props for the LogComponent
 * @returns {JSX.Element} Rendered list of log entries
 *
 * @example
 * const logs = [
 *   { title: "Check In To Office", date: "12-Feb-2024, 07:30 PM", status: "check-in", showIcon: true },
 *   { title: "Need To Work Tomorrow", date: "12-Feb-2024, 07:30 PM", status: "in-progress" }
 * ];
 *
 * <LogComponent logs={logs} />
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
    <div className="space-y-4">
      {logs.map((log, index) => (
        <LogItem key={index} {...log} />
      ))}
    </div>
  );
};

export default LogComponent;
