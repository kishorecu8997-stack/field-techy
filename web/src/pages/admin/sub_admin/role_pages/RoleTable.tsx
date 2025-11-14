import { permissionList } from "@/dummy_data/admin";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SwitchInput } from "@/shared/components/commonUI/inputs";
import React from "react";
import { useFormContext } from "react-hook-form";
import type { PermissionListType } from "../types";

/**
 * ManagePayment Component
 *
 * Renders a management dashboard for payment transactions.
 * Displays payment details in a searchable and paginated table, allowing admins to:
 * - View client and engineer details
 * - Track job-related payment statuses
 * - Send or process payments manually
 *
 * @component
 * @example
 * return (
 *   <ManagePayment />
 * );
 *
 * @returns {JSX.Element} The rendered ManagePayment component.
 */
const RoleTable: React.FC = () => {
  const ctx = useFormContext();
  const watchModuleNames = ctx.watch("moduleName");

  const columns: Column<PermissionListType>[] = [
    { key: "id", label: "Sr. No" },
    { key: "moduleName", label: "Module Name" },

    {
      key: "addAndEdit",
      label: "Add and Edit",
      renderCell: (row) => (
        <RenderToggleCell field={`${watchModuleNames}-${row.id}-addAndEdit`} />
      ),
    },
    {
      key: "view",
      label: "View",
      renderCell: (row) => (
        <RenderToggleCell field={`${watchModuleNames}-${row.id}-view`} />
      ),
    },
    {
      key: "delete",
      label: "Delete",
      renderCell: (row) => (
        <RenderToggleCell field={`${watchModuleNames}-${row.id}-delete`} />
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md gap-2">
        <div className="h-full flex-1 overflow-y-auto">
          <CustomTable<PermissionListType>
            columns={columns}
            data={permissionList}
            initialPageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default RoleTable;

const RenderToggleCell = ({ field }: { field: string }) => {
  return (
    <div className="flex items-center gap-2">
      <SwitchInput name={String(field)} />
    </div>
  );
};
