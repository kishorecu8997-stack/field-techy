import { useState } from "react";
import { ApplicationsData } from "@/dummy_data/engineer_profile/applicationData";
import type { Application } from "./my_job_components/ApplicationCard";
import ApplicationCard from "./my_job_components/ApplicationCard";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import SortDropdown from "@/shared/components/SortDropdown";
import {
  SORT_OPTIONS,
  type SortOption,
} from "@/pages/engineer/search_result/types";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useMemo } from "react";

const TAB_LABELS = ["All", "Applied", "Accepted", "Rejected", "Completed"];
/**
 * Page component that displays the engineer's job application history.
 *
 * It allows users to:
 * - Filter applications by status using the status tabs (e.g. All, Applied, Accepted).
 * - Search applications by job title or company name via the search input.
 * - Sort the filtered results by applied date using the sort dropdown (e.g. newest first).
 *
 * The component combines these controls to derive a filtered and sorted list of applications,
 * which is then rendered as a grid of {@link ApplicationCard} items.
 */
const handleReapply = (application: Application) => {
  console.log("Re-applying for:", application);
};
const ApplicationHistoryPage = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>(SORT_OPTIONS.NEWEST);

  const filteredData = useMemo(() => {
    return ApplicationsData.filter((app) => {
      const normalizedStatusFilter = statusFilter.toLowerCase();
      const normalizedAppStatus = app.status.toLowerCase();

      const matchesStatus =
        normalizedStatusFilter === "all" ||
        normalizedAppStatus === normalizedStatusFilter;

      const matchesSearch =
        app.title.toLowerCase().includes(search.toLowerCase()) ||
        app.company.toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [ApplicationsData, statusFilter, search]);

  const sortedData = useMemo(() => {
    return filteredData.slice().sort((a, b) => {
      const dateA = new Date(a.appliedDate).getTime();
      const dateB = new Date(b.appliedDate).getTime();
      return sort === SORT_OPTIONS.NEWEST ? dateB - dateA : dateA - dateB;
    });
  }, [filteredData, sort]);

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
            {TAB_LABELS.map((status) => (
              <Button
                key={status}
                onClick={() => setStatusFilter(status)}
                variant={statusFilter === status ? "primary" : "outline"}
                size="md"
              >
                {status}
              </Button>
            ))}
          </div>

          <div className="flex gap-2 flex-1 md:justify-end md:flex-none">
            <input
              type="text"
              placeholder="Search job or company"
              aria-label="Serach Job or company"
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

        <div className="p-6">
          {sortedData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <p className="font-medium mb-1">No applications found</p>
              <p className="text-sm">
                Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedData.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onReapply={handleReapply}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ApplicationHistoryPage;
