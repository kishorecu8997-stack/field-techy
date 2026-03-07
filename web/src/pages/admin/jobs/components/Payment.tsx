/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAdminGetPaymentTransactions } from "@/shared/apiServices/admin/adminOpenApiService";
import CustomTable from "@/shared/components/commonUI/custom_table";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import { useSearchParams } from "react-router-dom";

const Payment = () => {
  const [searchParams] = useSearchParams();
  const jobIdParam = searchParams.get("jobId");
  const jobId = jobIdParam ? Number(jobIdParam) : NaN;
  const shouldFetch = Number.isFinite(jobId);

  const { data, isLoading, error } = useAdminGetPaymentTransactions(
    shouldFetch ? { jobId, page: 1, limit: 10 } : undefined,
    { enabled: shouldFetch },
  );

  const columns = [
    { key: "id", label: "Payment ID" },
    { key: "amount", label: "Amount" },
    { key: "clientStatus", label: "Client Status" },
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
        Failed to load payment transactions.
      </div>
    );
  }

  const tableData = (data?.data ?? []).map((transaction) => ({
    ...transaction,
    clientStatus: transaction.type, // Map 'type' field to 'clientStatus' for table display
  }));

  return (
    <div>
      <div>
        <CustomTable<any>
          columns={columns}
          data={tableData}
          initialPageSize={10}
        />
      </div>
    </div>
  );
};

export default Payment;
