import CustomTable, {
  type Column,
} from "@/shared/components/commonUI/custom_table";
import { IoEye } from "react-icons/io5";
import { FaFile } from "react-icons/fa";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { usePopupStore } from "@/shared/store/popupStore";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import { useState } from "react";
import { getLevelColor } from "@/utils/helpers";
import { formatApiDate } from "@/utils/timelineUtils";
import { useAdminResolveReport } from "@/shared/apiServices/admin/adminOpenApiService";
import { toast } from "react-toastify";
import type { AdminGetReportsResponses } from "@/api";
import type { FilterDataProps } from "@/shared/components/AdminFilter";

type AdminReportIssue = AdminGetReportsResponses[200]["data"][number];
type ReporterRole = AdminReportIssue["reporterRole"] | "all" | "completed";

interface ReportTableProps {
  data: AdminReportIssue[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  refetch: () => void;
  total: number;
  isLoading: boolean;
  role: ReporterRole;
  filterParams: FilterDataProps;
}


/**
 * @component ReportTable
 * @description A reusable table component for displaying admin report issues.
 * Used across all four tabs (All Users, Client, Engineer, Completed) in the
 * AdminReportIssue page, differentiated by the `role` and `data` props.
 *
 * Features:
 * - Client-side search across category, description, priority, and role fields
 * - Client-side filtering by priority level and date from `filterParams`
 * - Client-side sorting by date or priority from `filterParams`
 * - Row action to view full report details in a popup
 * - "Solved" action inside the popup triggers `resolveReport` mutation and refetches data
 * - Server-side pagination via `currentPage`, `pageSize`, and `total` props
 *
 * @param {ReportTableProps} props - Component props
 * @returns {JSX.Element} A searchable, filterable, paginated table of report issues.
 *
 * @example
 * <ReportTable
 *   role="client"
 *   data={clientData?.data ?? []}
 *   total={clientData?.total ?? 0}
 *   isLoading={clientLoading}
 *   currentPage={clientPage}
 *   setCurrentPage={setClientPage}
 *   pageSize={pageSize}
 *   setPageSize={setPageSize}
 *   refetch={refetchClient}
 *   filterParams={filterParams}
 * />
 */
export default function ReportTable({
  refetch,
  data,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  total,
  isLoading,
  role,
  filterParams,
}: ReportTableProps) {
  const { showPopup } = usePopupStore();
  const { mutateAsync: resolveReport } = useAdminResolveReport();
  const [search, setSearch] = useState("");

  const filteredData = data
    .filter((e) => {
      const query = search.toLowerCase();
      const matchesSearch =
        e.issueCategory.toLowerCase().includes(query) ||
        e.detailedDescription.toLowerCase().includes(query) ||
        e.priorityLevel.toLowerCase().includes(query) ||
        e.reporterRole.toLowerCase().includes(query);

      const matchesRole =
        role === "all"
          ? true
          : role === "completed"
            ? e.status === "resolved"
            : e.reporterRole === role;

      // filter by priority levels if any selected
      const matchesPriority =
        filterParams.filters.length > 0
          ? filterParams.filters.includes(e.priorityLevel)
          : true;

      // filter by date if selected
      const matchesDate = filterParams.date
        ? e.createdAt?.startsWith(filterParams.date)
        : true;

      return matchesSearch && matchesPriority && matchesDate && matchesRole;
    })
    .sort((a, b) => {
      // sort by date if sortBy is "Date & Time"
      if (filterParams.sortBy === "Date & Time") {
        return (
          new Date(b.createdAt ?? "").getTime() -
          new Date(a.createdAt ?? "").getTime()
        );
      }
      // sort by priority if sortBy is "Priority"
      if (filterParams.sortBy === "Priority") {
        const order = { critical: 0, high: 1, medium: 2, low: 3 };
        return (order[a.priorityLevel] ?? 4) - (order[b.priorityLevel] ?? 4);
      }
      return 0;
    });

  const columns: Column<AdminReportIssue>[] = [
    {
      key: "id",
      label: "Sr.No.",
      renderCell: (_, index) => (currentPage - 1) * pageSize + index + 1,
    },
    { key: "reporterRole", label: "Role" },
    { key: "detailedDescription", label: "Issue" },
    { key: "issueCategory", label: "Issue category" },
    {
      key: "priorityLevel",
      label: "Priority level",
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          <div
            className={`size-3 rounded-full ${getLevelColor(row.priorityLevel)}`}
          />
          {row.priorityLevel}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      renderCell: (row) => <div>{formatApiDate(row.createdAt)}</div>,
    },
    {
      key: "status",
      label: "Status",
      renderCell: (row) => <div>{row.status}</div>,
    },
    {
      key: "details",
      label: "Action",
      renderCell: (row) => (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleGetReport(row)}
        >
          <IoEye className="text-xl text-green-950 dark:text-neutral-400" />
          <IoIosCheckmarkCircle
            className={`text-2xl ${row.status === "resolved" ? "text-green-700" : "text-gray-400"}`}
          />
        </div>
      ),
    },
  ];

  const handleGetReport = async (row: AdminReportIssue) => {
    await showPopup({
      title: "Report Details",
      body: (
        <div className="w-full">
          <hr className="dark:border-gray-800" />
          <div className="flex flex-col text-gray-900 dark:text-gray-100 gap-y-4">
            <div>
              <h1 className="text-lg font-medium">Priority Level</h1>
              <span className="flex items-center gap-x-2">
                <div
                  className={`size-3 rounded-full ${getLevelColor(row.priorityLevel)}`}
                />
                <p className="text-gray-500 dark:text-gray-400">
                  {row.priorityLevel}
                </p>
              </span>
            </div>
            <div>
              <h1 className="text-lg font-medium">Issue Category</h1>
              <p className="text-gray-500 dark:text-gray-400">
                {row.issueCategory}
              </p>
            </div>
            <div>
              <h1 className="text-lg font-medium">Detailed Description</h1>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                {row.detailedDescription}
              </p>
            </div>

            {row.attachment && (
              <div className="flex flex-col">
                <h1 className="text-lg font-medium">Attached files</h1>
                <span className="flex gap-x-2 items-center p-2 mt-2 border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 w-fit rounded-md cursor-pointer">
                  <FaFile className="text-3xl text-blue-500" />
                  <span className="flex flex-col">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={row.attachment?.url ?? undefined}
                    >
                      <h1 className="text-sm font-semibold">
                        {row.attachment?.filename}
                      </h1>
                      <p className="text-[10px] text-gray-500 uppercase">
                        {row.attachment?.size}
                      </p>
                    </a>
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>
      ),
      actionButtons: [
        { label: "Cancel", value: null, variant: "outline" },
        {
          label: "Solved",
          value: null,
          variant: "primary",
          action: async () => {
            solvedConfirmation(row);
          },
        },
      ],
    });
  };

  const solvedConfirmation = async (row: AdminReportIssue) => {
    await showPopup({
      title: "Problem Solved",
      body: "Are you sure you want to mark this problem as solved?",
      actionButtons: [
        { label: "Cancel", value: null, variant: "outline" },
        {
          label: "Submit",
          value: null,
          variant: "primary",
          action: async (close) => {
            try {
              await resolveReport({
                body: { reportId: row.id, resolve: true },
              });
              refetch();
              toast.success("Report resolved successfully!");
              close(true);
            } catch {
              toast.error("Failed to resolve report!");
            }
          },
        },
      ],
    });
  };

  return (
    <div className="px-2 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-gray-700 rounded-md gap-2">
      <SearchInput value={search} onChange={setSearch} />
      <CustomTable<AdminReportIssue>
        columns={columns}
        data={filteredData}
        initialPageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        totalCount={total}
        loading={isLoading}
      />
    </div>
  );
}
