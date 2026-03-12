import { useSearchParams } from "react-router-dom";
import { useAdminCountryStore } from "@/shared/store/useAdminCountryStore";
import {
  LookupTable,
  useAppGetLookupData,
} from "@/shared/apiServices/admin/adminOpenApiService";

/**
 * useAdminRegionParam
 *
 * Provides a `setRegionParam` handler for the admin region SelectMenu.
 * When called it updates both the Zustand store and the `?regionId` URL query param.
 *
 * Reading the regionId is done directly from the store — the URL param is just
 * a visual/shareable mirror that is kept in sync by AdminRegionSync.
 */
export function useAdminRegionParam() {
  const setRegion = useAdminCountryStore((state) => state.setRegion);
  const [, setSearchParams] = useSearchParams();
  const { data: adminLookupData } = useAppGetLookupData(LookupTable.Regions);

  const setRegionParam = (id: string | null) => {
    const selectedRegion = adminLookupData?.find(
      (item) => item.id.toString() === id,
    );
    setRegion(id, selectedRegion?.name ?? null);

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (id) {
          next.set("regionId", id);
        } else {
          next.delete("regionId");
        }
        return next;
      },
      { replace: true },
    );
  };

  return { setRegionParam, adminLookupData };
}
