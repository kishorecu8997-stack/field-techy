import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React, { useState } from "react";
import { FiEye } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { absoluteUrls } from "@/config/urls";
import { useNavigate } from "react-router-dom";
import Popup from "@/shared/components/Popup";
import ViewFileComponent from "./ViewFileComponent";
import { usePopupStore } from "@/shared/store/popupStore";
import SelectMenu from "@/shared/components/SelectMenu";
import { JobStatus } from "@/dummy_data/admin/manageEngineer";
import { useClientStatusChange } from "@/shared/hooks/useClientStatusChange";
import { toast } from "react-toastify";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import {
  useAdminManageClients,
  useAdminClientsByUserIdStatus,
  type AdminClientsByUserIdStatusBody,
} from "@/shared/apiServices/admin/adminOpenApiService";
import dayjs from "dayjs";
import { documentType, type ManageClientProps } from "../types";
import { type ProfileFileType } from "@/shared/apiServices/commonOpenApiService";

/**
 * CorporateClient Component
 *
 * Renders a management dashboard for corporate clients, including:
 * - Search functionality
 * - Custom table for displaying client info
 * - Action buttons for viewing, editing, or deleting client records
 *
 * @component
 * @returns {JSX.Element} The rendered CorporateClient component.
 */
const CorporateClient: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rowStatuses, setRowStatuses] = useState<Record<number, string>>({});
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();
  const { handleStatusChange } = useClientStatusChange();
  const [search, setSearch] = useState("");
  const [activeRowId, setActiveRowId] = useState<number | null>(null);
  const [activeUserId, setActiveUserId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<ProfileFileType | null>(
    null,
  );
  const session = useUserSessionStore((s) => s.session);
  const token = session?.accessToken || "";

  const { data: manageClient, refetch: refetchClients } = useAdminManageClients(
    token,
    {
      clientType: "corporate",
    },
  );

  const { mutateAsync: updateClientStatus } = useAdminClientsByUserIdStatus();

  const clientData = (manageClient?.data || []) as ManageClientProps[];

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
            console.log("Deleting client:", client.id);
            toast.success("Client deleted successfully");
            close(true);
          },
        },
      ],
    });
  };

  const columns: Column<ManageClientProps>[] = [
    {
      key: "",
      label: "Sr.No.",
      renderCell: (_row: ManageClientProps, index: number) => index + 1,
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
              {(row.companyName || row.name || "C").charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span
                className="font-medium text-gray-900 dark:text-gray-100 truncate"
                title={row.companyName || row.name}
              >
                {row.companyName || row.name}
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
      key: "documentType",
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
            onChange={async (value: string | null) => {
              if (!value) return;
              const previousStatus =
                rowStatuses[row.id] ?? row.profileStatus ?? "";

              setRowStatuses((prev) => ({
                ...prev,
                [row.id]: value,
              }));

              let isSuccess = false;
              const result = await handleStatusChange(
                row,
                value,
                showPopup,
                async (row, status) => {
                  try {
                    const payload: AdminClientsByUserIdStatusBody = {
                      profileStatus:
                        status as AdminClientsByUserIdStatusBody["profileStatus"],
                    };

                    await updateClientStatus({
                      userId: row.userId || row.id,
                      body: payload,
                      token: token,
                    });
                    isSuccess = true;
                    refetchClients();
                  } catch (error) {
                    toast.error(
                      error instanceof Error
                        ? error.message
                        : typeof error === "string"
                          ? error
                          : "Failed to update status",
                    );
                  }
                },
              );

              if (result !== true || !isSuccess) {
                setRowStatuses((prev) => ({
                  ...prev,
                  [row.id]: previousStatus,
                }));
              }
            }}
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
            className="p-2 bg-yellow-100 rounded-md cursor-pointer"
            onClick={() =>
              navigate(`${absoluteUrls.admin.home.corporateClientView}`)
            }
          >
            <FiEye className="text-yellow-600 " />
          </div>
          <div
            onClick={() =>
              navigate(`${absoluteUrls.admin.home.corporateClientEdit}`)
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
          onClick={() =>
            navigate(`${absoluteUrls.admin.home.corporateClientAdd}`)
          }
        >
          Add Client
        </Button>
      </div>
      <div className="h-full flex-1 overflow-y-auto ">
        <CustomTable<ManageClientProps>
          columns={columns}
          data={clientData}
          initialPageSize={10}
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

export default CorporateClient;
