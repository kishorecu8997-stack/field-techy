import React, { useState } from "react";
import {
  CustomTable,
  type Column,
} from "@/shared/components/commonUI/custom_table";
import { FiEye } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import type { DeclinedJobsProps } from "../../../types";
import SelectMenu from "@/shared/components/SelectMenu";
import { postedJobsData } from "@/dummy_data/ClientViewData";
import GeneralChart from "@/shared/components/AdminChart";
import { days } from "@/dummy_data/adminDashboard";
import CustomTooltip from "@/shared/components/ChartCustomTooltip";
import { chartData } from "@/dummy_data/chart";
import { useNavigate } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";
import { usePopupStore } from "@/shared/store/popupStore";
import useToggleStatus from "@/shared/components/ToggleStatus";

/**
 * DeclinedJobs component displays a table of declined jobs and a chart visualizing related data.
 * It provides functionalities for searching, viewing, editing, and deleting jobs.
 *
 * @returns {React.FC} The DeclinedJobs component.
 */
const DeclinedJobs: React.FC = () => {
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();

  const initialStatus = React.useMemo(() => {
    const initial: Record<string, boolean> = {};
    postedJobsData.forEach((job) => {
      initial[job.jObID] = Boolean(job.status);
    });
    return initial;
  }, []);
  const { get, toggle } = useToggleStatus(initialStatus);

  //Delete confirmation
  const handleDeleteJob = async (job: DeclinedJobsProps) => {
    await showPopup({
      title: "Delete Job",
      body: "Are you sure you want to delete this job?",
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          action: async (close: any) => {
            console.log("Deleting job:", job.jObID);
            // TODO: call your delete API here
            // await deleteJob(job.jObID);
            close(true);
          },
        },
      ],
    });
  };

  const columns: Column<DeclinedJobsProps>[] = [
    { key: "jObID", label: "Job ID" },
    { key: "postedBy", label: "Posted By" },
    { key: "jObTitle", label: "Job Title" },
    { key: "jobDescription", label: "Job Description" },
    { key: "jobType", label: "Job Type" },
    { key: "country", label: "Country" },
    { key: "state", label: "State" },
    { key: "city", label: "City" },
    { key: "startDateTime", label: "Start Date/Time" },
    { key: "createdDate", label: "Created Date" },
    {
      key: "status",
      label: "Status",
      renderCell: (row: DeclinedJobsProps) => {
        const val = get(row.jObID) ?? row.status;

        return (
          <div
            className={`flex items-center justify-center w-fit px-4 py-1 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${
              val ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
            onClick={() => toggle(row.jObID)}
          >
            {val ? "On" : "Off"}
          </div>
        );
      },
    },

    {
      key: "action",
      label: "Actions",
      renderCell: (row: DeclinedJobsProps) => (
        <div className="flex items-center gap-2">
          <div
            onClick={() =>
              navigate(`${absoluteUrls.admin.home.manage_categories}`)
            }
            className="p-2 bg-yellow-100 rounded-md cursor-pointer"
          >
            <FiEye className="text-yellow-600 " />
          </div>
          <div
            onClick={() =>
              navigate(`${absoluteUrls.admin.home.manage_categories}`)
            }
            className="p-2 bg-blue-100 rounded-md cursor-pointer"
          >
            <CiEdit className="text-blue-600" />
          </div>
          <div
            onClick={() => handleDeleteJob(row)}
            className="p-2 bg-red-100 rounded-md cursor-pointer"
          >
            <RiDeleteBin6Line className="text-red-600" />
          </div>
        </div>
      ),
    },
  ];

  /**
   * State to hold the selected day for filtering the chart data.
   * @type {(string | null)}
   */
  const [selectedDay, setSelectedDay] = useState<string | null>();

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3 ">
      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md gap-2">
        <div>
          <SearchInput />
        </div>
        <div className="h-full flex-1 overflow-y-auto ">
          <CustomTable<DeclinedJobsProps>
            columns={columns}
            data={postedJobsData}
            initialPageSize={10}
          />
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Total Jobs Completed
              </h3>
              <SelectMenu
                placeholder="Select Filter"
                className="w-32"
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
                  fill: "#6b7280",
                },
              ]}
              customTooltip={CustomTooltip}
              height={400}
              showLegend={false}
              legend={{
                verticalAlign: "top",
                align: "center",
                wrapperStyle: { paddingTop: "5px", paddingBottom: "5px" },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeclinedJobs;
