import React from "react";
import BreakStatusTable from "./BreakStatusTable";
import BreakCalendar from "./BreakCalendar";

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
  return (
    <div className="py-6 px-4 max-w-full bg-white dark:bg-gray-900">
      <h2 className="text-2xl font-bold mb-6 ">Break Details</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="order-2 lg:order-1 flex flex-col">
          <h3 className="text-xl font-semibold mb-4">Break Status</h3>
          <div className="bg-white rounded-xl shadow-md overflow-hidden flex-1 min-h-0">
            <div className="h-full">
              <BreakStatusTable />
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2 flex flex-col">
          <h3 className="text-xl font-semibold mb-4">
            Calendar view of Breaks
          </h3>
          <div className="bg-white rounded-xl shadow-md overflow-hidden flex-1 min-h-0">
            <div className="h-full">
              <BreakCalendar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakDetails;
