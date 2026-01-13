import type {
  SearchEvent,
  ClickEvent,
} from "@/dummy_data/engineer_search/searchAnalytics";

/** Total number of searches */
export const getTotalSearches = (searches: SearchEvent[]): number =>
  searches.length;

/** Frequency of each keyword */
export const getKeywordFrequency = (
  searches: SearchEvent[],
): Record<string, number> =>
  searches.reduce<Record<string, number>>((acc, s) => {
    acc[s.keyword] = (acc[s.keyword] || 0) + 1;
    return acc;
  }, {});

/** Search trends by date */
export const getSearchTrends = (
  searches: SearchEvent[],
): Record<string, number> =>
  searches.reduce<Record<string, number>>((acc, s) => {
    const date = s.searchedAt.split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

/** Click-through rate in % */
export const getCTR = (
  searches: SearchEvent[],
  clicks: ClickEvent[],
): number =>
  searches.length ? Math.round((clicks.length / searches.length) * 100) : 0;

/** Prepare search history analytics table */
export const getSearchHistory = (
  searches: SearchEvent[],
  clicks: ClickEvent[],
) => {
  const clickedSearchIds = new Set(clicks.map((c) => c.searchId));
  return searches.map((s) => ({
    id: s.id,
    keyword: s.keyword,
    date: s.searchedAt.split("T")[0],
    clicked: clickedSearchIds.has(s.id),
  }));
};
