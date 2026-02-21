import React, { useState } from "react";
import AdminTabComponent from "@/shared/components/AdminTabComponent";
import {
  useAdminGetJobs,
  type AdminGetJobsQuery,
} from "@/shared/apiServices/admin/adminOpenApiService";
import ClientJobByCategory from "./ClientJobByCategory";

interface JobHistoryProps {
  clientEmail?: string;
}

/**
 * JobHistory Component displays the job history for a client.
 * Refactored to follow the JobByCategory pattern from Manage Jobs, 
 * now simplified to only use Search filtering.
 */
const JobHistory: React.FC<JobHistoryProps> = ({ clientEmail }) => {
  const [activeTabLabel, setActiveTabLabel] = useState("Posted Jobs");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const tabsConfig: Array<{
    label: string;
    status: AdminGetJobsQuery["status"] | undefined;
  }> = [
    { label: "Posted Jobs", status: "Posted" },
    { label: "In Progress Jobs", status: "In Progress" },
    { label: "Completed Jobs", status: "Closed" },
    { label: "Hold Jobs", status: "Hold" },
    { label: "Flagged Jobs", status: "Flagged" },
    { label: "Declined Jobs", status: "Cancelled" },
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
    search: search || undefined,
  });

  const allJobs = jobsResponse?.data || [];

  // Filter jobs by client email
  const clientJobs = allJobs.filter((job) => {
    const emailMatches = clientEmail 
      ? job.postedBy.email.toLowerCase() === clientEmail.toLowerCase()
      : true;

    if (!emailMatches) return false;

    let matches = true;
    if (search) {
      const query = search.toLowerCase();
      matches =
        job.jobTitle.toLowerCase().includes(query) ||
        job.jobCode.toLowerCase().includes(query) ||
        (job.jobDescription?.toLowerCase().includes(query) ?? false);
    }

    return matches;
  });

  const handleClearFilters = () => {
    setSearch("");
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
      <ClientJobByCategory
        data={clientJobs}
        isLoading={isLoading}
        error={error}
        search={search}
        setSearch={setSearch}
        onClearFilters={handleClearFilters}
        page={page}
        limit={limit}
        total={clientJobs.length}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    ),
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 h-full flex-1">
      <AdminTabComponent
        tabs={tabs}
        activeTab={activeTabLabel}
        onTabChange={handleTabChange}
      />
    </div>
  );
};

export default JobHistory;
