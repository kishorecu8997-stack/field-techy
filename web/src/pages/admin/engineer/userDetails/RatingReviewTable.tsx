import {
  clientReviews,
  type ClientReviewProps,
} from "@/dummy_data/admin/manageEngineer";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import React from "react";

/**
 * RatingAndReviewTable Component
 *
 * Displays a table of client ratings and reviews.
 */
const RatingAndReviewTable: React.FC = () => {
  const columns: Column<ClientReviewProps>[] = [
    { key: "id", label: "Sr.No" },
    {
      key: "name",
      label: "Client Details",
      renderCell: (row: ClientReviewProps) => (
        <div className="flex items-center gap-3">
          {/* Avatar Placeholder */}
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-gray-600">
              {row.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-semibold text-sm">{row.name}</p>
            <p className="text-xs text-gray-500">{row.phone}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "jobTitle",
      label: "Job Title",
    },
    {
      key: "rating",
      label: "Rating",
      renderCell: (row: ClientReviewProps) => (
        <span className="">{row.rating.toFixed(1)}</span>
      ),
    },
    {
      key: "review",
      label: "Review",
      renderCell: (row: ClientReviewProps) => (
        <p className="text-sm text-gray-700 max-w-xs">{row.review}</p>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <h1 className="mb-4 font-bold">Rating and Reviews</h1>
      <div className="h-full flex-1 overflow-y-auto">
        <CustomTable<ClientReviewProps>
          columns={columns}
          data={clientReviews}
          initialPageSize={10}
        />
      </div>
    </div>
  );
};

export default RatingAndReviewTable;
