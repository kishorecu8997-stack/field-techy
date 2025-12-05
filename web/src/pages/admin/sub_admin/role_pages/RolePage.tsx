import { roleData } from "@/dummy_data/admin";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import type { RoleListType } from "../types";
import { useNavigate } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";

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
  const [statuses, setStatuses] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const getStatus = (row: RoleListType) => {
    // If status was never toggled, fallback to row.status
    return statuses[row.id] ?? row.status;
  };

  const toggleStatus = (id: string, current: boolean) => {
    setStatuses((prev) => ({ ...prev, [id]: !current }));
  };

  const columns: Column<RoleListType>[] = [
    { key: "id", label: "Sr.No." },
    { key: "roleName", label: "Role Name" },
    {
      key: "status",
      label: "Status",
      renderCell: (row: RoleListType) => {
        const currentStatus = getStatus(row);
        return (
          <div
            onClick={() => toggleStatus(row.id, currentStatus)}
            className={`flex items-center justify-center w-20 px-2 py-1 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${
              currentStatus ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {currentStatus ? "On" : "Off"}
          </div>
        );
      },
    },
    {
      key: "action",
      label: "Payment",
      renderCell: (row: RoleListType) => (
        <div className="flex items-center gap-2">
          <div
            className="p-2 bg-blue-100 rounded-md cursor-pointer"
            onClick={() => {
              navigate(absoluteUrls.admin.home.edit_role);
            }}
          >
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
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold">Manage Roles</h1>
        <div className="gap-2">
          <Button
            onClick={() => navigate(absoluteUrls.admin.home.add_role)}
            className="w-fit mr-2 bg-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Add Role
          </Button>
          <Button
            className="bg-neutral-800 text-white px-4 py-2 rounded-md hover:bg-neutral-700 w-fit cursor-pointer"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </div>
      </div>
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
