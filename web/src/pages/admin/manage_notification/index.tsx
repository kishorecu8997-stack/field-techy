import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminGetNotifications } from "@/shared/apiServices/admin/adminOpenApiService";

interface NotificationProps {
  id: number;
  title: string;
  message: string;
  type: string;
  sendTo: string;
  createdDate: string;
}

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
  const [search, setSearch] = useState("");

  const { data, isLoading } = useAdminGetNotifications({
    page: 1,
    limit: 1000,
    search: search || undefined,
  });

  const notifications =
    data?.data?.map((item, index) => ({
      id: index + 1,
      title: item.title,
      message: item.body,
      type: item.type,
      sendTo: item.sentTo?.join(", "),
      createdDate: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString()
        : "-",
    })) || [];

  const columns: Column<NotificationProps>[] = [
    { key: "id", label: "Sr.No." },
    { key: "title", label: "Title" },
    { key: "message", label: "Message" },
    { key: "type", label: "Type" },
    { key: "sendTo", label: "Send To" },
    { key: "createdDate", label: "Created Date" },
  ];

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <div className="flex justify-between items-center">
        <p className="mt-2 mb-6 font-semibold">Notification Management</p>

        <Button
          className="w-fit bg-teal-900 text-white py-1 rounded-lg hover:opacity-90 transition"
          onClick={() =>
            navigate(absoluteUrls.admin.home.manage_notification_add)
          }
        >
          Add Notification
        </Button>
      </div>

      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-gray-700 rounded-md gap-2">
        <SearchInput
          value={search}
          onChange={(value: string) => setSearch(value)}
        />

        <div className="h-full flex-1 overflow-y-auto">
          <CustomTable<NotificationProps>
            columns={columns}
            data={notifications}
            loading={isLoading}
            initialPageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageNotification;
