import { absoluteUrls } from "@/config/urls";
import {
  AllJobStatus,
  AllJobType,
  AllJobsFilterBy,
  Region,
} from "@/dummy_data/admin/manageJobs";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import SelectMenu from "@/shared/components/SelectMenu";
import { usePopupStore } from "@/shared/store/popupStore";
import { useState } from "react";
import { FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import type { AdminGetJobsQuery } from "@/shared/apiServices/admin/adminOpenApiService";
import dayjs from "dayjs";
import { InputOutline } from "@/shared/components/InputOutline";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useAppGetLookupData } from "@/shared/apiServices/admin/adminOpenApiService";
import type { JobByCategoryProps, JobItem } from "./types";

/**
 * Renders the "All Jobs" tab content within the manage jobs page.
 * This component displays a customizable table of all jobs, using dummy data.
 * It includes functionality for searching and filtering jobs by various criteria
 * such as category, region, budget, and job type. It also allows for inline
 * status changes (Approve/Reject) for each job and provides action buttons
 * for viewing details and deleting a job.
 *
 * @returns {JSX.Element} The rendered "All Jobs" view with filters and a data table.
 */
const JobByCategory: React.FC<JobByCategoryProps> = ({
  data,
  filterType,
  setFilterType,
  filterBy,
  setFilterBy,
  filterRegion,
  setFilterRegion,
  serviceCategoryId,
  setServiceCategoryId,
  budget,
  setBudget,
  search,
  setSearch,
  onClearFilters,
  showStatusSelect = false,
  currentStatus,
}) => {
  const { showPopup } = usePopupStore();
  const navigate = useNavigate();
  const [rowStatuses, setRowStatuses] = useState<Record<number, string>>({});

  const { data: categories } = useAppGetLookupData("serviceCategories");

  const categoryOptions =
    categories?.map((cat) => ({
      value: String(cat.id),
      label: cat.name,
    })) || [];

  const handleStatusChange = async (job: JobItem, status: string | null) => {
    if (!status) return;
    await showPopup({
      title: `${status.charAt(0).toUpperCase() + status.slice(1)} Job`,
      body: `Are you sure you want to ${status} this job?`,
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Yes",
          value: "yes",
          variant: status.toLowerCase() === "approve" ? "primary" : "danger",
          action: async (close: (v: boolean) => void) => {
            // TODO: call status update API
            console.log("Updating status for job", job.id, "to", status);
            close(true);
          },
        },
      ],
    });
  };

  const handleDeleteJob = async (job: JobItem) => {
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
          action: async (close: (v: boolean) => void) => {
            console.log("Deleting job:", job.id);
            // TODO: call delete API
            close(true);
          },
        },
      ],
    });
  };

  const columns: Column<JobItem>[] = [
    {
      label: "Sr.No.",
      renderCell: (_row: JobItem, index: number) => index + 1,
    },
    { key: "jobCode", label: "Job ID" },
    {
      key: "postedBy",
      label: "Posted By",
      renderCell: (row: JobItem) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-700 font-bold">
            {row.postedBy.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col overflow-hidden">
            <p
              className="font-semibold text-sm truncate"
              title={row.postedBy.name}
            >
              {row.postedBy.name}
            </p>
            <p
              className="text-xs text-gray-500 truncate"
              title={row.postedBy.email}
            >
              {row.postedBy.email}
            </p>
          </div>
        </div>
      ),
    },
    { key: "jobTitle", label: "Job Title" },
    {
      key: "jobDescription",
      label: "Job Description",
      renderCell: (row: JobItem) => (
        <p
          className="text-sm max-w-xs truncate"
          title={row.jobDescription ?? ""}
        >
          {row.jobDescription || "N/A"}
        </p>
      ),
    },
    { key: "categoryName", label: "Category" },
    { key: "jobType", label: "Job Type" },
    {
      key: "totalPrice",
      label: "Job Price",
      renderCell: (row: JobItem) =>
        row.totalPrice ? `₹${row.totalPrice}` : "N/A",
    },
    { key: "countryName", label: "Country" },
    { key: "stateName", label: "State" },
    { key: "cityName", label: "City" },
    {
      key: "startDate",
      label: "Start Date/Time",
      renderCell: (row: JobItem) =>
        row.startDate ? dayjs(row.startDate).format("DD/MM/YYYY HH:mm") : "N/A",
    },
    {
      key: "createdAt",
      label: "Created Date",
      renderCell: (row: JobItem) =>
        row.createdAt ? dayjs(row.createdAt).format("DD/MM/YYYY") : "N/A",
    },
    {
      key: "status",
      label: "Status",
      renderCell: (row: JobItem) => {
        if (showStatusSelect) {
          return (
            <SelectMenu
              placeholder="Select"
              value={rowStatuses[row.id] || row.status || ""}
              onChange={(value) => {
                setRowStatuses((prev) => ({ ...prev, [row.id]: value ?? "" }));
                handleStatusChange(row, value);
              }}
              options={AllJobStatus}
              badge
            />
          );
        }
        return <span className="capitalize">{row.status || "N/A"}</span>;
      },
    },
    {
      key: "action",
      label: "Action",
      renderCell: (row: JobItem) => (
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

  const hasSelectedFilters = !!(
    filterType ||
    serviceCategoryId ||
    budget ||
    search ||
    filterBy ||
    filterRegion
  );

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <div className="flex flex-wrap gap-4 items-center">
        <SearchInput value={search} onChange={setSearch} />
        {currentStatus !== "Flagged" && (
          <>
            <SelectMenu
              className="absolute z-20"
              placeholder="Filter by"
              value={filterBy}
              onChange={setFilterBy}
              options={AllJobsFilterBy}
            />
            <SelectMenu
              className="absolute z-20"
              placeholder="Select Region"
              value={filterRegion}
              onChange={setFilterRegion}
              options={Region}
            />

            <SelectMenu
              placeholder="Category"
              className="absolute z-20"
              value={serviceCategoryId ? String(serviceCategoryId) : null}
              onChange={(val) => setServiceCategoryId(val ? Number(val) : null)}
              options={categoryOptions}
            />

            <div className="flex items-center gap-2">
              <InputOutline
                placeholder="Budget"
                name="budget"
                className="w-40"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
              <SelectMenu
                placeholder="Job Type"
                className="absolute z-20"
                value={filterType || null}
                onChange={(val) =>
                  setFilterType(
                    (val as AdminGetJobsQuery["jobType"]) || undefined,
                  )
                }
                options={AllJobType}
              />
            </div>
          </>
        )}
        {hasSelectedFilters && (
          <Button variant="danger" onClick={onClearFilters}>
            Cancel Filters
          </Button>
        )}
      </div>
      <div className="h-full flex-1 overflow-y-auto my-4">
        <CustomTable<JobItem>
          columns={columns}
          data={data}
          initialPageSize={10}
        />
      </div>
    </div>
  );
};

export default JobByCategory;
