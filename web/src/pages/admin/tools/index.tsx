import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React, { useMemo, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

export interface ServerToolProps {
  id: string;
  toolImg: string;
  toolName: string;
  createdDate: string;
  status: boolean;
}

/**
 * ManageTools Component
 *
 * Renders a table view to manage all tools with the following features:
 * - Displays tool name, created date, and current status.
 * - Allows toggling the active/inactive status inline.
 * - Provides action buttons for viewing, editing, or deleting tools.
 * - Includes a search bar for quick filtering.
 *
 * @component
 * @example
 * return (
 *   <ManageTools />
 * );
 *
 * @returns {JSX.Element} The rendered ManageTools component.
 */
const ManageTools: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Placeholder for API data - will be connected when API is available
  const tableData = useMemo<ServerToolProps[]>(
    () => [
      // Empty for now - will be populated from API
    ],
    [search, page],
  );

  const totalCount = 0;

  const columns: Column<ServerToolProps>[] = [
    {
      key: "id",
      label: "Sr.No.",
      renderCell: (_row: ServerToolProps, index: number) => (
        <div className="whitespace-nowrap">{index + 1}</div>
      ),
    },
    { key: "toolName", label: "Tool Name" },
    {
      key: "action",
      label: "Actions",
      renderCell: (row: ServerToolProps) => (
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-md cursor-pointer">
            <CiEdit
              className="text-blue-600"
              onClick={() =>
                navigate(
                  `${absoluteUrls.admin.home.manage_tools_edit}/${row.id}`,
                  {
                    state: {
                      tool: {
                        id: Number(row.id),
                        name: row.toolName,
                      },
                    },
                  },
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
        <h1 className="font-semibold">Manage Tools</h1>
        <Button
          type="submit"
          className="w-fit bg-gradient-to-r bg-teal-900 text-white py-1 rounded-md hover:opacity-90 transition"
          onClick={() =>
            navigate(`${absoluteUrls.admin.home.manage_tools_add}`)
          }
        >
          Add Tool
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
          <CustomTable<ServerToolProps>
            columns={columns}
            data={tableData}
            initialPageSize={pageSize}
            loading={false}
            error={null}
            totalCount={totalCount}
            currentPage={page}
            pageSize={pageSize}
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

export default ManageTools;
