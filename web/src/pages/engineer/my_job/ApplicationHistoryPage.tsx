import { useState } from "react";
import { ApplicationsData } from "@/dummy_data/engineer_profile/applicationData";
import ApplicationCard from "./my_job_components/ApplicationCard";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import SortDropdown from "@/shared/components/SortDropdown";
import { SORT_OPTIONS, type SortOption } from "@/pages/engineer/search_result/types";

const ApplicationHistoryPage = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>(SORT_OPTIONS.NEWEST);

  const filteredData = ApplicationsData.filter((app) => {
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    const matchesSearch =
      app.title.toLowerCase().includes(search.toLowerCase()) ||
      app.company.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const dateA = new Date(a.appliedDate).getTime();
    const dateB = new Date(b.appliedDate).getTime();

    return sort === SORT_OPTIONS.NEWEST ? dateB - dateA : dateA - dateB;
  });

  return (
    <>
      <MyJobsHeader
        title="Application History"
        isShowBreadcrumb={true}
        isShowSort={false} 
        isReport={false}
      />

      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {["All", "Applied", "Accepted", "Rejected", "Completed"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded font-medium transition-colors duration-200 ${
                    statusFilter === status
                      ? "bg-teal-700 text-white shadow-md"
                      : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {status}
                </button>
              )
            )}
          </div>

          <div className="flex gap-2 flex-1 md:justify-end md:flex-none">
            <input
              type="text"
              placeholder="Search job or company"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-64 px-4 py-2 rounded-lg border border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            <SortDropdown
              currentSort={sort}
              onSortChange={(value) => setSort(value as SortOption)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedData.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ApplicationHistoryPage;
