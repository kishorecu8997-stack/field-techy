import { manageEngineer } from "@/dummy_data/admin/manageEngineer";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import { FaUserCircle } from "react-icons/fa";
import type { ManageEngineerProps } from "../types";
import { Button } from "@/shared/components/commonUI/Buttons";
import { usePopupStore } from "@/shared/store/popupStore";

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

  const handleRevoke = async (id: number) => {
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
            console.log("Revoking job:", id);
            close(true);
          },
        },
      ],
    });
  };

  const columns: Column<ManageEngineerProps>[] = [
    { key: "id", label: "Sr.No." },
    {
      key: "engineerID",
      label: "Engineer ID",
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
              <div className="font-semibold">{row.details.name}</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                {row.details.phone}
              </div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                {row.details.email}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "suspendReason",
      label: "Reason for Suspension",
    },
    {
      key: "suspendfrom",
      label: "Suspend From",
    },
    { key: "suspendto", label: "Suspend To" },
    { key: "suspendBy", label: "Suspend By" },
    { key: "suspendOn", label: "Suspend On" },
    { key: "currentStatus", label: "Current Status" },
    {
      key: "action",
      label: "Actions",
      align: "center",
      renderCell: (row: ManageEngineerProps) => (
        <div
          className="mx-auto text-center"
          onClick={() => handleRevoke(row.id)}
        >
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
          <SearchInput />
        </div>
        <div className="h-full flex-1 overflow-y-auto ">
          <CustomTable<ManageEngineerProps>
            columns={columns}
            data={manageEngineer}
            initialPageSize={10}
          />
        </div>
      </div>
    </div>
  );
}
