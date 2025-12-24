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
 * @returns {JSX.Element} Rendered table of breaks with styled status badges
 */

import React from "react";
import {
  CustomTable,
  type Column,
} from "@/shared/components/commonUI/custom_table";
import { icons } from "@/config/icons";
import breakData from "@/dummy_data/break.json";

type RawBreak = {
  id: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  duration: string;
  type: "Short" | "Long";
  status: "Pending" | "Approved" | "Active" | "Rejected";
  reason?: string;
};
interface DisplayBreak {
  id: string;
  type: string;
  start: string;
  end: string;
  duration: string;
  status: "Pending" | "Approved" | "Active" | "Rejected";
  reason?: string;
}
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
const processedData: DisplayBreak[] = (breakData as RawBreak[]).map((item) => {
  if (item.type === "Long") {
    return {
      id: item.id,
      type: "Long Term Break",
      start: formatDateShort(item.startDate),
      end: formatDateShort(item.endDate),
      duration: item.duration,
      status: item.status,
      reason: item.reason,
    };
  }
  return {
    id: item.id,
    type: "Short Term Break",
    start: item.startTime ?? "",
    end: item.endTime ?? "",
    duration: item.duration,
    status: item.status,
    reason: item.reason,
  };
});
const BreakStatusTable: React.FC = () => {
  const columns: Column<DisplayBreak>[] = [
    { key: "type", label: "Break Type" },
    { key: "start", label: "Start" },
    { key: "end", label: "End" },
    { key: "duration", label: "Duration" },
    {
      key: "status",
      label: "Status",
      renderCell: (row: DisplayBreak) => {
        const statusKey = row.status;
        const statusConfig = {
          Pending: {
            bg: "bg-yellow-100",
            text: "text-yellow-800",
            Icon: icons.pending,
          },
          Approved: {
            bg: "bg-green-100",
            text: "text-green-800",
            Icon: icons.check,
          },
          Active: {
            bg: "bg-blue-100",
            text: "text-blue-800",
            Icon: icons.active,
          },
          Rejected: {
            bg: "bg-red-100",
            text: "text-red-800",
            Icon: icons.close,
          },
        };
        const config = statusConfig[statusKey];
        const IconComponent = config.Icon;
        return (
          <div className="flex flex-col  justify-center gap-1">
            <span
              className={`inline-flex items-center justify-center w-28 h-8 rounded-full text-xs font-semibold ${config.bg} ${config.text} gap-1.5 px-3`}
            >
              {IconComponent && <IconComponent size={15} strokeWidth={2.5} />}
              <span>{statusKey}</span>
            </span>
            {(statusKey === "Approved" || statusKey === "Rejected") &&
              row.reason && (
                <span className="text-xs text-gray-600  mt-1">
                  {row.reason}
                </span>
              )}
          </div>
        );
      },
    },
  ];
  return (
    <CustomTable columns={columns} data={processedData} initialPageSize={10} />
  );
};

export default BreakStatusTable;
