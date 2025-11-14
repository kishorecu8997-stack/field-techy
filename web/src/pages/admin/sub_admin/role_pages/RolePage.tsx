import { roleData } from "@/dummy_data/admin";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React from "react";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import type { RoleListType } from "../types";

/**
 * RolePage Component
 *
 * Renders a management dashboard for roles.
 * Displays role details in a searchable and paginated table, allowing admins to:
 * - View role details
 * - Edit or delete specific roles
 * @component
 * @example
 * return (
 *   <RolePage />
 * );
 */
const RolePage: React.FC = () => {
  const columns: Column<RoleListType>[] = [
    { key: "id", label: "Sr. No" },
    { key: "roleName", label: "Role Name" },
    { key: "status", label: "Status" },
    {
      key: "action",
      label: "Payment",
      renderCell: (row: RoleListType) => (
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-md cursor-pointer">
            <CiEdit className="text-blue-600" />
          </div>
          <div className="p-2 bg-red-100 rounded-md cursor-pointer">
            <RiDeleteBin6Line className="text-red-600" />
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full h-full flex flex-col p-3 gap-3 ">
      <h1 className="text-xl font-semibold ">Manage Roles</h1>
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md gap-2">
        <div>
          <SearchInput />
        </div>
        <div className="h-full flex-1 overflow-y-auto ">
          <CustomTable<RoleListType>
            columns={columns}
            data={roleData}
            initialPageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default RolePage;
