import React, { useState } from "react";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import { Button } from "@/shared/components/commonUI/Buttons";
import { usePopupStore } from "@/shared/store/popupStore";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import {
  useAdminManageClients,
  useAdminClientsByUserIdStatus,
} from "@/shared/apiServices/admin/adminOpenApiService";
import { type ManageClientProps } from "../types";

/**
 * BlockedClientList Component
 *
 * Displays a table of clients whose status is set to "blocked".
 * Provides functionality to unblock clients with a confirmation popup.
 *
 * @returns {JSX.Element} The rendered BlockedClientList component.
 */
const BlockedClientList: React.FC = () => {
  const { showPopup } = usePopupStore();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: manageClient, refetch: refetchClients, isLoading } = useAdminManageClients({
    query: { page, limit, search: search || undefined },
  });

  const { mutateAsync: updateClientStatus } = useAdminClientsByUserIdStatus();

  const handleUnblock = async (client: ManageClientProps) => {
    await showPopup({
      title: "Unblock Client",
      body: `Are you sure you want to unblock client ${client.companyName || client.name}?`,
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Unblock",
          value: "unblock",
          variant: "primary",
          action: async (close) => {
            try {
              await updateClientStatus({
                path: { userId: client.userId },
                body: { userStatus: "active" },
              });
              toast.success("Client unblocked successfully!");
              refetchClients();
              close(true);
            } catch (error) {
              toast.error("Failed to unblock client");
              console.error(error);
            }
          },
        },
      ],
    });
  };

  // Filter blocked clients from the list 
  // (In a real scenario, this should ideally be handled by the API)
  const clientData = (manageClient?.data || []) as unknown as ManageClientProps[];
  const blockedClients = clientData.filter(c => c.userStatus === 'blocked');

  const columns: Column<ManageClientProps>[] = [
    {
      label: "Sr.No.",
      renderCell: (_row: ManageClientProps, index: number) =>
        (page - 1) * limit + index + 1,
    },
    {
      key: "clientCode",
      label: "Client ID",
      renderCell: (row: ManageClientProps) => (
        <span className="flex-nowrap text-nowrap">{(row.clientCode || "N/A").toUpperCase()}</span>
      ),
    },
    {
      key: "details",
      label: "Details",
      renderCell: (row: ManageClientProps) => {
        const displayName = row.companyName || row.name;
        const initials = (displayName || "C").charAt(0).toUpperCase();
        const avatarUrl = row.profilePicture?.url;

        return (
          <div className="flex gap-2 items-center w-[200px]">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0 border border-indigo-200 shadow-sm">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                {displayName}
              </span>
              <span className="text-xs text-gray-500 truncate">{row.email}</span>
              <span className="text-xs text-gray-500">{row.phoneNumber}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: "reason",
      label: "Reason for Block",
      renderCell: (row: ManageClientProps) => {
        const lastBlock = row.statusHistory?.filter(h => h.type === 'block').pop();
        return lastBlock?.reason || "N/A";
      }
    },
    {
      key: "registrationDate",
      label: "Blocked On",
      renderCell: (row: ManageClientProps) => {
         const lastBlock = row.statusHistory?.filter(h => h.type === 'block').pop();
         return lastBlock?.actionDate ? dayjs(lastBlock.actionDate).format("DD/MM/YYYY") : "N/A";
      }
    },
    {
       key: "blockedBy",
       label: "Blocked By",
       renderCell: (row: ManageClientProps) => {
          const lastBlock = row.statusHistory?.filter(h => h.type === 'block').pop();
          return lastBlock?.adminName || "N/A";
       }
    },
    {
      key: "userStatus",
      label: "Current Status",
      renderCell: (row: ManageClientProps) => (
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 capitalize">
          {row.userStatus}
        </span>
      ),
    },
    {
      key: "action",
      label: "Actions",
      align: "center",
      renderCell: (row: ManageClientProps) => (
        <Button 
          className="w-fit bg-gradient-to-r from-teal-800 to-teal-900 text-white shadow-sm hover:opacity-90"
          onClick={() => handleUnblock(row)}
        >
          Unblock
        </Button>
      ),
    },
  ];

  return (
    <div className="h-full w-full flex flex-1 overflow-hidden flex-col bg-white dark:bg-gray-800 rounded-md p-4">
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <SearchInput value={search} onChange={setSearch} />
      </div>
      <div className="h-full flex-1 overflow-hidden">
        <CustomTable<ManageClientProps>
          columns={columns}
          data={blockedClients}
          initialPageSize={limit}
          totalCount={blockedClients.length}
          currentPage={page}
          onPageChange={setPage}
          onPageSizeChange={setLimit}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default BlockedClientList;
