import { absoluteUrls } from "@/config/urls";
import { serviceCategoriesData } from "@/dummy_data/admin";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React from "react";
import { CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router-dom";


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
  const navigate = useNavigate();

  const columns: Column<ServerCategoryProps>[] = [
    { key: "id", label: "Sr.No." },
    { key: "categoryName", label: "Category" },
    { key: "createdDate", label: "Created Date" },
    {
      key: "action",
      label: "Actions",
      renderCell: (row: ServerCategoryProps) => (
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-md cursor-pointer">
            <CiEdit
              className="text-blue-600"
              onClick={() =>
                navigate(
                  `${absoluteUrls.admin.home.manage_categories_edit}/${row.id}`,
                )
              }
            />
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full h-full flex flex-col p-3 gap-3 ">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold">Manage Service Categories</h1>
        <Button
          type="submit"
          className="w-fit bg-gradient-to-r bg-teal-900 text-white py-1 rounded-md hover:opacity-90 transition"
          onClick={() =>
            navigate(`${absoluteUrls.admin.home.manage_categories_add}`)
          }
        >
          Add Category
        </Button>
      </div>
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-gray-700 rounded-md gap-2">
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
