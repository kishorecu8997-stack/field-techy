import { absoluteUrls } from "@/config/urls";
import {
  chartData,
  days,
  jobs,
  TOGGLE_STATUS,
  type JobProps,
} from "@/dummy_data/admin/manageEngineer";
import GeneralChart from "@/shared/components/AdminChart";
import CustomTooltip from "@/shared/components/ChartCustomTooltip";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import SelectMenu from "@/shared/components/SelectMenu";
import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
/**
 * AppliedJob
 *
 * Displays a searchable table of jobs applied by or assigned to an engineer,
 * alongside a small analytics chart showing jobs completed over a selectable
 * time window.
 *
 * Features:
 * - Search input to filter table rows
 * - Custom table with columns for job metadata and actions
 * - Per-row status toggling (On/Off) managed in local state
 * - Chart summary using `GeneralChart` with a configurable series and tooltip
 *
 * Notes:
 * - This component uses local dummy data from `@/dummy_data/admin/manageEngineer`.
 * - No props are accepted; state and data are internal. In future it can be
 *   adapted to accept `data` and handlers via props for reusability.
 *
 * @component
 * @returns {JSX.Element} The applied jobs table and chart section
 */
const AppliedJob: React.FC = () => {
  const [statuses, setStatuses] = useState<Record<number, "On" | "Off">>({});
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const navigate = useNavigate();

  const getStatus = (row: JobProps) => {
    return statuses[row.id] ?? row.status;
  };

  const toggleStatus = (id: number, current: "On" | "Off") => {
    const newStatus = current === "On" ? "Off" : "On";
    setStatuses((prev) => ({ ...prev, [id]: newStatus }));
  };

  const columns: Column<JobProps>[] = [
    { key: "id", label: "Job ID" },
    {
      key: "postedBy",
      label: "Posted By",
      renderCell: (row: JobProps) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium text-gray-600">
              {row?.postedBy?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-semibold text-sm">{row?.postedBy?.name}</p>
            <p className="text-xs text-gray-500">{row?.postedBy?.email}</p>
          </div>
        </div>
      ),
    },
    { key: "jobTitle", label: "Job Title" },
    {
      key: "jobDescription",
      label: "Job Description",
      renderCell: (row: JobProps) => (
        <p className="text-sm max-w-xs truncate">{row.jobDescription}</p>
      ),
    },
    { key: "jobType", label: "Job Type" },
    { key: "country", label: "Country" },
    { key: "state", label: "State" },
    { key: "city", label: "City" },
    { key: "startDate", label: "Start Date/Time" },
    { key: "createdDate", label: "Created Date" },
    {
      key: "status",
      label: "Status",
      renderCell: (row: JobProps) => {
        const currentStatus = getStatus(row);
        const isOn = currentStatus === TOGGLE_STATUS.on;
        return (
          <div
            onClick={() => toggleStatus(row.id, currentStatus)}
            className={`px-3 py-1 rounded-md text-sm font-medium cursor-pointer ${
              isOn
                ? "bg-white text-gray-700 border border-gray-300"
                : "bg-gray-100 text-gray-700 border border-gray-300"
            }`}
          >
            {currentStatus}
          </div>
        );
      },
    },
    {
      key: "action",
      label: "Action",
      renderCell: () => (
        <div className="flex items-center gap-2">
          <div className="p-2 bg-yellow-100 rounded-md cursor-pointer">
            <FiEye
              className="text-yellow-600"
              onClick={() => navigate(`${absoluteUrls.admin.home.manage_jobs}`)}
            />
          </div>
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
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <div>
        <SearchInput />
      </div>
      <div className="h-full flex-1 overflow-y-auto my-4">
        <CustomTable<JobProps>
          columns={columns}
          data={jobs}
          initialPageSize={10}
        />
      </div>
      <div className="w-1/2">
        <div className="flex justify-between items-center mt-2 md:mb-2 md:flex gap-4">
          <p className="font-bold">Total Jobs Completed</p>
          <SelectMenu
            placeholder="Filter By"
            className="md:w-32"
            options={days}
            value={selectedDay}
            onChange={setSelectedDay}
          />
        </div>
        <GeneralChart
          data={chartData}
          chartType="line"
          xAxisDataKey="name"
          aspectRatio={2}
          series={[
            {
              dataKey: "jobs",
              name: "Jobs",
              fill: "#e5e5e5",
            },
          ]}
          customTooltip={CustomTooltip}
          height={400}
          showLegend={true}
          legend={{
            verticalAlign: "top",
            align: "center",
            wrapperStyle: { paddingTop: "5px", paddingBottom: "5px" },
          }}
        />
      </div>
    </div>
  );
};

export default AppliedJob;
