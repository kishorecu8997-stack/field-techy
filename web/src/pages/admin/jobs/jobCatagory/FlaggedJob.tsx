import {
  manageFlaggedJobs,
  type ManageFlaggedJobProps,
} from "@/dummy_data/admin/manageJobs";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import React from "react";
import { FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

/**
 * Renders the "Flagged Jobs" tab content.
 *
 * This component displays a table of jobs that have been flagged for review,
 * using dummy data. It includes a search input for filtering and provides
 * action buttons for viewing job details and deleting a job for each entry.
 *
 * @returns {JSX.Element} The rendered "Flagged Jobs" view with a search input and a data table.
 */
const FlaggedJob: React.FC = () => {
  const columns: Column<ManageFlaggedJobProps>[] = [
    { key: "id", label: "Job ID" },
    {
      key: "postedBy",
      label: "Posted By",
      renderCell: (row: ManageFlaggedJobProps) => (
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
    { key: "jobDescription", label: "Job Description" },
    { key: "issueCategory", label: "Issue Category" },
    { key: "issueDescription", label: "Issue Description" },
    { key: "Priority", label: "Priority" },
    {
      key: "createdDate",
      label: "Created Date	",
      renderCell: (row: ManageFlaggedJobProps) => (
        <p className="text-sm max-w-xs truncate">{row.createdDate}</p>
      ),
    },
    {
      key: "action",
      label: "Action",
      renderCell: () => (
        <div className="flex items-center gap-2">
          <div className="p-2 bg-yellow-100 rounded-md cursor-pointer">
            <FiEye className="text-yellow-600" />
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
      <div className="flex gap-4 items-center">
        <SearchInput />
      </div>
      <div className="h-full flex-1 overflow-y-auto my-4">
        <CustomTable<ManageFlaggedJobProps>
          columns={columns}
          data={manageFlaggedJobs}
          initialPageSize={10}
        />
      </div>
    </div>
  );
};

export default FlaggedJob;
