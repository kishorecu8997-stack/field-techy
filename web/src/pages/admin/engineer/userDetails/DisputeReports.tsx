import { issues, type DisputeProps } from "@/dummy_data/admin/manageEngineer";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import Popup from "@/shared/components/Popup";
import React, { useState } from "react";

/**
 * DisputeReports Component
 *
 * Displays a table of dispute reports with the following features:
 * - Lists disputes with details including raised by, issue category, priority level, description, outcome, and resolution
 * - Provides "View File" button in each row to open a modal showing the associated file
 * - Includes a responsive popup modal to preview dispute-related files
 *
 * The component uses dummy data from `issues` array and renders it in a customizable table layout.
 * Each row includes a "View" button that opens a modal to display the file associated with that dispute.
 *
 * @component
 * @example
 * return (
 *   <DisputeReports />
 * );
 *
 * @returns {JSX.Element} The rendered DisputeReports component containing a dispute table and file preview modal.
 */

const DisputeReports: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: Column<DisputeProps>[] = [
    { key: "id", label: "Sr. No." },
    { key: "raisedBy", label: "Raised By" },
    { key: "issueCategory", label: "Issue Category" },
    { key: "priorityLevel", label: "Priority Level" },
    { key: "description", label: "Description" },
    {
      key: "file",
      label: "File",
      align: "center",
      renderCell: () => (
        <Button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-gradient-to-r from-teal-700 to-teal-900 text-white rounded-lg hover:opacity-90"
        >
          View
        </Button>
      ),
    },
    { key: "outcome", label: "Outcome" },
    { key: "resolvedInFavourOf", label: "Resolved In Favour Of" },
  ];

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <div className="h-full flex-1 overflow-y-auto">
        <CustomTable<DisputeProps>
          columns={columns}
          data={issues}
          initialPageSize={10}
        />
      </div>

      {isModalOpen && (
        <Popup open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-bold">View File</span>
              <div
                className="text-xl font-semibold cursor-pointer"
                onClick={() => setIsModalOpen(false)}
              >
                x
              </div>
            </div>
            <div className="border border-gray-400 h-36 my-6">
              <img src="https://via.placeholder.com/500" alt="file" />
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default DisputeReports;
