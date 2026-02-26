import { useSearchParams } from "react-router-dom";
import { exampleMarkers } from "@/dummy_data/jobDetails";
import CustomTable from "@/shared/components/commonUI/custom_table";
import MapComponent from "@/shared/components/MapComponent";
import { useAdminGetJobLogs } from "@/shared/apiServices/admin/adminOpenApiService";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";

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
  const [searchParams] = useSearchParams();
  const jobIdParam = searchParams.get("jobId");
  const jobId = jobIdParam ? Number(jobIdParam) : NaN;
  const shouldFetch = Number.isFinite(jobId);

  const { data, isLoading, error } = useAdminGetJobLogs(
    shouldFetch ? { jobId } : undefined,
    { enabled: shouldFetch },
  );

  const columns = [
    { key: "id", label: "Sr.No." },
    { key: "timestamp", label: "Date and Time" },
    { key: "logType", label: "Work Log Type" },
    { key: "status", label: "Status" },
    { key: "details", label: "Details" },
    { key: "updatedAt", label: "Updated At" },
  ];

  if (!shouldFetch) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-600">
        Missing job id.
      </div>
    );
  }

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-600">
        Failed to load job logs.
      </div>
    );
  }

  const tableData = data?.data ?? [];

  return (
    <div>
      <div className="font-bold text-gray-800 mb-1 dark:text-gray-400 py-2">
        Work Log Details
      </div>
      <div>
        <CustomTable<any>
          columns={columns}
          data={tableData}
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
