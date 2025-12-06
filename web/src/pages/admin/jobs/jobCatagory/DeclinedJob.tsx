import { absoluteUrls } from "@/config/urls";
import {
  AllJobsCategory,
  AllJobsFilterBy,
  AllJobType,
  manageJobs,
  Region,
} from "@/dummy_data/admin/manageJobs";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import { InputOutline } from "@/shared/components/InputOutline";
import SelectMenu from "@/shared/components/SelectMenu";
import React, { useState } from "react";
import { FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import type { ManageJobProps } from "../types";
import { usePopupStore } from "@/shared/store/popupStore";

/**
 * Renders the "Declined" jobs tab content.
 *
 * This component displays a table of jobs that have been declined, using dummy data.
 * It includes filtering options for category, region, budget, and job type,
 * as well as a search input. Each job row has action buttons for viewing details
 * and deleting the job.
 *
 * @returns {JSX.Element} The rendered "Declined" jobs view with filters and a data table.
 */
const DeclinedJob: React.FC = () => {
  const [filterBy, setFilterBy] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterRegion, setFilterRegion] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  const navigate = useNavigate();
  const { showPopup } = usePopupStore();

  //Delete confirmation
  const handleDeleteJob = async (job: ManageJobProps) => {
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
            console.log("Deleting job:", job.id);
            // TODO: call your delete API here
            // await deleteJob(job.id);
            close(true);
          },
        },
      ],
    });
  };

  const columns: Column<ManageJobProps>[] = [
    { key: "id", label: "Job ID" },
    {
      key: "postedBy",
      label: "Posted By",
      renderCell: (row: ManageJobProps) => (
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
      renderCell: (row: ManageJobProps) => (
        <p className="text-sm max-w-xs truncate">{row.jobDescription}</p>
      ),
    },
    { key: "category", label: "Category" },
    { key: "jobType", label: "Job Type" },
    { key: "jobPrice", label: "Job Price" },
    {
      key: "country",
      label: "Country",
      renderCell: (row: ManageJobProps) => (
        <p className="text-sm max-w-xs truncate">{row.country}</p>
      ),
    },
    {
      key: "state",
      label: "State",
      renderCell: (row: ManageJobProps) => (
        <p className="text-sm max-w-xs truncate">{row.state}</p>
      ),
    },
    {
      key: "city",
      label: "City",
      renderCell: (row: ManageJobProps) => (
        <p className="text-sm max-w-xs truncate">{row.city}</p>
      ),
    },
    {
      key: "startDate",
      label: "Start Date/Time",
      renderCell: (row: ManageJobProps) => (
        <p className="text-sm max-w-xs truncate">{row.startDate}</p>
      ),
    },
    { key: "createdDate", label: "Created Date" },
    { key: "approvalStatus", label: "Status" },
    {
      key: "action",
      label: "Action",
      renderCell: (row: ManageJobProps) => (
        <div className="flex items-center gap-2">
          <div
            className="p-2 bg-yellow-100 rounded-md cursor-pointer"
            onClick={() => navigate(absoluteUrls.admin.home.manage_jobs_view)}
          >
            <FiEye className="text-yellow-600" />
          </div>
          <div
            className="p-2 bg-red-100 rounded-md cursor-pointer"
            onClick={() => handleDeleteJob(row)}
          >
            <RiDeleteBin6Line className="text-red-600" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <div className="flex flex-wrap gap-4 items-center">
        <SearchInput />
        <SelectMenu
          className="absolute z-20"
          placeholder="Filter by"
          value={filterBy}
          onChange={setFilterBy}
          options={AllJobsFilterBy}
        />
        <SelectMenu
          className="absolute z-20"
          placeholder="Category"
          value={filterCategory}
          onChange={setFilterCategory}
          options={AllJobsCategory}
        />
        <SelectMenu
          className="absolute z-20"
          placeholder="Select Region"
          value={filterRegion}
          onChange={setFilterRegion}
          options={Region}
        />
        <InputOutline placeholder="Budget" name="budget" className="w-40" />
        <SelectMenu
          className="absolute z-20"
          placeholder="Job Type"
          value={filterType}
          onChange={setFilterType}
          options={AllJobType}
        />
      </div>
      <div className="h-full flex-1 overflow-y-auto my-4">
        <CustomTable<ManageJobProps>
          columns={columns}
          data={manageJobs}
          initialPageSize={10}
        />
      </div>
    </div>
  );
};

export default DeclinedJob;
