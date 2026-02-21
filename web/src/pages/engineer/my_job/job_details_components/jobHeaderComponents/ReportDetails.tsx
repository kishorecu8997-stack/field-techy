import {
  sampleReportsIssue,
  type ReportIssue,
} from "@/dummy_data/reportDetailsData";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { Button } from "@/shared/components/commonUI/Buttons";
import CustomTable, {
  type Column,
} from "@/shared/components/commonUI/custom_table";
import { usePopupStore } from "@/shared/store/popupStore";
import React from "react";
import { FaFile } from "react-icons/fa";
import { IoEye } from "react-icons/io5";

/**
 * BreakDetails
 *
 * Displays the break management section including:
 * - BreakStatusTable: Shows the list and status of breaks
 * - BreakCalendar: Shows breaks in a monthly calendar view
 *
 * Layout:
 * - Two-column responsive grid on large screens
 * - Single-column layout on smaller screens
 */
const ReportDetails: React.FC = () => {
  const { showPopup, closePopup } = usePopupStore();

  const columns: Column<ReportIssue>[] = [
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
          <div className=" dark:text-white text-md group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
            {row.name}
          </div>
        </div>
      ),
    },
    { key: "issue", label: "Issue" },
    { key: "category", label: "Issue category" },
    {
      key: "level",
      label: "Priority level",
      renderCell: (row: ReportIssue) => (
        <div className=" flex items-center gap-2 cursor-pointer">
          {levelUI(row.level)}
          {row.level}
        </div>
      ),
    },
    {
      key: "details",
      label: "Action",
      renderCell: (row: ReportIssue) => (
        <div
          className=" flex items-center gap-2 cursor-pointer"
          onClick={() => handleGetReport(row)}
        >
          <IoEye className="text-lg text-green-950 dark:text-neutral-400" />
          <div className=" dark:text-white  text-md">View Report</div>
        </div>
      ),
    },
  ];

  function levelUI(level: string) {
    if (level === "Level-1") {
      return <div className="size-3 bg-amber-300 rounded-full"></div>;
    } else if (level === "Level-2") {
      return <div className="size-3 bg-orange-500 rounded-full"></div>;
    } else if (level === "Level-3") {
      return <div className="size-3 bg-red-500 rounded-full"></div>;
    }
  }

  const handleGetReport = async (data: ReportIssue) => {
    await showPopup({
      title: "Report Details",
      body: (
        <>
          <div className="w-full">
            <hr className="dark:border-gray-400" />
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
                    Designer
                  </h1>
                </span>
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
                    <h1 className="text-sm font-semibold">
                      Button Description
                    </h1>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">
                      XLSX 4.49KB
                    </p>
                  </span>
                </span>
              </div>

              {/* Stepper / Progress Bar */}
              <div className="w-full px-8 py-6">
                <div className="relative flex items-center justify-between w-full">
                  {/* Background Line */}
                  <div className="absolute left-0 top-2/4 h-0.5 w-full -translate-y-2/4 bg-gray-300 dark:bg-gray-700"></div>
                  {/* Active Line (Adjust width based on progress) */}
                  <div className="absolute left-0 top-2/4 h-0.5 w-1/3 -translate-y-2/4 bg-gray-900 dark:bg-emerald-500 transition-all duration-500"></div>

                  {/* Step 1 (Active) */}
                  <div className="relative z-10 grid w-10 h-10 font-bold text-white transition-all duration-300 bg-gray-900 dark:bg-emerald-600 rounded-full place-items-center">
                    1
                  </div>

                  {/* Inactive Steps */}
                  {[2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className="relative z-10 grid w-10 h-10 font-bold text-gray-900 dark:text-gray-400 transition-all duration-300 bg-gray-300 dark:bg-gray-800 rounded-full place-items-center border border-transparent dark:border-gray-700"
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end mt-2" onClick={closePopup}>
                <Button variant="secondary">Cancel</Button>
              </div>
            </div>
          </div>
        </>
      ),
      actionButtons: [],
    });
  };

  return (
    <>
      <MyJobsHeader
        title="Engineer Report Update"
        isReport={false}
        isShowSort={false}
        isShowBreadcrumb
      />

      <CustomTable<ReportIssue>
        columns={columns}
        data={sampleReportsIssue}
        initialPageSize={10}
      />
    </>
  );
};

export default ReportDetails;
