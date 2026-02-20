import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import { FaUserCircle } from "react-icons/fa";
import type { ManageEngineerProps, StatusHistoryType } from "../types";
import { Button } from "@/shared/components/commonUI/Buttons";
import { usePopupStore } from "@/shared/store/popupStore";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAdminManageEngineers } from "@/shared/apiServices/admin/adminOpenApiService";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: engineersResponse, isLoading } = useAdminManageEngineers({
    page: currentPage,
    limit: pageSize,
    status: "blocked",
  });

  const engineerData = (engineersResponse?.data ?? []) as ManageEngineerProps[];

  const latestBlockMap = useMemo<Record<string, StatusHistoryType | undefined>>(() => {
  const map: Record<string, StatusHistoryType | undefined> = {};

  engineerData.forEach((engineer) => {
    // safely handle undefined statusHistory
    const latestBlock = engineer.statusHistory?.reduce<StatusHistoryType | undefined>(
      (latest, current) => {
        if (current.type !== "block") return latest;
        // pick the one with latest actionDate
        if (!latest || new Date(current.actionDate) > new Date(latest.actionDate)) {
          return current;
        }
        return latest;
      },
      undefined
    );

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
            console.log("Unlocking engineer:", engineer.id);
            toast.success("Engineer unblocked successfully!");
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
            data={engineerData}
            loading={isLoading}
            initialPageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            totalCount={engineersResponse?.total ?? 0}
          />
        </div>
      </div>
    </div>
  );
}
