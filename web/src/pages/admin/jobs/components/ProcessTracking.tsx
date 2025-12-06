import { TrackingData } from "@/dummy_data/admin/myjob_datas";
import { exampleMarkers } from "@/dummy_data/jobDetails";
import CustomTable from "@/shared/components/commonUI/custom_table";
import MapComponent from "@/shared/components/MapComponent";

/**
 * ProcessTracking Component
 *
 * Displays a table of check-ins and GPS tracking for a job.
 * Uses CustomTable and MapComponent components.
 *
 * @component
 * @example
 * <ProcessTracking />
 */
const ProcessTracking = () => {
  const columns = [
    { key: "id", label: "Sr.No." },
    { key: "date", label: "Date & Time" },
    { key: "checkIn", label: "Check In Time" },
    { key: "checkOut", label: "Check Out Time" },
    { key: "Total", label: "Total Time" },
  ];

  return (
    <div>
      <div className="font-bold text-gray-800 mb-1 dark:text-gray-400 py-2">
        Check-ins
      </div>
      <div>
        <CustomTable<any>
          columns={columns}
          data={TrackingData}
          initialPageSize={10}
        />
      </div>
      <div className="p-2">
        <div className="font-bold text-gray-800 mb-1 dark:text-gray-400 py-2">
          GPS Tracking
        </div>
        <div>
          <MapComponent
            initialPosition={[
              exampleMarkers.position[0],
              exampleMarkers.position[1],
            ]} // Coordinates for Utica, NY
            initialZoom={exampleMarkers.maxZoom} // Zoom level appropriate for street view
            markers={[exampleMarkers]}
            //   onMapClick={handleMapClick}
          />
        </div>
      </div>
    </div>
  );
};

export default ProcessTracking;
