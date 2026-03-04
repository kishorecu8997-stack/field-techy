import React from "react";
import { useSearchParams } from "react-router-dom";
import BreakStatusTable from "./BreakStatusTable";
import BreakCalendar from "./BreakCalendar";
import { useGetJobLogs } from "@/shared/apiServices/engineer/engineerOpenApiService";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";

/**
 * BreakDetails
 *
 * Displays the break management section including:
 * - BreakStatusTable: Shows the list and status of breaks
 * - BreakCalendar: Shows breaks in a monthly calendar view
 *
 * Layout:
 * - Two-column responsive grid on large screens
 * - Single-column layout on smaller screens
 */
const BreakDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const assignmentId = Number(searchParams.get("assignmentId")) || 0;

  const { data: jobLogs, isLoading } = useGetJobLogs(assignmentId, !!assignmentId);

  const breakRequests = jobLogs?.breakRequests || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoaderComponent />
      </div>
    );
  }

  return (
    <div className="py-6 px-4 max-w-full bg-white dark:bg-gray-900">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Break Details
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="order-2 lg:order-1 flex flex-col gap-4">
          {/* <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Break Details
          </h3> */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden flex-1 min-h-0">
            <div className="h-full">
              <BreakStatusTable breakRequests={breakRequests} />
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2 flex flex-col gap-4">
          {/* <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Calendar view of Breaks
          </h2> */}
          <div className="bg-white dark:bg-gray-200 shadow-md overflow-hidden flex-1 min-h-0 rounded-xl ">
            <div className="h-full dark:bg-gray-800 p-4 ">
              <BreakCalendar breakRequests={breakRequests} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakDetails;
