import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
export interface NotificationProps {
  id: number;
  name: string;
  message: string;
  time: string;
  action: string;
}

const notifications: NotificationProps[] = [
  {
    id: 1,
    name: "John Doe",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    time: "2 hours ago",
    action: "delete",
  },
  {
    id: 2,
    name: "Alice Smith",
    message:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    time: "1 day ago",
    action: "delete",
  },
  {
    id: 3,
    name: "Michael Johnson",
    message:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    time: "3 days ago",
    action: "delete",
  },
  {
    id: 4,
    name: "Sophia Brown",
    message:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
    time: "5 days ago",
    action: "delete",
  },
  {
    id: 5,
    name: "David Wilson",
    message:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.",
    time: "1 week ago",
    action: "delete",
  },
];

const columns: Column<NotificationProps>[] = [
  {
    key: "id",
    label: "Sr. No",
    renderCell: (row) => <span>{row.id}</span>,
  },
  {
    key: "name",
    label: "Details",
    renderCell: (row) => (
      <div className="flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm font-medium">
          {row.name.charAt(0).toUpperCase()}
        </span>
        <span>{row.name}</span>
      </div>
    ),
  },
  {
    key: "message",
    label: "Message",
    renderCell: (row) => (
      <span className="max-w-xs truncate" title={row.message}>
        {row.message}
      </span>
    ),
  },
  {
    key: "time",
    label: "Notification Time",
  },
  {
    key: "action",
    label: "Actions",
    align: "center",
    renderCell: () => (
      <div className="flex items-center justify-center gap-2">
        <div className="p-2 bg-red-100 rounded-md cursor-pointer hover:bg-red-200">
          <RiDeleteBin6Line className="text-red-600" />
        </div>
      </div>
    ),
  },
];

/**
 * ReceviedNotification Component
 *
 * Displays a list of received notifications with:
 * - Search functionality
 * - Custom table with name, message, time, and delete action
 */
const ReceviedNotification: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <h1 className="font-semibold">Manage Received Notifications</h1>
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md gap-2">
        <div>
          <SearchInput />
        </div>
        <div className="h-full flex-1 overflow-y-auto">
          <CustomTable<NotificationProps>
            columns={columns}
            data={notifications}
            initialPageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default ReceviedNotification;