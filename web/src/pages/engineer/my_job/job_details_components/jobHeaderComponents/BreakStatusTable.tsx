import React, { useState } from "react";
import {
  CustomTable,
  type Column,
} from "@/shared/components/commonUI/custom_table";
import { icons } from "@/config/icons";
import { HiEye } from "react-icons/hi";
import { Button } from "@/shared/components/commonUI/Buttons";
import Popup from "@/shared/components/Popup";

// API types for break requests from GetJobLogsResponse
type ApiBreakRequest = {
  id: number;
  assignmentId: number;
  type: "short_term" | "long_term";
  status: "pending" | "approved" | "rejected";
  reason: string;
  startAt: string;
  endAt: string;
  approverComment?: string | null;
  createdAt: string | null;
};

interface BreakStatusTableProps {
  breakRequests?: ApiBreakRequest[];
}

type DisplayBreak = {
  id: string;
  type: string;
  breakType: "short_term" | "long_term";
  start: string;
  end: string;
  duration: string;
  status: "Pending" | "Approved" | "Active" | "Rejected" | "pending" | "approved" | "rejected";
  reason?: string;
  approverComment?: string | null;
};

const formatDateShort = (dateStr: string): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Calculate duration between two dates
const calculateDuration = (startAt: string, endAt: string, breakType: string): string => {
  const start = new Date(startAt);
  const end = new Date(endAt);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return "";
  
  const diffTime = end.getTime() - start.getTime();
  
  // For short term breaks, calculate in hours/minutes
  if (breakType === "short_term") {
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    let durationText = "";
    if (hours > 0) durationText += `${hours} hour${hours !== 1 ? "s" : ""}`;
    if (minutes > 0) {
      if (durationText) durationText += " ";
      durationText += `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    }
    return durationText || "0 minutes";
  }
  
  // For long term breaks, calculate in days
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return "< 1 day";
  } else if (diffDays === 1) {
    return "1 day";
  } else {
    return `${diffDays} days`;
  }
};

// Transform API data to display format
const transformBreakRequests = (requests: ApiBreakRequest[]): DisplayBreak[] => {
  // Format time only (for short breaks)
  const formatTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format date only (for long breaks)
  const formatDateOnly = (dateStr: string): string => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return requests.map((item) => ({
    id: String(item.id),
    type: item.type === "long_term" ? "Long Term Break" : "Short Term Break",
    breakType: item.type,
    // For short breaks show time, for long breaks show date
    start: item.type === "long_term" ? formatDateOnly(item.startAt) : formatTime(item.startAt),
    end: item.type === "long_term" ? formatDateOnly(item.endAt) : formatTime(item.endAt),
    duration: calculateDuration(item.startAt, item.endAt, item.type),
    status: item.status === "pending" 
      ? "Pending" 
      : item.status === "approved" 
        ? "Approved" 
        : "Rejected",
    reason: item.reason,
    approverComment: item.approverComment || null,
  }));
};

/**
 * BreakStatusTable
 *
 * Table component that displays a list of breaks with their status.
 * Uses CustomTable for rendering and applies status-based styling with icons.
 *
 * Features:
 * - Status badges with colors and icons
 * - Paginated table with initial page size
 * - Columns: Break Type, Start, End, Status
 *
 * @component
 * @param {BreakStatusTableProps} props - Props including breakRequests from API
 * @returns {JSX.Element} Rendered table of breaks with styled status badges
 */
const BreakStatusTable: React.FC<BreakStatusTableProps> = ({ breakRequests = [] }) => {
  const processedData = transformBreakRequests(breakRequests);
  const [selectedBreak, setSelectedBreak] = useState<DisplayBreak | null>(null);

  const handleViewDetails = (row: DisplayBreak) => {
    setSelectedBreak(row);
  };

  const handleCloseModal = () => {
    setSelectedBreak(null);
  };

  const columns: Column<DisplayBreak>[] = [
    { key: "type", label: "Break Type" },
    { key: "start", label: "Start" },
    { key: "end", label: "End" },
    { key: "duration", label: "Duration" },
    {
      key: "status",
      label: "Status",
      renderCell: (row: DisplayBreak) => {
        // Normalize status to lowercase for config lookup
        const statusKey = row.status.toLowerCase() as keyof typeof statusConfig;
        const statusConfig = {
          pending: {
            bg: "bg-yellow-100",
            text: "text-yellow-800",
            Icon: icons.pending,
          },
          approved: {
            bg: "bg-green-100",
            text: "text-green-800",
            Icon: icons.check,
          },
          active: {
            bg: "bg-blue-100",
            text: "text-blue-800",
            Icon: icons.active,
          },
          rejected: {
            bg: "bg-red-100",
            text: "text-red-800",
            Icon: icons.close,
          },
        };
        const config = statusConfig[statusKey];
        const IconComponent = config.Icon;
        return (
          <div className="flex flex-col justify-center gap-1">
            <span
              className={`inline-flex items-center justify-center w-28 h-8 rounded-full text-xs font-semibold ${config.bg} ${config.text} gap-1.5 px-3`}
            >
              {IconComponent && <IconComponent size={15} strokeWidth={2.5} />}
              <span>{statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}</span>
            </span>
          </div>
        );
      },
    },
    {
      key: "details",
      label: "Details",
      renderCell: (row: DisplayBreak) => {
        const hasDetails = row.reason || row.approverComment;
        
        if (!hasDetails) {
          return <span className="text-sm text-gray-400">-</span>;
        }
        
        return (
          <button
            onClick={() => handleViewDetails(row)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
          >
            <HiEye size={18} />
            <span>View</span>
          </button>
        );
      },
    },
  ];
  
  if (processedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <p>No break requests found</p>
      </div>
    );
  }

  return (
    <>
      <CustomTable columns={columns} data={processedData} initialPageSize={10} />
      
      {selectedBreak && (
        <Popup
          open={!!selectedBreak}
          onClose={handleCloseModal}
        >
          {/* Header with title and close button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Break Details
            </h3>
            <button
              onClick={handleCloseModal}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="space-y-4 p-4">
            {/* Engineer Comment */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Engineer Request Comment
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {selectedBreak.reason || "No comment provided"}
              </p>
            </div>
            
            {/* Client Comment */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Client Approver Comment
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {selectedBreak.approverComment || "No comment provided"}
              </p>
            </div>
            
            {/* Break Info Summary */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Type:</span>
                  <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
                    {selectedBreak.breakType === "short_term" ? "Short Term" : "Long Term"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Status:</span>
                  <span className={`ml-1 font-medium ${
                    selectedBreak.status === "approved" || selectedBreak.status === "Approved" ? "text-green-600" :
                    selectedBreak.status === "rejected" || selectedBreak.status === "Rejected" ? "text-red-600" :
                    "text-yellow-600"
                  }`}>
                    {typeof selectedBreak.status === "string" ? selectedBreak.status.charAt(0).toUpperCase() + selectedBreak.status.slice(1).toLowerCase() : selectedBreak.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Popup>
      )}
    </>
  );
};

export default BreakStatusTable;
