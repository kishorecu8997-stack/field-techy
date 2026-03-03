import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import Popup from "@/shared/components/Popup";
import React, { useMemo, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { useAdminGetEngineerHistory } from "@/shared/apiServices/admin/adminOpenApiService";
import type { DisputeProps } from "./types";

/**
 * DisputeReports Component
 * Displays a table of dispute reports for a specific engineer.
 * Allows admins to view attached files in a popup and download them.
 * Fetches data using the engineer's ID from the URL parameters.
 * Handles pagination and loading/error states gracefully.
 */

const DisputeReports: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<{
    url: string;
    filename: string;
  } | null>(null);

  const isPreviewOpen = !!selectedFile;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const params = useParams();
  const userId = Number(params.id);
  const hasValidUserId = Number.isFinite(userId) && userId > 0;

  const {
    data: engineerHistory,
    isLoading,
    error,
  } = useAdminGetEngineerHistory(
    hasValidUserId ? userId : 0,
    {
      page,
      limit,
      type: "reports",
    },
    { enabled: hasValidUserId },
  );

  const disputes: DisputeProps[] = useMemo(
    () => (engineerHistory?.data ?? []) as DisputeProps[],
    [engineerHistory?.data],
  );

  // Table columns
  const columns: Column<DisputeProps>[] = [
    { key: "id", label: "Report ID" },
    {
      key: "JobId",
      label: "Job ID",
      renderCell: (row) => <span className="capitalize">{row.jobId}</span>,
    },
    { key: "issueCategory", label: "Issue Category" },
    {
      key: "priorityLevel",
      label: "Priority",
      renderCell: (row) => (
        <span className="capitalize font-semibold">{row.priorityLevel}</span>
      ),
    },
    {
      key: "detailedDescription",
      label: "Description",
      renderCell: (row) => (
        <p className="max-w-xs truncate">{row.detailedDescription}</p>
      ),
    },
    {
      key: "attachFile",
      label: "File",
      align: "center",
      dataCellAlign: "center",
      renderCell: (row) => {
        const hasFile = !!row.attachFile?.url;

        return hasFile ? (
          <Button
            onClick={() =>
              setSelectedFile({
                url: row.attachFile.url,
                filename: row.attachFile.filename,
              })
            }
            className="px-6 py-2 bg-gradient-to-r from-teal-700 to-teal-900 text-white rounded-lg hover:opacity-90"
          >
            View
          </Button>
        ) : (
          <span className="text-gray-400 italic">No File</span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      renderCell: (row) => (
        <div
          className={`px-3 py-1 rounded-full text-sm font-semibold capitalize w-fit ${
            row.status === "resolved"
              ? "bg-green-100 text-green-600"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {row.status}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Reported At",
      renderCell: (row) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3">
      {/* Table */}
      <div className="h-full flex-1 overflow-y-auto">
        <CustomTable<DisputeProps>
          columns={columns}
          data={disputes}
          loading={isLoading}
          error={
            !hasValidUserId
              ? "Missing engineer ID in the URL."
              : error
                ? "Failed to fetch dispute reports."
                : null
          }
          totalCount={engineerHistory?.total ?? 0}
          currentPage={page}
          onPageChange={setPage}
          initialPageSize={limit}
          onPageSizeChange={(size) => {
            setLimit(size);
            setPage(1);
          }}
        />
      </div>

      {/* Backend-Compatible File Viewer */}
      <Popup open={isPreviewOpen} onClose={() => setSelectedFile(null)}>
        {selectedFile && (
          <div className="p-4 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold">{selectedFile.filename}</span>
              <div
                className="text-xl font-semibold cursor-pointer"
                onClick={() => setSelectedFile(null)}
              >
                <IoCloseSharp />
              </div>
            </div>

            {/* File Preview Area */}
            <div className="border border-gray-400 h-80 overflow-hidden flex items-center justify-center bg-white">
              {selectedFile.url.endsWith(".pdf") ? (
                <iframe
                  src={selectedFile.url}
                  title="PDF Preview"
                  className="w-full h-full"
                />
              ) : (
                <img
                  src={selectedFile.url}
                  alt="Attachment"
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>

            {/* Download Button */}
            <div className="mt-4 flex justify-end">
              <a
                href={selectedFile.url}
                download={selectedFile.filename}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Download
              </a>
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default DisputeReports;
