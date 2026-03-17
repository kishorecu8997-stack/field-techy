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
import SelectMenu from "@/shared/components/SelectMenu";
import { JobStatus } from "@/dummy_data/admin/manageEngineer";
import { useClientStatusChange } from "@/shared/hooks/useClientStatusChange";
import { useStatusChange } from "@/shared/hooks/useStatusChange";
import { toast } from "react-toastify";
import { usePopupStore } from "@/shared/store/popupStore";
import {
  useAdminManageClients,
  useAdminClientsByUserIdStatus,
  useAdminDeleteClientMutation,
  LookupTable,
  useAppGetLookupData,
} from "@/shared/apiServices/admin/adminOpenApiService";
import dayjs from "dayjs";
import { documentType, type ManageClientProps } from "../types";
import { type ProfileFileType } from "@/shared/apiServices/commonOpenApiService";
import { useAdminCountryStore } from "@/shared/store/useAdminCountryStore";

interface ClientListProps {
  clientType: "corporate" | "home";
  onViewDocument: (client: ManageClientProps, type: ProfileFileType) => void;
}

/**
 * ClientList Component
 *
 * A unified table component for managing both Corporate and Home clients.
 *
 * @param {ClientListProps} props - The component props
 * @returns {JSX.Element} The rendered ClientList component.
 */
const ClientList: React.FC<ClientListProps> = ({
  clientType,
  onViewDocument,
}) => {
  const [rowStatuses, setRowStatuses] = useState<Record<number, string>>({});
  const navigate = useNavigate();
  const { handleStatusChange } = useClientStatusChange();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const normalizedSearch = search.trim();
  const {
    data: manageClient,
    refetch: refetchClients,
    isLoading,
  } = useAdminManageClients({
    clientType,
    query: {
      page,
      limit,
      ...(normalizedSearch ? { search: normalizedSearch } : {}),
    },
  });

  const { mutateAsync: updateClientStatus } = useAdminClientsByUserIdStatus();
  const { mutateAsync: deleteClient } = useAdminDeleteClientMutation();

  // Lookup APIs for country and state names
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);
  const { data: countries } = useAppGetLookupData(LookupTable.Countries);
  const { data: states } = useAppGetLookupData(
    LookupTable.States,
    selectedRegionId || undefined,
    { enabled: !!selectedRegionId },
  );

  const { showPopup } = usePopupStore();

  const { onStatusChange } = useStatusChange({
    rowStatuses,
    setRowStatuses,
    updateClientStatus,
    refetchClients,
    showPopup,
    handleStatusChange,
  });

  const clientData = (manageClient?.data || []) as unknown as ManageClientProps[];

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleDeleteClient = async (client: ManageClientProps) => {
    await showPopup({
      title: "Delete Client",
      body: `Are you sure you want to delete this client ${client.companyName}?`,
      actionButtons: [
        { label: "Cancel", value: null, variant: "outline" },
        {
          label: "Delete",
          value: "delete",
          variant: "danger",
          action: async (close) => {
            await deleteClient({ path: { userId: client.userId } });
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
      renderCell: (row: ManageClientProps) => (
        <span className="flex-nowrap text-nowrap">
          {(row.clientCode || "N/A").toUpperCase()}
        </span>
      ),
    },
    {
      key: "details",
      label: "Details",
      renderCell: (row: ManageClientProps) => {
        const displayName =
          clientType === "corporate" ? row.companyName || row.name : row.name;
        const initials = (displayName || "C").charAt(0).toUpperCase();
        const avatarUrl = row.profilePicture?.url;

        return (
          <div className="flex gap-2 items-center w-[200px]">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0 border border-indigo-200 shadow-sm">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span
                className="font-medium text-gray-900 dark:text-gray-100 truncate"
                title={displayName}
              >
                {displayName}
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
      renderCell: (row: ManageClientProps) => {
        const countryName =
          countries?.find((c) => c.id === row.countryId)?.name ||
          row.country?.name;

        const stateName =
          states?.find((s) => s.id === row.stateId)?.name || row.state?.name;

        const cityName = row.city?.name;

        const mainLocation = cityName || stateName;

        const locationParts = [mainLocation, countryName].filter(Boolean);
        return locationParts.length > 0
          ? locationParts.join(", ")
          : row.location || "N/A";
      },
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
      renderCell: (row: ManageClientProps) => (
        <SelectMenu
          placeholder="Select Document"
          className="w-36"
          options={documentType.map((item) => ({
            value: item.value ?? "",
            label: item.label ?? "",
          }))}
          value={null}
          onChange={(value) => onViewDocument(row, value as ProfileFileType)}
        />
      ),
    },
    {
      key: "balance",
      label: "Wallet Balance",
      renderCell: (row: ManageClientProps) => `₹${row.balance || 0}`,
    },
    {
      key: "userStatus",
      label: "Profile Status",
      renderCell: (row: ManageClientProps) => (
        <SelectMenu
          placeholder="Select"
          value={rowStatuses[row.id] ?? row.profileStatus ?? ""}
          onChange={(value) => onStatusChange(row, value)}
          options={JobStatus}
          badge
          disableSelected
        />
      ),
    },
    {
      key: "action",
      label: "Actions",
      renderCell: (row: ManageClientProps) => {
        const baseViewUrl =
          clientType === "corporate"
            ? absoluteUrls.admin.home.corporateClientView
            : absoluteUrls.admin.home.homeClientView;
        const baseEditUrl =
          clientType === "corporate"
            ? absoluteUrls.admin.home.corporateClientEdit
            : absoluteUrls.admin.home.homeClientEdit;

        return (
          <div className="flex items-center gap-2">
            <div
              className="p-2 bg-yellow-50 hover:bg-yellow-100 rounded-md cursor-pointer transition-colors"
              title="View Details"
              onClick={() =>
                navigate(
                  `${baseViewUrl}?userId=${row.userId}&id=${row.id}&view=true`,
                )
              }
            >
              <FiEye className="text-yellow-600" />
            </div>
            <div
              className="p-2 bg-blue-50 hover:bg-blue-100 rounded-md cursor-pointer transition-colors"
              title="Edit Client"
              onClick={() =>
                navigate(
                  `${baseEditUrl}?userId=${row.userId}&id=${row.id}&type=${clientType}`,
                )
              }
            >
              <CiEdit className="text-blue-600" />
            </div>
            <div
              className="p-2 bg-red-50 hover:bg-red-100 rounded-md cursor-pointer transition-colors"
              title="Delete Client"
              onClick={() => handleDeleteClient(row)}
            >
              <RiDeleteBin6Line className="text-red-600" />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="h-full w-full flex flex-1 overflow-hidden flex-col bg-white dark:bg-gray-700 rounded-md p-4">
      <div className="mb-4 flex justify-between items-center gap-2">
        <SearchInput value={search} onChange={handleSearchChange} />
        <Button
          className="w-fit bg-gradient-to-r bg-teal-900 text-white py-1 rounded-lg hover:opacity-90 transition"
          onClick={() => {
            const addUrl =
              clientType === "corporate"
                ? absoluteUrls.admin.home.corporateClientAdd
                : absoluteUrls.admin.home.homeClientAdd;
            navigate(`${addUrl}?type=${clientType}`);
          }}
        >
          Add Client
        </Button>
      </div>
      <div className="h-full flex-1 overflow-hidden">
        <CustomTable<ManageClientProps>
          columns={columns}
          data={clientData}
          initialPageSize={limit}
          totalCount={manageClient?.total || 0}
          currentPage={page}
          onPageChange={setPage}
          onPageSizeChange={setLimit}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default ClientList;
