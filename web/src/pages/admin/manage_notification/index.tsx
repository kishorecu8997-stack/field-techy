import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import { usePopupStore } from "@/shared/store/popupStore";
import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDeleteNotification, useGetPagedNotifications } from "@/shared/apiServices/admin/adminService";
import type { AdminNotification } from "@/shared/apiServices/admin/adminTypes";
import { CiEdit } from "react-icons/ci";

const ManageNotification: React.FC = () => {
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();
  const { data } = useGetPagedNotifications({ page: 0, size: 10 });

  // Delete mutation
  const deleteNotificationMutation = useDeleteNotification({
    onSuccess: () => {
      toast.success("Notification deleted successfully!");
    },
     onError: (error: unknown) => {
      let message = "Failed to delete notification. Please try again.";
      // Narrow common HTTP / network error shapes (e.g., Axios-style errors)
      const anyError = error as any;
      const status = anyError?.response?.status;
      if (!anyError?.response) {
        // Likely a network or connectivity issue
        message = "Network error while deleting notification. Please check your connection and try again.";
      } else if (status === 401 || status === 403) {
        message = "You are not authorized to delete this notification.";
      } else if (status === 400 || status === 422) {
        message = "Unable to delete notification due to validation or request error.";
      } else if (status >= 500 && status < 600) {
        message = "Server error while deleting notification. Please try again later.";
      } else if (anyError?.message && typeof anyError.message === "string") {
        // Fall back to a more specific error message if available
        message = anyError.message;
      }
      toast.error(message);
    },
  });

  // Delete confirmation popup
  const handleDeleteNotification = async (notification: AdminNotification) => {
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
          action: async (close) => {
            deleteNotificationMutation.mutate(notification.id);
            close(true);
          },
        },
      ],
    });
  };

  // Table columns
  const columns: Column<AdminNotification>[] = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "message", label: "Message" },
    { key: "type", label: "Type" },
    { key: "sendTo", label: "Send To" },
    { key: "createdAt", label: "Created Date" },
    {
      key: "action",
      label: "Action",
      renderCell: (row: AdminNotification) => (
        <div className="flex items-center gap-2">
          {/* Edit Button */}
          <Button
            type="button"
            className="p-2 bg-blue-100 rounded-md cursor-pointer hover:bg-blue-200"
            onClick={() =>
              navigate(`${absoluteUrls.admin.home.manage_notification_edit}/${row.id}`)
            }
            aria-label="Edit notification"
          >
            <CiEdit className="text-blue-600" />
          </Button>
          {/* Delete Button */}
          <Button
            type="button"
            className="p-2 bg-red-100 rounded-md cursor-pointer hover:bg-red-200"
            onClick={() => handleDeleteNotification(row)}
            aria-label="Delete notification"
          >
            <RiDeleteBin6Line className="text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  if (deleteNotificationMutation.isPending)
    return (
      <div className="w-full h-full flex items-center justify-center py-10">
        <div
          className="h-8 w-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"
          role="status"
          aria-label="Loading"
        ></div>
        <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">
          Loading notifications...
        </span>
      </div>
    );

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <div className="flex justify-between items-center">
        <p className="mt-2 mb-6 font-semibold">Notification Management</p>
        <Button
          type="button"
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
        <CustomTable<AdminNotification>
          columns={columns}
          initialPageSize={10}
          data={data?.content}
        />
      </div>
      </div>
    </div>
  );
};

export default ManageNotification;
