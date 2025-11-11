import { serviceCategoriesData } from "@/dummy_data/admin";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";


export interface ServerCategoryProps {
  id: string;
  categoryImg: string;
  categoryName: string;
  createdDate: string;
  status: boolean;
}

/**
 * ManageJobCategory Component
 * 
 * Renders a table view to manage all service categories with the following features:
 * - Displays category name, created date, and current status.
 * - Allows toggling the active/inactive status inline.
 * - Provides action buttons for viewing, editing, or deleting categories.
 * - Includes a search bar for quick filtering.
 * 
 * @component
 * @example
 * return (
 *   <ManageJobCategory />
 * );
 * 
 * @returns {JSX.Element} The rendered ManageJobCategory component.
 */
const ManageJobCategory: React.FC = () => {
  const columns: Column<ServerCategoryProps>[] = [
    { key: "id", label: "Sr. NO" },
    { key: "categoryName", label: "Category" },
    { key: "createdDate", label: "Created Date" },
    {
      key: "status",
      label: "Status",
      renderCell: (row: ServerCategoryProps) => {
        const [status, setStatus] = useState<boolean>(row.status);

        return (
          <div
            className={`flex items-center justify-center w-20 px-2 py-1 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${
              status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
            onClick={() => setStatus(!status)}
          >
            {status ? "On" : "Off"}
          </div>
        );
      },
    },

    {
      key: "action",
      label: "Actions",
      renderCell: (row: ServerCategoryProps) => (
        <div className="flex items-center gap-2">
          <div className="p-2 bg-yellow-100 rounded-md">
            <FiEye className="text-yellow-600 " />
          </div>
          <div className="p-2 bg-blue-100 rounded-md">
            <CiEdit className="text-blue-600" />
          </div>
          <div className="p-2 bg-red-100 rounded-md">
            <RiDeleteBin6Line className="text-red-600" />
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full h-full flex flex-col p-3 gap-3 ">
      <h1 className="text-xl font-semibold ">Manage service categories</h1>
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md gap-2">
        <div>
          <SearchInput />
        </div>
        <div className="h-full flex-1 overflow-y-auto ">
          <CustomTable<ServerCategoryProps>
            columns={columns}
            data={serviceCategoriesData}
            initialPageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageJobCategory;
