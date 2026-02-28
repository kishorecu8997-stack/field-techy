import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import Popup from "@/shared/components/Popup";
import { useEffect, useMemo, useState } from "react";
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
  useAdminEngineersByUserIdStatus,
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
  const [activeEngineer, setActiveEngineer] = useState<ManageEngineerProps | null>(
    null,
  );
  const [selectedFile, setSelectedFile] = useState<{
    engineerId: number;
    type: ProfileFileType;
  } | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { data: engineersResponse, isLoading, isFetching } =
    useAdminManageEngineers({
      page: currentPage,
      limit: pageSize,
      status: "active",
    });

  const { mutateAsync: deleteEngineer } = useAdminDeleteEngineerMutation();

  const engineerData = (engineersResponse?.data ?? []) as ManageEngineerProps[];

  useEffect(() => {
    setSelectedFile(null);
    setIsPreviewOpen(false);
  }, [currentPage, pageSize]);

  const selectedEngineer = useMemo(() => {
    if (!selectedFile) return null;
    return engineerData.find((engineer) => engineer.id === selectedFile.engineerId) ?? null;
  }, [engineerData, selectedFile]);

  useEffect(() => {
    if (!selectedFile) return;
    if (isLoading || isFetching) return;
    if (selectedEngineer) return;
    setSelectedFile(null);
    setIsPreviewOpen(false);
  }, [isFetching, isLoading, selectedEngineer, selectedFile]);

  const getFileUrl = () => {
    if (!selectedFile || !selectedEngineer) return null;
    const { type } = selectedFile;

    switch (type) {
      case "profilePicture":
        return selectedEngineer.profilePicture?.url;
      case "resumeFile":
        return selectedEngineer.resumeFile?.url;
      case "govIdDoc":
        return selectedEngineer.govIdDoc?.url;
      case "certificateDoc":
        return selectedEngineer.certificateDoc?.url;
      default:
        return null;
    }
  };

  const { mutateAsync: updateEngineerStatus } =
    useAdminEngineersByUserIdStatus();

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
            value={selectedFile?.engineerId === row.id ? selectedFile.type : null}
            onChange={(value) => {
              if (!value) {
                setSelectedFile(null);
                setIsPreviewOpen(false);
                return;
              }

              setSelectedFile({ engineerId: row.id, type: value as ProfileFileType });
              setIsPreviewOpen(true);
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
      renderCell: (row) => row.profileStatus.toUpperCase() || "N/A",
    },
    {
      key: "employmentStatus",
      label: "Employment Status",
      dataCellAlign: "center",
      renderCell: (row) => (row.isEmployed ? "Employed" : "Unemployed").toUpperCase(),
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
          setIsSuspend={(v) => {
            if (v) setActiveEngineer(row);
            if (!v) setActiveEngineer(null);
            setIsSuspendEngineer(v);
          }}
          setIsBlock={(v) => {
            if (v) setActiveEngineer(row);
            if (!v) setActiveEngineer(null);
            setIsBlockEngineer(v);
          }}
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
    if (!activeEngineer) {
      toast.error("Please select an engineer to suspend.");
      return;
    }

    const startDate = data.suspendStartDate;
    const endDate = data.suspendEndDate;

    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates.");
      return;
    }

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
            try {
              await updateEngineerStatus({
                path: { userId: activeEngineer.userId },
                body: {
                  userStatus: "suspended",
                  reason: data.reason,
                  startDate: startDate.toISOString(),
                  endDate: endDate.toISOString(),
                },
              });

              toast.success("Engineer suspended successfully!");
              methods.reset();
              setIsSuspendEngineer(false);
              setActiveEngineer(null);
              close(true);
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : typeof error === "string"
                    ? error
                    : "Failed to suspend engineer",
              );
              close(true);
            }
          },
        },
      ],
    });
  };

  const handleBlockSubmit = async (data: BlockEngineerFormData) => {
    if (!activeEngineer) {
      toast.error("Please select an engineer to block.");
      return;
    }

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
            try {
              await updateEngineerStatus({
                path: { userId: activeEngineer.userId },
                body: {
                  userStatus: "blocked",
                  reason: data.reason,
                },
              });

              toast.success("Engineer blocked successfully!");
              methods.reset();
              setIsBlockEngineer(false);
              setActiveEngineer(null);
              close(true);
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : typeof error === "string"
                    ? error
                    : "Failed to block engineer",
              );
              close(true);
            }
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
            loading={isLoading || isFetching}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>
      <Popup open={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
        {selectedFile && selectedEngineer && (
          <ViewFileComponent
            onClose={() => setIsPreviewOpen(false)}
            fileType={selectedFile.type}
            userId={selectedEngineer.userId}
            fileUrl={getFileUrl()}
            title={`${selectedEngineer.name}'s`}
          />
        )}
      </Popup>
      <FormContainer methods={methods} onSubmit={onSubmit}>
        {isSuspendEngineer && (
          <SuspendEngineer
            isSuspendEngineer={isSuspendEngineer}
            setIsSuspendEngineer={setIsSuspendEngineer}
            onSubmit={handleSuspendSubmit}
          />
        )}
        {isBlockEngineer && (
          <BlockEngineer
            isBlockEngineer={isBlockEngineer}
            setIsBlockEngineer={setIsBlockEngineer}
            onSubmit={handleBlockSubmit}
          />
        )}
      </FormContainer>
    </div>
  );
}
