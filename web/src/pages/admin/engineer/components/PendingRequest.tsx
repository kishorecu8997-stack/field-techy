import { absoluteUrls } from "@/config/urls";
import { JobStatus } from "@/dummy_data/admin/manageEngineer";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import Popup from "@/shared/components/Popup";
import SelectMenu from "@/shared/components/SelectMenu";
import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { IoCloseSharp } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import type { ManageEngineerProps, EngineerStatusType } from "../types";
import { EngineerStatus } from "../types";
import { usePopupStore } from "@/shared/store/popupStore";
import { toast } from "react-toastify";
import { useUpdateEngineerProfileStatus, fetchAdminManageEngineersPaged } from "@/shared/apiServices/admin/adminOpenApiService";
import { useQueryClient } from "@tanstack/react-query";

export type EngineerApiResponse = {
  id: number;
  userId: number;
  engineerCode: string;
  name: string;
  email: string;
  phoneNumber: string;
  location: string;
  cityName: string;
  countryName: string;
  registrationDate: string;
  balance: number;
  profileStatus: string;
  isEmployed: boolean;
  averageRating: number;
  user?: {
    name: string;
    email: string;
    phone_number: string;
  };
  isLoading?: boolean;
};

/**
 * PendingRequest Component
 *
 * Displays a management dashboard for engineers, including:
 * - A search input for filtering results.
 * - A customizable table for viewing detailed engineer data.
 * - Actionable buttons for viewing document details.
 *
 * @component
 * @example
 * return (
 *   <PendingRequest />
 * );
 *
 * @returns {JSX.Element} The rendered PendingRequest component.
 */

export default function PendingRequest() {
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();
  const queryClient = useQueryClient();
  const [rowStatuses, setRowStatuses] = useState<Record<number, EngineerStatusType>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const isEngineerStatus = (value: string | null): value is EngineerStatusType =>
    value !== null && Object.values(EngineerStatus).includes(value as EngineerStatusType);

  const { mutateAsync: updateEngineerStatus } = useUpdateEngineerProfileStatus({
    onSuccess: (_data, variables) => {
      toast.success(
        variables.profileStatus === EngineerStatus.APPROVE
          ? "Engineer Approved Successfully!"
          : "Engineer Rejected Successfully!",
      );
      setRowStatuses((prev) => ({ ...prev, [variables.userId]: variables.profileStatus }));
      queryClient.invalidateQueries({ queryKey: ["admin-manage-engineers"] });
    },
    onError: () => toast.error("Failed to update engineer status"),
  });

  const handleStatusChange = async (data: ManageEngineerProps, status: EngineerStatusType) => {
    if (!status) return;
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);
    const bodyMessage =
      status === EngineerStatus.PENDING
        ? "Are you sure you want to set this engineer to pending?"
        : `Are you sure you want to ${formattedStatus} this engineer?`;

    await showPopup({
      title: `${formattedStatus} Engineer`,
      body: bodyMessage,
      actionButtons: [
        { label: "Cancel", value: null, variant: "outline" },
        {
          label: "Yes",
          value: "yes",
          variant:
            status === EngineerStatus.APPROVE
              ? "primary"
              : status === EngineerStatus.REJECT
              ? "danger"
              : "warning",
          action: async (close) => {
            try {
              await updateEngineerStatus({
                userId: data.userId,
                profileStatus: status,
              });
              close(true);
            } catch {
              close(true);
            }
          },
        },
      ],
    });
  };

  const handleDeleteEngineer = async () => {
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
            queryClient.invalidateQueries({ queryKey: ["admin-manage-engineers"] });
            toast.success("Engineer deleted successfully!");
            close(true);
          },
        },
      ],
    });
  };

  const columns: Column<ManageEngineerProps & { srNo: number }>[] = [
    { key: "srNo", label: "Sr.No." },
    { key: "engineerID", label: "Engineer ID" },
    {
      key: "details",
      label: "Details",
      renderCell: (row) => (
        <div className="text-sm flex items-center gap-2">
          <FaUserCircle className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
          <div>
            <div className="font-semibold">{row.details.name}</div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">{row.details.phone}</div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">{row.details.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "submittedDocuments",
      label: "Submitted Documents",
      renderCell: (row) => (
        <div className="text-sm flex flex-col gap-1">
          {row.submittedDocuments.map((doc, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs dark:bg-gray-700 dark:text-gray-200">
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
              setSelectedRowId(row.userId);
            }}
          >
            {row.documents || "N/A"}
          </Button>
        </div>
      ),
    },
    { key: "location", label: "Location" },
    { key: "registrationDate", label: "Registration Date", dataCellAlign: "center" },
    { key: "walletBalance", label: "Wallet Balance", dataCellAlign: "center" },
    { key: "kycStatus", label: "KYC Status", dataCellAlign: "center" },
    { key: "employmentStatus", label: "Employment Status", dataCellAlign: "center" },
    { key: "avgRating", label: "Avg Rating", dataCellAlign: "center" },
    {
      key: "approvalStatus",
      label: "Approve/Reject",
      renderCell: (row) => {
        const current = rowStatuses[row.userId] ?? EngineerStatus.PENDING;
        const preparedOptions = [
          ...JobStatus.filter((opt) => opt.value === current).map((opt) => ({ ...opt, disabled: true })),
          ...JobStatus.filter((opt) => opt.value !== current),
        ];
        return (
          <SelectMenu
            placeholder="Select"
            value={current}
            onChange={(value) => {
              if (!isEngineerStatus(value) || value === current) return;
              handleStatusChange(row, value);
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
          <div className="p-2 bg-yellow-100 rounded-md cursor-pointer" onClick={() => navigate(absoluteUrls.admin.home.manage_engineer_view)}>
            <FiEye className="text-yellow-600" />
          </div>
          <div className="p-2 bg-blue-100 rounded-md cursor-pointer" onClick={() => navigate(`${absoluteUrls.admin.home.manage_engineer_edit}/${row.userId}`)}>
            <CiEdit className="text-blue-600" />
          </div>
          <div className="p-2 bg-red-100 rounded-md cursor-pointer" onClick={() => handleDeleteEngineer()}>
            <RiDeleteBin6Line className="text-red-600" />
          </div>
        </div>
      ),
    },
  ];

  const tableApi = async ({
    page,
    pageSize,
    filters,
  }: {
    page: number;
    pageSize: number;
    filters?: { [key: string]: string };
  }): Promise<{ data: (ManageEngineerProps & { srNo: number })[]; total: number }> => {

    const { data, total } = await fetchAdminManageEngineersPaged({
      page,
      limit: pageSize,
      profileStatus: "pending",
    });

    let rows = ((data ?? []) as EngineerApiResponse[]).map((e: EngineerApiResponse, idx: number) => {
      const base: ManageEngineerProps = {
        id: e.id,
        userId: e.userId,
        engineerID: e.engineerCode,
        details: {
          name: e.name || e.user?.name || "N/A",
          email: e.email || e.user?.email || "N/A",
          phone: e.phoneNumber || e.user?.phone_number || "N/A",
        },
        submittedDocuments: [],
        documents: "View",
        location: e.location || `${e.cityName}, ${e.countryName}`,
        registrationDate: new Date(e.registrationDate).toLocaleDateString(),
        walletBalance: (e.balance ?? 0).toString(),
        kycStatus:
          e.profileStatus === "pending"
            ? EngineerStatus.PENDING
            : (e.profileStatus as EngineerStatusType),
        employmentStatus: e.isEmployed ? "Employed" : "Unemployed",
        avgRating: e.averageRating ?? 0,
        approvalStatus:
          e.profileStatus === "pending"
            ? EngineerStatus.PENDING
            : (e.profileStatus as EngineerStatusType),
      };

      return {
        ...base,
        srNo: (page - 1) * pageSize + (idx + 1),
      };
    });

const q = (filters?.search ?? "").trim().toLowerCase();
  if (q) {
    rows = rows.filter((r) =>
      r.engineerID.toLowerCase().includes(q) ||
      r.details.name.toLowerCase().includes(q) ||
      r.details.email.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q)
    );
    return { data: rows, total: rows.length };
  }
  return { data: rows, total: total ?? 0 };
};

  return (
    <div>
      <div className="px-2 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-gray-700 rounded-md gap-2">
        <div className="flex flex-wrap gap-4 items-center">
          <SearchInput value={search} onChange={setSearch} />
        </div>

        <div className="h-full flex-1 overflow-y-auto">
          <CustomTable<ManageEngineerProps & { srNo: number }>
            columns={columns}
            initialPageSize={10}
            api={tableApi}
            externalFilters={{ search }}
            showPagination
          />
        </div>
      </div>

      {isModalOpen && (
        <Popup open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-bold">View File {selectedRowId}</span>
              <div className="text-xl font-semibold cursor-pointer" onClick={() => setIsModalOpen(false)}>
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