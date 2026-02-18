import type { EngineerSearchJobsData } from "@/api";
import type { Filters } from "./types";

/**
 * Normalizes job type string to match API expectations
 * @param value - The job type value from the filter
 * @returns Normalized job type value
 */
function normalizeJobType(
  value: string,
): "On site" | "Remote" | "Hybrid" | null {
  const normalized = value.trim();

  // Handle variations
  if (
    normalized === "On-Site" ||
    normalized === "On site" ||
    normalized === "Onsite"
  ) {
    return "On site";
  }
  if (normalized === "Remote") {
    return "Remote";
  }
  if (normalized === "Hybrid") {
    return "Hybrid";
  }

  return null;
}

/**
 * Maps UI filters to API query parameters
 * @param filters - The current filter state from the UI
 * @returns Query parameters for the EngineerSearchJobs API
 */
export function mapFiltersToApiQuery(
  filters: Filters,
): NonNullable<EngineerSearchJobsData["query"]> {
  const query: NonNullable<EngineerSearchJobsData["query"]> = {};

  // Map job type - API only supports single jobType parameter
  // When multiple job types are selected, send the first one to API
  // and filter the rest client-side in the search results page
  const jobTypeSource =
    filters.locationType.length > 0 ? filters.locationType : filters.location;

  if (jobTypeSource.length > 0) {
    const normalized = normalizeJobType(jobTypeSource[0]);
    if (normalized) {
      query.jobType = normalized;
    }
  }

  // Map service category IDs
  if (filters.category.length > 0) {
    // Convert category names/IDs to string array
    query.serviceCategoryIds = filters.category.map(String);
  }

  // Map experience level ID
  if (filters.experienceLevel.length > 0) {
    // Take the first experience level if multiple are selected
    const experienceLevelId = Number(filters.experienceLevel[0]);
    if (!isNaN(experienceLevelId)) {
      query.experienceLevelId = experienceLevelId;
    }
  }

  // Map skill IDs
  if (filters.skills.length > 0) {
    query.skillIds = filters.skills.map(String);
  }

  // Map budget range
  if (filters.budgetRange.min > 0) {
    query.minPrice = filters.budgetRange.min;
  }
  if (filters.budgetRange.max < 10000) {
    query.maxPrice = filters.budgetRange.max;
  }

  // Note: The following are not currently supported by FilterPanel:
  // - countryId, stateId, cityId (actual location filters)
  // - startDate and endDate

  console.log("Filter mapping:", { filters, query });

  return query;
}
