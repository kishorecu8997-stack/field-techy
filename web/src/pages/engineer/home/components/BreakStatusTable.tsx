import React from "react";
import {
  CustomTable,
  type Column,
} from "@/shared/components/commonUI/custom_table";
import { icons } from "@/config/icons";

interface Break {
  id: string;
  startDate: string;
  endDate: string;
  type: string;
  status: "Pending" | "Approved" | "Active";
}

const breakData: Break[] = [
  {
    id: "1",
    startDate: "2025-12-18 09:00",
    endDate: "2025-12-18 12:00",
    type: "Short",
    status: "Pending",
  },
  {
    id: "2",
    startDate: "2025-12-20 13:00",
    endDate: "2025-12-22 18:00",
    type: "Long",
    status: "Approved",
  },
  {
    id: "3",
    startDate: "2025-12-23 10:00",
    endDate: "2025-12-23 14:00",
    type: "Short",
    status: "Active",
  },
  {
    id: "4",
    startDate: "2025-12-23 10:00",
    endDate: "2025-12-23 14:00",
    type: "Short",
    status: "Active",
  },
];

const BreakStatusTable: React.FC = () => {
  const columns: Column<Break>[] = [
    { key: "type", label: "Break Type" },
    { key: "startDate", label: "Start" },
    { key: "endDate", label: "End" },
    {
      key: "status",
      label: "Status",
      renderCell: (row: Break) => {
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
        };

        const config = statusConfig[row.status];
        const IconComponent = config.Icon;

        return (
          <div className="flex justify-center">
            <span
              className={`inline-flex items-center justify-center w-28 h-8 rounded-full text-xs font-semibold ${config.bg} ${config.text} gap-1.5 px-3`}
            >
              {IconComponent ? (
                <IconComponent size={15} strokeWidth={2.5} />
              ) : (
                <span className="w-4 h-4" />
              )}
              <span>{row.status}</span>
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <CustomTable columns={columns} data={breakData} initialPageSize={3} />
  );
};

export default BreakStatusTable;