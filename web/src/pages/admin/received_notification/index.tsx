import {
  receivedNotifications,
  type ReceivedNotificationProps,
} from "@/dummy_data/admin/manageNotification";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import { usePopupStore } from "@/shared/store/popupStore";
import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-toastify";

/**
 * ReceviedNotification Component
 *
 * Displays a list of received notifications with:
 * - Search functionality
 * - Custom table with name, message, time, and delete action
 */
const ReceivedNotification: React.FC = () => {
  const { showPopup } = usePopupStore();

  //Delete confirmation
  const handleDeleteNotification = async (
    notification: ReceivedNotificationProps,
  ) => {
    await showPopup({
      title: "Delete Notification",
      body: "Are you sure you want to delete this notification?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Delete",
          value: "delete",
          variant: "danger",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          action: async (close: any) => {
            console.log("Deleting notification:", notification.id);
            toast.success("Notification deleted successfully!");
            // TODO: call your delete API here
            // await deleteNotification(notification.id);
            close(true);
          },
        },
      ],
    });
  };

  const columns: Column<ReceivedNotificationProps>[] = [
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
      renderCell: (row: ReceivedNotificationProps) => (
        <div className="flex items-center justify-center gap-2">
          <div
            className="p-2 bg-red-100 rounded-md cursor-pointer hover:bg-red-200"
            onClick={() => handleDeleteNotification(row)}
          >
            <RiDeleteBin6Line
              className="text-red-600"
              onClick={() => console.log("id..", row.id)}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <h1 className="font-semibold">Manage Received Notifications</h1>
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md gap-2">
        <div>
          <SearchInput />
        </div>
        <div className="h-full flex-1 overflow-y-auto">
          <CustomTable<ReceivedNotificationProps>
            columns={columns}
            data={receivedNotifications}
            initialPageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default ReceivedNotification;
