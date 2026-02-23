import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React, { useMemo, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import {
  useAdminDeleteServiceCategory,
  useAdminGetServiceCategories,
} from "@/shared/apiServices/admin/adminOpenApiService";
import { usePopupStore } from "@/shared/store/popupStore";
import { toast } from "react-toastify";

const HandleStatus = ({ status: value }: { status: boolean }) => {
  const [status, setStatus] = useState<boolean>(value);
  return (
    <div
      className={`flex items-center justify-center w-fit px-4 py-1 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${
        status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
      onClick={() => setStatus(!status)}
    >
      {status ? "On" : "Off"}
    </div>
  );
};

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
  const { showPopup } = usePopupStore();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: categoriesResponse,
    isLoading,
    isFetching,
    error,
  } = useAdminGetServiceCategories({
      page,
      limit: pageSize,
      search: search.trim() || undefined,
    });

  const {
    mutateAsync: deleteServiceCategory,
    isPending: isDeletingCategory,
  } = useAdminDeleteServiceCategory({
    onSuccess: () => {
      toast.success("Service category deleted successfully!");
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Delete category failed";
      toast.error(errorMessage);
    },
  });

  const handleDeleteCategory = async (row: ServerCategoryProps) => {
    await showPopup({
      title: "Delete Category",
      body: "Are you sure you want to delete this category?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Delete",
          value: "delete",
          variant: "danger",
          action: async (close) => {
            if (isDeletingCategory) return;
            await deleteServiceCategory({
              path: { id: Number(row.id) },
            });
            close(true);
          },
        },
      ],
    });
  };

  const tableData = useMemo<ServerCategoryProps[]>(
    () =>
      (categoriesResponse?.data ?? []).map((item) => ({
        id: String(item.id),
        categoryName: item.name,
        categoryImg: "",
        createdDate: "-",
        status: true,
      })),
    [categoriesResponse],
  );

  const totalCount = categoriesResponse?.total ?? 0;
  const errorMessage =
    error instanceof Error ? error.message : error ? "Failed to load data." : null;

  const columns: Column<ServerCategoryProps>[] = [
    { key: "id", label: "Sr.No." },
    { key: "categoryName", label: "Category" },
    { key: "createdDate", label: "Created Date" },
    {
      key: "status",
      label: "Status",
      renderCell: (row: ServerCategoryProps) => (
        <HandleStatus status={row.status} />
      ),
    },

    {
      key: "action",
      label: "Actions",
      renderCell: (row: ServerCategoryProps) => (
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-md cursor-pointer">
            <CiEdit
              className="text-blue-600"
              onClick={() =>
                navigate(
                  `${absoluteUrls.admin.home.manage_categories_edit}/${row.id}`,
                  {
                    state: {
                      category: {
                        id: Number(row.id),
                        name: row.categoryName,
                      },
                    },
                  },
                )
              }
            />
          </div>
          <div className="p-2 bg-red-100 rounded-md cursor-pointer">
            <RiDeleteBin6Line
              className="text-red-600"
              onClick={() => handleDeleteCategory(row)}
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
          <SearchInput
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
          />
        </div>
        <div className="h-full flex-1 overflow-y-auto ">
          <CustomTable<ServerCategoryProps>
            columns={columns}
            data={tableData}
            initialPageSize={pageSize}
            loading={isLoading || isFetching}
            error={errorMessage}
            totalCount={totalCount}
            currentPage={page}
            onPageChange={(p) => setPage(p)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageJobCategory;
