import { exampleMarkers } from "@/dummy_data/jobDetails";
import MapComponent from "@/shared/components/MapComponent";

interface LocationMapProps {
  workLocationLat?: string | null;
  workLocationLng?: string | null;
  workLocationName?: string | null;
  cityId?: number | null;
  stateId?: number | null;
  countryId?: number | null;
}

/**
 * Displays the job's work location with a descriptive address and an interactive map.
 *
 * This component renders a static address block for the SPOC (Single Point of Contact)
 * work location and embeds a map using the `MapComponent`, centered on the job's
 * coordinates. It also logs map click events for potential future use.
 *
 * @param {LocationMapProps} props - Job location data including coordinates and address
 * @returns {JSX.Element} A section containing the location address and an interactive map.
 *
 * @example
 * <LocationMap 
 *   workLocationLat="17.6868"
 *   workLocationLng="83.2185"
 *   workLocationName="Visakhapatnam, Andhra Pradesh"
 * />
 */
const LocationMap: React.FC<LocationMapProps> = ({
  workLocationLat,
  workLocationLng,
  workLocationName,
}) => {
  const handleMapClick = (latlng: { lat: number; lng: number }) => {
    console.log("User clicked map at:", latlng);
  };

  // Use job coordinates if available, otherwise fall back to dummy data
  const hasValidCoords = workLocationLat && workLocationLng && 
    !isNaN(parseFloat(workLocationLat)) && !isNaN(parseFloat(workLocationLng));

  const initialPosition: [number, number] = hasValidCoords
    ? [parseFloat(workLocationLat), parseFloat(workLocationLng)]
    : [exampleMarkers.position[0], exampleMarkers.position[1]];

  const markers = hasValidCoords
    ? [{
        id: 1,
        position: initialPosition,
        title: workLocationName || "Work Location",
        description: workLocationName || "Job work location",
      }]
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
