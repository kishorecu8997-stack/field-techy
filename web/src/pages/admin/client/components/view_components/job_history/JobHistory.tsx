import React, { useState } from "react";
import AdminTabComponent from "@/shared/components/AdminTabComponent";
import {
  useAdminGetClientHistory,
  type AdminGetClientHistoryQuery,
  type AdminGetJobGraphQuery,
} from "@/shared/apiServices/admin/adminOpenApiService";

import type { JobItem } from "@/pages/admin/jobs/types";
import ClientJobByCategory from "./ClientJobByCategory";

interface JobHistoryProps {
  userId: number;
}

/**
 * JobHistory Component displays the job history for a client using the AdminGetClientHistory API.
 */
const JobHistory: React.FC<JobHistoryProps> = ({ userId }) => {
  const [activeTabLabel, setActiveTabLabel] = useState("Posted Jobs");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const tabsConfig: Array<{
    label: string;
    statusGroup: AdminGetClientHistoryQuery["statusGroup"];
  }> = [
    { label: "Posted Jobs", statusGroup: "posted" },
    { label: "In Progress Jobs", statusGroup: "inProgress" },
    { label: "Completed Jobs", statusGroup: "completed" },
    { label: "Hold Jobs", statusGroup: "hold" },
    { label: "Flagged Jobs", statusGroup: "flagged" },
    { label: "Declined Jobs", statusGroup: "declined" },
  ];

  const currentStatusGroup = tabsConfig.find(
    (t) => t.label === activeTabLabel,
  )?.statusGroup;

  const {
    data: historyResponse,
    isLoading,
    error,
  } = useAdminGetClientHistory(userId, {
    page,
    limit,
    type: "jobs",
    statusGroup: currentStatusGroup,
  });

  const allJobs = (historyResponse?.data || []) as JobItem[];

  // Filter jobs by search on client side if search is provided, or rely on API if it supports search
  const clientJobs = allJobs.filter((job) => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      job.jobTitle?.toLowerCase().includes(query) ||
      job.jobCode?.toLowerCase().includes(query) ||
      (job.jobDescription?.toLowerCase().includes(query) ?? false)
    );
  });

  const handleTabChange = (tabLabel: string) => {
    setActiveTabLabel(tabLabel);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => setPage(newPage);

  const handlePageSizeChange = (newSize: number) => {
    setLimit(newSize);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
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
        setSearch={handleSearchChange}
        page={page}
        limit={limit}
        total={historyResponse?.total || 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        userId={userId}
        status={config.statusGroup as AdminGetJobGraphQuery["status"]}
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
