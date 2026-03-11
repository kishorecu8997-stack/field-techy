import { useLookupData } from "@/shared/apiServices/commonOpenApiService";
import { useMemo } from "react";

interface LocationDisplayProps {
  countryId?: number;
  stateId?: number;
  cityId?: number;
  workLocationName?: string | null;
  fallback?: string;
}

/**
 * Displays the location of the job.
 * @param {LocationDisplayProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered location display.
 */
const LocationDisplay = ({
  countryId,
  stateId,
  cityId,
  workLocationName,
  fallback,
}: LocationDisplayProps) => {
  const { data: countries } = useLookupData("countries");

  const { data: states } = useLookupData(
    "states",
    countryId ? String(countryId) : undefined,
  );
  const { data: cities } = useLookupData(
    "cities",
    stateId ? String(stateId) : undefined,
  );

  const countryName = useMemo(
    () => countries?.find((c) => c.id === countryId)?.name,
    [countries, countryId],
  );
  const stateName = useMemo(
    () => states?.find((s) => s.id === stateId)?.name,
    [states, stateId],
  );
  const cityName = useMemo(
    () => cities?.find((c) => c.id === cityId)?.name,
    [cities, cityId],
  );

  if (workLocationName) {
    return <span>{workLocationName}</span>;
  }

  if (!countryId && !cityId) return <span>{fallback || "N/A"}</span>;

  const parts = [];
  if (cityName) parts.push(cityName);
  if (stateName) parts.push(stateName);
  else if (!cityName && cityId) parts.push(String(cityId));

  if (countryName) parts.push(countryName);

  if (parts.length === 0) {
    const idParts = [];
    if (cityId) idParts.push(cityId);
    if (countryId) idParts.push(countryId);
    return <span>{idParts.join(", ")}</span>;
  }

  return <span>{parts.join(", ")}</span>;
};

export default LocationDisplay;
