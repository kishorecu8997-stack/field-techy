import {
  useGetReportEngineer,
  type ReportIssue,
} from "@/shared/apiServices/engineer/engineerOpenApiService";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { Button } from "@/shared/components/commonUI/Buttons";
import CustomTable, {
  type Column,
} from "@/shared/components/commonUI/custom_table";
import { usePopupStore } from "@/shared/store/popupStore";
import { getLevelColor } from "@/utils/helpers";
import { formatApiDateTime } from "@/utils/timelineUtils";
import React, { useEffect, useState } from "react";
import { FaFile } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { LuCalendarDays, LuClock } from "react-icons/lu";
import { useParams } from "react-router-dom";

type StatusType = "pending" | "resolved";

/**
 * ReportDetailsEngineer
 * Engineer-facing view: focus on creating/updating/submitting reports
 */
const ReportDetails: React.FC = () => {
  const { jobId } = useParams();
  const { showPopup, closePopup } = usePopupStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState<StatusType>("pending");

  const {
    data: engineerReports,
    refetch,
    isLoading,
  } = useGetReportEngineer({
    limit: pageSize,
    page: currentPage,
    status: status,
    jobId: Number(jobId),
  });

  useEffect(() => {
    refetch();
  }, [engineerReports]);

  const engineerReportsData = engineerReports?.data;

  const columns: Column<ReportIssue>[] = [
    {
      key: "reporterRole",
      label: "Role",
      renderCell: (row) => (
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="dark:text-white text-md group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
            {row.reporterRole}
          </div>
        </div>
      ),
    },
    { key: "detailedDescription", label: "Issue" },
    { key: "issueCategory", label: "Issue category" },
    {
      key: "priorityLevel",
      label: "Priority level",
      renderCell: (row) => (
        <div className="flex items-center gap-2 cursor-pointer">
          <div
            className={`size-3 rounded-full ${getLevelColor(row.priorityLevel)}`}
          ></div>
          {row.priorityLevel}
        </div>
      ),
    },
    {
      key: "details",
      label: "Action",
      renderCell: (row: ReportIssue) => (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleGetReport(row)}
        >
          <IoEye className="text-lg text-green-950 dark:text-neutral-400" />
          <div className="dark:text-white  text-md">View Report</div>
        </div>
      ),
    },
  ];

  const handleGetReport = async (data: ReportIssue) => {
    const ticketInfo = formatApiDateTime(data.createdAt) ?? {
      date: "---",
      time: "---",
    };
    const adminInfo = formatApiDateTime(data.adminViewedAt) ?? {
      date: "---",
      time: "---",
    };

    const resolvedInfo = formatApiDateTime(data.resolvedAt) ?? {
      date: "---",
      time: "---",
    };

    const steps = [
      {
        label: "Ticket Raising",
        date: ticketInfo.date,
        time: ticketInfo.time,
        color: data.createdAt ? "border-red-600" : "border-gray-300",
        isActive: !!data.createdAt,
      },
      {
        label: "Admin Received",
        date: adminInfo.date,
        time: adminInfo.time,
        color: data.adminViewedAt ? "border-amber-400" : "border-gray-300",
        isActive: !!data.adminViewedAt,
      },
      {
        label: "Resolved",
        date: resolvedInfo.date,
        time: resolvedInfo.time,
        color:
          data.status === "resolved" ? "border-emerald-600" : "border-gray-300",
        isActive: !!data.resolvedAt,
      },
    ];

    await showPopup({
      title: "Report Details",
      body: (
        <>
          <div className="w-full">
            <hr className="dark:border-gray-400" />
            {/* Container now shifts from black to white/off-white in dark mode */}
            <div className="flex flex-col text-gray-900 dark:text-gray-100 gap-y-4">
              <div>
                <h1 className="text-lg font-medium">Priority Level</h1>
                <span className="flex items-center gap-x-2">
                  <div
                    className={`size-3 rounded-full ${getLevelColor(data.priorityLevel)}`}
                  ></div>
                  <p className="text-gray-500 dark:text-gray-400 text-md">
                    {data.priorityLevel}
                  </p>
                </span>
              </div>

              <div>
                <h1 className="text-lg font-medium">Issue Category</h1>
                <p className="text-gray-500 dark:text-gray-400 text-md">
                  {data.issueCategory}
                </p>
              </div>

              <div>
                <h1 className="text-lg font-medium">Detailed Description</h1>
                <p className="text-gray-500 dark:text-gray-400 text-md leading-relaxed">
                  {data.detailedDescription}
                </p>
              </div>

              {data.attachment && (
                <div className="flex flex-col">
                  <h1 className="text-lg font-medium">Attached files</h1>
                  <span className="flex gap-x-2 items-center p-2 mt-2 border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 w-fit rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <FaFile className="text-3xl text-blue-500 dark:text-blue-400" />
                    <span className="flex flex-col">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={data.attachment?.url ?? undefined}
                      >
                        <h1 className="text-sm font-semibold">
                          {data.attachment?.filename}
                        </h1>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">
                          {data.attachment?.size}
                        </p>
                      </a>
                    </span>
                  </span>
                </div>
              )}

              <div className="w-full px-4 mt-10 py-12">
                <div className="relative flex items-center justify-around w-full">
                  <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 flex">
                    <div
                      className={`h-full w-1/2 transition-colors ${data.adminViewedAt ? "bg-orange-200" : "bg-gray-200"}`}
                    ></div>
                    <div
                      className={`h-full w-1/2 transition-colors ${data.status === "resolved" ? "bg-teal-200" : "bg-gray-100"}`}
                    ></div>
                  </div>

                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className="relative z-10 flex flex-col items-center"
                    >
                      <div className="absolute -top-10 left-2 whitespace-nowrap -rotate-45 origin-bottom-left">
                        {step.isActive && (
                          <span className="text-xs font-bold">
                            {step.label}
                          </span>
                        )}
                      </div>

                      <div
                        className={`size-4 bg-white dark:bg-gray-900 border-2 rounded-full transition-all ${step.color}`}
                      ></div>

                      <div className="absolute top-6 flex flex-col items-start gap-1 min-w-[100px]">
                        <div
                          className={`flex items-center gap-1 text-[10px] ${step.isActive ? "text-gray-600" : "text-gray-400"}`}
                        >
                          <LuCalendarDays className="size-3" />
                          <span>{step.date}</span>
                        </div>
                        <div
                          className={`flex items-center gap-1 text-[10px] ${step.isActive ? "text-gray-500" : "text-gray-400"}`}
                        >
                          <LuClock className="size-3" />
                          <span>{step.time}</span>
                        </div>
                      </div>
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
      <div className="sticky top-20 z-20">
        <MyJobsHeader
          title="Engineer Report Updates"
          isReport={false}
          isShowSort={false}
          isShowBreadcrumb
        />
      </div>

      <div className="flex mb-2 py-3 px-2 justify-end w-full md:w-auto">
        <div className="inline-flex p-1 bg-gray-100 dark:bg-[#101828] rounded-xl border border-[#009689] dark:border-[#101828]">
          {(["pending", "resolved"] as StatusType[]).map((type) => (
            <button
              key={type}
              onClick={() => {
                setStatus(type);
                setCurrentPage(1);
              }}
              className={`
            min-w-[100px] px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300 capitalize
            ${
              status === type
                ? "bg-white dark:bg-emerald-600 text-emerald-600 dark:text-white shadow-md"
                : "text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            }
          `}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <CustomTable<ReportIssue>
        columns={columns}
        data={engineerReportsData}
        initialPageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        totalCount={engineerReports?.total ?? 0}
        loading={isLoading}
      />
    </>
  );
};

export default ReportDetails;
