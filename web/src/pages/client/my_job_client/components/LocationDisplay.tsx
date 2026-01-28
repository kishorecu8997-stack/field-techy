import { useLookupData } from "@/shared/apiServices/client/clientOpenApiService";
import { useMemo } from "react";

interface LocationDisplayProps {
    countryId?: number;
    stateId?: number;
    cityId?: number;
    workLocationName?: string | null;
    fallback?: string;
}

const LocationDisplay = ({ countryId, stateId, cityId, workLocationName, fallback }: LocationDisplayProps) => {
    // If we have a specific work location name, use it (assumed to be fully descriptive or "On Site" logic might handle it)
    // However, usually workLocationName might be null.

    // Conditionally fetch data only if we have the IDs
    const { data: countries } = useLookupData("countries");

    // We can only fetch states if we have a countryId
    const { data: states } = useLookupData("states", countryId ? String(countryId) : undefined);

    // We can only fetch cities if we have a stateId
    const { data: cities } = useLookupData("cities", stateId ? String(stateId) : undefined);

    const countryName = useMemo(() => countries?.find(c => c.id === countryId)?.name, [countries, countryId]);
    const stateName = useMemo(() => states?.find(s => s.id === stateId)?.name, [states, stateId]);
    const cityName = useMemo(() => cities?.find(c => c.id === cityId)?.name, [cities, cityId]);

    if (workLocationName) {
        return <span>{workLocationName}</span>;
    }

    if (!countryId && !cityId) return <span>{fallback || "N/A"}</span>;

    const parts = [];
    if (cityName) parts.push(cityName);
    if (stateName) parts.push(stateName);
    else if (!cityName && cityId) parts.push(String(cityId)); // Fallback ID if name not found yet

    if (countryName) parts.push(countryName);

    // Fallback to IDs if names are not loaded yet or not found, but only if we don't have ANY names.
    if (parts.length === 0) {
        // If data is loading, maybe show "Loading..." or just the IDs?
        // IDs look bad. let's show nothing or IDs.
        // Screenshot showed "20, 1". 
        // If we have IDs we should try to show them if lookups fail? 
        // Or maybe simpler: if we have cityId/countryId but no names, it implies loading or error.
        // Retain old behavior (ids) as last resort or while loading? 
        // Actually, standard is usually to show IDs if name lookup fails completely.
        const idParts = [];
        if (cityId) idParts.push(cityId);
        if (countryId) idParts.push(countryId);
        return <span>{idParts.join(", ")}</span>;
    }

    return <span>{parts.join(", ")}</span>;
};

export default LocationDisplay;
