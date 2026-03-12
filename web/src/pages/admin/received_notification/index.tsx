import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import { usePopupStore } from "@/shared/store/popupStore";
import React, { useMemo, useState } from "react";
import { RiDeleteBin6Line, RiCheckLine } from "react-icons/ri";
import { toast } from "react-toastify";
import {
  useAppNotifications,
  useAppDeleteNotification,
  useAppMarkNotificationAsRead,
  useAppMarkAllNotificationsAsRead,
} from "@/shared/apiServices/notifications/notificationOpenApiService";
import { formatApiDate } from "@/utils/timelineUtils";
import { Button } from "@/shared/components/commonUI/Buttons";

interface ReceivedNotificationProps {
  id: number;
  name: string;
  message: string;
  time: string;
  read: boolean;
}

/**
 * ReceviedNotification Component
 *
 * Displays a list of received notifications with:
 * - Search functionality
 * - Custom table with name, message, time, and delete action
 */

const ReceivedNotification: React.FC = () => {
  const { showPopup } = usePopupStore();
  const [search, setSearch] = useState("");

  const { notifications, isLoading } = useAppNotifications();

  const deleteNotification = useAppDeleteNotification({
    onSuccess: () => toast.success("Notification deleted successfully!"),
    onError: () => toast.error("Failed to delete notification"),
  });

  const markAsRead = useAppMarkNotificationAsRead({
    onError: () => toast.error("Failed to mark notification as read"),
  });

  const markAllAsRead = useAppMarkAllNotificationsAsRead({
    onSuccess: () => toast.success("All notifications marked as read"),
    onError: () => toast.error("Failed to mark all notifications as read"),
  });

  const hasUnread = useMemo(() => {
    return notifications.some((n) => !n.read);
  }, [notifications]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead.mutateAsync({
        body: { id },
      });
    } catch {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllAsRead.mutateAsync({});
    } catch {
      toast.error("Failed to mark all notifications as read");
    }
  };

  const notificationData: ReceivedNotificationProps[] = useMemo(() => {
    return notifications
      .filter((n) => {
        const title = (n.title ?? "").toLowerCase();
        const message = (n.message ?? "").toLowerCase();
        return (
          title.includes(search.toLowerCase()) ||
          message.includes(search.toLowerCase())
        );
      })
      .map((n) => ({
        id: Number(n.id),
        name: n.title ?? "",
        message: n.message ?? "",
        time: formatApiDate(n.createdAt),
        read: n.read ?? false,
      }));
  }, [notifications, search]);

  const handleDeleteNotification = async (
    notification: ReceivedNotificationProps,
  ) => {
    await showPopup({
      title: "Delete Notification",
      body: "Are you sure you want to delete this notification?",
      actionButtons: [
        { label: "Cancel", value: null, variant: "outline" },
        {
          label: "Delete",
          value: "delete",
          variant: "danger",
          action: async (close: (value?: boolean) => void) => {
            try {
              await deleteNotification.mutateAsync({
                body: { id: notification.id },
              });
              close(true);
            } catch {
              toast.error("Failed to delete notification");
              close(false);
            }
          },
        },
      ],
    });
  };

  const columns: Column<ReceivedNotificationProps>[] = [
    {
      key: "id",
      label: "Sr. No",
      renderCell: (_, index) => <span>{index + 1}</span>,
    },
    {
      key: "name",
      label: "Details",
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          {!row.read && (
            <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
          )}
          <span
            className={`${
              row.read
                ? "text-gray-600 dark:text-gray-300"
                : "font-semibold text-gray-900 dark:text-gray-100"
            }`}
          >
            {row.name}
          </span>
        </div>
      ),
    },
    {
      key: "message",
      label: "Message",
      renderCell: (row) => (
        <span
          className={`max-w-full break-words whitespace-pre-line ${
            row.read
              ? "text-gray-600 dark:text-gray-300"
              : "font-semibold text-gray-900 dark:text-gray-100"
          }`}
          title={row.message}
        >
          {row.message.length > 70
            ? row.message.slice(0, 70) + "..."
            : row.message}
        </span>
      ),
    },
    {
      key: "time",
      label: "Notification Time",
      renderCell: (row) => (
        <span className="whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
          {row.time || "—"}
        </span>
      ),
    },
    {
      key: "markAsRead",
      label: "Mark as Read",
      align: "center",
      renderCell: (row) => (
        <div className="flex items-center justify-center min-h-[40px] w-full">
          {row.read ? (
            <span className="text-gray-400 dark:text-gray-500 italic text-sm">
              Read
            </span>
          ) : (
            <button
              onClick={() => handleMarkAsRead(row.id)}
              className="p-2 bg-green-100 hover:bg-green-200 
                         dark:bg-green-900/30 dark:hover:bg-green-800/40 
                         rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              title="Mark as read"
              aria-label="Mark this notification as read"
            >
              <RiCheckLine className="text-green-600 dark:text-green-400 text-xl" />
            </button>
          )}
        </div>
      ),
    },
    {
      key: "action",
      label: "Actions",
      align: "center",
      renderCell: (row) => (
        <div className="flex items-center justify-center gap-2">
          <div
            className="p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40 rounded-md cursor-pointer transition-colors"
            onClick={() => handleDeleteNotification(row)}
            title="Delete notification"
          >
            <RiDeleteBin6Line className="text-red-600 dark:text-red-400" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <h1 className="font-semibold">Manage Received Notifications</h1>

      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-gray-700 rounded-md gap-2">
        <div className="flex justify-between items-center">
          <SearchInput
            value={search}
            onChange={(value: string) => setSearch(value)}
          />

          {hasUnread && (
            <Button
              variant="no_style"
              onClick={handleMarkAll}
              disabled={markAllAsRead.isPending}
              className="text-sm text-blue-600 hover:underline dark:text-blue-400 disabled:opacity-50"
            >
              Mark all as read
            </Button>
          )}
        </div>

        <div className="h-full flex-1 overflow-y-auto">
          <CustomTable<ReceivedNotificationProps>
            columns={columns}
            data={notificationData}
            loading={isLoading}
            initialPageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default ReceivedNotification;
