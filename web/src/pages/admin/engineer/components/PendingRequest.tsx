import { absoluteUrls } from "@/config/urls";
import { JobStatus } from "@/dummy_data/admin/manageEngineer";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import Popup from "@/shared/components/Popup";
import SelectMenu from "@/shared/components/SelectMenu";
import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { ManageEngineerProps, EngineerStatusType } from "../types";
import { documentType, EngineerStatus } from "../types";
import { usePopupStore } from "@/shared/store/popupStore";
import {
  useAdminManageEngineers,
  useAdminEngineersByUserIdStatus,
} from "@/shared/apiServices/admin/adminOpenApiService";
import { useEngineerStatusChange } from "@/shared/hooks/useEngineerStatusChange";
import type { ProfileFileType } from "@/shared/apiServices/commonOpenApiService";
import ViewFileComponent from "@/pages/admin/engineer/components/ViewFileComponent";

export default function PendingRequest() {
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();

  const [rowStatuses, setRowStatuses] = useState<
    Record<number, EngineerStatusType>
  >({});
  const [search, setSearch] = useState("");
  const [activeRowId, setActiveRowId] = useState<number | null>(null);
  const [activeUserId, setActiveUserId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<ProfileFileType | null>(
    null,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: engineersResponse,
    isLoading,
    refetch,
  } = useAdminManageEngineers({
    page: currentPage,
    limit: pageSize,
    profileStatus: "pending",
  });

  // Mutation for updating status
  const { mutateAsync: updateEngineerStatus } =
    useAdminEngineersByUserIdStatus();

  // Use the hook for status change
  const { onStatusChange } = useEngineerStatusChange({
    rowStatuses,
    setRowStatuses,
    mutateAsync: async ({
      userId,
      profileStatus,
    }: {
      userId: number;
      profileStatus: EngineerStatusType;
    }) =>
      updateEngineerStatus({
        path: { userId },
        body: { profileStatus },
      }),
    showPopup,
    refetch,
  });

  const engineerData = (engineersResponse?.data ?? []) as ManageEngineerProps[];

  const handleDeleteEngineer = async (engineerData: ManageEngineerProps) => {
    await showPopup({
      title: "Delete Engineer",
      body: "Are you sure you want to delete this engineer?",
      actionButtons: [
        { label: "Cancel", value: null, variant: "outline" },
        {
          label: "Delete",
          value: "delete",
          variant: "danger",
          action: async (close) => {
            toast.success("Engineer deleted successfully!");
            // Here you would call the API to delete the engineer using engineerData.id
            console.log("Deleting engineer:", engineerData.id);
            close(true);
          },
        },
      ],
    });
  };

  const columns: Column<ManageEngineerProps>[] = [
    {
      label: "Sr.No.",
      renderCell: (_row: ManageEngineerProps, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      key: "engineerID",
      label: "Engineer ID",
      renderCell: (row: ManageEngineerProps) => {
        const id = row.engineerCode || "N/A";
        return (
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {id}
          </div>
        );
      },
    },
    {
      key: "details",
      label: "Details",
      renderCell: (row) => (
        <div className="text-sm flex items-center gap-2">
          <FaUserCircle className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
          <div>
            <div className="font-semibold">{row.name}</div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              {row.phoneNumber}
            </div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              {row.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "submittedDocuments",
      label: "Submitted Documents",
      renderCell: (row) => (
        <div className="text-sm flex flex-col gap-1">
          {row.submittedDocuments?.map((doc, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs dark:bg-gray-700 dark:text-gray-200"
            >
              {doc}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "documentType",
      label: "View Documents",
      renderCell: (row: ManageEngineerProps) => {
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
    { key: "location", label: "Location", renderCell: (row) => row.location || "N/A" },
    {
      key: "registrationDate",
      label: "Registration Date",
      dataCellAlign: "center",
      renderCell: (row) =>
        row.registrationDate
          ? new Date(row.registrationDate).toLocaleDateString()
          : "N/A",
    },
    { key: "walletBalance", label: "Wallet Balance", dataCellAlign: "center", renderCell: (row) => row.balance },
    { key: "kycStatus", label: "KYC Status", dataCellAlign: "center", renderCell: (row) => row.profileStatus || "N/A" },
    {
      key: "employmentStatus",
      label: "Employment Status",
      dataCellAlign: "center",
      renderCell: (row) => (row.isEmployed ? "Employed" : "Unemployed"),
    },
    { key: "avgRating", label: "Avg Rating", dataCellAlign: "center", renderCell: (row) => row.averageRating?.toFixed(1) || "N/A" },
    {
      key: "approvalStatus",
      label: "Approve/Reject",
      renderCell: (row) => {
        const current = rowStatuses[row.id] ?? EngineerStatus.PENDING;
        const preparedOptions = [
          ...JobStatus.filter((opt) => opt.value === current).map((opt) => ({
            ...opt,
            disabled: true,
          })),
          ...JobStatus.filter((opt) => opt.value !== current),
        ];

        return (
          <SelectMenu
            placeholder="Select"
            value={current}
            onChange={(value) => {
              if (!value) return;
              onStatusChange(row, value as EngineerStatusType);
            }}
            options={preparedOptions}
            badge
          />
        );
      },
    },
    {
      key: "action",
      label: "Actions",
      align: "center",
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          <div
            className="p-2 bg-yellow-100 rounded-md cursor-pointer"
            onClick={() =>
              navigate(absoluteUrls.admin.home.manage_engineer_view)
            }
          >
            <FiEye className="text-yellow-600" />
          </div>
          <div
            className="p-2 bg-blue-100 rounded-md cursor-pointer"
            onClick={() =>
              navigate(
                `${absoluteUrls.admin.home.manage_engineer_edit}/${row.id}`,
              )
            }
          >
            <CiEdit className="text-blue-600" />
          </div>
          <div
            className="p-2 bg-red-100 rounded-md cursor-pointer"
            onClick={() => handleDeleteEngineer(row)}
          >
            <RiDeleteBin6Line className="text-red-600" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="px-2 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-gray-700 rounded-md gap-2">
        <div className="flex flex-wrap gap-4 items-center">
          <SearchInput value={search} onChange={setSearch} />
        </div>
        <div className="h-full flex-1 overflow-y-auto">
          <CustomTable<ManageEngineerProps>
            columns={columns}
            data={engineerData}
            initialPageSize={pageSize}
            currentPage={currentPage}
            totalCount={engineersResponse?.total ?? 0}
            loading={isLoading}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
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
}
