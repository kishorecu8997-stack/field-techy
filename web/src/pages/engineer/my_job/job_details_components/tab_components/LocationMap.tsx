import { exampleMarkers } from "@/dummy_data/jobDetails";
import MapComponent from "@/shared/components/MapComponent";
 
type CoordinateInput = string | number | null | undefined;
 
interface LocationMapProps {
  workLocationLat?: CoordinateInput;
  workLocationLng?: CoordinateInput;
  workLocationName?: string | null;
}
 
/**
 * Displays the job's work location with a descriptive address and an interactive map.
 *
 * This component renders a static address block for the SPOC (Single Point of Contact)
 * work location and embeds a map using the `MapComponent`, centered on predefined
 * coordinates from dummy data. It also logs map click events for potential future use
 * (e.g., coordinate selection or debugging).
 *
 * @returns {JSX.Element} A section containing the location address and an interactive map.
 *
 * @example
 * <LocationMap />
 */
const LocationMap: React.FC<LocationMapProps> = ({
  workLocationLat,
  workLocationLng,
  workLocationName,
}) => {
  const handleMapClick = (latlng: { lat: number; lng: number }) => {
    console.log("User clicked map at:", latlng);
  };
 
  const parseCoord = (value: CoordinateInput): number | null => {
    if (value === null || value === undefined) return null;
    const num = typeof value === "number" ? value : parseFloat(String(value));
    return Number.isFinite(num) ? num : null;
  };
 
  const normalizeLng = (value: number): number => {
    const normalized =
      ((((value + 180) % 360) + 360) % 360) - 180;
    return Object.is(normalized, -0) ? 0 : normalized;
  };
 
  const lat = parseCoord(workLocationLat);
  const rawLng = parseCoord(workLocationLng);
  const lng = rawLng === null ? null : normalizeLng(rawLng);
 
  const hasValidCoords =
    lat !== null &&
    lng !== null &&
    Math.abs(lat) <= 90;
 
  const initialPosition: [number, number] = hasValidCoords
    ? [lat, lng]
    : [exampleMarkers.position[0], exampleMarkers.position[1]];
 
  const markers = hasValidCoords
    ? [
        {
          id: 1,
          position: initialPosition,
          title: workLocationName || "Work Location",
          description: workLocationName || "Job work location",
        },
      ]
    : [exampleMarkers];
 
  return (
    <div className="p-4 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Work Location Details</h1>
      <div className=" rounded-lg shadow-sm">
        {workLocationName && (
          <div className="mb-1 p-3 bg-gray-50 rounded-md dark:bg-gray-700">
            <h3 className="font-semibold text-gray-800 mb-1 dark:text-gray-400">
              Work Location
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {workLocationName}
            </p>
          </div>
        )}
        <MapComponent
          initialPosition={initialPosition}
          initialZoom={hasValidCoords ? 15 : exampleMarkers.maxZoom}
          markers={markers}
          onMapClick={handleMapClick}
        />
      </div>
    </div>
  );
};
 
export default LocationMap;