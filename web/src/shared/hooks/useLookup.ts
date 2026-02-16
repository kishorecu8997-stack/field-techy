import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { createClient } from "@/api/client";
import { appGetLookupData } from "@/api";

export type LookupItem = {
  id: string | number;
  name: string;
  [key: string]: unknown;
};

// Allowed lookup table names (matches backend typings)
export type LookupTable =
  | "countries"
  | "industries"
  | "states"
  | "cities"
  | "employmentTypes"
  | "skills"
  | "tools"
  | "serviceCategories"
  | "workLocations"
  | "educationLevels"
  | "courses"
  | "engagementModels";

type QueryKey = readonly unknown[];
type LookupQueryOptions = UseQueryOptions<
  LookupItem[],
  Error,
  LookupItem[],
  QueryKey
>;

/**
 * Memoized API client using Vite env variable fallback.
 */
export const useApiClient = () => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  return useMemo(() => createClient({ baseUrl }), [baseUrl]);
};

/**
 * Generic hook to fetch lookup data via `appGetLookupData` and react-query.
 * - `table` is required (e.g. 'countries', 'states', 'cities')
 * - `parentId` is optional and will be stringified when present
 */
type LookupCallOptions = Omit<LookupQueryOptions, "queryKey">;

export function useLookup(
  table: LookupTable,
  parentId?: string | number | null,
  options?: LookupCallOptions,
) {
  const client = useApiClient();
  const resolvedParentId = parentId == null ? undefined : String(parentId);
  const queryKey = ["lookup", table, resolvedParentId ?? "root"] as const;

  const queryFn = async (): Promise<LookupItem[]> => {
    const query: { table: LookupTable; parentId?: string } = resolvedParentId
      ? { table, parentId: resolvedParentId }
      : { table };
    const res = await appGetLookupData({
      client,
      query,
      responseStyle: "data",
    });
    return Array.isArray(res) ? res : (res && (res as any).data) || [];
  };

  // Safely merge options but exclude `queryKey` to avoid type conflicts
  const restOptions = (options ?? {}) as LookupCallOptions;
  type SafeOptions = LookupCallOptions;
  return useQuery<LookupItem[], Error>({
    queryKey,
    queryFn,
    ...(restOptions as SafeOptions),
  });
}

/** Convenience hooks for all supported lookup tables */
export const useCountries = (options?: LookupCallOptions) =>
  useLookup("countries", undefined, options);
export const useIndustries = (options?: LookupCallOptions) =>
  useLookup("industries", undefined, options);
export const useStates = (
  countryId?: string | number | null,
  options?: LookupCallOptions,
) =>
  useLookup("states", countryId, {
    ...(options ?? {}),
    enabled: options?.enabled ?? Boolean(countryId),
  });
export const useCities = (
  stateId?: string | number | null,
  options?: LookupCallOptions,
) =>
  useLookup("cities", stateId, {
    ...(options ?? {}),
    enabled: options?.enabled ?? Boolean(stateId),
  });
export const useEmploymentTypes = (options?: LookupCallOptions) =>
  useLookup("employmentTypes", undefined, options);
export const useSkills = (options?: LookupCallOptions) =>
  useLookup("skills", undefined, options);
export const useTools = (options?: LookupCallOptions) =>
  useLookup("tools", undefined, options);
export const useServiceCategories = (options?: LookupCallOptions) =>
  useLookup("serviceCategories", undefined, options);
export const useWorkLocations = (options?: LookupCallOptions) =>
  useLookup("workLocations", undefined, options);
export const useEducationLevels = (options?: LookupCallOptions) =>
  useLookup("educationLevels", undefined, options);
export const useCourses = (options?: LookupCallOptions) =>
  useLookup("courses", undefined, options);
export const useEngagementModels = (options?: LookupCallOptions) =>
  useLookup("engagementModels", undefined, options);
