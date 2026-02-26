import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import { FaUserCircle } from "react-icons/fa";
import type { ManageEngineerProps, StatusHistoryType } from "../types";
import { Button } from "@/shared/components/commonUI/Buttons";
import { usePopupStore } from "@/shared/store/popupStore";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  useAdminEngineersByUserIdStatus,
  useAdminManageEngineers,
} from "@/shared/apiServices/admin/adminOpenApiService";

/**
 * SuspendedUser Component
 *
 * Displays a management dashboard for engineers, including:
 * - A search input for filtering results.
 * - A customizable table for viewing detailed engineer data.
 * - Actionable buttons for viewing document details.
 *
 * @component
 * @example
 * return (
 *   <SuspendedUser />
 * );
 *
 * @returns {JSX.Element} The rendered SuspendedUser component.
 */
export default function SuspendedUser() {
  const { showPopup } = usePopupStore();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: engineersResponse, isLoading, refetch } =
    useAdminManageEngineers({
      page: currentPage,
      limit: pageSize,
      status: "suspended",
    });

  const engineerData = (engineersResponse?.data ?? []) as ManageEngineerProps[];

  const { mutateAsync: updateEngineerStatus } =
    useAdminEngineersByUserIdStatus();

  const latestSuspensionMap = useMemo<
    Record<string, StatusHistoryType | undefined>
  >(() => {
    const map: Record<string, StatusHistoryType | undefined> = {};

    engineerData.forEach((engineer) => {
      // safely reduce over statusHistory
      const latestSuspension = engineer.statusHistory?.reduce<
        StatusHistoryType | undefined
      >((latest, current) => {
        if (current.type !== "suspension") return latest;

        // pick the one with the latest actionDate
        if (
          !latest ||
          new Date(current.actionDate) > new Date(latest.actionDate)
        ) {
          return current;
        }

        return latest;
      }, undefined);

      map[engineer.id] = latestSuspension;
    });

    return map;
  }, [engineerData]);

  const handleRevoke = async (engineer: ManageEngineerProps) => {
    await showPopup({
      title: "Revoke",
      body: "Are you sure you want to revoke suspension of this engineer?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Revoke",
          value: "save",
          variant: "primary",
          action: async (close) => {
            try {
              await updateEngineerStatus({
                path: { userId: engineer.userId },
                body: { userStatus: "active" },
              });
              toast.success("Suspension revoked successfully!");
              await refetch();
              close(true);
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : typeof error === "string"
                    ? error
                    : "Failed to revoke suspension",
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
      key: "suspendReason",
      label: "Reason for Suspension",
      renderCell: (row) => latestSuspensionMap[row.id]?.reason || "N/A",
    },
    {
      key: "suspendFrom",
      label: "Suspend From",
      renderCell: (row) => {
        const date = latestSuspensionMap[row.id]?.startDate;
        return date ? new Date(date).toLocaleDateString() : "N/A";
      },
    },
    {
      key: "suspendTo",
      label: "Suspend To",
      renderCell: (row) => {
        const date = latestSuspensionMap[row.id]?.endDate;
        return date ? new Date(date).toLocaleDateString() : "N/A";
      },
    },
    {
      key: "suspendBy",
      label: "Suspend By",
      renderCell: (row) => latestSuspensionMap[row.id]?.adminName || "N/A",
    },
    {
      key: "suspendOn",
      label: "Suspend On",
      renderCell: (row) => {
        const date = latestSuspensionMap[row.id]?.actionDate;
        return date ? new Date(date).toLocaleDateString() : "N/A";
      },
    },
    {
      key: "action",
      label: "Actions",
      align: "center",
      renderCell: (row: ManageEngineerProps) => (
        <div className="mx-auto text-center" onClick={() => handleRevoke(row)}>
          <Button className="w-fit bg-gradient-to-r bg-teal-900 text-white">
            Revoke
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
            data={engineerData}
            initialPageSize={pageSize}
            currentPage={currentPage}
            loading={isLoading}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            totalCount={engineersResponse?.total ?? 0}
          />
        </div>
      </div>
    </div>
  );
}
