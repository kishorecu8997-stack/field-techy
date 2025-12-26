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
} from "@/utils/searchAnalytics";

//  Search Analytics Components
import AnalyticsCard from "@/shared/components/search-analytics/AnalyticsCard";
import Section from "@/shared/components/search-analytics/Section";
import KeywordRow from "@/shared/components/search-analytics/KeywordRow";
import TrendRow from "@/shared/components/search-analytics/TrendRow";

// Styles for the page 
import {
  containerStyle,
  headingStyle,
  tableStyle,
} from "@/shared/styles/searchAnalytics.styles";

const SearchAnalyticsPage: React.FC = () => {
  const totalSearches = getTotalSearches(searchEvents);
  const keywordFrequency = getKeywordFrequency(searchEvents);
  const searchTrends = getSearchTrends(searchEvents);
  const ctr = getCTR(searchEvents, clickEvents);
  const searchHistory = getSearchHistory(searchEvents, clickEvents);

  const sortedKeywords = Object.entries(keywordFrequency).sort(
    (a, b) => b[1] - a[1]
  );

  const sortedTrends = Object.entries(searchTrends).sort(
    ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Search Analytics</h2>
      
      {/* Analytics Cards */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "32px",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <AnalyticsCard title="Total Searches" value={totalSearches.toString()} />
        <AnalyticsCard title="Click Through Rate" value={`${ctr}%`} />
        <AnalyticsCard title="Unique Keywords" value={Object.keys(keywordFrequency).length.toString()} />
      </div>

      {/* Most Searched Keywords */}
      <Section title="Most Searched Keywords">
        {sortedKeywords.map(([keyword, count]) => (
          <KeywordRow
            key={keyword}
            keyword={keyword}
            count={count}
            total={totalSearches}
          />
        ))}
      </Section>

      {/* Search Trends */}
      <Section title="Search Trends">
        {sortedTrends.map(([date, count]) => (
          <TrendRow key={date} date={date} count={count} />
        ))}
      </Section>

      {/* Search History */}
      <Section title="Search History Analytics">
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Keyword</th>
              <th>Date</th>
              <th>Clicked</th>
            </tr>
          </thead>
          <tbody>
            {searchHistory.map((item) => (
              <tr key={item.id}>
                <td>{item.keyword}</td>
                <td>{item.date}</td>
                <td>{item.clicked ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
};

export default SearchAnalyticsPage;
