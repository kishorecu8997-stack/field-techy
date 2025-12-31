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
  getSearchHistory
} from "@/utils/searchServiceAnalytics";
import AnalyticsCard from "@/shared/components/search-analytics/AnalyticsCard";
import Section from "@/shared/components/search-analytics/Section";
import KeywordRow from "@/shared/components/search-analytics/KeywordRow";
import TrendRow from "@/shared/components/search-analytics/TrendRow";
import { CustomTable, type Column } from "@/shared/components/commonUI/custom_table";

interface SearchHistoryItem {
  id: string;
  keyword: string;
  date: string;
  clicked: boolean;
}

/**
 * SearchAnalyticsPage Component
 *
 * Main page component for displaying search analytics for engineers.
 * Shows analytics cards, most searched keywords, search trends, and search history.
 * Fetches data from dummy data and utility functions to calculate:
 * - Total searches
 * - Click-through rate
 * - Unique keywords
 * - Keyword frequency
 * - Search trends
 * - Search history
 *
 * @example
 * <SearchAnalyticsPage />
 */
  const SearchAnalyticsPage: React.FC = () => {
  const totalSearches = getTotalSearches(searchEvents);
  const keywordFrequency = getKeywordFrequency(searchEvents);
  const searchTrends = getSearchTrends(searchEvents);
  const ctr = getCTR(searchEvents, clickEvents);
  const searchHistory = getSearchHistory(searchEvents, clickEvents);

  const sortedKeywords = Object.entries(keywordFrequency).sort(
    (a, b) => b[1] - a[1]
  );
  const sortedTrends = Object.entries(searchTrends).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  /**  Columns definition for CustomTable */
  const searchHistoryColumns: Column<SearchHistoryItem>[] = [
    {
      key: "keyword",
      label: "Keyword",
      align: "left",
    },
    {
      key: "date",
      label: "Date",
      align: "left",
    },
    {
      key: "clicked",
      label: "Clicked",
      align: "center",
      renderCell: (row) => (row.clicked ? "Yes" : "No"),
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen p-8">
      {/* Heading */}
      <h2 className="text-3xl font-bold mb-2">Search Analysis</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">
        Analyze user search behavior and results performance.
      </p>

      {/* Analytics Cards */}
      <div className="flex flex-wrap gap-5 mb-10">
        <AnalyticsCard
          title="Total Searches"
          value={totalSearches.toString()}
        />
        <AnalyticsCard title="Click-Through Rate" value={`${ctr}%`} />
        <AnalyticsCard
          title="Unique Keywords"
          value={Object.keys(keywordFrequency).length.toString()}
        />
      </div>

      {/* Most Searched Keywords */}
      <Section title="Most Searched Keywords">
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
            No keywords searched yet
          </p>
        )}
      </Section>

      {/* Search Trends */}
      <Section title="Search Trends">
        {sortedTrends.length > 0 ? (
          sortedTrends.map(([date, count]) => (
            <TrendRow key={date} date={date} count={count} />
          ))
        ) : (
          <p className="p-3 text-gray-500 dark:text-gray-400">
            No search trends available
          </p>
        )}
      </Section>

      {/* Search History Analytics */}
      <Section title="Search History Analytics">
        <CustomTable<SearchHistoryItem>
          columns={searchHistoryColumns}
          data={searchHistory}
          initialPageSize={10}
          showPagination={true}
        />
      </Section>
    </div>
  );
};

export default SearchAnalyticsPage;
