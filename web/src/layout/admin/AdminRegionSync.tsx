import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminCountryStore } from "@/shared/store/useAdminCountryStore";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import {
  LookupTable,
  useAppGetLookupData,
} from "@/shared/apiServices/admin/adminOpenApiService";

/**
 * AdminRegionSync
 *
 * Layout-level component that keeps `?regionId` present in the URL at all times
 * without using useEffect. It runs at render time using a `<Navigate replace>`:
 *
 * - Admin: reads regionId from the Zustand store (persisted). If the URL is
 *   missing the param it redirects to the same path+query with regionId added.
 *   This preserves all existing query params on the page.
 *
 * - Sub-admin: reads regionId from the JWT session. Same redirect behaviour.
 */
export default function AdminRegionSync() {
  const location = useLocation();
  const storeRegionId = useAdminCountryStore((s) => s.regionId);
  const subRegionId = useUserSessionStore((s) => s.session?.regionId);
  const { data: adminLookupData } = useAppGetLookupData(LookupTable.Regions);

  // Sub-admin: fixed from session.
  // Admin: from persisted store, or first region from lookup data on first visit.
  let effectiveRegionId: string | null = null;
  let regionToSync: { id: string; name: string | null } | null = null;

  if (subRegionId) {
    effectiveRegionId = subRegionId.toString();
  } else if (storeRegionId) {
    effectiveRegionId = storeRegionId;
  } else if (adminLookupData && adminLookupData.length > 0) {
    const first = adminLookupData[0];
    effectiveRegionId = first.id.toString();
    regionToSync = { id: effectiveRegionId, name: first.name ?? null };
  }

  // Safely persist the default store initialization outside the render phase
  useEffect(() => {
    if (regionToSync) {
      useAdminCountryStore
        .getState()
        .setRegion(regionToSync.id, regionToSync.name);
    }
  }, [regionToSync?.id, regionToSync?.name]);

  if (!effectiveRegionId) return null;

  // Check if the URL already has the correct regionId — nothing to do
  const searchParams = new URLSearchParams(location.search);
  if (searchParams.get("regionId") === effectiveRegionId) return null;

  // Inject (or correct) the regionId param, preserving all other existing params
  searchParams.set("regionId", effectiveRegionId);
  return (
    <Navigate to={`${location.pathname}?${searchParams.toString()}`} replace />
  );
}
