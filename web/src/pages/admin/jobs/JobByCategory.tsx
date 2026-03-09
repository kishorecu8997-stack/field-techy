import { absoluteUrls } from "@/config/urls";
import {
  AllJobStatus,
  AllJobType,
  AllJobsFilterBy,
} from "@/dummy_data/admin/manageJobs";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";
import SelectMenu from "@/shared/components/SelectMenu";
import { usePopupStore } from "@/shared/store/popupStore";
import { useState } from "react";
import { FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import type { AdminGetJobsQuery } from "@/shared/apiServices/admin/adminOpenApiService";
import dayjs from "dayjs";
import { InputOutline } from "@/shared/components/InputOutline";
import { Button } from "@/shared/components/commonUI/Buttons";
import {
  LookupTable,
  type AdminUpdateJobStatusBody,
  useAdminUpdateJobStatus,
  useAppGetLookupData,
} from "@/shared/apiServices/admin/adminOpenApiService";
import type { JobByCategoryProps, JobItem } from "./types";
import { toast } from "react-toastify";

type StatusKind = "Hold" | "Flagged" | "Cancelled" | "Unknown";
const getCurrentStatusKind = (status: string | null | undefined): StatusKind => {
  const s = (status ?? "").trim().toLowerCase();
  if (s === "cancel" || s === "cancelled") return "Cancelled";
  if (s === "flag" || s === "flagged") return "Flagged";
  if (s === "hold" || s === "onhold" || s === "held") return "Hold";
  return "Unknown";
};

const normalizeStatus = (
  status: string
): AdminUpdateJobStatusBody["status"] => {
  const normalized = status.toLowerCase();
  if (normalized === "cancel" || normalized === "cancelled") {
    return "Cancelled";
  }
  if (normalized === "flag" || normalized === "flagged") {
    return "Flagged";
  }
  return "Hold";
};

const JobByCategory: React.FC<JobByCategoryProps> = ({
  data,
  isLoading,
  error,
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
  page = 1,
  limit = 10,
  total,
  onPageChange,
  onPageSizeChange,
}) => {
  const { showPopup } = usePopupStore();
  const navigate = useNavigate();
  const [rowStatuses, setRowStatuses] = useState<Record<number, string>>({});
  const { mutateAsync: updateJobStatus } = useAdminUpdateJobStatus();

  const { data: categories } = useAppGetLookupData("serviceCategories");
  const { data: adminLookupData } = useAppGetLookupData(LookupTable.Countries);

  const categoryOptions =
    categories?.map((cat) => ({
      value: String(cat.id),
      label: cat.name,
    })) || [];

  const handleStatusChange = async (job: JobItem, status: string | null) => {
    if (!status) return;

    const current = rowStatuses[job.id] ?? job.status ?? "";
    const previousStatus = current;
    const nextStatus = normalizeStatus(status);

    if (normalizeStatus(current) === "Cancelled" && nextStatus !== "Cancelled") {
      toast.error("Cannot update status of a Cancelled job");
      return;
    }

    setRowStatuses((prev) => ({
      ...prev,
      [job.id]: nextStatus,
    }));

    let isSuccess = false;

    await showPopup({
      title: `${status} Job`,
      body: `Are you sure you want to set this job to ${status}?`,
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Yes",
          value: "yes",
          variant: nextStatus.toLowerCase() === "hold" ? "warning" : "danger",
          action: async (close: (v: boolean) => void) => {
            try {
              await updateJobStatus({
                query: { jobId: Number(job.id) },
                body: { status: nextStatus },
              });
              isSuccess = true;
              toast.success(`Job status updated to ${status}`);
              close(true);
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : typeof error === "string"
                  ? error
                  : "Failed to update job status"
              );
              close(false);
            }
          },
        },
      ],
    });

    if (!isSuccess) {
      setRowStatuses((prev) => ({
        ...prev,
        [job.id]: previousStatus,
      }));
    }
  };

  const columns: Column<JobItem>[] = [
    {
      label: "Sr.No.",
      renderCell: (_row: JobItem, index: number) =>
        (page - 1) * limit + index + 1,
    },
    { key: "jobCode", label: "Job ID" },
    {
      key: "postedBy",
      label: "Posted By",
      renderCell: (row: JobItem) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-700 font-bold">
            {row.postedBy.name.charAt(0).toUpperCase() ?? ""}
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
      label: "Start Date",
      renderCell: (row: JobItem) =>
        row.startDate ? dayjs(row.startDate).format("DD/MM/YYYY") : "N/A",
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
          const rawCurrent = rowStatuses[row.id] ?? row.status ?? "";
          const currentKind = getCurrentStatusKind(rawCurrent);

          const statusOptions = AllJobStatus
            .filter((option) => {
              if (option.value === "Unhold" && currentKind !== "Hold") {
                return false;
              }
              return true;
            })
            .map((option) => {
              if (currentKind === "Cancelled") {
                return {
                  ...option,
                  disabled: option.value !== "Cancelled",
                };
              }

              if (
                option.value !== "Unhold" &&
                currentKind !== "Unknown" &&
                normalizeStatus(option.value) === currentKind
              ) {
                return {
                  ...option,
                  disabled: true,
                };
              }

              if (option.value === "Unhold") {
                return {
                  ...option,
                  disabled: currentKind !== "Hold",
                };
              }

              return option;
            });

          return (
            <SelectMenu
              placeholder="Select"
              value={rawCurrent}
              onChange={(value) => {
                handleStatusChange(row, value);
              }}
              options={statusOptions}
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
          <button
            type="button"
            className="p-2 bg-yellow-100 rounded-md cursor-pointer hover:bg-yellow-200 transition-colors"
            onClick={() =>
              navigate(
                `${absoluteUrls.admin.home.manage_jobs_view}?jobId=${row.id}`
              )
            }
            aria-label={`View job details for job ${row.id}`}
          >
            <FiEye className="text-yellow-600" />
          </button>
        </div>
      ),
    },
  ];

  const hasSelectedFilters = [
    filterType,
    serviceCategoryId,
    budget,
    search,
    filterBy,
    filterRegion,
  ].some(Boolean);

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <div className="flex flex-wrap gap-4 items-center">
        <SearchInput value={search} onChange={setSearch} />
        {currentStatus !== "Flagged" && (
          <>
            <SelectMenu
              className="z-30"
              placeholder="Filter by"
              value={filterBy}
              onChange={setFilterBy}
              options={AllJobsFilterBy}
            />
            <SelectMenu
              placeholder="Select Region"
              className="z-30"
              options={
                adminLookupData?.map((item) => ({
                  value: item.name ?? "",
                  label: item.name ?? "",
                })) ?? []
              }
              value={filterRegion}
              onChange={setFilterRegion}
            />

            <SelectMenu
              placeholder="Category"
              className="z-30"
              value={serviceCategoryId ? String(serviceCategoryId) : null}
              onChange={(val) =>
                setServiceCategoryId(val ? Number(val) : null)
              }
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
                className="z-20"
                value={filterType || null}
                onChange={(val) =>
                  setFilterType(
                    (val as AdminGetJobsQuery["jobType"]) || undefined
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
          initialPageSize={limit}
          loading={isLoading}
          error={error ? "An error occurred while fetching jobs." : null}
          totalCount={total}
          currentPage={page}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  );
};

export default JobByCategory;