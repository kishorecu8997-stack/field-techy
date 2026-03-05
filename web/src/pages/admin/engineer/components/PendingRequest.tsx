import { absoluteUrls } from "@/config/urls";
import { JobStatus } from "@/dummy_data/admin/manageEngineer";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import Popup from "@/shared/components/Popup";
import SelectMenu from "@/shared/components/SelectMenu";
import { useMemo, useState } from "react";
import { CiEdit } from "react-icons/ci";
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
  useAdminDeleteEngineerMutation,
} from "@/shared/apiServices/admin/adminOpenApiService";
import { useEngineerStatusChange } from "@/shared/hooks/useEngineerStatusChange";
import type { ProfileFileType } from "@/shared/apiServices/commonOpenApiService";
import ViewFileComponent from "@/pages/admin/engineer/components/ViewFileComponent";
import { getEngineerFileUrl } from "@/utils/getEngineerFileUrl";

export default function PendingRequest() {
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();

  const [rowStatuses, setRowStatuses] = useState<
    Record<number, EngineerStatusType>
  >({});
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState<{
    engineerId: number;
    type: ProfileFileType;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: engineersResponse,
    isLoading,
    isFetching,
    refetch,
  } = useAdminManageEngineers({
    page: currentPage,
    limit: pageSize,
    profileStatus: "pending",
  });

  // Mutation for updating status
  const { mutateAsync: updateEngineerStatus } =
    useAdminEngineersByUserIdStatus();
  const { mutateAsync: deleteEngineer } = useAdminDeleteEngineerMutation();

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

  const selectedEngineer = useMemo(() => {
    if (!selectedFile) return null;
    return (
      engineerData.find(
        (engineer) => engineer.id === selectedFile.engineerId,
      ) ?? null
    );
  }, [engineerData, selectedFile]);

    const filteredEngineers = useMemo(() => {
      if (!search.trim()) return engineerData;

      const term = search.toLowerCase();

      return engineerData.filter((engineer) =>
        [
          engineer.engineerCode,
          engineer.name,
          engineer.email,
          engineer.phoneNumber,
          engineer.location,
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(term)),
      );
    }, [engineerData, search]);

  const isPreviewOpen = !!selectedFile && !!selectedEngineer;

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
            try {
              await deleteEngineer({ path: { userId: engineerData.userId } });
              toast.success("Engineer deleted successfully!");
              await refetch?.();
              close(true);
            } catch (error) {
              toast.error("Failed to delete engineer. Please try again.");
              console.error(error);
            }
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
      renderCell: (row) => {
        const initials = row.name?.charAt(0).toUpperCase() || "E";
        return (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0 border border-indigo-200 shadow-sm">
              {row.profilePicture?.url ? (
                <img
                  src={row.profilePicture.url}
                  alt={row.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="flex flex-col">
              <div className="font-semibold">{row.name}</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                {row.phoneNumber}
              </div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                {row.email}
              </div>
            </div>
          </div>
        );
      },
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
            value={
              selectedFile?.engineerId === row.id ? selectedFile.type : null
            }
            onChange={(value) => {
              if (!value) {
                setSelectedFile(null);
                return;
              }

              setSelectedFile({
                engineerId: row.id,
                type: value as ProfileFileType,
              });
            }}
          />
        );
      },
    },
    {
      key: "location",
      label: "Location",
      renderCell: (row) => row.location || "N/A",
    },
    {
      key: "registrationDate",
      label: "Registration Date",
      dataCellAlign: "center",
      renderCell: (row) =>
        row.registrationDate
          ? new Date(row.registrationDate).toLocaleDateString()
          : "N/A",
    },
    {
      key: "walletBalance",
      label: "Wallet Balance",
      dataCellAlign: "center",
      renderCell: (row) => row.balance,
    },
    {
      key: "employmentStatus",
      label: "Employment Status",
      dataCellAlign: "center",
      renderCell: (row) =>
        (row.isEmployed ? "Employed" : "Unemployed").toUpperCase(),
    },
    {
      key: "avgRating",
      label: "Avg Rating",
      dataCellAlign: "center",
      renderCell: (row) => row.averageRating?.toFixed(1) || "N/A",
    },
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
              navigate(
                `${absoluteUrls.admin.home.manage_engineer_view}/${row.userId}`,
              )
            }
          >
            <FiEye className="text-yellow-600" />
          </div>
          <div
            className="p-2 bg-blue-100 rounded-md cursor-pointer"
            onClick={() =>
              navigate(
                `${absoluteUrls.admin.home.manage_engineer_edit}/${row.userId}`,
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
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="h-full flex-1 overflow-y-auto">
          <CustomTable<ManageEngineerProps>
            columns={columns}
            data={filteredEngineers}
            initialPageSize={pageSize}
            currentPage={currentPage}
            totalCount={
              search
                ? filteredEngineers.length
                : (engineersResponse?.total ?? 0)
            }
            loading={isLoading || isFetching}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>
      <Popup open={isPreviewOpen} onClose={() => setSelectedFile(null)}>
        {selectedFile && selectedEngineer && (
          <ViewFileComponent
            onClose={() => setSelectedFile(null)}
            fileType={selectedFile.type}
            userId={selectedEngineer.userId}
            fileUrl={getEngineerFileUrl(selectedEngineer, selectedFile?.type)}
            title={`${selectedEngineer.name}'s`}
          />
        )}
      </Popup>
    </div>
  );
}
