import { useGetReportClient } from "../apiServices/client/clientOpenApiService";

interface CountParams {
  status: "pending" | "resolved";
  jobId: string | number;
}

/**
 * A custom hook to fetch and manage the total count of reports based on status and job ID.
 * const { count, refetch } = useReportCount({ status: 'pending', jobId: 123 });
 */
export const useReportCount = ({ status, jobId }: CountParams) => {
  const { data: data, refetch } = useGetReportClient(
    {
      status: status,
      jobId: Number(jobId),
    },
    true,
  );

  return {
    count: data?.total ?? 0,
    refetch,
  };
};
