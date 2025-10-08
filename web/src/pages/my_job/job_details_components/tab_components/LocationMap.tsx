import MapComponent from "@/shared/components/MapComponent";

const LocationMap = () => {
  const handleMapClick = (latlng: { lat: number; lng: number }) => {
    console.log("User clicked map at:", latlng);
  };

  // Updated markers to show the correct location
  const exampleMarkers = [
    {
      id: 1,
      position: [43.0987, -75.2258] as [number, number], // Coordinates for Utica, NY
      title: "Work Location",
      description: "3517 W. Gray St. Utica, Pennsylvania 57867",
    },
  ];

  return (
    <div className="p-4 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Work Location Details</h1>
      <div className=" rounded-lg shadow-sm">
        <div className="mb-1 p-3 bg-gray-50 rounded-md">
          <h3 className="font-semibold text-gray-800 mb-1">SPOC Details</h3>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Work location is at:</span> 3517 W. Gray St. Utica, Pennsylvania 57867
          </p>
        </div>
        <MapComponent
          initialPosition={[43.0987, -75.2258]} // Coordinates for Utica, NY
          initialZoom={14} // Zoom level appropriate for street view
          markers={exampleMarkers}
          onMapClick={handleMapClick}
        />
      </div>
    </div>
  );
};

export default LocationMap;