import React from "react";
import {
  searchEvents,
  clickEvents,
} from "@/dummy_data/engineer_search/searchAnalytics";
import {
  getTotalSearches,
  getKeywordFrequency,
  getSearchTrends,
  getCTR,
  getSearchHistory,
} from "@/utils/searchServiceAnalytics";
import AnalyticsCard from "@/shared/components/search-analytics/AnalyticsCard";
import Section from "@/shared/components/search-analytics/Section";
import KeywordRow from "@/shared/components/search-analytics/KeywordRow";
import TrendRow from "@/shared/components/search-analytics/TrendRow";
import {
  CustomTable,
  type Column,
} from "@/shared/components/commonUI/custom_table";

interface SearchHistoryItem {
  id: string;
  keyword: string;
  date: string;
  clicked: boolean;
}

/**
 * ClientSearchAnalyticsPage Component
 *
 * Main page component for displaying analytics for clients.
 * Shows key metrics about job postings, proposals, applications, and performance.
 * Currently reuses engineer search analytics logic as placeholder.
 * You should replace dummy data and utils with client-specific data sources later.
 *
 * @example
 * <ClientSearchAnalyticsPage />
 */
const ClientSearchAnalyticsPage: React.FC = () => {
  const totalSearches = getTotalSearches(searchEvents);
  const keywordFrequency = getKeywordFrequency(searchEvents);
  const searchTrends = getSearchTrends(searchEvents);
  const ctr = getCTR(searchEvents, clickEvents);
  const searchHistory = getSearchHistory(searchEvents, clickEvents);

  const sortedKeywords = Object.entries(keywordFrequency).sort(
    (a, b) => b[1] - a[1],
  );
  const sortedTrends = Object.entries(searchTrends).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  const historyColumns: Column<SearchHistoryItem>[] = [
    {
      key: "keyword",
      label: "Job Title / Skill",
      align: "left",
    },
    {
      key: "date",
      label: "Posted / Viewed Date",
      align: "left",
    },
    {
      key: "clicked",
      label: "Application Received",
      align: "left",
      renderCell: (row) => (row.clicked ? "Yes" : "No"),
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen p-8">
      {/* Heading */}
      <h2 className="text-3xl font-bold mb-2">Job search Analytics</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">
        Track performance of your posted jobs, views, applications, and
        proposals.
      </p>

      {/* Analytics Cards – updated titles for client context */}
      <div className="flex flex-wrap gap-5 mb-10">
        <AnalyticsCard
          title="Total Job Views"
          value={totalSearches.toString()}
        />
        <AnalyticsCard title="Application Rate" value={`${ctr}%`} />
        <AnalyticsCard
          title="Active Postings"
          value={Object.keys(keywordFrequency).length.toString()}
        />
      </div>

      {/* Most Used Skills / Job Titles (placeholder name change) */}
      <Section title="Most Frequent Skills / Job Titles">
        {sortedKeywords.length > 0 ? (
          sortedKeywords.map(([keyword, count]) => (
            <KeywordRow
              key={keyword}
              keyword={keyword}
              count={count}
              total={totalSearches}
            />
          ))
        ) : (
          <p className="p-3 text-gray-500 dark:text-gray-400">
            No job postings or views recorded yet
          </p>
        )}
      </Section>

      {/* Posting Trends */}
      <Section title="Job Posting Trends">
        {sortedTrends.length > 0 ? (
          sortedTrends.map(([date, count]) => (
            <TrendRow key={date} date={date} count={count} />
          ))
        ) : (
          <p className="p-3 text-gray-500 dark:text-gray-400">
            No posting trends available yet
          </p>
        )}
      </Section>

      {/* Application / Proposal History */}
      <Section title="Application & Proposal History">
        <CustomTable<SearchHistoryItem>
          columns={historyColumns}
          data={searchHistory}
          initialPageSize={10}
          showPagination={true}
        />
      </Section>
    </div>
  );
};

export default ClientSearchAnalyticsPage;
