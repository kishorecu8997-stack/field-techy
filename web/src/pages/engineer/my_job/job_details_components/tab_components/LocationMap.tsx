import { exampleMarkers } from "@/dummy_data/jobDetails";
import MapComponent from "@/shared/components/MapComponent";

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
const LocationMap = () => {
  const handleMapClick = (latlng: { lat: number; lng: number }) => {
    console.log("User clicked map at:", latlng);
  };

  return (
    <div className="p-4 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Work Location Details</h1>
      <div className=" rounded-lg shadow-sm">
        <div className="mb-1 p-3 bg-gray-50 rounded-md dark:bg-gray-700">
          <h3 className="font-semibold text-gray-800 mb-1 dark:text-gray-400">
            SPOC Details
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Nick Wilson</span> work location: 3517
            W. Gray St. Utica, Pennsylvania 57867
          </p>
        </div>
        <MapComponent
          initialPosition={[
            exampleMarkers.position[0],
            exampleMarkers.position[1],
          ]} // Coordinates for Utica, NY
          initialZoom={exampleMarkers.maxZoom} // Zoom level appropriate for street view
          markers={[exampleMarkers]}
          onMapClick={handleMapClick}
        />
      </div>
    </div>
  );
};

export default LocationMap;
