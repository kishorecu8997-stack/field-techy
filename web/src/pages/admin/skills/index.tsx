import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React, { useMemo, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useAdminGetSkills } from "@/shared/apiServices/admin/adminOpenApiService";

export interface ServerSkillProps {
  id: string;
  skillImg: string;
  skillName: string;
  createdDate: string;
  status: boolean;
}

/**
 * ManageSkills Component
 *
 * Renders a table view to manage all skills with the following features:
 * - Displays skill name, created date, and current status.
 * - Allows toggling the active/inactive status inline.
 * - Provides action buttons for viewing, editing, or deleting skills.
 * - Includes a search bar for quick filtering.
 *
 * @component
 * @example
 * return (
 *   <ManageSkills />
 * );
 *
 * @returns {JSX.Element} The rendered ManageSkills component.
 */
const ManageSkills: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: skillsResponse,
    isLoading,
    isFetching,
    error,
  } = useAdminGetSkills(
    {
      page,
      limit: pageSize,
      search: search.trim() || undefined,
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    },
  );

  const tableData = useMemo<ServerSkillProps[]>(
    () =>
      (skillsResponse?.data ?? []).map((item) => ({
        id: String(item.id),
        skillName: item.name,
        skillImg: "",
        createdDate: "-",
        status: true,
      })),
    [skillsResponse],
  );

  const totalCount = skillsResponse?.total ?? 0;
  const errorMessage =
    error instanceof Error
      ? error.message
      : error
        ? "Failed to load data."
        : null;

  const columns: Column<ServerSkillProps>[] = [
    {
      key: "id",
      label: "Sr.No.",
      renderCell: (_row: ServerSkillProps, index: number) => (
        <div className="whitespace-nowrap">
          {(page - 1) * pageSize + index + 1}
        </div>
      ),
    },
    { key: "skillName", label: "Skill Name" },
    {
      key: "action",
      label: "Actions",
      renderCell: (row: ServerSkillProps) => (
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-md cursor-pointer">
            <CiEdit
              className="text-blue-600"
              onClick={() =>
                navigate(
                  `${absoluteUrls.admin.home.manage_skills_edit}/${row.id}`,
                  {
                    state: {
                      skill: {
                        id: Number(row.id),
                        name: row.skillName,
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
        <h1 className="font-semibold">Manage Skills</h1>
        <Button
          type="submit"
          className="w-fit bg-gradient-to-r bg-teal-900 text-white py-1 rounded-md hover:opacity-90 transition"
          onClick={() =>
            navigate(`${absoluteUrls.admin.home.manage_skills_add}`)
          }
        >
          Add Skill
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
          <CustomTable<ServerSkillProps>
            columns={columns}
            data={tableData}
            initialPageSize={pageSize}
            loading={isLoading || isFetching}
            error={errorMessage}
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

export default ManageSkills;
