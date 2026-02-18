import { absoluteUrls } from "@/config/urls";
import { JobStatus } from "@/dummy_data/admin/manageEngineer";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import Popup from "@/shared/components/Popup";
import SelectMenu from "@/shared/components/SelectMenu";
import { useState, useMemo } from "react";
import { CiEdit } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { IoCloseSharp } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { ManageEngineerProps, EngineerStatusType } from "../types";
import { EngineerStatus } from "../types";
import { usePopupStore } from "@/shared/store/popupStore";
import {
  useAdminManageEngineers,
  useAdminEngineersByUserIdStatus,
} from "@/shared/apiServices/admin/adminOpenApiService";
import { useEngineerStatusChange } from "@/shared/hooks/useEngineerStatusChange";

export default function PendingRequest() {
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();

  const [rowStatuses, setRowStatuses] = useState<
    Record<number, EngineerStatusType>
  >({});
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
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

  // Map API response to table rows
  const engineersData: ManageEngineerProps[] = (
    engineersResponse?.data ?? []
  ).map((e) => ({
    id: e.userId,
    userId: e.userId,
    engineerID: e.engineerCode,
    details: {
      name: e.name || "N/A",
      email: e.email || "N/A",
      phone: e.phoneNumber || "N/A",
    },
    submittedDocuments: e.statusHistory?.map((s) => s.type) ?? [],
    documents: "View",
    location: e.location || "N/A",
    registrationDate: new Date(e.registrationDate).toLocaleDateString(),
    walletBalance: e.balance?.toString() ?? "0",
    kycStatus: e.profileStatus as EngineerStatusType,
    employmentStatus: e.isEmployed ? "Employed" : "Unemployed",
    avgRating: e.averageRating,
    approvalStatus: e.profileStatus as EngineerStatusType,
  }));

  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    return engineersData.filter(
      (e) =>
        e.engineerID.toLowerCase().includes(q) ||
        e.details.name.toLowerCase().includes(q) ||
        e.details.email.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q),
    );
  }, [engineersData, search]);

  const handleDeleteEngineer = async (_row: ManageEngineerProps) => {
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
            // Here you would call the API to delete the engineer using _row.id
            console.log("Deleting engineer:", _row.id);
            close(true);
          },
        },
      ],
    });
  };

  const columns: Column<ManageEngineerProps>[] = [
    {
      label: "Sr.No.",
      renderCell: (_row: ManageEngineerProps, index: number) => (currentPage - 1) * pageSize + index + 1,
    },
    { key: "engineerID", label: "Engineer ID" },
    {
      key: "details",
      label: "Details",
      renderCell: (row) => (
        <div className="text-sm flex items-center gap-2">
          <FaUserCircle className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
          <div>
            <div className="font-semibold">{row.details.name}</div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              {row.details.phone}
            </div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              {row.details.email}
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
      key: "documents",
      label: "View Documents",
      align: "center",
      renderCell: (row) => (
        <div className="mx-auto text-center">
          <Button
            className="w-fit bg-gradient-to-r bg-teal-900 text-white"
            onClick={() => {
              setIsModalOpen(true);
              setSelectedRowId(row.id);
            }}
          >
            {row.documents || "N/A"}
          </Button>
        </div>
      ),
    },
    { key: "location", label: "Location" },
    {
      key: "registrationDate",
      label: "Registration Date",
      dataCellAlign: "center",
    },
    { key: "walletBalance", label: "Wallet Balance", dataCellAlign: "center" },
    { key: "kycStatus", label: "KYC Status", dataCellAlign: "center" },
    {
      key: "employmentStatus",
      label: "Employment Status",
      dataCellAlign: "center",
    },
    { key: "avgRating", label: "Avg Rating", dataCellAlign: "center" },
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
            data={filteredData}
            initialPageSize={pageSize}
            currentPage={currentPage}
            totalCount={engineersResponse?.total ?? 0}
            loading={isLoading}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>

      {isModalOpen && (
        <Popup open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-bold">View File {selectedRowId}</span>
              <div
                className="text-xl font-semibold cursor-pointer"
                onClick={() => setIsModalOpen(false)}
              >
                <IoCloseSharp />
              </div>
            </div>
            <div className="border border-gray-400 h-36 my-6">
              <img src="https://via.placeholder.com/500" alt="file" />
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
}
