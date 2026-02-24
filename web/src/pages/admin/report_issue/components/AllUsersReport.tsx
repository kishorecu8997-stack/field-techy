import CustomTable, {
  type Column,
} from "@/shared/components/commonUI/custom_table";
import { IoEye } from "react-icons/io5";
import { sampleReportsIssue, type AdminReportIssue } from "../types";
import { FaFile } from "react-icons/fa";
import { usePopupStore } from "@/shared/store/popupStore";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import { useState } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";

/**
 * @component AllUsersReport
 * @description Displays a comprehensive list of all issues reported across the entire system regardless of user type.
 */
export default function AllUsersReport() {
  const [reports, setReports] =
    useState<AdminReportIssue[]>(sampleReportsIssue);
  const { showPopup } = usePopupStore();
  const [search, setSearch] = useState("");
  const [solved, setSolved] = useState(false);
  const filteredData = sampleReportsIssue.filter((e) => {
    const query = search.toLowerCase();

    return (
      e.category.toLowerCase().includes(query) ||
      e.issue.toLowerCase().includes(query) ||
      e.level.toLowerCase().includes(query) ||
      e.name.toLowerCase().includes(query)
    );
  });

  function levelUI(level: string) {
    if (level === "Level-1") {
      return <div className="size-3 bg-amber-300 rounded-full"></div>;
    } else if (level === "Level-2") {
      return <div className="size-3 bg-orange-500 rounded-full"></div>;
    } else if (level === "Level-3") {
      return <div className="size-3 bg-red-500 rounded-full"></div>;
    }
  }

  const columns: Column<AdminReportIssue>[] = [
    { key: "id", label: "Sr.No." },
    {
      key: "name",
      label: "Name",
      renderCell: (row) => (
        <div className="flex items-center gap-2 cursor-pointer group">
          {/* Avatar Circle */}
          <span className="flex justify-center items-center p-2 text-white text-lg bg-emerald-950 dark:bg-emerald-900 size-9 rounded-full transition-colors">
            {row.name.slice(0, 1).toUpperCase()}
          </span>

          {/* Name Text */}
          <div className="flex flex-col dark:text-white text-md group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
            {row.name}
            <span className="text-xs"> {row.user}</span>
          </div>
        </div>
      ),
    },
    { key: "issue", label: "Issue" },
    { key: "category", label: "Issue category" },
    {
      key: "level",
      label: "Priority level",
      renderCell: (row: AdminReportIssue) => (
        <div className=" flex items-center gap-2 cursor-pointer">
          {levelUI(row.level)}
          {row.level}
        </div>
      ),
    },
    { key: "date", label: "Date" },
    {
      key: "status",
      label: "Status",
      renderCell: () => (
        <div className=" flex items-center gap-2 cursor-pointer">Active</div>
      ),
    },
    {
      key: "details",
      label: "Action",
      renderCell: (row: AdminReportIssue) => (
        <div
          className=" flex items-center gap-2 cursor-pointer"
          onClick={() => handleGetReport(row)}
        >
          <IoEye className="text-xl text-green-950 dark:text-neutral-400" />
          {row.solved ? (
            <IoIosCheckmarkCircle className="text-green-700 text-2xl" />
          ) : (
            <IoIosCheckmarkCircle className="text-gray-400 text-2xl" />
          )}
        </div>
      ),
    },
  ];

  const handleGetReport = async (data: AdminReportIssue) => {
    await showPopup({
      title: "Report Details",
      body: (
        <>
          <div className="w-full">
            <hr className="dark:border-gray-800" />
            {/* Container now shifts from black to white/off-white in dark mode */}
            <div className="flex flex-col text-gray-900 dark:text-gray-100 gap-y-4">
              {/* Profile Header */}
              <div className="flex items-center justify-start flex-row gap-3 mt-3">
                <span className="flex justify-center items-center p-2 text-white text-lg bg-emerald-950 dark:bg-emerald-900 size-11 rounded-full">
                  {data.name.slice(0, 1).toUpperCase()}
                </span>
                <span>
                  <h1 className="text-2xl font-semibold">{data.name}</h1>
                  <h1 className="text-md text-gray-500 dark:text-gray-400">
                    {data.user}
                  </h1>
                </span>
              </div>

              {/* Info Sections */}
              <div>
                <h1 className="text-lg font-medium">Email</h1>
                <p className="text-gray-500 dark:text-gray-400 text-md">
                  {data.email}
                </p>
              </div>

              <div>
                <h1 className="text-lg font-medium">Phone Number</h1>
                <p className="text-gray-500 dark:text-gray-400 text-md">
                  {data.phone}
                </p>
              </div>

              <div>
                <h1 className="text-lg font-medium">Priority Level</h1>
                <span className="flex items-center gap-x-2">
                  {levelUI(data.level)}
                  <p className="text-gray-500 dark:text-gray-400 text-md">
                    {data.level}
                  </p>
                </span>
              </div>

              <div>
                <h1 className="text-lg font-medium">Issue Category</h1>
                <p className="text-gray-500 dark:text-gray-400 text-md">
                  {data.category}
                </p>
              </div>

              <div>
                <h1 className="text-lg font-medium">Detailed Description</h1>
                <p className="text-gray-500 dark:text-gray-400 text-md leading-relaxed">
                  {data.issue}
                </p>
              </div>

              {/* File Attachment */}
              <div className="flex flex-col">
                <h1 className="text-lg font-medium">Attached files</h1>
                <span className="flex gap-x-2 items-center p-2 mt-2 border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 w-fit rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <FaFile className="text-3xl text-blue-500 dark:text-blue-400" />
                  <span className="flex flex-col">
                    <h1 className="text-sm font-semibold">{data.file}</h1>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">
                      {data.size}
                    </p>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </>
      ),
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Solved",
          value: null,
          variant: "primary",
          action: async () => {
            solvedConfirmation(data);
          },
        },
      ],
    });
  };

  const solvedConfirmation = async (data: AdminReportIssue) => {
    await showPopup({
      title: "Problem Solved",
      body: "Are you sure the problem solved ?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Submit",
          value: null,
          variant: "primary",
          action: async (close) => {
            setReports((prevReports) =>
              prevReports.map((r) =>
                r.id === data.id ? { ...r, solved: true } : r,
              ),
            );
            setSolved(true);
            close(true);
          },
        },
      ],
    });
  };

  return (
    <div className="px-2 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-gray-700 rounded-md gap-2">
      <div className="flex flex-wrap gap-4 items-center">
        <SearchInput value={search} onChange={setSearch} />
      </div>
      <CustomTable<AdminReportIssue>
        columns={columns}
        data={solved ? reports : filteredData}
        initialPageSize={10}
      />
    </div>
  );
}
