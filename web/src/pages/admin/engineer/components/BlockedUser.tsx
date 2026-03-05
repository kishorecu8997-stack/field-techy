import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import Popup from "@/shared/components/Popup";
import type { ManageEngineerProps, StatusHistoryType } from "../types";
import { documentType } from "../types";
import { Button } from "@/shared/components/commonUI/Buttons";
import { usePopupStore } from "@/shared/store/popupStore";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  useAdminEngineersByUserIdStatus,
  useAdminManageEngineers,
} from "@/shared/apiServices/admin/adminOpenApiService";
import SelectMenu from "@/shared/components/SelectMenu";
import type { ProfileFileType } from "@/shared/apiServices/commonOpenApiService";
import ViewFileComponent from "@/pages/admin/engineer/components/ViewFileComponent";
import { getEngineerFileUrl } from "@/utils/getEngineerFileUrl";

/**
 * BlockedUser Component
 *
 * Displays a management dashboard for engineers, including:
 * - A search input for filtering results.
 * - A customizable table for viewing detailed engineer data.
 * - Actionable buttons for viewing document details.
 *
 * @component
 * @example
 * return (
 *   <BlockedUser />
 * );
 *
 * @returns {JSX.Element} The rendered BlockedUser component.
 */
export default function BlockedUser() {
  const { showPopup } = usePopupStore();
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
    status: "blocked",
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

  const { mutateAsync: updateEngineerStatus } =
    useAdminEngineersByUserIdStatus();

  const latestBlockMap = useMemo<
    Record<string, StatusHistoryType | undefined>
  >(() => {
    const map: Record<string, StatusHistoryType | undefined> = {};

    engineerData.forEach((engineer) => {
      // safely handle undefined statusHistory
      const latestBlock = engineer.statusHistory?.reduce<
        StatusHistoryType | undefined
      >((latest, current) => {
        if (current.type !== "block") return latest;
        // pick the one with latest actionDate
        if (
          !latest ||
          new Date(current.actionDate) > new Date(latest.actionDate)
        ) {
          return current;
        }
        return latest;
      }, undefined);

      map[engineer.id] = latestBlock;
    });

    return map;
  }, [engineerData]);

  const handleUnblock = async (engineer: ManageEngineerProps) => {
    await showPopup({
      title: "Unblock",
      body: "Are you sure you want to unblock this engineer?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Unblock",
          value: "save",
          variant: "primary",
          action: async (close) => {
            try {
              await updateEngineerStatus({
                path: { userId: engineer.userId },
                body: { userStatus: "active" },
              });
              toast.success("Engineer unblocked successfully!");
              close(true);
              await refetch?.();
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : typeof error === "string"
                    ? error
                    : "Failed to unblock engineer",
              );
              close(true);
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
      renderCell: (row: ManageEngineerProps) => (
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
              return;
            }

            setSelectedFile({
              engineerId: row.id,
              type: value as ProfileFileType,
            });
          }}
        />
      ),
    },
    {
      key: "blockReason",
      label: "Reason for Block",
      renderCell: (row) => latestBlockMap[row.id]?.reason || "N/A",
    },
    {
      key: "blockOn",
      label: "Blocked On",
      renderCell: (row) => {
        const date = latestBlockMap[row.id]?.actionDate;
        return date ? new Date(date).toLocaleDateString() : "N/A";
      },
    },
    {
      key: "blockBy",
      label: "Blocked By",
      dataCellAlign: "center",
      renderCell: (row) => latestBlockMap[row.id]?.adminName || "N/A",
    },
    {
      key: "action",
      label: "Actions",
      align: "center",
      renderCell: (row: ManageEngineerProps) => (
        <div className="mx-auto text-center" onClick={() => handleUnblock(row)}>
          <Button className="w-fit bg-gradient-to-r bg-teal-900 text-white">
            Unblock
          </Button>
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
        <div className="h-full flex-1 overflow-y-auto ">
          <CustomTable<ManageEngineerProps>
            columns={columns}
            data={filteredEngineers}
            loading={isLoading || isFetching}
            initialPageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
                        totalCount={
              search
                ? filteredEngineers.length
                : (engineersResponse?.total ?? 0)
            }
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
