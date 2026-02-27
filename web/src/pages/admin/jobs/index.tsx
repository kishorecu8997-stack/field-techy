import AdminTabComponent from "@/shared/components/AdminTabComponent";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useState } from "react";
import {
  useAdminGetJobs,
  type AdminGetJobsQuery,
} from "@/shared/apiServices/admin/adminOpenApiService";
import JobByCategory from "./JobByCategory";

/**
 * Renders the main page for managing jobs in the admin dashboard.
 *
 * This component sets up a tabbed interface to display different categories of jobs,
 * such as "All Jobs", "In Progress", "Completed", etc. It also includes
 * a header with the page title and an "Export CSV" button.
 *
 * It fetches data from the useAdminGetJobs API based on the active tab and filters.
 *
 * @returns {JSX.Element} The rendered manage jobs page.
 */
export default function ManageJobs() {
  const [activeTabLabel, setActiveTabLabel] = useState("All Jobs");
  const [filterType, setFilterType] = useState<
    AdminGetJobsQuery["jobType"] | undefined
  >(undefined);
  const [serviceCategoryId, setServiceCategoryId] = useState<number | null>(
    null,
  );
  const [budget, setBudget] = useState("");
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState<string | null>(null);
  const [filterRegion, setFilterRegion] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const handleFilterChange =
    <T,>(setter: (val: T) => void) =>
    (val: T) => {
      setter(val);
      setPage(1);
    };

  const tabsConfig: Array<{
    label: string;
    status: AdminGetJobsQuery["status"] | undefined;
  }> = [
    { label: "All Jobs", status: undefined },
    { label: "In Progress", status: "In Progress" },
    { label: "Completed", status: "Closed" },
    { label: "Declined", status: "Cancelled" },
    { label: "Hold Jobs", status: "Hold" },
    { label: "Flagged Jobs", status: "Flagged" },
  ];

  const currentStatus = tabsConfig.find(
    (t) => t.label === activeTabLabel,
  )?.status;

  const {
    data: jobsResponse,
    isLoading,
    error,
  } = useAdminGetJobs({
    page,
    limit,
    status: currentStatus,
    jobType: filterType,
    serviceCategoryId: serviceCategoryId ?? undefined,
    search: search || undefined,
  });

  const allJobs = jobsResponse?.data || [];

  // Local filtering for search and budget as backend might not support all query params yet
  const filteredJobs = allJobs.filter((job) => {
    let matches = true;

    if (search) {
      const query = search.toLowerCase();
      matches =
        job.jobTitle.toLowerCase().includes(query) ||
        job.jobCode.toLowerCase().includes(query) ||
        job.postedBy.name.toLowerCase().includes(query) ||
        job.postedBy.email.toLowerCase().includes(query) ||
        (job.jobDescription?.toLowerCase().includes(query) ?? false);
    }

    if (budget) {
      matches = matches && (job.totalPrice?.includes(budget) ?? false);
    }

    if (filterRegion) {
      matches =
        matches &&
        job.countryName?.toLowerCase() === filterRegion.toLowerCase();
    }

    return matches;
  });

  const paginatedJobs = filteredJobs;

  const handleClearFilters = () => {
    setFilterType(undefined);
    setServiceCategoryId(null);
    setBudget("");
    setSearch("");
    setFilterBy(null);
    setFilterRegion(null);
    setPage(1);
  };

  const handleTabChange = (tabLabel: string) => {
    setActiveTabLabel(tabLabel);
    handleClearFilters();
  };

  const handlePageChange = (newPage: number) => setPage(newPage);

  const handlePageSizeChange = (newSize: number) => {
    setLimit(newSize);
    setPage(1);
  };

  const tabs = tabsConfig.map((config) => ({
    label: config.label,
    content: (
      <JobByCategory
        data={paginatedJobs}
        isLoading={isLoading}
        error={error}
        filterType={filterType}
        setFilterType={handleFilterChange(setFilterType)}
        serviceCategoryId={serviceCategoryId}
        setServiceCategoryId={handleFilterChange(setServiceCategoryId)}
        budget={budget}
        setBudget={handleFilterChange(setBudget)}
        search={search}
        setSearch={handleFilterChange(setSearch)}
        filterBy={filterBy}
        setFilterBy={handleFilterChange(setFilterBy)}
        filterRegion={filterRegion}
        setFilterRegion={handleFilterChange(setFilterRegion)}
        onClearFilters={handleClearFilters}
        showStatusSelect={config.label === "All Jobs"}
        currentStatus={currentStatus}
        page={page}
        limit={limit}
        total={jobsResponse?.total || 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    ),
    hide: false,
  }));

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <div className="flex justify-between mt-2">
        <h1 className="font-semibold">Manage Jobs</h1>
        <div className="flex gap-4">
          <Button variant="solid" className="">
            Export CSV
          </Button>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-700 rounded-lg p-2 h-full flex-1">
        <AdminTabComponent
          tabs={tabs}
          activeTab={activeTabLabel}
          onTabChange={handleTabChange}
        />
      </div>
    </div>
  );
}
