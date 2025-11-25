import { absoluteUrls } from "@/config/urls";
import {
  notifications,
  type NotificationProps,
} from "@/dummy_data/admin/manageNotification";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import { usePopupStore } from "@/shared/store/popupStore";
import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

/**
 * ManageNotification Component
 *
 * Provides an administrative dashboard view for managing notifications.
 * Displays notification records in a searchable and paginated table,
 * with options to delete specific notifications.
 *
 * @component
 * @example
 * return (
 *   <ManageNotification />
 * );
 *
 * @returns {JSX.Element} The rendered ManageNotification component.
 */
const ManageNotification: React.FC = () => {
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();

  //Delete confirmation
  const handleDeleteNotification = async (notification: NotificationProps) => {
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
            // TODO: call your delete API here
            // await deleteNotification(notification.id);
            close(true);
          },
        },
      ],
    });
  };

  const columns: Column<NotificationProps>[] = [
    { key: "id", label: "Sr. No." },
    { key: "title", label: "Title" },
    { key: "message", label: "Message" },
    { key: "type", label: "Type" },
    { key: "sendTo", label: "Send To" },
    { key: "createdDate", label: "Created Date" },
    {
      key: "action",
      label: "Action",
      renderCell: (row: NotificationProps) => (
        <div className="flex items-center gap-2">
          <div
            className="p-2 bg-red-100 rounded-md cursor-pointer"
            onClick={() => handleDeleteNotification(row)}
          >
            <RiDeleteBin6Line className="text-red-600" />
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <div className="flex justify-between items-center">
        <p className="mt-2 mb-6 font-semibold">Notification Management</p>
        <Button
          type="submit"
          className="w-fit bg-gradient-to-r bg-teal-900 text-white py-1 rounded-lg hover:opacity-90 transition"
          onClick={() =>
            navigate(absoluteUrls.admin.home.manage_notification_add)
          }
        >
          Add Notification
        </Button>
      </div>
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

export default ManageNotification;
