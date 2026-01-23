import { manageEngineer } from "@/dummy_data/admin/manageEngineer";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import { FaUserCircle } from "react-icons/fa";
import type { ManageEngineerProps } from "../types";
import { Button } from "@/shared/components/commonUI/Buttons";
import { usePopupStore } from "@/shared/store/popupStore";
import { useState } from "react";

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
  const filteredData = manageEngineer
    .filter((e) => e.employmentStatus === "Blocked")
    .filter((e) => {
      const query = search.toLowerCase();
      return (
        e.engineerID.toLowerCase().includes(query) ||
        e.details.name.toLowerCase().includes(query) ||
        e.details.email.toLowerCase().includes(query) ||
        e.location.toLowerCase().includes(query)
      );
    });

  const handleUnblock = async (id: number) => {
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
            console.log("Unlocking engineer:", id);
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
      label: "Reason for Block",
    },
    { key: "suspendOn", label: "Blocked On" },
    { key: "suspendBy", label: "Blocked By" },
    { key: "currentStatus", label: "Current Status" },
    {
      key: "action",
      label: "Actions",
      align: "center",
      renderCell: (row: ManageEngineerProps) => (
        <div
          className="mx-auto text-center"
          onClick={() => handleUnblock(row.id)}
        >
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
            data={filteredData}
            initialPageSize={10}
          />
        </div>
      </div>
    </div>
  );
}
