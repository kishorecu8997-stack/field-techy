import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React, { useState } from "react";
import { FiEye } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { documentType, type ManageClientProps } from "../types";
import { absoluteUrls } from "@/config/urls";
import { useNavigate } from "react-router-dom";
import Popup from "@/shared/components/Popup";
import ViewFileComponent from "./ViewFileComponent";
import { usePopupStore } from "@/shared/store/popupStore";
import SelectMenu from "@/shared/components/SelectMenu";
import { JobStatus } from "@/dummy_data/admin/manageEngineer";
import { useClientStatusChange } from "@/shared/hooks/useClientStatusChange";
import { useStatusChange } from "@/shared/hooks/useStatusChange";
import { toast } from "react-toastify";
import {
  useAdminManageClients,
  useAdminClientsByUserIdStatus,
} from "@/shared/apiServices/admin/adminOpenApiService";
import dayjs from "dayjs";
import { type ProfileFileType } from "@/shared/apiServices/commonOpenApiService";

/**
 * HomeClient Component
 *
 * Renders a management dashboard for home clients, including:
 * - Search functionality
 * - Custom table for displaying client info
 * - Action buttons for viewing, editing, or deleting client records
 *
 * @component
 * @returns {JSX.Element} The rendered HomeClient component.
 */
const HomeClient: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();
  const [rowStatuses, setRowStatuses] = useState<Record<number, string>>({});
  const { handleStatusChange } = useClientStatusChange();
  const [search, setSearch] = useState("");
  const [activeRowId, setActiveRowId] = useState<number | null>(null);
  const [activeUserId, setActiveUserId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<ProfileFileType | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data: manageClient, refetch: refetchClients } = useAdminManageClients(
    {
      clientType: "home",
      query: { page, limit, search: search || undefined },
    },
  );
  const { mutateAsync: updateClientStatus } = useAdminClientsByUserIdStatus();

  const { onStatusChange } = useStatusChange({
    rowStatuses,
    setRowStatuses,
    updateClientStatus,
    refetchClients,
    showPopup,
    handleStatusChange,
  });

  const clientData = (manageClient?.data || []) as ManageClientProps[];

  //Delete confirmation
  const handleDeleteClient = async (client: ManageClientProps) => {
    await showPopup({
      title: "Delete Client",
      body: "Are you sure you want to delete this client?",
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
            console.log("Deleting client with ID:", client.id);
            toast.success("Client deleted successfully");
            close(true);
          },
        },
      ],
    });
  };

  const columns: Column<ManageClientProps>[] = [
    {
      label: "Sr.No.",
      renderCell: (_row: ManageClientProps, index: number) =>
        (page - 1) * limit + index + 1,
    },
    {
      key: "clientCode",
      label: "Client ID",
      renderCell: (row: ManageClientProps) => {
        const name = row.clientCode || "N/A";
        return (
          <span className="flex-nowrap text-nowrap">{name.toUpperCase()}</span>
        );
      },
    },
    {
      key: "details",
      label: "Details",
      renderCell: (row: ManageClientProps) => {
        return (
          <div className="flex gap-2 items-center w-[200px]">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
              {(row.name || "C").charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span
                className="font-medium text-gray-900 dark:text-gray-100 truncate"
                title={row.name}
              >
                {row.name}
              </span>
              <span
                className="text-xs text-gray-500 truncate"
                title={row.email}
              >
                {row.email}
              </span>
              <span className="text-xs text-gray-500">{row.phoneNumber}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: "location",
      label: "Location",
      renderCell: (row: ManageClientProps) => row.location || "N/A",
    },
    {
      key: "registrationDate",
      label: "Registration Date",
      renderCell: (row: ManageClientProps) =>
        row.registrationDate
          ? dayjs(row.registrationDate).format("DD/MM/YYYY")
          : "N/A",
    },
    {
      key: "documents",
      label: "View Documents",
      renderCell: (row: ManageClientProps) => {
        return (
          <SelectMenu
            placeholder="Select Document"
            className="w-36"
            options={
              documentType?.map((item) => ({
                value: item.value ?? "",
                label: item.label ?? "",
              })) ?? []
            }
            value={activeRowId === row.id ? selectedType : null}
            onChange={(value) => {
              setActiveRowId(row.id);
              setActiveUserId(row.userId);
              setSelectedType(value as ProfileFileType | null);
              setIsOpen(true);
            }}
          />
        );
      },
    },
    {
      key: "balance",
      label: "Wallet Balance",
      renderCell: (row: ManageClientProps) => `₹${row.balance || 0}`,
    },
    {
      key: "profileStatus",
      label: "Profile Status",
      renderCell: (row: ManageClientProps) => (
        <span
          className={`capitalize ${
            row.profileStatus === "approved"
              ? "text-green-600"
              : row.profileStatus === "pending"
                ? "text-yellow-600"
                : "text-red-600"
          }`}
        >
          {row.profileStatus || "N/A"}
        </span>
      ),
    },
    {
      key: "clientType",
      label: "Required Type",
      renderCell: (row: ManageClientProps) => (
        <span className="capitalize">{row.clientType}</span>
      ),
    },
    {
      key: "userStatus",
      label: "User Status",
      renderCell: (row: ManageClientProps) => {
        return (
          <SelectMenu
            placeholder="Select"
            value={rowStatuses[row.id] ?? row.profileStatus ?? ""}
            onChange={(value) => onStatusChange(row, value)}
            options={JobStatus}
            badge
          />
        );
      },
    },
    {
      key: "action",
      label: "Actions",
      renderCell: (row: ManageClientProps) => (
        <div className="flex items-center gap-2">
          <div
            onClick={() =>
              navigate(`${absoluteUrls.admin.home.homeClientView}`)
            }
            className="p-2 bg-yellow-100 rounded-md cursor-pointer"
          >
            <FiEye className="text-yellow-600 " />
          </div>
          <div
            onClick={() =>
              navigate(`${absoluteUrls.admin.home.homeClientEdit}`)
            }
            className="p-2 bg-blue-100 rounded-md cursor-pointer"
          >
            <CiEdit className="text-blue-600" />
          </div>
          <div
            className="p-2 bg-red-100 rounded-md cursor-pointer"
            onClick={() => handleDeleteClient(row)}
          >
            <RiDeleteBin6Line className="text-red-600" />
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-gray-700 rounded-md">
      <div className="mb-2 flex justify-between items-center gap-2">
        <SearchInput value={search} onChange={setSearch} />
        <Button
          className="w-fit bg-gradient-to-r bg-teal-900 text-white"
          onClick={() => navigate(`${absoluteUrls.admin.home.homeClientAdd}`)}
        >
          Add Client
        </Button>
      </div>
      <div className="h-full flex-1 overflow-y-auto ">
        <CustomTable<ManageClientProps>
          columns={columns}
          data={clientData}
          initialPageSize={limit}
          totalCount={manageClient?.total || 0}
          currentPage={page}
          onPageChange={setPage}
          onPageSizeChange={setLimit}
        />
      </div>
      <Popup open={isOpen} onClose={() => setIsOpen(false)}>
        <ViewFileComponent
          onClose={() => setIsOpen(false)}
          userId={activeUserId}
          fileType={selectedType}
        />
      </Popup>
    </div>
  );
};

export default HomeClient;
