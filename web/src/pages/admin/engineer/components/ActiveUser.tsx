import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import Popup from "@/shared/components/Popup";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import {
  documentType,
  SUSPEND_ENGINEER_DEFAULT_VALUES,
  type BlockEngineerFormData,
  type ManageEngineerProps,
  type SuspendEngineerFormData,
} from "../types";
import { usePopupStore } from "@/shared/store/popupStore";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import SuspendEngineer from "./SuspendEngineer";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import BlockEngineer from "./BlockEngineer";
import ActionsMenu from "./ActionMenu";
import {
  useAdminManageEngineers,
  useAdminDeleteEngineerMutation,
} from "@/shared/apiServices/admin/adminOpenApiService";
import SelectMenu from "@/shared/components/SelectMenu";
import type { ProfileFileType } from "@/shared/apiServices/commonOpenApiService";
import ViewFileComponent from "@/pages/admin/engineer/components/ViewFileComponent";
/**
 * ActiveUser Component
 *
 * Displays a management dashboard for engineers, including:
 * - A search input for filtering results.
 * - A customizable table for viewing detailed engineer data.
 * - Actionable buttons for viewing document details.
 * @returns {JSX.Element} The rendered ActiveUser component.
 */
export default function ActiveUser() {
  const methods = useForm<SuspendEngineerFormData>({
    mode: "onChange",
    defaultValues: SUSPEND_ENGINEER_DEFAULT_VALUES,
  });

  const { showPopup } = usePopupStore();
  const [showAction, setShowAction] = useState<number | null>(null);
  const [isSuspendEngineer, setIsSuspendEngineer] = useState<boolean>(false);
  const [isBlockEngineer, setIsBlockEngineer] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeRowId, setActiveRowId] = useState<number | null>(null);
  const [activeUserId, setActiveUserId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<ProfileFileType | null>(
    null,
  );
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: engineersResponse,
    isLoading,
    refetch,
  } = useAdminManageEngineers({
    page: currentPage,
    limit: pageSize,
    status: "active",
  });

  const { mutateAsync: deleteEngineer } = useAdminDeleteEngineerMutation();

  const engineerData = (engineersResponse?.data ?? []) as ManageEngineerProps[];

  //Delete confirmation
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
              // Refetch table data
              await refetch();
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
      renderCell: (row: ManageEngineerProps) => {
        return (
          <div className="text-sm flex items-center gap-2">
            <div>
              <FaUserCircle className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
            </div>
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
      key: "kycStatus",
      label: "KYC Status",
      dataCellAlign: "center",
      renderCell: (row) => row.profileStatus || "N/A",
    },
    {
      key: "employmentStatus",
      label: "Employment Status",
      dataCellAlign: "center",
      renderCell: (row) => (row.isEmployed ? "Employed" : "Unemployed"),
    },
    {
      key: "avgRating",
      label: "Avg Rating",
      dataCellAlign: "center",
      renderCell: (row) => row.averageRating?.toFixed(1) || "N/A",
    },
    {
      key: "action",
      label: "Actions",
      align: "center",
      dataCellAlign: "center",
      renderCell: (row: ManageEngineerProps) => (
        <ActionsMenu
          row={row}
          showAction={showAction}
          setShowAction={setShowAction}
          handleDelete={handleDeleteEngineer}
          setIsSuspend={setIsSuspendEngineer}
          setIsBlock={setIsBlockEngineer}
        />
      ),
    },
  ];

  const onSubmit = async (
    data: SuspendEngineerFormData | BlockEngineerFormData,
  ) => {
    if (isSuspendEngineer) {
      await handleSuspendSubmit(data as SuspendEngineerFormData);
    } else {
      await handleBlockSubmit(data);
    }
  };

  const handleSuspendSubmit = async (data: SuspendEngineerFormData) => {
    await showPopup({
      title: "Suspend Engineer",
      body: "Are you sure you want to suspend this engineer?",
      actionButtons: [
        { label: "Cancel", value: null, variant: "outline" },
        {
          label: "Suspend",
          value: "save",
          variant: "danger",
          action: async (close) => {
            console.log("Suspend data:", data);
            methods.reset();
            setIsSuspendEngineer(false);
            toast.success("Engineer suspended successfully!");
            close(true);
          },
        },
      ],
    });
  };

  const handleBlockSubmit = async (data: BlockEngineerFormData) => {
    await showPopup({
      title: "Block Engineer",
      body: "Are you sure you want to block this engineer?",
      actionButtons: [
        { label: "Cancel", value: null, variant: "outline" },
        {
          label: "Block",
          value: "save",
          variant: "danger",
          action: async (close) => {
            console.log("Block data:", data);
            close(true);
            methods.reset();
            setIsBlockEngineer(false);
            toast.success("Engineer blocked successfully!");
          },
        },
      ],
    });
  };

  return (
    <div>
      <div className="px-2 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-gray-700 rounded-md gap-2">
        <div className="flex flex-wrap gap-4 items-center">
          <SearchInput value={search} onChange={setSearch} />
        </div>
        <div className="h-full flex-1 overflow-y-auto ">
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
      <FormContainer methods={methods} onSubmit={onSubmit}>
        {isSuspendEngineer && (
          <SuspendEngineer
            isSuspendEngineer={isSuspendEngineer}
            setIsSuspendEngineer={setIsSuspendEngineer}
          />
        )}
        {isBlockEngineer && (
          <BlockEngineer
            isBlockEngineer={isBlockEngineer}
            setIsBlockEngineer={setIsBlockEngineer}
          />
        )}
      </FormContainer>
    </div>
  );
}
