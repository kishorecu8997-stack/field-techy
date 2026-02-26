import type { ClientReviewProps } from "./types";
import type { Column } from "@/shared/components/commonUI/custom_table";
import CustomTable from "@/shared/components/commonUI/custom_table";
import { useAdminGetEngineerHistory } from "@/shared/apiServices/admin/adminOpenApiService";
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

type ReviewRow = ClientReviewProps;

const RatingAndReviewTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const params = useParams();
  const userId = Number(params.id);
  const hasValidUserId = Number.isFinite(userId) && userId > 0;

  const { data: engineerHistory, isLoading, error } = useAdminGetEngineerHistory(
    hasValidUserId ? userId : 0,
    { page: currentPage, limit: pageSize, type: "reviews" },
    { enabled: hasValidUserId }
  );

  // Map unknown data to ClientReviewProps safely
  const reviews: ReviewRow[] = useMemo(() => {
    if (!engineerHistory?.data) return [];

    return (engineerHistory.data as ClientReviewProps[]).map((item, index) => ({
      id: item.id ?? index + 1,
      reviewerName: item.reviewerName ?? "N/A",
      reviewerPhoneNumber: item.reviewerPhoneNumber ?? "N/A",
      reviewerEmail: item.reviewerEmail ?? "N/A",
      profileUrl: item.profileUrl ?? "",
      jobTitle: item.jobTitle ?? "N/A",
      rating: item.rating ?? 0,
      review: item.review ?? "N/A",
      type: item.type ?? "client",
      createdAt: item.createdAt ?? new Date().toISOString(),
    }));
  }, [engineerHistory?.data]);

  const columns: Column<ReviewRow>[] = [
    { key: "sr.No", label: "Sr.No.",  renderCell: (_row: ReviewRow, index: number) =>
            (currentPage - 1) * pageSize + index + 1 },
    {
      key: "reviewerName",
      label: "Client Details",
      renderCell: (row: ReviewRow) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {row.profileUrl ? (
              <img
                src={row.profileUrl}
                alt={row.reviewerName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-gray-600">
                {row.reviewerName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="font-semibold text-sm">{row.reviewerName}</p>
            <p className="text-xs text-gray-500">{row.reviewerPhoneNumber}</p>
            <p className="text-xs text-gray-500">{row.reviewerEmail}</p>
          </div>
        </div>
      ),
    },
    { key: "jobTitle", label: "Job Title" },
    {
      key: "rating",
      label: "Rating",
      renderCell: (row: ReviewRow) => (
        <span>{row.rating !== null ? row.rating.toFixed(1) : "N/A"}</span>
      ),
    },
    {
      key: "review",
      label: "Review",
      renderCell: (row: ReviewRow) => (
        <p className="text-sm text-gray-700 max-w-xs">{row.review}</p>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <h1 className="mb-4 font-bold">Rating and Reviews</h1>
      <div className="h-full flex-1 overflow-y-auto">
        <CustomTable<ReviewRow>
          columns={columns}
          data={reviews}
          initialPageSize={pageSize}
          currentPage={currentPage}
          loading={isLoading}
          error={
            !hasValidUserId
              ? "Missing engineer id in the URL."
              : error
              ? "An error occurred while fetching reviews."
              : null
          }
          totalCount={engineerHistory?.total ?? 0}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
};

export default RatingAndReviewTable;
